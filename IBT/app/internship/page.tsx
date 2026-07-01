import {
  FiArrowRight,
  FiChevronDown,
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiSend,
  FiTarget,
  FiUsers,
  FiZap,
  FiCode,
  FiSmartphone,
  FiBarChart2,
  FiPenTool,
  FiCheckCircle,
  FiUserPlus,
  FiMonitor,
  FiThumbsUp
} from 'react-icons/fi';
import * as FiIcons from 'react-icons/fi';
import Link from 'next/link';

import { InternshipTestimonials } from './InternshipTestimonials';
import { InternshipJourneyTimeline } from './InternshipJourneyTimeline';

export const dynamic = 'force-dynamic'



type PublicTestimonial = {
  id: string
  name: string
  content: string
  role?: string | null
  avatarUrl?: string | null
}

type SiteSettingsPayload = {
  internshipHeroTitle?: string | null
  internshipHeroSubtitle?: string | null
  internshipHeroDescription?: string | null
  internshipHeroImageUrl?: string | null
  internshipTestimonialsTitle?: string | null
  internshipClosingTitle?: string | null
  internshipClosingContent?: string | null
  internshipApplyEmail?: string | null
  internshipPrograms?: string | Array<{
    id: string
    title: string
    icon: string
    points: string[]
    learnMoreLink: string
    colorTheme: string
  }> | null
  internshipTestimonials?: string | Array<{
    id: string
    name: string
    content: string
    role: string
    avatarUrl: string
  }> | null
}

