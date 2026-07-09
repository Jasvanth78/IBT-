import nodemailer from "nodemailer";
import { prisma } from "../lib/prisma";
import { SETTINGS } from "../types/settings";

export const getTransporter = async () => {
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: [
          SETTINGS.SMTP_HOST,
          SETTINGS.SMTP_PORT,
          SETTINGS.SMTP_USER,
          SETTINGS.SMTP_PASS,
        ],
      },
    },
  });

  const settingsMap = new Map(settings.map((s) => [s.key, s.value]));

  const host = (settingsMap.get(SETTINGS.SMTP_HOST) as string) || process.env.EMAIL_HOST;
  const portStr = (settingsMap.get(SETTINGS.SMTP_PORT) as string) || process.env.EMAIL_PORT;
  const user = (settingsMap.get(SETTINGS.SMTP_USER) as string) || process.env.EMAIL_USER;
  const pass = (settingsMap.get(SETTINGS.SMTP_PASS) as string) || process.env.EMAIL_PASSWORD;

  if (host && user && pass) {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(portStr) || 587,
      secure: Number(portStr) === 465,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000, // 10 seconds timeout
      greetingTimeout: 10000,
    });

    // If using ZeptoMail, intercept SMTP calls and send via HTTP API to avoid port blocks on Render Free Tier
    if (host.toLowerCase().includes("zeptomail")) {
      const originalSendMail = transporter.sendMail.bind(transporter);
      
      const parseEmail = (emailStr: string) => {
        const match = emailStr.match(/^(?:"?([^"]*)"?\s)?(?:<([^>]+)>)$/);
        if (match) {
          return {
            address: match[2].trim(),
            name: (match[1] || match[2].split("@")[0]).trim()
          };
        }
        return {
          address: emailStr.trim(),
          name: emailStr.split("@")[0].trim()
        };
      };

      transporter.sendMail = (async (mailOptions: any, callback?: any) => {
        try {
          console.log("ZeptoMail detected. Intercepting and sending via HTTPS API...");

          const parsedFrom = parseEmail(mailOptions.from);
          const toEmails = Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to];
          const formattedTo = toEmails.map((email: string) => {
            const parsed = parseEmail(email);
            return {
              email_address: {
                address: parsed.address,
                name: parsed.name
              }
            };
          });

          const payload: any = {
            from: {
              address: parsedFrom.address,
              name: parsedFrom.name || "IBT"
            },
            to: formattedTo,
            subject: mailOptions.subject,
            htmlbody: mailOptions.html,
          };

          if (mailOptions.bcc) {
            const bccEmails = Array.isArray(mailOptions.bcc) ? mailOptions.bcc : [mailOptions.bcc];
            payload.bcc = bccEmails.map((email: string) => {
              const parsed = parseEmail(email);
              return {
                email_address: {
                  address: parsed.address,
                  name: parsed.name
                }
              };
            });
          }

          const authHeader = pass.startsWith("Zoho-enczapikey") 
            ? pass 
            : `Zoho-enczapikey ${pass}`;

          const res = await fetch("https://api.zeptomail.in/v1.1/email", {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": authHeader
            },
            body: JSON.stringify(payload)
          });

          if (!res.ok) {
            const errText = await res.text();
            throw new Error(`ZeptoMail HTTP API returned status ${res.status}: ${errText}`);
          }

          const responseData = await res.json();
          console.log("ZeptoMail HTTP API Response:", responseData);

          const result = {
            messageId: responseData.request_id || "zeptomail-http-success",
            response: "250 OK",
          };

          if (callback) callback(null, result);
          return result;
        } catch (err: any) {
          console.error("ZeptoMail HTTPS API failed, falling back to SMTP:", err.message);
          return originalSendMail(mailOptions, callback);
        }
      }) as any;
    }

    return transporter;
  }

  // Generate test SMTP service account from ethereal.email for local dev/testing
  console.warn("⚠️ No SMTP credentials found in DB or .env. Using Ethereal Email for testing.");
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

export const getMailSender = async () => {
  const setting = await prisma.setting.findUnique({ where: { key: SETTINGS.SMTP_FROM } });
  const fromDb = setting?.value as string;
  return fromDb || process.env.MAIL_FROM || process.env.EMAIL_USER || 'no-reply@ethereal.email';
};

