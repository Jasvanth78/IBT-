'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaWhatsapp,
  FaDiscord,
  FaTelegramPlane,
  FaTiktok,
  FaPinterestP,
  FaRedditAlien,
  FaTwitch,
  FaGlobe
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { apiClient, type PublicContact } from '@/src/api/client';
import { resolveImageUrl } from '@/src/utils/image';
import { formatAddress } from '@/src/utils/address';

const footerLinks = [
  {
    title: 'Company',
    items: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about-us' },

      { label: 'Services', href: '/services' },
      { label: 'Internship', href: '/internship' },

      { label: 'Contact Us', href: '/contact-us' },

    ],
  },

  {
    title: 'Resources',
    items: [
      { label: 'IBT Labs', href: '/ibt-labs' },
      { label: "Blog", href: "/blog" },

    ],
  },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  PHONE: FiPhone,
  EMAIL: FiMail,
  ADDRESS: FiMapPin,
};

const hrefMap: Record<string, (value: string) => string | undefined> = {
  PHONE: (value: string) => `tel:+91${value}`,
  EMAIL: (value: string) => `mailto:${value}`,
  ADDRESS: () => undefined,
};

const labelMap: Record<string, string> = {
  PHONE: 'Phone',
  EMAIL: 'Email',
  ADDRESS: 'Address',
};

export function SiteFooter() {
  const [contacts, setContacts] = useState<PublicContact[]>([]);
  const [socials, setSocials] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [contactResult, socialResult] = await Promise.all([
          apiClient.getContacts(1, 10),
          apiClient.getSocialLinks(1, 10),
        ]);

        setContacts(
          (contactResult.items || [])
            .sort((a: PublicContact, b: PublicContact) => (a.order || 0) - (b.order || 0))
        );

        setSocials(
          (socialResult.items || [])
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
        );
      } catch (error) {
        console.warn('Failed to load footer data:', error);
      }
    };

    loadData();
  }, []);

  const getSocialIcon = (logoUrl: string, platform: string) => {
    const logoKey = (logoUrl || '').toLowerCase();
    const isIconKey = logoKey && !logoKey.includes('/') && !logoKey.startsWith('http');
    if (isIconKey) {
      if (logoKey.includes('facebook')) return FaFacebookF;
      if (logoKey.includes('twitter')) return FaTwitter;
      if (logoKey.includes('linkedin')) return FaLinkedinIn;
      if (logoKey.includes('youtube')) return FaYoutube;
      if (logoKey.includes('instagram')) return FaInstagram;
      if (logoKey.includes('github')) return FaGithub;
      if (logoKey.includes('whatsapp')) return FaWhatsapp;
      if (logoKey.includes('discord')) return FaDiscord;
      if (logoKey.includes('telegram')) return FaTelegramPlane;
      if (logoKey.includes('tiktok')) return FaTiktok;
      if (logoKey.includes('pinterest')) return FaPinterestP;
      if (logoKey.includes('reddit')) return FaRedditAlien;
      if (logoKey.includes('twitch')) return FaTwitch;
      if (logoKey.includes('website')) return FaGlobe;
    }

    const platName = (platform || '').toLowerCase();
    if (platName.includes('facebook')) return FaFacebookF;
    if (platName.includes('twitter') || platName.includes('x.com')) return FaTwitter;
    if (platName.includes('linkedin')) return FaLinkedinIn;
    if (platName.includes('youtube')) return FaYoutube;
    if (platName.includes('instagram')) return FaInstagram;
    if (platName.includes('github')) return FaGithub;
    if (platName.includes('whatsapp')) return FaWhatsapp;
    if (platName.includes('discord')) return FaDiscord;
    if (platName.includes('telegram')) return FaTelegramPlane;
    if (platName.includes('tiktok')) return FaTiktok;
    if (platName.includes('pinterest')) return FaPinterestP;
    if (platName.includes('reddit')) return FaRedditAlien;
    if (platName.includes('twitch')) return FaTwitch;

    return FaGlobe;
  };

  return (
    <footer className="bg-[#0f172a] text-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-6">

          {/* Logo + Description + Social (col-span-2) */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="IBACUS TECH SOLUTION"
                width={180}
                height={50}
                className="h-12 w-auto object-contain !bg-white px-2 py-1 rounded"
                priority
              />
            </Link>

            <p className="mt-5 text-sm leading-relaxed !text-white max-w-xs">
              Empowering Businesses Through Technology.
              We build cutting-edge software, AI-powered solutions, and scalable digital products that drive innovation, efficiency, and growth.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => {
                const Icon = getSocialIcon(s.logoUrl, s.platform);
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 !text-white transition-all duration-300 hover:bg-red-500 hover:text-white"
                  >
                    <Icon className="text-sm" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-md font-bold !text-red-500 mb-5 uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm !text-white hover:text-red-500 transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Us Column */}
          <div className="lg:col-span-2">
            <h4 className="text-md font-bold !text-red-500 mb-5 uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-4">
              {contacts.map((contact) => {
                const Icon = iconMap[contact.type];
                const href = hrefMap[contact.type]?.(contact.value);

                if (!Icon) return null;

                const displayValue = contact.type === 'ADDRESS'
                  ? formatAddress(contact.value)
                  : contact.value;

                const content = (
                  <div className="flex items-start gap-3">
                    <Icon className="h-4 w-4 text-red-400 mt-1 shrink-0" />
                    <span className="text-sm !text-white leading-relaxed break-words whitespace-pre-line">
                      {displayValue}
                    </span>
                  </div>
                );

                return (
                  <li key={contact.id}>
                    {href ? (
                      <a href={href} className="group hover:text-white transition-colors duration-200">
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}

              {/* Fallback if no contacts loaded */}
              {contacts.length === 0 && (
                <>
                  <li className="flex items-start gap-3">
                    <FiPhone className="h-4 w-4 !text-red-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-white">+91 9003562715</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiMail className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-white">info@ibacustech.com</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiMapPin className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-white">I-BACUS-TECH, 3rd Floor,
                      6C, Chitra Nagar, Saravanampatti,
                      Coimbatore - 641035.</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 pt-5 pb-24 md:pb-5 lg:px-8 flex justify-center items-center">
          <p className="text-xs !text-white text-center">
            © {new Date().getFullYear()} I BACUS TECH SOLUTIONS. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}