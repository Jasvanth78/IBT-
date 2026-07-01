'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { apiClient, type PaginationMeta, type PublicLabProject, type PublicPartner } from '@/src/api/client';
import { Loader } from '@/src/shared/ui';
import { motion } from 'framer-motion';
import { resolveImageUrl } from '@/src/utils/image';
import { useSocketSettings } from '@/src/providers/SocketSettingsProvider';
import {
  FiArrowRight,
  FiLayers,
  FiCheck,
  FiTarget,
  FiUsers,
  FiAward,
  FiZap,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiBriefcase,
  FiTerminal,
  FiShield,
  FiCpu,
  FiCode
} from 'react-icons/fi';
import {
  FaRocket,
  FaUserGraduate,
  FaLightbulb,
  FaHandshake,
  FaFileAlt,
  FaFlask,
  FaSearch,
  FaCogs,
  FaCheckCircle,
  FaChartLine
} from 'react-icons/fa';

/* =========================================================
   UTILITIES
========================================================= */
const cleanHtml = (html: string) => {
  if (!html) return '';
  return html
    .replace(/&nbsp;/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/style="[^"]*color\s*:\s*[^"]*"/gi, '');
};

/* =========================================================
   SUPPORTING COMPONENTS
========================================================= */

function PartnerMarqueeCard({
  item,
}: {
  item: PublicPartner;
}) {
  const textColors = [
    'text-blue-600',
    'text-emerald-600',
    'text-indigo-600',
    'text-rose-500',
    'text-amber-500',
    'text-violet-600'
  ];
  const hash = item.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorClass = textColors[hash % textColors.length];

  const content = item.logoUrl ? (
    <img
      src={resolveImageUrl(item.logoUrl)}
      alt={item.name}
      className="h-10 max-w-[140px] object-contain transition-transform duration-300 hover:scale-105"
    />
  ) : (
    <span className={`text-[20px] font-black tracking-tight ${colorClass} hover:opacity-80 transition-opacity duration-300`}>
      {item.name}
    </span>
  );

  if (item.website) {
    return (
      <a
        href={item.website}
        target="_blank"
        rel="noopener noreferrer"
        className="block shrink-0 outline-none hover:scale-105 transition-transform duration-300"
      >
        {content}
      </a>
    );
  }

  return <div className="shrink-0">{content}</div>;
}