const getHtmlTemplate = (title: string, bodyContent: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
      color: #334155;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header {
      background-color: #0f172a;
      padding: 30px 40px;
      text-align: center;
    }
    .logo {
      font-size: 28px;
      font-weight: 800;
      color: #ffffff;
      margin: 0;
      letter-spacing: 1px;
    }
    .logo span {
      color: #ef4444;
    }
    .content {
      padding: 40px;
      line-height: 1.6;
    }
    .title {
      font-size: 20px;
      font-weight: 600;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 24px;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 12px;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 24px 40px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
    }
    .footer a {
      color: #ef4444;
      text-decoration: none;
    }
    .field {
      margin-bottom: 16px;
    }
    .field-label {
      font-weight: 600;
      color: #475569;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .field-value {
      font-size: 16px;
      color: #0f172a;
    }
    .message-box {
      background: #f8fafc;
      border-left: 4px solid #ef4444;
      padding: 20px;
      margin-top: 24px;
      border-radius: 0 8px 8px 0;
      white-space: pre-wrap;
      font-size: 15px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="logo">I-BACUS<span>TECH</span></h1>
    </div>
    <div class="content">
      <h2 class="title">${title}</h2>
      ${bodyContent}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} I-Bacus Tech. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

type AdminContactNotificationProps = {
  adminEmail: string;
  userName: string;
  userEmail: string;
  userPhone?: string | null;
  userCompany?: string | null;
  subject?: string | null;
  message: string;
};

export const sendAdminContactNotification = async (props: AdminContactNotificationProps) => {
  const mailer = await getTransporter();
  const mailFrom = await getMailSender();
  const info = await mailer.sendMail({
    from: `"IBT System" <${mailFrom}>`,
    to: props.adminEmail,
    subject: `New Contact Submission from ${props.userName}`,
    html: getHtmlTemplate(
      "New Contact Submission",
      `
        <div style="border: 1px solid #dbe3f0; border-radius: 18px; overflow: hidden; background: #ffffff; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);">
          <div style="background: #0f172a; color: #ffffff; text-align: center; padding: 12px 18px; font-size: 12px; font-weight: 800; letter-spacing: 1.8px; text-transform: uppercase;">
            New Contact Lead
          </div>

          <div style="padding: 26px 24px 24px;">
            <p style="font-size: 16px; color: #334155; margin: 0 0 18px; line-height: 1.65;">
              A new message has arrived through the website contact form. Review the sender details and respond from the dashboard.
            </p>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 18px;">
              <tr>
                <td style="width: 50%; padding: 0 8px 14px 0; vertical-align: top;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Name</div>
                  <div style="font-size: 15px; font-weight: 700; color: #0f172a; word-break: break-word;">${props.userName}</div>
                </td>
                <td style="width: 50%; padding: 0 0 14px 8px; vertical-align: top;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Email</div>
                  <div style="font-size: 15px; font-weight: 700; color: #0f172a; word-break: break-word;"><a href="mailto:${props.userEmail}" style="color: #dc2626; text-decoration: none;">${props.userEmail}</a></div>
                </td>
              </tr>
              <tr>
                <td style="width: 50%; padding: 0 8px 14px 0; vertical-align: top;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Phone</div>
                  <div style="font-size: 15px; font-weight: 600; color: #0f172a;">${props.userPhone || 'Not provided'}</div>
                </td>
                <td style="width: 50%; padding: 0 0 14px 8px; vertical-align: top;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Company</div>
                  <div style="font-size: 15px; font-weight: 600; color: #0f172a;">${props.userCompany || 'Not provided'}</div>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 0; vertical-align: top;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Subject</div>
                  <div style="font-size: 15px; font-weight: 600; color: #0f172a; line-height: 1.6;">${props.subject || 'No Subject'}</div>
                </td>
              </tr>
            </table>

            <div style="margin-top: 18px; border-left: 4px solid #dc2626; background: #fff5f5; border-radius: 0 12px 12px 0; padding: 16px 18px; color: #1f2937; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">
              ${props.message}
            </div>
          </div>
        </div>
      `
    ),
  });
  console.log("Admin Notification Email sent: %s", nodemailer.getTestMessageUrl(info));
};

type UserAutoReplyProps = {
  userEmail: string;
  userName: string;
};

