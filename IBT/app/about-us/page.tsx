'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

import {
  FiArrowRight,
  FiTarget,
  FiUsers,
  FiGlobe,
  FiAward,
  FiChevronRight,
  FiChevronLeft,
  FiMail,
  FiLinkedin,
  FiCheckCircle,
  FiSpeaker,
  FiActivity,
  FiPieChart,
  FiEdit3,
  FiTrendingUp,
  FiCpu,
  FiLayers,
  FiBriefcase,
  FiSmile,
  FiEye,
  FiSend,
  FiBookOpen,
  FiTwitter,
  FiFacebook,
} from 'react-icons/fi'

import {
  apiClient,
  type PublicMember,
  type PublicBranch,
  type PublicStat,
  type PublicContact,
  type PublicPartner,
  type PublicClient,
} from '@/src/api/client'
import { useSocketSettings } from '@/src/providers/SocketSettingsProvider'
import { resolveImageUrl } from '@/src/utils/image'
import { Loader } from '@/src/shared/ui/Loader'
import { IoRocketOutline, IoPeopleOutline, IoSchoolOutline, IoTrophyOutline } from 'react-icons/io5'

function cleanHtml(html: string): string {
  if (!html) return ''
  if (typeof html !== 'string') return ''
  return html.replace(/&nbsp;/g, ' ')
}