function PartnerInfiniteMarquee({
  items,
  direction = 'right',
  speed = 40
}: {
  items: PublicPartner[];
  direction?: 'left' | 'right';
  speed?: number;
}) {
  if (!items || items.length === 0) return null;

  const multipliedItems = items.length < 8
    ? [...items, ...items, ...items, ...items]
    : [...items, ...items];

  return (
    <div className="relative flex w-full overflow-hidden py-4">
      {/* Edge fading masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 sm:w-36 bg-gradient-to-r from-white to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 sm:w-36 bg-gradient-to-l from-white to-transparent"></div>

      <motion.div
        className="flex w-max gap-16 items-center pr-16"
        animate={{
          x: direction === 'left' ? [0, '-50%'] : ['-50%', 0],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: speed,
        }}
      >
        {multipliedItems.map((item, i) => (
          <PartnerMarqueeCard key={`${item.id}-${i}`} item={item} />
        ))}
      </motion.div>
    </div>
  );
}

/* =========================================================
   PAGE COMPONENT
========================================================= */

export function AllLabsPage() {
  const [projects, setProjects] = useState<PublicLabProject[]>([]);
  const [partners, setPartners] = useState<PublicPartner[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 6, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSocketSettings();

  const loadingRef = useRef(false);

  // Carousel State
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  const timelineRef = useRef<HTMLDivElement>(null);
  const [canScrollTimelineLeft, setCanScrollTimelineLeft] = useState(false);
  const [canScrollTimelineRight, setCanScrollTimelineRight] = useState(true);

  const checkTimelineScroll = useCallback(() => {
    if (timelineRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = timelineRef.current;
      setCanScrollTimelineLeft(scrollLeft > 1);
      setCanScrollTimelineRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  }, []);

  const scrollTimelineLeft = () => {
    if (timelineRef.current) {
      timelineRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollTimelineRight = () => {
    if (timelineRef.current) {
      timelineRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const updateVisible = () => {
      const w = window.innerWidth;
      if (w >= 1024) setVisibleCount(4);
      else if (w >= 640) setVisibleCount(2);
      else setVisibleCount(1);
      checkTimelineScroll();
    };

    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, [checkTimelineScroll]);

  const loadData = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const [projectsResult, partnersResult] = await Promise.all([
        apiClient.getProjects(1, 10),
        apiClient.getPartners(1, 100)
      ]);

      setProjects(projectsResult.items || []);
      setPartners(partnersResult.items || []);
    } catch (err) {
      console.warn("Failed to load lab data", err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Fallback / Hardcoded Carousel Items if API is empty
  const defaultCarouselItems = [
    { title: "Predictive Maintenance AI", desc: "AI model to predict machine failures and downtime.", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400", tag: "AI / ML" },
    { title: "Smart Energy Monitor", desc: "IoT device for real-time flexibility monitoring.", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400", tag: "IoT" },
    { title: "AutoBot Rover", desc: "Autonomous rover for exploration and mapping.", img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400", tag: "Robotics" },
    { title: "Cyber Threat Detector", desc: "ML based system to detect network threats.", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400", tag: "Cyber Security" },
  ];

  const portfolioItems = projects.length > 0
    ? projects.map(p => ({
      title: p.title,
      desc: (p.description || '').replace(/<[^>]*>/g, '').slice(0, 60) + '...',
      img: p.imageUrl ? resolveImageUrl(p.imageUrl) : defaultCarouselItems[0].img,
      tag: p.techStack?.[0] || 'Research',
      slug: p.slug
    }))
    : defaultCarouselItems.map((item) => ({ ...item, slug: '' }));

  const fallbackPartners = [
    { id: "fp1", name: "Journey", logoUrl: null, website: "#" },
    { id: "fp2", name: "TechCoach", logoUrl: null, website: "#" },
    { id: "fp3", name: "Octosignals", logoUrl: null, website: "#" },
    { id: "fp4", name: "MultipliersKart", logoUrl: null, website: "#" },
    { id: "fp5", name: "FIM", logoUrl: null, website: "#" },
    { id: "fp6", name: "X-Mind", logoUrl: null, website: "#" },
  ] as PublicPartner[];

  const displayPartners = partners.length > 0 ? partners : fallbackPartners;

  // Lab Initiatives
  const initiatives = useMemo(() => {
    const raw = settings['labs_initiatives'];
    let items: any[] = [];
    if (Array.isArray(raw) && raw.length > 0) {
      items = raw;
    } else if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) items = parsed;
      } catch { }
    }
    if (items.length === 0) {
      items = [
        {
          id: 'init1',
          badge: 'ACTIVE RESEARCH',
          title: 'Next-Gen Robotics.',
          description: 'Developing autonomous systems for precision manufacturing and hazardous environment exploration.',
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
          link: '/services',
          btnText: '',
          layout: 'dark-large'
        },
        {
          id: 'init2',
          badge: '',
          title: 'Practice Log',
          description: 'The ultimate tool to track your skills.',
          imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
          link: 'https://practice-skill-log.vercel.app/login',
          btnText: 'Visit',
          layout: 'light-row'
        },
        {
          id: 'init3',
          badge: '',
          title: 'Join the Lab Ecosystem',
          description: 'Collaborate with industry veterans on real-world challenges that define the next decade.',
          imageUrl: '',
          link: '',
          btnText: 'Submit Portfolio',
          layout: 'gradient-cta'
        }
      ];
    }
    return items.map((item: any) => ({
      ...item,
      title: cleanHtml(item.title || ''),
      description: cleanHtml(item.description || '')
    }));
  }, [settings]);

  const largeCards = useMemo(() => initiatives.filter((c: any) => c.layout === 'dark-large'), [initiatives]);
  const stackedCards = useMemo(() => initiatives.filter((c: any) => c.layout !== 'dark-large'), [initiatives]);

  // Technical Rigor Section
  const rigorTitle = cleanHtml(settings['labs_rigor_title'] || 'Technical Rigor');
  const rigorDesc = cleanHtml(settings['labs_rigor_description'] || 'Our laboratory environment is built on the principles of mechanical and digital precision. We believe that true innovation happens at the intersection of rigorous testing and creative problem-solving.');
  const rigorPoints = useMemo(() => {
    const raw = settings['labs_rigor_points'];
    if (Array.isArray(raw) && raw.length > 0) return raw;
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { }
    }
    return [
      'Phase-gate project management systems',
      'Peer-reviewed code and design standards',
      'Iterative prototyping and stress testing'
    ];
  }, [settings]);
  const rigorImage = settings['labs_rigor_image'] || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800';

  // Mentorship
  const mentorshipTitle = cleanHtml(settings['labs_mentorship_title'] || 'Mentorship-First Approach');
  const mentorshipDesc = cleanHtml(settings['labs_mentorship_description'] || 'We pair emerging talent with seasoned industry veterans. This ensures that every project is guided by experience while being fueled by fresh perspectives.');
  const mentorshipImage = settings['labs_mentorship_image'] || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80';
  const mentorshipQuote = cleanHtml(settings['labs_mentorship_quote'] || 'Innovation isn\'t just about technology. It\'s about the people who build it and the minds we nurture along the way.');
  const mentorshipQuoteAuthor = cleanHtml(settings['labs_mentorship_quote_author'] || 'Dr. Sarah Jenkins');
  const mentorshipQuoteRole = cleanHtml(settings['labs_mentorship_quote_role'] || 'IBT LABS CORE TEAM');
  const mentorshipQuoteAvatar = settings['labs_mentorship_quote_avatar'] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80';

  // Hero Section
  const rawHeroTitle = settings['labs_hero_title'];
  const heroTitle = (!rawHeroTitle || rawHeroTitle.trim() === 'IBT LABS')
    ? 'Precision-led <br class="md:hidden" /><span class="text-[#e63946]">Future Engineering</span>'
    : cleanHtml(rawHeroTitle);
  const heroDescription = cleanHtml(settings['labs_hero_description'] || 'Empowering the next generation of researchers and engineers through precision-led skill development and forward-thinking technological innovation.');
  const heroImageUrl = settings['labs_hero_image_url'] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200';
  const rawHeroBtnText = settings['labs_hero_btn1_text'];
  const heroBtnText = (!rawHeroBtnText || rawHeroBtnText.trim() === '' || rawHeroBtnText.trim() === 'Collaborate')
    ? 'Join our Lab'
    : cleanHtml(rawHeroBtnText);

  // CTA Section
  const ctaTitle = cleanHtml(settings['labs_cta_title'] || 'Ready to Innovate and Create Impact?');
  const ctaDescription = cleanHtml(settings['labs_cta_description'] || 'Join IBT Labs and be a part of a thriving community of innovators.');
  const rawCtaBtnText = settings['labs_cta_btn_text'];
  const ctaBtnText = (!rawCtaBtnText || rawCtaBtnText.trim() === '' || rawCtaBtnText.trim() === 'Collaborate')
    ? 'Submit your idea'
    : cleanHtml(rawCtaBtnText);

  const showPrev = () => {
    setCarouselIndex((prev) => (prev <= 0 ? Math.max(0, portfolioItems.length - visibleCount) : prev - 1));
  };
  const showNext = () => {
    setCarouselIndex((prev) => (prev >= portfolioItems.length - visibleCount ? 0 : prev + 1));
  };

  /* =========================================================
     RENDER
  ========================================================= */

  if (loading && projects.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white">
        <Loader size="lg" label="Loading Lab Data..." />
      </div>
    );
  }

  return (
    <div className="bg-[#f8faff] min-h-screen overflow-hidden font-sans">

      {/* =====================================================
          1. HERO SECTION
      ===================================================== */}
      <section className="relative pt-12 pb-28 sm:pb-36 lg:pt-20 lg:pb-24 bg-[#f8faff]">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

            {/* Left Content */}
            <div className="relative z-10 max-w-none lg:max-w-xl">


              <h1
                className="text-[24px] sm:text-[28px] lg:text-[40px] font-black text-[#0f172a] leading-[1.05] tracking-tight mb-6 md:[&_br]:hidden"
                dangerouslySetInnerHTML={{ __html: heroTitle }}
              />

              <div
                className="text-[15px] text-slate-500 font-medium leading-relaxed mb-10 max-w-none lg:max-w-md [&>p]:mb-4 last:[&>p]:mb-0"
                dangerouslySetInnerHTML={{ __html: heroDescription }}
              />

              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-50 text-[#e63946] flex items-center justify-center shrink-0 border border-red-100">
                    <FiLayers size={20} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#0f172a] mb-1">Project-Based</h4>
                    <p className="text-[13px] text-slate-500 font-medium">Real-world technical deliverables.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-50 text-[#e63946] flex items-center justify-center shrink-0 border border-red-100">
                    <FiZap size={20} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#0f172a] mb-1">Pure Skill</h4>
                    <p className="text-[13px] text-slate-500 font-medium">Mentorship-led acquisition.</p>
                  </div>
                </div>
              </div>

              <Link
                href="/internship/apply"
                className="w-full sm:w-auto inline-flex h-12 sm:h-14 px-8 bg-[#e63946] text-white rounded-lg items-center justify-center text-[14px] font-bold shadow-lg shadow-red-500/20 hover:bg-[#c1121f] transition-colors"
              >
                {heroBtnText} <FiArrowRight className="ml-2" />
              </Link>
            </div>

            {/* Right Image & Badge */}
            <div className="relative z-10 lg:pl-10 mt-12 lg:mt-0">
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-slate-100">
                <img
                  src={resolveImageUrl(heroImageUrl)}
                  alt="Laboratory Engineering"
                  className="w-full h-[300px] sm:h-[380px] lg:h-[450px] object-cover"
                />
              </div>

              {/* Floating Badge (Left offset) */}
              <div className="absolute top-[55%] sm:top-[60%] left-4 sm:left-6 lg:-left-12 lg:top-[60%] bg-white p-4 sm:p-5 lg:p-6 rounded-2xl shadow-2xl border border-slate-100 max-w-[220px] sm:max-w-[260px] z-20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-50 text-[#e63946] flex items-center justify-center mb-3 sm:mb-4">
                  <FiAward size={20} className="sm:w-[24px] sm:h-[24px]" />
                </div>
                <h4 className="text-[14px] sm:text-[16px] font-bold text-[#0f172a] mb-1 sm:mb-2">Certification</h4>
                <p className="text-[11px] sm:text-[13px] text-slate-500 font-medium leading-relaxed">
                  Accredited recognition of laboratory proficiency.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          2. DARK STATS BAR
      ===================================================== */}
      <section className="relative z-20 pb-16">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0f172a] rounded-[2rem] shadow-2xl py-6 px-4 sm:py-8 sm:px-6 lg:py-10 lg:px-12 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-0 lg:divide-x lg:divide-slate-700/50">

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center text-center sm:text-left">
              <FaRocket className="text-white text-xl sm:text-2xl opacity-80" />
              <div>
                <div className="text-[20px] sm:text-[24px] lg:text-[28px] font-black text-white leading-tight">50+</div>
                <div className="text-[10px] sm:text-[11px] lg:text-[12px] font-medium text-slate-300">Research Projects</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center text-center sm:text-left lg:pl-6">
              <FaUserGraduate className="text-white text-xl sm:text-2xl opacity-80" />
              <div>
                <div className="text-[20px] sm:text-[24px] lg:text-[28px] font-black text-white leading-tight">5000+</div>
                <div className="text-[10px] sm:text-[11px] lg:text-[12px] font-medium text-slate-300">Students Trained</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center text-center sm:text-left lg:pl-6">
              <FaLightbulb className="text-white text-xl sm:text-2xl opacity-80" />
              <div>
                <div className="text-[20px] sm:text-[24px] lg:text-[28px] font-black text-white leading-tight">15+</div>
                <div className="text-[10px] sm:text-[11px] lg:text-[12px] font-medium text-slate-300">Live Innovations</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center text-center sm:text-left lg:pl-6">
              <FaHandshake className="text-white text-xl sm:text-2xl opacity-80" />
              <div>
                <div className="text-[20px] sm:text-[24px] lg:text-[28px] font-black text-white leading-tight">20+</div>
                <div className="text-[10px] sm:text-[11px] lg:text-[12px] font-medium text-slate-300">Industry Collaborations</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          3. LAB INITIATIVES (Grid)
      ===================================================== */}
      <section className="py-12 lg:py-16 bg-[#f8faff]">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-[32px] md:text-[40px] font-black tracking-tight text-[#0f172a] mb-2">
                Lab Initiatives
              </h2>
              <p className="text-[15px] text-slate-500 font-medium">Explore our specialized research and development sectors.</p>
            </div>

          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left large cards */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {largeCards.map((card: any) => (
                <div key={card.id} className="bg-[#0f172a] rounded-[2rem] overflow-hidden relative shadow-lg group min-h-[300px] sm:min-h-[380px] lg:min-h-[450px] flex-1 flex flex-col justify-end">
                  {card.imageUrl && (
                    <img
                      src={resolveImageUrl(card.imageUrl)}
                      alt={card.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent pointer-events-none" />

                  <div className="relative p-6 sm:p-8 lg:p-10 z-10">
                    {card.badge && (
                      <div className="inline-block bg-[#e63946] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 sm:mb-4">
                        {card.badge}
                      </div>
                    )}
                    <h3 className="text-[22px] sm:text-[30px] lg:text-[36px] font-black !text-white leading-tight mb-2 sm:mb-3">
                      {card.title}
                    </h3>
                    <div className="text-[13px] sm:text-[14px] text-slate-300 font-medium max-w-none lg:max-w-sm html-content" dangerouslySetInnerHTML={{ __html: card.description }} />
                    {card.btnText && (
                      <Link href={card.link || '#'} className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-[#e63946] hover:gap-2 transition-all target='_blank' ">
                        {card.btnText} <FiArrowRight />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right stacked cards */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {stackedCards.map((card: any) => {
                 if (card.layout === 'gradient-cta') {
                  return (
                    <div key={card.id} className="bg-gradient-to-br from-[#e63946] to-[#c1121f] rounded-[2rem] p-8 shadow-lg text-white relative overflow-hidden h-full flex flex-col justify-between min-h-[220px]">
                      <FiZap className="absolute -right-8 -bottom-8 text-[180px] text-red-950 opacity-20 transform -rotate-12 pointer-events-none" />

                      <div className="w-12 h-12 bg-white rounded-xl text-[#e63946] flex items-center justify-center shadow-md relative z-10 mb-6">
                        <FiZap size={24} />
                      </div>

                      <div className="relative z-10 flex-1 flex flex-col justify-end">
                        <h4 className="text-[24px] font-black mb-2 text-[#0f172a]">{card.title}</h4>
                        <div className="text-[13px] text-white font-medium html-content" dangerouslySetInnerHTML={{ __html: card.description }} />
                        {card.btnText && (
                          <div className="mt-4 flex gap-4">
                            <Link
                              href={card.link || '#'}
                              className="inline-flex h-10 px-6 bg-white text-[#e63946] rounded-lg items-center justify-center text-[13px] font-bold hover:bg-slate-50 transition-colors shadow-md"
                            >
                              {card.btnText} <FiArrowRight className="ml-1.5" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                // Default: light-row
                return (
                  <div key={card.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 h-full hover:shadow-lg transition-shadow">
                    {card.imageUrl && (
                      <div className="w-full sm:w-1/2 h-40 sm:h-auto rounded-xl overflow-hidden shrink-0">
                        <img src={resolveImageUrl(card.imageUrl)} alt={card.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex flex-col justify-center min-w-0 flex-1">
                      {card.badge && (
                        <span className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">{card.badge}</span>
                      )}
                      <h4 className="text-[22px] font-black text-[#0f172a] mb-2">{card.title}</h4>
                      <div className="text-[13px] text-slate-500 font-medium mb-4 html-content" dangerouslySetInnerHTML={{ __html: card.description }} />
                      <Link href={card.link || '/services'} className="text-[13px] font-bold text-[#e63946] flex items-center gap-1 hover:gap-2 transition-all">
                        {card.btnText || 'Learn More'} <FiArrowRight />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          4. OUR RESEARCH PROCESS (Timeline)
      ===================================================== */}
      <section className="py-12 lg:py-16 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">

          <div className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-bold uppercase tracking-widest !text-red-500 mb-3">
                OUR RESEARCH PROCESS
              </h3>
            </div>

            {/* Navigation Arrows (Moved to header) */}
            <div className="flex items-center gap-2 lg:hidden shrink-0 pb-1 self-end sm:self-auto">
              <button
                onClick={scrollTimelineLeft}
                disabled={!canScrollTimelineLeft}
                className={`w-10 h-10 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center transition-all ${!canScrollTimelineLeft
                    ? 'opacity-30 cursor-not-allowed text-slate-300'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                <FiChevronLeft size={20} />
              </button>
              <button
                onClick={scrollTimelineRight}
                disabled={!canScrollTimelineRight}
                className={`w-10 h-10 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center transition-all ${!canScrollTimelineRight
                    ? 'opacity-30 cursor-not-allowed text-slate-300'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="relative flex items-center">

            {/* Timeline Line */}
            <div className="absolute top-[30px] left-10 right-10 h-[2px] bg-slate-100 z-0" />

            {/* Timeline Steps */}
            <div
              ref={timelineRef}
              onScroll={checkTimelineScroll}
              className="w-full flex lg:grid lg:grid-cols-6 gap-6 px-10 overflow-x-auto snap-x snap-mandatory lg:overflow-visible pb-4 custom-scrollbar"
            >

              {[
                { num: '01', title: 'Idea Discovery', desc: 'Identify real-world problems worth solving.', icon: <FaLightbulb />, color: 'text-blue-500 bg-blue-50 border-blue-100' },
                { num: '02', title: 'Research & Analysis', desc: 'Deep research and feasibility analysis.', icon: <FaFileAlt />, color: 'text-red-500 bg-red-50 border-red-100' },
                { num: '03', title: 'Prototype Development', desc: 'Build and design the initial prototypes.', icon: <FiCode />, color: 'text-green-500 bg-green-50 border-green-100' },
                { num: '04', title: 'Testing & Validation', desc: 'Test rigorously and validate the solution.', icon: <FaFlask />, color: 'text-purple-500 bg-purple-50 border-purple-100' },
                { num: '05', title: 'Implementation', desc: 'Deploy and implement in real environments.', icon: <FaRocket />, color: 'text-orange-500 bg-orange-50 border-orange-100' },
                { num: '06', title: 'Impact & Scale', desc: 'Creating scalable impact and innovation.', icon: <FiAward />, color: 'text-teal-500 bg-teal-50 border-teal-100' },
              ].map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center shrink-0 w-[200px] lg:w-auto snap-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm border-4 border-white ring-1 ring-slate-100 mb-6 ${step.color}`}>
                    <span className="text-xl">{step.icon}</span>
                  </div>
                  <div className="text-[11px] font-black text-[#e63946] mb-1">{step.num}</div>
                  <h4 className="text-[14px] font-bold text-[#0f172a] mb-2">{step.title}</h4>
                  <p className="text-[12px] text-slate-500 font-medium px-2">{step.desc}</p>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          5. TECHNICAL RIGOR & MENTORSHIP-FIRST
      ===================================================== */}
      <section className="py-12 lg:py-16 bg-[#f8faff]">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Left Column */}
            <div className="flex flex-col gap-12">
              <div>
                <h2 className="text-[32px] sm:text-[40px] font-black tracking-tight text-[#0f172a] mb-6">
                  {rigorTitle}
                </h2>
                <div className="text-[15px] text-slate-500 font-medium leading-relaxed mb-8 max-w-none lg:max-w-md" dangerouslySetInnerHTML={{ __html: rigorDesc }} />
                <div className="flex flex-col gap-5">
                  {rigorPoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-red-50 text-[#e63946] flex items-center justify-center text-[12px] font-black shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[14px] font-bold text-[#0f172a]">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {rigorImage && (
                <div className="rounded-[2rem] overflow-hidden shadow-lg border border-slate-100">
                  <img src={resolveImageUrl(rigorImage)} alt={rigorTitle} className="w-full h-[350px] object-cover" />
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-12">
              {mentorshipImage && (
                <div className="rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 order-last lg:order-first">
                  <img src={resolveImageUrl(mentorshipImage)} alt={mentorshipTitle} className="w-full h-[350px] object-cover" />
                </div>
              )}

              <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100">
                <h2 className="text-[32px] sm:text-[40px] font-black tracking-tight text-[#0f172a] mb-6">
                  {mentorshipTitle}
                </h2>
                <div className="text-[15px] text-slate-500 font-medium leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: mentorshipDesc }} />

                {/* Quote block */}
                {(mentorshipQuote || mentorshipQuoteAuthor) && (
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 relative">
                    <span className="absolute top-4 left-4 text-4xl text-blue-200 font-serif leading-none">"</span>
                    <div className="text-[14px] font-medium text-slate-600 italic relative z-10 pl-6 pt-2 mb-6" dangerouslySetInnerHTML={{ __html: mentorshipQuote }} />
                    <div className="flex items-center gap-4">
                      {mentorshipQuoteAvatar && (
                        <img src={resolveImageUrl(mentorshipQuoteAvatar)} alt={mentorshipQuoteAuthor} className="w-12 h-12 rounded-full object-cover" />
                      )}
                      <div>
                        <h4 className="text-[14px] font-bold text-[#0f172a]">{mentorshipQuoteAuthor}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{mentorshipQuoteRole}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* =====================================================
          7. OUR INNOVATION PARTNERS
      ===================================================== */}
      <section className="py-12 bg-white border-t border-slate-100 overflow-hidden">
        <div className="mx-auto max-w-[1300px] text-center relative px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-10 bg-slate-200" />
            <span className="text-[18px] font-bold tracking-[0.2em] text-[#e63946] uppercase">OUR INNOVATION PARTNERS</span>
            <div className="h-px w-10 bg-slate-200" />
          </div>

          <div className="w-full relative overflow-hidden">
            <PartnerInfiniteMarquee items={displayPartners} direction="right" speed={30} />
          </div>
        </div>
      </section>

      {/* =====================================================
          8. BOTTOM CTA RIBBON
      ===================================================== */}
      <section className="bg-white py-10 lg:py-16 relative overflow-hidden border-t border-slate-100">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl">

            {/* Abstract Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center px-8 py-10 md:px-12 md:py-12 gap-8 md:gap-12">

              {/* Left Image / Rocket Placeholder */}
              <div className="hidden md:flex justify-center items-center relative h-full">
                <div className="w-24 h-24 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <FaRocket className="text-white text-5xl opacity-90 transform -rotate-45" />
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center md:text-left z-10">
                <h2
                  className="text-[24px] sm:text-[32px] font-black !text-white leading-tight mb-2"
                  dangerouslySetInnerHTML={{ __html: ctaTitle }}
                />
                <div
                  className="text-slate-300 text-[14px] font-medium max-w-none md:max-w-sm mx-auto md:mx-0 [&>p]:mb-4 last:[&>p]:mb-0"
                  dangerouslySetInnerHTML={{ __html: ctaDescription }}
                />
              </div>

              {/* Button */}
              <div className="text-center md:text-right z-10 flex flex-col sm:flex-row items-center justify-end gap-4">
                <Link
                  href="/ibt-labs/submit-idea"
                  className="w-full sm:w-auto inline-flex h-12 bg-white text-[#e63946] rounded-lg px-8 items-center justify-center font-bold text-[14px] hover:bg-slate-50 transition-colors shadow-xl whitespace-nowrap"
                >
                  {ctaBtnText} <FiArrowRight className="inline-block ml-2" />
                </Link>

              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