export const sendUserContactAutoReply = async (props: UserAutoReplyProps) => {
  const mailer = await getTransporter();
  const mailFrom = await getMailSender();
  const info = await mailer.sendMail({
    from: `"IBT Support" <${mailFrom}>`,
    to: props.userEmail,
    subject: `We've received your message!`,
    html: getHtmlTemplate(
      "We've received your message!",
      `
        <div style="border: 1px solid #dbe3f0; border-radius: 18px; overflow: hidden; background: #ffffff; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);">
          <div style="background: linear-gradient(90deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; text-align: center; padding: 12px 18px; font-size: 12px; font-weight: 800; letter-spacing: 1.8px; text-transform: uppercase;">
            Message Received
          </div>

          <div style="padding: 26px 24px 24px;">
            <p style="font-size: 16px; color: #334155; margin: 0 0 16px; line-height: 1.65;">
              Hello <strong>${props.userName}</strong>,
            </p>
            <p style="font-size: 16px; color: #334155; line-height: 1.75; margin: 0 0 18px;">
              Thank you for contacting I-Bacus Tech. We have received your message and our team will review it shortly.
            </p>

            <div style="border-left: 4px solid #dc2626; background: #fff5f5; border-radius: 0 12px 12px 0; padding: 16px 18px; color: #0f172a; font-size: 14px; line-height: 1.7;">
              If your inquiry is urgent, please reply to this email with any additional details so we can prioritize it.
            </div>

            <p style="font-size: 16px; color: #334155; margin: 22px 0 0;">
              Best regards,<br/><strong>The I-Bacus Tech Team</strong>
            </p>
          </div>
        </div>
      `
    ),
  });
  console.log("User Auto-Reply Email sent: %s", nodemailer.getTestMessageUrl(info));
};

type AdminLoginAlertProps = {
  adminEmail: string;
  userEmail: string;
  ipAddress: string;
  browser: string;
  os: string;
  device: string;
  time: string;
  status: string;
};

export const sendAdminLoginAlert = async (props: AdminLoginAlertProps) => {
  const mailer = await getTransporter();
  const mailFrom = await getMailSender();
  const isSuccess = props.status === "SUCCESS";
  const statusColor = isSuccess ? "#1d4ed8" : "#dc2626";
  const statusBg = isSuccess ? "#dbeafe" : "#fee2e2";
  const statusBorder = isSuccess ? "#93c5fd" : "#fca5a5";
  const info = await mailer.sendMail({
    from: `"IBT Security" <${mailFrom}>`,
    to: props.adminEmail,
    subject: `Security Alert: Admin Login Attempt (${props.status})`,
    html: getHtmlTemplate(
      "Admin Login Alert",
      `
        <div style="border: 1px solid #dbe3f0; border-radius: 18px; overflow: hidden; background: #ffffff; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);">
          <div style="background: #0f172a; color: #ffffff; text-align: center; padding: 12px 18px; font-size: 12px; font-weight: 800; letter-spacing: 1.8px; text-transform: uppercase;">
            Critical Security Log
          </div>

          <div style="padding: 26px 24px 24px;">
            <p style="font-size: 16px; color: #334155; margin: 0 0 18px; line-height: 1.65;">
              A login attempt was detected on the admin panel. Review the details below and confirm whether this activity is expected.
            </p>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 18px;">
              <tr>
                <td style="width: 50%; padding: 0 8px 14px 0; vertical-align: top;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Account</div>
                  <div style="font-size: 15px; font-weight: 700; color: #0f172a; word-break: break-word;">${props.userEmail}</div>
                </td>
                <td style="width: 50%; padding: 0 0 14px 8px; vertical-align: top;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Status</div>
                  <div style="display: inline-block; padding: 6px 12px; border-radius: 999px; background: ${statusBg}; border: 1px solid ${statusBorder}; color: ${statusColor}; font-size: 12px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                    ${props.status}
                  </div>
                </td>
              </tr>
              <tr>
                <td style="width: 50%; padding: 0 8px 14px 0; vertical-align: top;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Time</div>
                  <div style="font-size: 15px; font-weight: 600; color: #0f172a;">${props.time}</div>
                </td>
                <td style="width: 50%; padding: 0 0 14px 8px; vertical-align: top;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">IP Address</div>
                  <div style="font-size: 15px; font-weight: 600; color: #0f172a; word-break: break-word;">${props.ipAddress}</div>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 0; vertical-align: top;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Browser & OS</div>
                  <div style="font-size: 15px; font-weight: 600; color: #0f172a; line-height: 1.6;">${props.browser} on ${props.os} (${props.device})</div>
                </td>
              </tr>
            </table>

            <div style="margin-top: 20px; border-left: 4px solid #dc2626; background: #fff5f5; border-radius: 0 12px 12px 0; padding: 16px 18px; color: #7f1d1d; font-size: 14px; line-height: 1.65;">
              If this was you, you can ignore this email. Otherwise, review your security settings immediately and block any suspicious access.
            </div>
          </div>
        </div>
      `
    ),
  });
  console.log("Login Alert Email sent: %s", nodemailer.getTestMessageUrl(info));
};