function normalizeApiBaseUrl(raw: string | undefined) {
  const fallback = 'http://localhost:5000'
  if (!raw?.trim()) return fallback
  const trimmed = raw.trim()
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`
  try {
    return new URL(withProtocol).origin
  } catch {
    return fallback
  }
}

const resolveImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl?.trim()) return null
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl
  return `${normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL)}${imageUrl}`
}

async function getInternshipData() {
  const baseUrl = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL)
  let settings: SiteSettingsPayload = {}

  try {
    const settingsRes = await fetch(`${baseUrl}/api/public/v1/settings/current`, { cache: 'no-store' })
    if (settingsRes.ok) {
      const json = await settingsRes.json()
      settings = json.data || {}
    }
  } catch (err) {
    console.error('Failed to fetch internship settings data:', err)
  }

  return { settings }
}

const renderProgramIcon = (iconName: string) => {
  const IconComponent = (FiIcons as any)[iconName] || FiBookOpen;
  return <IconComponent size={22} />;
}

const getColorClasses = (theme: string) => {
  switch (theme?.toLowerCase()) {
    case 'blue':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-500',
        iconBg: 'bg-blue-50',
        iconText: 'text-blue-500',
        checkText: 'text-blue-400',
        linkText: 'text-blue-500'
      }
    case 'yellow':
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-600',
        iconBg: 'bg-yellow-50',
        iconText: 'text-yellow-500',
        checkText: 'text-yellow-400',
        linkText: 'text-yellow-500'
      }
    case 'green':
      return {
        bg: 'bg-green-50',
        text: 'text-green-500',
        iconBg: 'bg-green-50',
        iconText: 'text-green-500',
        checkText: 'text-green-400',
        linkText: 'text-green-500'
      }
    case 'red':
    default:
      return {
        bg: 'bg-red-50',
        text: 'text-red-500',
        iconBg: 'bg-red-50',
        iconText: 'text-red-500',
        checkText: 'text-red-400',
        linkText: 'text-red-500'
      }
  }
}

export default async function InternshipPage() {
  const { settings } = await getInternshipData()

  // Hardcoded defaults matching exactly the mockup text
  const defaultTestimonials = [
    {
      id: 't1',
      content: 'This internship helped me transition from a student to a developer. The projects and mentors are amazing!',
      name: 'Ayush Verma',
      role: 'Web Development Intern',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 't2',
      content: 'I gained hands-on experience in real projects. It boosted my confidence and my career opportunities.',
      name: 'Sneha Patel',
      role: 'Data Science Intern',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 't3',
      content: 'Great learning environment, supportive mentors and practical exposure. Highly recommended!',
      name: 'Rohan Kumar',
      role: 'AI/ML Intern',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    }
  ];

  const defaultPrograms = [
    {
      id: 'p1',
      title: 'Web Development',
      icon: 'FiMonitor',
      points: ['HTML, CSS, JavaScript', 'React.js, Node.js', 'Real-world Projects'],
      learnMoreLink: '/internship/apply',
      colorTheme: 'red'
    },
    {
      id: 'p2',
      title: 'Mobile App Development',
      icon: 'FiSmartphone',
      points: ['Flutter / React Native', 'Android Development', 'Live Project Experience'],
      learnMoreLink: '/internship/apply',
      colorTheme: 'blue'
    },
    {
      id: 'p3',
      title: 'Data Science & AI',
      icon: 'FiBarChart2',
      points: ['Python, Pandas, NumPy', 'Machine Learning', 'AI Model Development'],
      learnMoreLink: '/internship/apply',
      colorTheme: 'yellow'
    },
    {
      id: 'p4',
      title: 'UI/UX Design',
      icon: 'FiPenTool',
      points: ['Figma, Adobe XD', 'Wireframing & Prototyping', 'Design Thinking'],
      learnMoreLink: '/internship/apply',
      colorTheme: 'green'
    }
  ]

  const parseJsonField = (field: any, fallback: any) => {
    if (!field) return fallback
    if (Array.isArray(field)) return field
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field)
        if (Array.isArray(parsed)) return parsed
      } catch { }
    }
    return fallback
  }

  const programs = parseJsonField(settings.internshipPrograms, defaultPrograms)
  const displayTestimonials = parseJsonField(settings.internshipTestimonials, defaultTestimonials)

  return (
    <div className="bg-[#f8faff] min-h-screen overflow-hidden font-sans">

      {/* =====================================================
          1. HERO SECTION
      ===================================================== */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Content */}
            <div className="relative z-10 max-w-none lg:max-w-xl">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#e63946]" />
                <h3 className="text-[18px] font-bold uppercase tracking-widest !text-red-500">
                  INTERNSHIP PROGRAM
                </h3>
              </div>

              <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] font-black text-[#0f172a] leading-[1.1] tracking-tight mb-4">
                Learn by Building <br className="md:hidden" />
                <span className="text-[#e63946]">Real Products</span>
              </h1>

              <p className="text-[14px] text-slate-500 font-medium leading-relaxed mb-10 max-w-none lg:max-w-md">
                Our internship program is designed to give you real-world experience, mentorship and the skills to thrive in your career.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/internship/apply"
                  className="w-full sm:w-auto inline-flex h-12 sm:h-14 px-8 bg-[#e63946] text-white rounded-lg items-center justify-center text-[14px] font-bold shadow-lg shadow-red-500/20 hover:bg-[#c1121f] transition-colors"
                >
                  Apply for Internship <FiArrowRight className="ml-2" />
                </Link>
                <a
                  href="#programs"
                  className="w-full sm:w-auto inline-flex h-12 sm:h-14 px-8 bg-white text-[#0f172a] border border-slate-200 rounded-lg items-center justify-center text-[14px] font-bold hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                >
                  Explore Programs <FiChevronDown className="ml-2" />
                </a>
              </div>
            </div>

            {/* Right Image & Floating Badge */}
            <div className="relative z-10">
              <div className="rounded-[2rem] overflow-hidden shadow-2xl relative">
                <img
                  src={resolveImageUrl(settings.internshipHeroImageUrl) || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"}
                  alt="Internship Collaboration"
                  className="w-full h-auto object-cover aspect-[4/3] lg:aspect-auto lg:h-[500px]"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-8 left-4 right-4 mx-auto w-fit sm:left-4 sm:right-auto sm:mx-0 lg:-left-8 bg-white p-3 sm:p-6 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 sm:gap-5 sm:min-w-[280px] z-20">
                <div className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-red-50 text-[#e63946] flex items-center justify-center shadow-inner">
                  <FiUsers size={20} className="sm:scale-100" />
                </div>
                <div>
                  <div className="text-[18px] sm:text-[24px] font-black text-[#0f172a] leading-none mb-0.5">5000+</div>
                  <div className="text-[10px] sm:text-[12px] font-bold text-slate-500 mb-1.5">Interns Trained</div>
                  {/* Tiny Avatar Group */}
                  <div className="flex -space-x-1.5 sm:-space-x-2">
                    <img className="w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Avatar 1" />
                    <img className="w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Avatar 2" />
                    <img className="w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Avatar 3" />
                    <img className="w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Avatar 4" />
                    <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center text-[7px] font-bold text-slate-500">+</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          2. STATS BAR
      ===================================================== */}
      <section className="relative z-20 pb-16 lg:pb-20">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 py-8 px-4 sm:px-6 lg:px-12 grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 lg:gap-4 divide-y-0 lg:divide-x divide-slate-100">

            <div className="flex items-center gap-3 sm:gap-4 w-full max-w-[200px] sm:max-w-[240px] ml-auto lg:mx-auto">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <FiBriefcase size={20} />
              </div>
              <div className="text-left">
                <div className="text-[20px] sm:text-[24px] font-black text-[#0f172a] leading-tight">20+</div>
                <div className="text-[11px] sm:text-[12px] font-medium text-slate-500 leading-snug break-words">Programs</div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 w-full max-w-[200px] sm:max-w-[240px] mr-auto lg:mx-auto">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <FiUsers size={20} />
              </div>
              <div className="text-left">
                <div className="text-[20px] sm:text-[24px] font-black text-[#0f172a] leading-tight">5000+</div>
                <div className="text-[11px] sm:text-[12px] font-medium text-slate-500 leading-snug break-words">Interns Trained</div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 w-full max-w-[200px] sm:max-w-[240px] ml-auto lg:mx-auto">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-yellow-50 text-yellow-500 flex items-center justify-center shrink-0">
                <FiAward size={20} />
              </div>
              <div className="text-left">
                <div className="text-[20px] sm:text-[24px] font-black text-[#0f172a] leading-tight">99%+</div>
                <div className="text-[11px] sm:text-[12px] font-medium text-slate-500 leading-snug break-words">Success Rate</div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 w-full max-w-[200px] sm:max-w-[240px] mr-auto lg:mx-auto">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                <FiCheckCircle size={20} />
              </div>
              <div className="text-left">
                <div className="text-[20px] sm:text-[24px] font-black text-[#0f172a] leading-tight">100%</div>
                <div className="text-[11px] sm:text-[12px] font-medium text-slate-500 leading-snug break-words">Hands-on Experience</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          3. HOW IT WORKS (Journey Timeline)
      ===================================================== */}
      <section className="py-16 lg:py-20 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">

          <div className="mb-16 text-center lg:text-left">
            <h3 className="text-[18px] font-bold uppercase tracking-widest !text-red-500 mb-3">
              HOW IT WORKS
            </h3>
            <h2 className="text-[32px] md:text-[40px] font-black tracking-tight text-[#0f172a]">
              Your Journey with Us
            </h2>
          </div>

          <InternshipJourneyTimeline>

            {/* Step 01 */}
            <div className="relative z-10 flex flex-col items-center text-center shrink-0 w-[260px] sm:w-[300px] lg:w-auto snap-center">
              <div className="text-[36px] font-black text-red-500 mb-2 leading-none">01</div>
              <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center shadow-sm mb-5 border-[4px] border-white ring-1 ring-slate-100">
                <FiMonitor size={20} />
              </div>
              <h4 className="text-[16px] font-bold text-[#0f172a] mb-2">Apply Online</h4>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed px-2">
                Fill the application form and choose your preferred domain.
              </p>
            </div>

            {/* Step 02 */}
            <div className="relative z-10 flex flex-col items-center text-center shrink-0 w-[260px] sm:w-[300px] lg:w-auto snap-center">
              <div className="text-[36px] font-black text-blue-500 mb-2 leading-none">02</div>
              <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shadow-sm mb-5 border-[4px] border-white ring-1 ring-slate-100">
                <FiUserPlus size={20} />
              </div>
              <h4 className="text-[16px] font-bold text-[#0f172a] mb-2">Screening</h4>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed px-2">
                Our team reviews your application and shortlists the best fit.
              </p>
            </div>

            {/* Step 03 */}
            <div className="relative z-10 flex flex-col items-center text-center shrink-0 w-[260px] sm:w-[300px] lg:w-auto snap-center">
              <div className="text-[36px] font-black text-yellow-500 mb-2 leading-none">03</div>
              <div className="w-14 h-14 rounded-full bg-yellow-50 text-yellow-500 flex items-center justify-center shadow-sm mb-5 border-[4px] border-white ring-1 ring-slate-100">
                <FiBookOpen size={20} />
              </div>
              <h4 className="text-[16px] font-bold text-[#0f172a] mb-2">Onboarding</h4>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed px-2">
                Get access to resources, tools and your learning roadmap.
              </p>
            </div>

            {/* Step 04 */}
            <div className="relative z-10 flex flex-col items-center text-center shrink-0 w-[260px] sm:w-[300px] lg:w-auto snap-center">
              <div className="text-[36px] font-black text-purple-500 mb-2 leading-none">04</div>
              <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shadow-sm mb-5 border-[4px] border-white ring-1 ring-slate-100">
                <FiCode size={20} />
              </div>
              <h4 className="text-[16px] font-bold text-[#0f172a] mb-2">Learn & Build</h4>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed px-2">
                Work on real projects with guidance from industry experts.
              </p>
            </div>

            {/* Step 05 */}
            <div className="relative z-10 flex flex-col items-center text-center shrink-0 w-[260px] sm:w-[300px] lg:w-auto snap-center">
              <div className="text-[36px] font-black text-green-500 mb-2 leading-none">05</div>
              <div className="w-14 h-14 rounded-full bg-green-50 text-green-500 flex items-center justify-center shadow-sm mb-5 border-[4px] border-white ring-1 ring-slate-100">
                <FiAward size={20} />
              </div>
              <h4 className="text-[16px] font-bold text-[#0f172a] mb-2">Evaluate & Grow</h4>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed px-2">
                Receive feedback, improve your skills and become job-ready.
              </p>
            </div>

          </InternshipJourneyTimeline>
        </div>
      </section>

      {/* =====================================================
          4. EXPLORE INTERNSHIP ROLES
      ===================================================== */}
      <section id="programs" className="py-10 lg:py-16 bg-[#f8faff] scroll-mt-24">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <h3 className="text-[18px] font-bold uppercase tracking-widest !text-red-500 mb-3">
                PROGRAMS WE OFFER
              </h3>
              <h2 className="text-[32px] md:text-[40px] font-black tracking-tight text-[#0f172a]">
                Explore Internship Roles
              </h2>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((prog: any, idx: number) => {
              const colors = getColorClasses(prog.colorTheme);
              return (
                <div key={prog.id || idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 rounded-xl ${colors.iconBg} ${colors.iconText} flex items-center justify-center mb-6`}>
                    {renderProgramIcon(prog.icon)}
                  </div>
                  <h4 className="text-[18px] font-bold text-[#0f172a] mb-4">{prog.title}</h4>
                  <ul className="space-y-3">
                    {(prog.points || []).map((pt: string, ptIdx: number) => (
                      <li key={ptIdx} className="flex items-start gap-2 text-[13px] text-slate-500 font-medium">
                        <FiCheckCircle className={`${colors.checkText} mt-0.5 shrink-0`} size={14} /> {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          5. MORE THAN JUST AN INTERNSHIP
      ===================================================== */}
      <section className="py-10 lg:py-16 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">

          <div className="mb-8">
            <h3 className="text-[18px] font-bold uppercase tracking-widest !text-red-500 mb-3">
              WHY INTERN WITH IBACUS TECH
            </h3>
            <h2 className="text-[32px] md:text-[40px] font-black tracking-tight text-[#0f172a]">
              More Than Just an Internship
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6">

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-500 flex items-center justify-center mb-4">
                <FiUsers size={18} />
              </div>
              <h4 className="text-[15px] font-bold text-[#0f172a] mb-2">Industry Mentorship</h4>
              <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                Learn directly from experienced professionals.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center mb-4">
                <FiBriefcase size={18} />
              </div>
              <h4 className="text-[15px] font-bold text-[#0f172a] mb-2">Real-world Projects</h4>
              <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                Work on live projects and build your portfolio.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center mb-4">
                <FiZap size={18} />
              </div>
              <h4 className="text-[15px] font-bold text-[#0f172a] mb-2">Skill Development</h4>
              <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                Upgrade your skills with practical learning.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <FiTarget size={18} />
              </div>
              <h4 className="text-[15px] font-bold text-[#0f172a] mb-2">Career Support</h4>
              <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                Get guidance on resumes, interviews and placements.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-4">
                <FiAward size={18} />
              </div>
              <h4 className="text-[15px] font-bold text-[#0f172a] mb-2">Certificate</h4>
              <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                Earn a certificate of completion.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          6. TESTIMONIALS
      ===================================================== */}
      <InternshipTestimonials
        testimonials={displayTestimonials}
        title={settings.internshipTestimonialsTitle || "WHAT OUR INTERNS SAY"}
      />

      {/* =====================================================
          7. BOTTOM CTA RIBBON
      ===================================================== */}
      <section className="bg-white py-6 lg:py-8 relative overflow-hidden border-t border-slate-100">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-slate-900 rounded-3xl overflow-hidden relative shadow-xl">
            {/* Abstract Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center px-6 py-6 md:px-10 md:py-8 gap-6 md:gap-8">

              {/* Left Image / Illustration Placeholder */}
              <div className="hidden md:flex justify-center items-center relative h-full">
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                  <FiBriefcase className="text-white text-4xl opacity-90" />
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center md:text-left z-10">
                <h2 className="text-[22px] md:text-[28px] font-black !text-white leading-tight mb-2">
                  {settings.internshipClosingTitle || "Ready to Start Your Journey?"}
                </h2>
                {settings.internshipClosingContent ? (
                  <div
                    className="!text-slate-300 text-[14px] font-medium max-w-md mx-auto md:mx-0 html-content"
                    dangerouslySetInnerHTML={{ __html: settings.internshipClosingContent }}
                  />
                ) : (
                  <p className="!text-slate-300 text-[14px] font-medium max-w-md mx-auto md:mx-0">
                    Join hundreds of learners who are building their future with IBACUS TECH.
                  </p>
                )}
              </div>

              {/* Button */}
              <div className="text-center md:text-right z-10">
                <Link
                  href="/internship/apply"
                  className="w-full sm:w-auto inline-flex h-11 bg-white text-[#0f172a] rounded-lg px-6 items-center justify-center font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-lg whitespace-nowrap"
                >
                  Apply Now <FiArrowRight className="inline-block ml-2 text-[#e63946]" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