export default function AboutPage() {
  const { settings } = useSocketSettings()
  const s = settings as any;
  const [members, setMembers] = useState<PublicMember[]>([])
  const [branches, setBranches] = useState<PublicBranch[]>([])
  const [stats, setStats] = useState<PublicStat[]>([])
  const [contacts, setContacts] = useState<PublicContact[]>([])
  const [partners, setPartners] = useState<PublicPartner[]>([])
  const [clients, setClients] = useState<PublicClient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 1);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll, members]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' })
    }
  }
  // Who Are We dynamic data
  const whoTitle = s.aboutWhoTitle || 'Who Are We?'
  const whoDescription = s.aboutWhoDescription || 'We are a digital and branding company that believes in the power of creative strategy and along with great design.'
  const whoSecondaryDescription = s.aboutWhoSecondaryDescription || 'Our team of designers, developers, analysts and problem solvers work together to deliver solutions that create impact. We don’t just build products, we build experiences that drive growth.'
  const whoFeatures = (s.aboutWhoFeatures && s.aboutWhoFeatures.length > 0) ? s.aboutWhoFeatures : [
    { title: 'Result-Oriented Approach', desc: 'We focus on measurable results that drive business growth.' },
    { title: 'Experienced Professionals', desc: 'Skilled team with domain expertise and industry knowledge.' },
    { title: 'Innovative Solutions', desc: 'We use the latest technologies to create future-ready solutions.' },
    { title: 'Client-Centric Mindset', desc: 'Your goals are our priority. We grow when you grow.' }
  ]
  const whoImages = (s.aboutWhoImages && s.aboutWhoImages.length > 0) ? s.aboutWhoImages : [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800'
  ]

  // How It Works dynamic data
  const processBadge = s.aboutProcessBadge || 'OUR PURPOSE'
  const processTitle = s.aboutProcessTitle || 'We bring your ideas to life through our proven process'
  const processFeatures = (s.aboutProcessFeatures && s.aboutProcessFeatures.length > 0) ? s.aboutProcessFeatures : [
    { title: 'Collect Ideas', desc: 'We listen to your ideas and turn them into smart solutions.' },
    { title: 'Plan & Analyse', desc: 'We analyze, plan and create a roadmap for success.' },
    { title: 'Design & Develop', desc: 'We design, develop and build with quality and scalability.' },
    { title: 'Deliver & Support', desc: 'We deliver on time and provide continuous support.' }
  ]
  const processImage = s.aboutProcessImage || 'https://sandbox.elemisthemes.com/assets/img/illustrations/i2.png'

  // Contact dynamic data
  const contactBadge = s.aboutContactBadge || 'GET IN TOUCH'
  const contactTitle = s.aboutContactTitle || "Got any questions? Don't hesitate to get in touch."
  const contactImage = s.aboutContactImage || 'https://sandbox.elemisthemes.com/assets/img/illustrations/i3.png'

  // Mission & Vision dynamic data
  const missionTitle = s.aboutMissionTitle || 'Our Mission'
  const missionDesc = s.aboutMissionDesc || 'We are committed to providing exceptional services by delivering innovative solutions, skill development programs and technology-driven products that create a lasting impact, enabling our clients and students to achieve their goals.'
  const visionTitle = s.aboutVisionTitle || 'Our Vision'
  const visionDesc = s.aboutVisionDesc || 'To be a global leader in digital transformation and career development. We aim to empower businesses and individuals by delivering innovative solutions, skill development programs and technology-driven products that create a lasting impact.'
  const missionCards = (s.aboutMissionCards && s.aboutMissionCards.length === 4) ? s.aboutMissionCards : [
    { value: '250+', label: 'Projects Delivered' },
    { value: '200+', label: 'Happy Clients' },
    { value: '50+', label: 'International Client' },
    { value: '10+', label: 'Years Experience' },
  ]

  /* =========================================================
      FETCH DATA
  ========================================================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        const [teamData, branchData, statsData, contactData, partnersData, clientsData] =
          await Promise.all([
            apiClient.getTeam(1, 100),
            apiClient.getBranches(1, 10),
            apiClient.getStats(1, 4),
            apiClient.getContacts(1, 10),
            apiClient.getPartners(1, 50),
            apiClient.getClients(1, 50),
          ])

        setMembers(teamData.items)
        setBranches(branchData.items)
        setStats(statsData.items)
        setContacts(contactData.items)
        setPartners(partnersData.items)
        setClients(clientsData.items)
      } catch (err) {
        console.warn('Error fetching about data:', err)
        setError(err instanceof Error ? err.message : 'Unable to load data at this time.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading && members.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white gap-6">
        <Loader size="lg" label="Synchronizing Experience..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased font-sans">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="relative overflow-hidden bg-white pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">

            {/* LEFT */}
            <div className="text-left lg:col-span-6">
              <span className="text-[18px] font-bold uppercase tracking-[0.25em] text-[#e63946]">
                ABOUT I BACUS TECH
              </span>

              <h1 className="mt-4 text-[24px] sm:text-[28px] lg:text-[40px] font-extrabold tracking-tight text-[#0f172a] leading-[1.15] ">
                We Build Digital
                <span className="text-[#e63946] pl-2">Excellence</span>
              </h1>

              <p className="pt-6 max-w-none lg:max-w-xl text-base leading-relaxed text-[#475569] ">
                I BACUS TECH SOLUTION specializes in custom software development, AI solutions, web and mobile application development, data analytics, and enterprise technology solutions that drive business success.
              </p>

              {/* BUTTONS */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact-us"
                  className="flex w-full sm:w-auto h-12 items-center justify-center rounded-lg bg-[#e63946] px-6 text-sm font-semibold text-white transition hover:bg-[#d62839] shadow-md shadow-red-500/10"
                >
                  Work With Us <FiArrowRight className="ml-2" />
                </Link>

                <Link
                  href="/services"
                  className="flex w-full sm:w-auto h-12 items-center justify-center rounded-full bg-white border border-slate-200 px-5 text-[18px] font-semibold text-[#0f172a] transition hover:bg-slate-50 gap-3 shadow-sm"
                >
                  Our Services
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0f172a] text-white">
                    <FiArrowRight size={12} />
                  </div>
                </Link>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative lg:col-span-6">
              <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000"
                  alt="Modern glass skyscraper architecture"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* FLOATING CARD */}
              <div className="absolute bottom-6 left-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl max-w-xs">
                <div className="text-sm font-bold text-[#0f172a]">Building Solutions</div>
                <div className="text-xs font-semibold text-[#e63946] mt-0.5">That Create Impact</div>
              </div>
            </div>

          </div>

          {/* COUNTER GRID ROW RIGHT UNDER HERO */}
          <div className="mt-16 grid grid-cols-2 gap-6 border-t border-slate-100 pt-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-4 md:justify-center lg:justify-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-50 text-[#e63946]">
                <FiAward size={22} />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#0f172a]">10+</div>
                <div className="text-xs font-medium text-slate-500">Years of Experience</div>
              </div>
            </div>

            <div className="flex items-center gap-4 md:justify-center lg:justify-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-50 text-[#e63946]">
                <FiUsers size={22} />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#0f172a]">250+</div>
                <div className="text-xs font-medium text-slate-500">Projects Delivered</div>
              </div>
            </div>

            <div className="flex items-center gap-4 md:justify-center lg:justify-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                <FiCheckCircle size={22} />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#0f172a]">50+</div>
                <div className="text-xs font-medium text-slate-500">Expert Professionals</div>
              </div>
            </div>

            <div className="flex items-center gap-4 md:justify-center lg:justify-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-50 text-[#e63946]">
                <FiSmile size={22} />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#0f172a]">95%</div>
                <div className="text-xs font-medium text-slate-500">Client Satisfaction</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================
          2. WHO ARE WE SECTION
      ===================================================== */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">

            {/* Left Column Content */}
            <div className="lg:col-span-6">
              <span className="text-[18px] font-bold uppercase tracking-wider text-[#e63946]">
                WHO WE ARE
              </span>
              <h2 className="mt-2 text-[36px] font-extrabold text-[#0f172a] tracking-tight sm:text-[44px] md:text-[50px] leading-[1.1] mb-6">
                {whoTitle}
              </h2>
              <div
                className="text-lg text-slate-600 leading-relaxed mb-4 prose max-w-none [&>p]:mb-4"
                dangerouslySetInnerHTML={{ __html: cleanHtml(whoDescription) }}
              />
              <div
                className="text-base text-slate-500 leading-relaxed mb-10 prose max-w-none [&>p]:mb-4"
                dangerouslySetInnerHTML={{ __html: cleanHtml(whoSecondaryDescription) }}
              />

              {/* Approach 2x2 Feature Block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {whoFeatures.map((item: any, i: number) => (
                  <div key={i} className="flex flex-col items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-[#e63946]">
                      {i === 0 && <FiTrendingUp size={18} />}
                      {i === 1 && <FiUsers size={18} />}
                      {i === 2 && <FiCpu size={18} />}
                      {i === 3 && <FiTarget size={18} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0f172a]">{item.title || item}</h4>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">{item.desc || 'Leveraging modern methodology and infrastructure frameworks.'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column Grid Images */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6">
                <div className="rounded-2xl overflow-hidden h-full">
                  <img src={resolveImageUrl(whoImages[0])} alt="Office workspace collaboration" className="w-full h-full object-cover min-h-[250px] sm:min-h-[400px]" />
                </div>
              </div>
              <div className="sm:col-span-6 flex flex-col gap-4">
                <div className="rounded-2xl overflow-hidden h-[48%] min-h-[150px] sm:min-h-0">
                  <img src="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&q=80&w=600" alt="Meeting discussion room" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden h-[48%] min-h-[150px] sm:min-h-0">
                  <img src={resolveImageUrl(whoImages[1])} alt="Whiteboard sketching presentation" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          3. HOW IT WORKS / OUR PURPOSE SECTION
      ===================================================== */}
      <section className="py-12 lg:py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">

            {/* Left Grid Layout: Features */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-[18px] font-bold uppercase tracking-wider text-[#e63946]">
                  {processBadge}
                </span>
                <h2 className="mt-2 text-[36px] font-extrabold text-[#0f172a] tracking-tight sm:text-[44px] md:text-[50px] leading-[1.1]">
                  {processTitle}
                </h2>
              </div>

              <div className="space-y-6">
                {processFeatures.map((feat: any, i: number) => {
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 shadow-sm">
                        {i === 0 && <FiEdit3 size={15} />}
                        {i === 1 && <FiPieChart size={15} />}
                        {i === 2 && <FiLayers size={15} />}
                        {i === 3 && <FiCheckCircle size={15} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0f172a]">{feat.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed mt-0.5 max-w-none lg:max-w-lg">
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Layout: 3D Illustration Viewport */}
            <div className="lg:col-span-5 flex justify-center">
              <img
                src={resolveImageUrl(processImage)}
                alt="Operational workflow illustration"
                className="w-full h-auto max-w-[380px] drop-shadow-xl animate-float"
              />
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          4. MILESTONES DARK METRICS SECTION
      ===================================================== */}
      <section className="bg-[#051124] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-center relative">

            {/* Vertical Divider (Visible only on large screens) */}
            <div className="hidden lg:block absolute left-[33.333%] top-4 bottom-4 w-px bg-white/10"></div>

            <div className="lg:col-span-4 lg:pr-12">
              <span className="text-[16px] font-bold uppercase tracking-[0.15em] text-[#e63946]">
                OUR JOURNEY IN NUMBERS
              </span>
              <h2 className="mt-3 text-[22px] sm:text-[34px] font-extrabold tracking-tight !text-white mb-4 leading-[1.2] whitespace-normal">
                Milestones That <br className="hidden lg:block" />
                Define Our Journey
              </h2>
              <p className="text-[13px] text-slate-300/80 leading-relaxed">
                From a small team with a big vision to a trusted partner for 200+ businesses contents — our numbers reflect our passion and commitment.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:pl-6">
              {missionCards.map((card: any, idx: number) => {
                const icons = [
                  <IoRocketOutline size={26} />,
                  <IoPeopleOutline size={26} />,
                  <IoSchoolOutline size={26} />,
                  <IoTrophyOutline size={26} />
                ]
                return (
                  <div key={idx} className="border border-white/10 rounded-2xl p-4 sm:p-6 text-center flex flex-col items-center justify-center hover:bg-white/[0.02] transition-colors relative group">
                    <div className="mb-5 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.2rem] bg-white/[0.03] text-white shadow-inner group-hover:bg-white/[0.06] transition-colors">
                      {icons[idx % icons.length]}
                    </div>
                    <div className="text-[28px] font-extrabold text-white mb-1.5 leading-none">{card?.value || '00'}</div>
                    <div className="text-[13px] font-medium text-slate-200">{card?.label}</div>
                  </div>
                )
              })}
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          MISSION & VISION SPLIT GRID (White Section)
      ===================================================== */}
      <section className="py-12 lg:py-16 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 split-divided">

            {/* VISION CARD */}
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-rose-50 text-[#e63946] border border-rose-100 shadow-sm">
                <FiEye size={24} />
              </div>
              <div>
                <span className="text-[14px] font-bold text-[#e63946] uppercase tracking-wider">OUR VISION</span>
                <h3 className="text-[32px] sm:text-[40px] md:text-[44px] leading-[1.1] font-extrabold text-[#0f172a] tracking-tight mt-2 mb-4">{visionTitle}</h3>
                <div
                  className="text-base sm:text-lg text-slate-500 leading-relaxed prose max-w-none [&>p]:mb-4"
                  dangerouslySetInnerHTML={{ __html: cleanHtml(visionDesc) }}
                />
              </div>
            </div>

            {/* MISSION CARD */}
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-4 md:border-l border-slate-100">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-rose-50 text-[#e63946] border border-rose-100 shadow-sm">
                <FiTarget size={24} />
              </div>
              <div>
                <span className="text-[14px] font-bold text-[#e63946] uppercase tracking-wider">OUR MISSION</span>
                <h3 className="text-[32px] sm:text-[40px] md:text-[44px] leading-[1.1] font-extrabold text-[#0f172a] tracking-tight mt-2 mb-4">{missionTitle}</h3>
                <div
                  className="text-base sm:text-lg text-slate-500 leading-relaxed prose max-w-none [&>p]:mb-4"
                  dangerouslySetInnerHTML={{ __html: cleanHtml(missionDesc) }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          5. TEAM MEMBERS LEADERSHIP ROW
      ===================================================== */}
      <section className="pt-12 lg:pt-16 pb-6 lg:pb-8 bg-slate-50/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* HEADER HEADER */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[18px] font-bold uppercase tracking-wider text-[#e63946]">OUR TEAM</span>
            <h2 className="text-[36px] sm:text-[44px] md:text-[50px] leading-[1.1] font-extrabold tracking-tight text-[#0f172a] mt-2 mb-4">Meet Our Leadership Team</h2>
            <p className="text-base sm:text-lg text-slate-500 mt-2">Experts who drive innovation, deliver solutions and build successful partnerships.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse h-64 rounded-[1.5rem] bg-slate-200" />
              ))}
            </div>
          ) : (
            <div>
              {members.length > 0 ? (
                <>
                  <div className="px-4 sm:px-12 w-full">
                     <div className="relative group/slider flex items-center w-full">
                      <button
                        onClick={scrollLeft}
                        disabled={!canScrollLeft}
                        className={`absolute -left-4 sm:-left-12 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-colors focus:outline-none ${!canScrollLeft
                          ? 'opacity-30 cursor-not-allowed text-slate-300'
                          : 'text-slate-600 hover:text-[#e63946]'
                          }`}
                      >
                        <FiChevronLeft size={20} />
                      </button>

                      <div
                        ref={sliderRef}
                        onScroll={checkScroll}
                        className="flex overflow-x-auto gap-5 sm:gap-6 pb-6 pt-4 px-[calc(50%-130px)] md:px-4 lg:px-8 snap-x snap-mandatory hide-scrollbar w-full"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        {members.map((member) => (
                          <div
                            key={member.id}
                            className="snap-center shrink-0 w-[260px] bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-300 flex flex-col items-center p-6"
                          >
                            <div className="w-24 h-24 rounded-full overflow-hidden mb-5 border-4 border-slate-50 shadow-sm shrink-0">
                              {member.avatarUrl ? (
                                <img
                                  src={member.avatarUrl}
                                  alt={member.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                                  <FiUsers size={32} />
                                </div>
                              )}
                            </div>

                            <h4 className="text-[17px] font-bold text-[#0f172a] text-center tracking-tight leading-snug">{member.name}</h4>
                            <p className="text-[13px] font-semibold text-[#e63946] text-center mt-1.5">{member.role}</p>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={scrollRight}
                        disabled={!canScrollRight}
                        className={`absolute -right-4 sm:-right-12 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-colors focus:outline-none ${!canScrollRight
                          ? 'opacity-30 cursor-not-allowed text-slate-300'
                          : 'text-slate-600 hover:text-[#e63946]'
                          }`}
                      >
                        <FiChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                  <style dangerouslySetInnerHTML={{
                    __html: `
                      .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                      }
                    `}} />
                </>
              ) : (
                <div className="text-center text-xs text-slate-400 py-12">No active leaders currently populated.</div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          TRUSTED COMPANIES ROW (Marquee)
      ===================================================== */}
      <section className="py-12 bg-white border-t border-b border-slate-100 overflow-hidden">
        <div className="mx-auto max-w-7xl text-center relative">
          <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">TRUSTED BY AMAZING COMPANIES</span>

          <div className="mt-10 relative flex w-full items-center">
            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {(() => {
              const combinedLogos = [...partners, ...clients]
              const fallbackLogos = [
                { id: '1', name: 'Journey Analytics', type: 'text', color: 'text-[#2563eb]' },
                { id: '2', name: 'TechCoach', type: 'text', color: 'text-slate-800' },
                { id: '3', name: 'Octosignals', type: 'text', color: 'text-emerald-600' },
                { id: '4', name: 'MultipliersKart', type: 'text', color: 'text-slate-700' },
                { id: '5', name: 'FIM', type: 'text', color: 'text-red-600' },
                { id: '6', name: 'X-Mind', type: 'text', color: 'text-blue-500' },
              ]
              const displayLogos = combinedLogos.length > 0 ? combinedLogos : fallbackLogos

              const multipliedLogos = displayLogos.length < 8
                ? [...displayLogos, ...displayLogos, ...displayLogos, ...displayLogos]
                : [...displayLogos, ...displayLogos]

              return (
                <motion.div
                  className="flex w-max gap-12 sm:gap-24 pr-12 sm:pr-24 items-center"
                  animate={{ x: ['0%', '-50%'] }}
                  transition={{ repeat: Infinity, ease: 'linear', duration: Math.max(30, displayLogos.length * 5) }}
                >
                  {multipliedLogos.map((logo: any, idx: number) => (
                    <div key={`${logo.id}-${idx}`} className="shrink-0 flex items-center justify-center transition-transform hover:scale-105 duration-300">
                      {logo.logoUrl ? (
                        <img src={logo.logoUrl} alt={logo.name} className="max-h-10 sm:max-h-12 max-w-[160px] object-contain" />
                      ) : (
                        <span className={`font-black text-xl sm:text-2xl ${logo.color || 'text-slate-800'} tracking-tight`}>{logo.name}</span>
                      )}
                    </div>
                  ))}
                </motion.div>
              )
            })()}
          </div>
        </div>
      </section>

      {/* =====================================================
          READY TO WORK CTA BANNER INTERFACE 
      ===================================================== */}
      <section className="my-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0d1b2a] to-[#e63946] rounded-xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="absolute left-0 bottom-0 opacity-20 pointer-events-none">
            <FiSend size={180} className="text-white transform -rotate-12 translate-y-12 -translate-x-6" />
          </div>
          <div className="relative z-10 text-center sm:text-left">
            <h3 className="text-xl font-extrabold !text-white sm:text-2xl">Ready to work with us?</h3>
            <p 
              className="text-xs text-slate-200 mt-1"
              style={{ textAlign: 'inherit' }}
            >
              Let's build something amazing together.
            </p>
          </div>
          <Link
            href="/contact-us"
            className="relative z-10 bg-white text-[#0f172a] rounded-lg px-6 py-3.5 text-xs font-bold shadow-sm hover:bg-slate-50 transition shrink-0 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Schedule a Free Consultation <FiArrowRight />
          </Link>
        </div>
      </section>

    </div>
  )
}