export const sendOTPEmail = async (email: string, otp: string) => {
  const mailer = await getTransporter();
  const mailFrom = await getMailSender();
  const info = await mailer.sendMail({
    from: `"IBT Security" <${mailFrom}>`,
    to: email,
    subject: `Your Verification Code: ${otp}`,
    html: getHtmlTemplate(
      "Verification Code",
      `
        <div style="border: 1px solid #dbe3f0; border-radius: 18px; overflow: hidden; background: #ffffff; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);">
          <div style="background: #0f172a; color: #ffffff; text-align: center; padding: 12px 18px; font-size: 12px; font-weight: 800; letter-spacing: 1.8px; text-transform: uppercase;">
            Identity Verification
          </div>

          <div style="padding: 26px 24px 24px; text-align: center;">
            <p style="font-size: 16px; color: #334155; margin: 0 0 24px; line-height: 1.65;">
              Use the code below to verify your email address for your application. This code will expire in 10 minutes.
            </p>

            <div style="display: inline-block; background: #f1f5f9; border-radius: 12px; padding: 16px 32px; font-size: 32px; font-weight: 800; color: #0f172a; letter-spacing: 8px; border: 2px dashed #0f172a;">
              ${otp}
            </div>

            <p style="font-size: 14px; color: #64748b; margin: 24px 0 0;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        </div>
      `
    ),
  });
  console.log("OTP Email sent: %s", info.messageId);
};

type AdminInternshipNotificationProps = {
  adminEmail: string;
  name: string;
  email: string;
  phone: string;
  jobType: string;
  applicationType: string;
  about: string;
  skills: string;
  resumeUrl?: string | null;
};

export const sendAdminInternshipNotification = async (props: AdminInternshipNotificationProps) => {
  const mailer = await getTransporter();
  const mailFrom = await getMailSender();
  const info = await mailer.sendMail({
    from: `"IBT Recruitment" <${mailFrom}>`,
    to: props.adminEmail,
    subject: `New ${props.applicationType === 'JOB' ? 'Job' : 'Internship'} Application: ${props.name}`,
    html: getHtmlTemplate(
      `New ${props.applicationType === 'JOB' ? 'Job' : 'Internship'} Application`,
      `
        <div style="border: 1px solid #dbe3f0; border-radius: 18px; overflow: hidden; background: #ffffff; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);">
          <div style="background: #0f172a; color: #ffffff; text-align: center; padding: 12px 18px; font-size: 12px; font-weight: 800; letter-spacing: 1.8px; text-transform: uppercase;">
            New Application Received
          </div>

          <div style="padding: 26px 24px 24px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 18px;">
              <tr>
                <td style="width: 50%; padding: 0 8px 14px 0; vertical-align: top;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Name</div>
                  <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${props.name}</div>
                </td>
                <td style="width: 50%; padding: 0 0 14px 8px; vertical-align: top;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Email</div>
                  <div style="font-size: 15px; font-weight: 700; color: #0f172a;"><a href="mailto:${props.email}" style="color: #dc2626; text-decoration: none;">${props.email}</a></div>
                </td>
              </tr>
              <tr>
                <td style="width: 50%; padding: 0 8px 14px 0; vertical-align: top;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Phone</div>
                  <div style="font-size: 15px; font-weight: 600; color: #0f172a;">${props.phone}</div>
                </td>
                <td style="width: 50%; padding: 0 0 14px 8px; vertical-align: top;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Type</div>
                  <div style="font-size: 15px; font-weight: 600; color: #0f172a;">${props.applicationType}</div>
                </td>
              </tr>
              <tr>
                <td style="width: 50%; padding: 0 8px 14px 0; vertical-align: top;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Role / Interest</div>
                  <div style="font-size: 15px; font-weight: 600; color: #0f172a;">${props.jobType}</div>
                </td>
                <td style="width: 50%; padding: 0 0 14px 8px; vertical-align: top;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Resume</div>
                  <div style="font-size: 15px; font-weight: 600; color: #0f172a;">
                    ${props.resumeUrl ? `<a href="${props.resumeUrl}" style="color: #dc2626; text-decoration: underline;" target="_blank">View Resume</a>` : 'Not provided'}
                  </div>
                </td>
              </tr>
            </table>

            <div style="margin-bottom: 18px;">
              <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Skills</div>
              <div style="font-size: 14px; background: #f8fafc; border: 1px solid #f1f5f9; padding: 12px; border-radius: 8px; color: #334155;">${props.skills}</div>
            </div>

            <div>
              <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">About / Background</div>
              <div style="font-size: 14px; background: #f8fafc; border: 1px solid #f1f5f9; padding: 12px; border-radius: 8px; color: #334155; line-height: 1.6;">${props.about}</div>
            </div>
          </div>
        </div>
      `
    ),
  });
};

type UserInternshipAutoReplyProps = {
  userEmail: string;
  userName: string;
  applicationType: string;
};

export const sendUserInternshipAutoReply = async (props: UserInternshipAutoReplyProps) => {
  const mailer = await getTransporter();
  const mailFrom = await getMailSender();
  const isJob = props.applicationType === 'JOB';
  const info = await mailer.sendMail({
    from: `"IBT Recruitment" <${mailFrom}>`,
    to: props.userEmail,
    subject: `Application Received: ${isJob ? 'Job' : 'Internship'} at IBT`,
    html: getHtmlTemplate(
      "Application Received",
      `
        <div style="border: 1px solid #dbe3f0; border-radius: 18px; overflow: hidden; background: #ffffff; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);">
          <div style="background: linear-gradient(90deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; text-align: center; padding: 12px 18px; font-size: 12px; font-weight: 800; letter-spacing: 1.8px; text-transform: uppercase;">
            Application Successful
          </div>

          <div style="padding: 26px 24px 24px;">
            <p style="font-size: 16px; color: #334155; margin: 0 0 16px; line-height: 1.65;">
              Hello <strong>${props.userName}</strong>,
            </p>
            <p style="font-size: 16px; color: #334155; line-height: 1.75; margin: 0 0 18px;">
              Thank you for applying for the ${isJob ? 'Job' : 'Internship'} position at I-Bacus Tech. We have successfully received your application.
            </p>
            <p style="font-size: 16px; color: #334155; line-height: 1.75; margin: 0 0 18px;">
              Our recruitment team will review your profile and get back to you soon regarding the next steps.
            </p>

            <p style="font-size: 16px; color: #334155; margin: 22px 0 0;">
              Best regards,<br/><strong>The I-Bacus Tech Team</strong>
            </p>
          </div>
        </div>
      `
    ),
  });
  console.log("User Internship Auto-Reply Email sent: %s", nodemailer.getTestMessageUrl(info));
};

type AdminLabIdeaNotificationProps = {
  adminEmail: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  category: string;
  ideaTitle: string;
  description: string;
  attachments?: string[];
};

export const sendAdminLabIdeaNotification = async (props: AdminLabIdeaNotificationProps) => {
  const mailer = await getTransporter();
  const mailFrom = await getMailSender();
  
  const attachmentLinks = props.attachments && props.attachments.length > 0 
    ? props.attachments.map(url => `<a href="${url}" style="color: #dc2626; text-decoration: underline;" target="_blank">Attachment</a>`).join(", ")
    : 'No attachments provided';

  const info = await mailer.sendMail({
    from: `"IBT Labs" <${mailFrom}>`,
    to: props.adminEmail,
    subject: `New Lab Idea Submission: ${props.ideaTitle}`,
    html: getHtmlTemplate(
      `New Innovation Lab Idea`,
      `
        <div style="border: 1px solid #dbe3f0; border-radius: 18px; overflow: hidden; background: #ffffff; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);">
          <div style="background: #0f172a; color: #ffffff; text-align: center; padding: 12px 18px; font-size: 12px; font-weight: 800; letter-spacing: 1.8px; text-transform: uppercase;">
            New Idea Received
          </div>

          <div style="padding: 26px 24px 24px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 18px;">
              <tr>
                <td style="width: 50%; padding: 0 8px 14px 0; vertical-align: top;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Name</div>
                  <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${props.firstName} ${props.lastName || ''}</div>
                </td>
                <td style="width: 50%; padding: 0 0 14px 8px; vertical-align: top;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Email</div>
                  <div style="font-size: 15px; font-weight: 700; color: #0f172a;"><a href="mailto:${props.email}" style="color: #dc2626; text-decoration: none;">${props.email}</a></div>
                </td>
              </tr>
              <tr>
                <td style="width: 50%; padding: 0 8px 14px 0; vertical-align: top;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Category</div>
                  <div style="font-size: 15px; font-weight: 600; color: #0f172a;">${props.category}</div>
                </td>
                <td style="width: 50%; padding: 0 0 14px 8px; vertical-align: top;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Title</div>
                  <div style="font-size: 15px; font-weight: 600; color: #0f172a;">${props.ideaTitle}</div>
                </td>
              </tr>
            </table>

            <div style="margin-bottom: 18px;">
              <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Attachments</div>
              <div style="font-size: 15px; font-weight: 600; color: #0f172a;">${attachmentLinks}</div>
            </div>

            <div>
              <div style="font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">Description</div>
              <div style="font-size: 14px; background: #f8fafc; border: 1px solid #f1f5f9; padding: 12px; border-radius: 8px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${props.description}</div>
            </div>
          </div>
        </div>
      `
    ),
  });
};

type UserLabIdeaAutoReplyProps = {
  userEmail: string;
  userName: string;
  ideaTitle: string;
};

export const sendUserLabIdeaAutoReply = async (props: UserLabIdeaAutoReplyProps) => {
  const mailer = await getTransporter();
  const mailFrom = await getMailSender();
  const info = await mailer.sendMail({
    from: `"IBT Labs" <${mailFrom}>`,
    to: props.userEmail,
    subject: `Idea Submitted: ${props.ideaTitle}`,
    html: getHtmlTemplate(
      "Idea Submitted Successfully",
      `
        <div style="border: 1px solid #dbe3f0; border-radius: 18px; overflow: hidden; background: #ffffff; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);">
          <div style="background: linear-gradient(90deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; text-align: center; padding: 12px 18px; font-size: 12px; font-weight: 800; letter-spacing: 1.8px; text-transform: uppercase;">
            Idea Received
          </div>

          <div style="padding: 26px 24px 24px;">
            <p style="font-size: 16px; color: #334155; margin: 0 0 16px; line-height: 1.65;">
              Hello <strong>${props.userName}</strong>,
            </p>
            <p style="font-size: 16px; color: #334155; line-height: 1.75; margin: 0 0 18px;">
              Thank you for sharing your idea "<strong>${props.ideaTitle}</strong>" with IBT Labs. We have successfully received your submission.
            </p>
            <p style="font-size: 16px; color: #334155; line-height: 1.75; margin: 0 0 18px;">
              Our team will review your proposal and reach out to you if we need any further information or to discuss the next steps.
            </p>

            <p style="font-size: 16px; color: #334155; margin: 22px 0 0;">
              Best regards,<br/><strong>The I-Bacus Tech Labs Team</strong>
            </p>
          </div>
        </div>
      `
    ),
  });
  console.log("User Lab Idea Auto-Reply Email sent: %s", nodemailer.getTestMessageUrl(info));
};

type BulkNotificationProps = {
  emails: string[];
  subject: string;
  message: string;
};

export const sendBulkNotification = async (props: BulkNotificationProps) => {
  const mailer = await getTransporter();
  const mailFrom = await getMailSender();
  
  // Since sending to multiple BCCs at once can sometimes trigger spam filters if the list is too large,
  // we will just send one email with all of them in BCC for simplicity. In production with a huge list, 
  // you might want to batch this.
  
  const info = await mailer.sendMail({
    from: `"IBT Notifications" <${mailFrom}>`,
    bcc: props.emails,
    subject: props.subject,
    html: getHtmlTemplate(
      props.subject,
      `
        <div style="border: 1px solid #dbe3f0; border-radius: 18px; overflow: hidden; background: #ffffff; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);">
          <div style="background: #0f172a; color: #ffffff; text-align: center; padding: 12px 18px; font-size: 12px; font-weight: 800; letter-spacing: 1.8px; text-transform: uppercase;">
            Important Update
          </div>

          <div style="padding: 26px 24px 24px;">
            <div style="font-size: 16px; color: #334155; line-height: 1.65; white-space: pre-wrap;">${props.message}</div>
          </div>
        </div>
      `
    ),
  });
  
  console.log("Bulk Notification Email sent to %d recipients: %s", props.emails.length, info.messageId);
};
