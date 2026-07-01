'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { apiClient, type PublicService } from '@/src/api/client';
import { Loader, SiteButton } from '@/src/shared/ui';
import { useSocketSettings } from '@/src/providers/SocketSettingsProvider';
import { resolveImageUrl } from '@/src/utils/image';
import * as FiIcons from 'react-icons/fi';
import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiCloud,
  FiMonitor,
  FiSmartphone,
  FiBarChart2,
  FiLayers,
  FiSettings,
  FiRefreshCw,
  FiShield,
  FiChevronLeft,
  FiChevronRight,
  FiCode,
  FiSend,
  FiThumbsUp,
  FiMessageSquare,
  FiTarget,
  FiUsers,
  FiTrendingUp
} from 'react-icons/fi';

/* =========================================================
   UTILITIES
========================================================= */

function cleanHtml(html: string | undefined | null): string {
  if (!html) return '';
  if (typeof html !== 'string') return '';
  return html.replace(/&nbsp;/g, ' ');
}

/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

/* =========================================================
   PAGE
========================================================= */

export function AllServicesPage() {
  const { settings } = useSocketSettings();
  const [services, setServices] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadingRef = useRef(false);

  /* =========================================================
     LOAD SERVICES (For API compatibility)
  ========================================================= */

  const loadAllServices = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const result = await apiClient.getServices(1, 100);
      setServices(result.items);
    } catch (err) {
      console.warn('Failed to load services:', err);
      setError(err instanceof Error ? err.message : 'Failed to load services');
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAllServices();
  }, [loadAllServices]);

  // Dynamic configuration maps
  const whatFeatures = useMemo(() => {
    const defaultWhatFeatures = [
      { title: "Software Development", desc: "Custom software solutions that drive efficiency and growth.", icon: "FiCode" },
      { title: "Mobile App Development", desc: "Engaging mobile experiences for iOS and Android platforms.", icon: "FiSmartphone" },
      { title: "Web Development", desc: "Fast, secure and scalable websites built with modern technologies.", icon: "FiCloud" },
      { title: "Digital Solutions", desc: "End-to-end digital solutions for business transformation.", icon: "FiBarChart2" }
    ];

    if (!settings?.servicesWhatFeatures) return defaultWhatFeatures;

    try {
      const parsed = typeof settings.servicesWhatFeatures === 'string'
        ? JSON.parse(settings.servicesWhatFeatures)
        : settings.servicesWhatFeatures;

      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultWhatFeatures;
    } catch (e) {
      console.warn('Failed to parse whatFeatures:', e);
      return defaultWhatFeatures;
    }
  }, [settings?.servicesWhatFeatures]);

  const processSteps = useMemo(() => {
    const defaultProcessSteps = [
      { step: '01', title: 'Discovery', desc: 'Understanding your requirements, challenges and business goals through deep collaboration.' },
      { step: '02', title: 'Architecture', desc: 'Designing robust, scalable and secure architecture tailored to your solution needs.' },
      { step: '03', title: 'Build & Test', desc: 'Agile development, continuous testing and quality assurance at every step.' },
      { step: '04', title: 'Launch & Scale', desc: 'Seamless deployment, ongoing support and optimization to help you scale.' }
    ];

    if (!settings?.servicesProcessSteps) return defaultProcessSteps;

    try {
      const parsed = typeof settings.servicesProcessSteps === 'string'
        ? JSON.parse(settings.servicesProcessSteps)
        : settings.servicesProcessSteps;

      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultProcessSteps;
    } catch (e) {
      console.warn('Failed to parse processSteps:', e);
      return defaultProcessSteps;
    }
  }, [settings?.servicesProcessSteps]);

  const renderServiceIcon = (iconName: string) => {
    const IconComponent = (FiIcons as any)[iconName] || FiIcons.FiBriefcase;
    return <IconComponent size={20} />;
  };

  const renderStepIcon = (index: number) => {
    switch (index) {
      case 0: return <FiMessageSquare size={20} />;
      case 1: return <FiCode size={20} />;
      case 2: return <FiSend size={20} />;
      case 3:
      default:
        return <FiThumbsUp size={20} />;
    }
  };

  const whatTitle = settings?.servicesWhatTitle || "What We Do";
  const processTitle = settings?.servicesProcessTitle || "How We Deliver Excellence";
  const processBadge = settings?.servicesProcessBadge || "HOW WE DELIVER";

  const fallbackServices = [
    {
      id: "1",
      title: "Analytics Dashboard",
      slug: "analytics-dashboard",
      tags: ["Web Application"],
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      description: ""
    },
    {
      id: "2",
      title: "Edu LMS Platform",
      slug: "edu-lms-platform",
      tags: ["Web Application"],
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
      description: ""
    },
    {
      id: "3",
      title: "ThreatShield AI",
      slug: "threatshield-ai",
      tags: ["AI / ML Solution"],
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
      description: ""
    },
    {
      id: "4",
      title: "Smart Inventory System",
      slug: "smart-inventory-system",
      tags: ["IoT Solution"],
      imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
      description: ""
    }
  ] as PublicService[];

  const displayServices = services.length > 0 ? services : fallbackServices;

  // Carousel logic for All Services offerings grid
  const [allServicesCarouselIndex, setAllServicesCarouselIndex] = useState(0);
  const [allServicesVisibleCount, setAllServicesVisibleCount] = useState(3);

  useEffect(() => {
    const updateVisibleAllServices = () => {
      const w = window.innerWidth;
      if (w >= 1024) setAllServicesVisibleCount(3);
      else if (w >= 640) setAllServicesVisibleCount(2);
      else setAllServicesVisibleCount(1);
    };
    updateVisibleAllServices();
    window.addEventListener('resize', updateVisibleAllServices);
    return () => window.removeEventListener('resize', updateVisibleAllServices);
  }, []);

  const showPrevAllServices = () => {
    setAllServicesCarouselIndex((prev) => Math.max(0, prev - 1));
  };
  const showNextAllServices = () => {
    setAllServicesCarouselIndex((prev) => Math.min(displayServices.length - allServicesVisibleCount, prev + 1));
  };

  useEffect(() => {
    setAllServicesCarouselIndex((prev) => {
      const maxIdx = Math.max(0, displayServices.length - allServicesVisibleCount);
      return Math.min(prev, maxIdx);
    });
  }, [allServicesVisibleCount, displayServices.length]);

  /* =========================================================
     MAIN RENDER
  ========================================================= */

  if (loading && services.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white">
        <Loader size="lg" label="Loading Services..." />
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white">

      {/* =====================================================
          1. HERO SECTION
      ===================================================== */}
      <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden bg-white mt-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 min-w-0">
              <h3 className="text-[18px] font-bold uppercase tracking-widest !text-red-500 mb-4">
                OUR SERVICES
              </h3>
              <h1 className="text-[24px] sm:text-[28px] lg:text-[40px] font-extrabold text-[#0f172a] leading-[1.05] tracking-tight mb-6">
                Services Built
                <span className="text-[#e63946] pl-2">for Impact</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-none lg:max-w-lg">
                We deliver innovative, scalable and reliable digital solutions that help businesses grow, operate efficiently, and stay ahead in a competitive world.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-10">
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#e63946]">
                    <FiUsers size={24} />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#0f172a] mb-1">Client Focused</h4>
                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed">Solutions tailored to your goals.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#e63946]">
                    <FiSettings size={24} />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#0f172a] mb-1">Technology</h4>
                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed">Driven approach for real results.</p>
                  </div>
                </div>
              </div>

              <Link
                href="#all-services"
                className="w-full sm:w-auto inline-flex h-14 px-8 bg-[#e63946] text-white rounded-md items-center justify-center text-[14px] font-bold hover:bg-[#c1121f] transition-all shadow-xl shadow-red-500/20"
              >
                Explore Our Services <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>

            {/* Right Image & Floating Badge */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="relative z-10 min-w-0">
              <div className="rounded-[1.5rem] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"
                  alt="Service Impact"
                  className="w-full h-[300px] sm:h-[350px] lg:h-[400px] object-cover"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 left-4 sm:-bottom-8 sm:left-8 bg-white py-4 px-6 sm:py-6 sm:px-8 rounded-xl shadow-2xl border border-slate-100 flex items-center gap-3 sm:gap-4">
                <div>
                  <div className="text-[28px] sm:text-[36px] font-black text-[#0f172a] leading-none mb-1">250+</div>
                  <div className="text-[11px] sm:text-[13px] font-bold text-slate-500">Projects Completed</div>
                </div>
                <FiTrendingUp className="text-[#e63946] text-2xl sm:text-3xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* =====================================================
          2. WHAT WE DO
      ===================================================== */}
      <section className="py-12 lg:py-16 bg-slate-50 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left Content & Grid */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="min-w-0">
              <h3 className="text-[18px] font-bold uppercase tracking-widest !text-red-500 mb-4">
                WHAT WE DO
              </h3>
              <h2 className="mb-6 font-extrabold tracking-tight text-[#0f172a]">
                {whatTitle}
              </h2>
              {settings?.servicesWhatDescription ? (
                <div
                  className="text-lg text-slate-500 font-medium leading-relaxed mb-12 max-w-none lg:max-w-lg html-content w-full overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: cleanHtml(settings.servicesWhatDescription) }}
                />
              ) : (
                <p className="text-lg text-slate-500 font-medium leading-relaxed mb-12 max-w-none lg:max-w-lg">
                  We offer a wide range of technology and engineering services to transform ideas into powerful solutions.
                </p>
              )}

              {/* 2x2 Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {whatFeatures.map((feat: any, idx: number) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#e63946] mb-4">
                      {renderServiceIcon(feat.icon)}
                    </div>
                    <h4 className="text-[16px] font-bold text-[#0f172a] mb-2">{feat.title}</h4>
                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Masonry Images */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="min-w-0">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-3 sm:space-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600"
                    alt="Team Working"
                    className="w-full h-40 sm:h-64 object-cover rounded-2xl"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600"
                    alt="Team Collaboration"
                    className="w-full h-32 sm:h-48 object-cover rounded-2xl"
                  />
                </div>
                <div className="space-y-3 sm:space-y-4 pt-8">
                  <img
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600"
                    alt="Office Desk"
                    className="w-full h-32 sm:h-48 object-cover rounded-2xl"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600"
                    alt="Whiteboard Session"
                    className="w-full h-40 sm:h-64 object-cover rounded-2xl"
                  />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* =====================================================
          2.5 ALL SERVICES GRID
      ===================================================== */}
      <section id="all-services" className="py-12 lg:py-16 bg-white border-t border-slate-100 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-[18px] font-bold uppercase tracking-widest !text-red-500 mb-3">
              OUR SERVICES
            </h3>
            <h2 className="mb-6 font-extrabold tracking-tight text-[#0f172a] text-3xl sm:text-4xl">
              Innovative Solutions for Modern Challenges
            </h2>
            <div className="w-full flex justify-center">
              <p className="max-w-2xl text-center text-lg text-slate-500 font-medium leading-relaxed">
                Explore our full range of professional services, tailored to help your business innovate, scale, and succeed.
              </p>
            </div>
          </div>

          <div className="relative px-8 sm:px-12 lg:px-16">
            {/* Arrows */}
            {displayServices.length > allServicesVisibleCount && (
              <>
                <button
                  onClick={showPrevAllServices}
                  disabled={allServicesCarouselIndex <= 0}
                  className={`absolute top-[40%] -translate-y-1/2 -left-2 sm:left-0 lg:left-2 z-20 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md transition-colors ${allServicesCarouselIndex <= 0 ? 'opacity-30 cursor-not-allowed text-slate-300' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <FiChevronLeft />
                </button>
                <button
                  onClick={showNextAllServices}
                  disabled={allServicesCarouselIndex >= displayServices.length - allServicesVisibleCount}
                  className={`absolute top-[40%] -translate-y-1/2 -right-2 sm:right-0 lg:right-2 z-20 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md transition-colors ${allServicesCarouselIndex >= displayServices.length - allServicesVisibleCount ? 'opacity-30 cursor-not-allowed text-slate-300' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <FiChevronRight />
                </button>
              </>
            )}

            {/* Carousel Track */}
            <div className="overflow-hidden py-4 -my-4">
              <motion.div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  width: `${(displayServices.length * 100) / allServicesVisibleCount}%`,
                  transform: `translateX(-${(allServicesCarouselIndex * 100) / displayServices.length}%)`,
                }}
              >
                {displayServices.map((service, idx) => {
                  const cardColors = [
                    { bg: 'bg-blue-50', text: 'text-blue-600', hoverBg: 'hover:border-blue-200' },
                    { bg: 'bg-rose-50', text: 'text-rose-500', hoverBg: 'hover:border-rose-200' },
                    { bg: 'bg-emerald-50', text: 'text-emerald-500', hoverBg: 'hover:border-emerald-200' },
                    { bg: 'bg-purple-50', text: 'text-[#9333ea]', hoverBg: 'hover:border-purple-200' },
                    { bg: 'bg-orange-50', text: 'text-orange-500', hoverBg: 'hover:border-orange-200' },
                    { bg: 'bg-sky-50', text: 'text-sky-500', hoverBg: 'hover:border-sky-200' },
                  ];
                  const colorSet = cardColors[idx % cardColors.length];

                  return (
                    <div
                      key={service.id || idx}
                      className="px-3 text-left"
                      style={{ flex: `0 0 ${100 / displayServices.length}%` }}
                    >
                      <Link
                        href={`/services/${service.slug}`}
                        className="group block h-full"
                      >
                        <div className={`flex h-full flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 p-8 text-left hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 ${colorSet.hoverBg}`}>

                          {/* Visual container (Image or styled icon placeholder) */}
                          <div className="relative overflow-hidden rounded-xl mb-6 aspect-video bg-slate-50 border border-slate-100/50 flex items-center justify-center">
                            {service.imageUrl ? (
                              <img
                                src={resolveImageUrl(service.imageUrl)}
                                alt={service.title}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                              />
                            ) : (
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorSet.bg} ${colorSet.text}`}>
                                <FiBriefcase size={28} />
                              </div>
                            )}
                          </div>

                          {/* Tags */}
                          {service.tags && service.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {service.tags.map((tag, tagIdx) => (
                                <span
                                  key={tagIdx}
                                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${colorSet.bg} ${colorSet.text}`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <h3 className="text-xl font-bold text-[#0f172a] mb-3 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                            {service.title}
                          </h3>

                          <p className="text-[13px] leading-relaxed text-slate-500 mb-6 flex-1 line-clamp-3">
                            {service.description || "Customized technology solutions designed to streamline operations and enhance productivity."}
                          </p>

                          <div className={`mt-auto flex items-center gap-1.5 text-sm font-bold ${colorSet.text}`}>
                            Learn More <FiArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          3. HOW WE DELIVER EXCELLENCE (Process Timeline)
      ===================================================== */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-[18px] font-bold uppercase tracking-widest !text-red-500 mb-4">
            {processBadge}
          </h3>
          <h2 className="mb-6 font-extrabold tracking-tight text-[#0f172a]">
            {processTitle}
          </h2>
          <div className="w-full flex justify-center mb-20">
            {settings?.servicesProcessDescription ? (
              <div
                className="max-w-2xl text-center text-lg text-slate-500 font-medium leading-relaxed m-0 html-content w-full overflow-hidden"
                dangerouslySetInnerHTML={{ __html: cleanHtml(settings.servicesProcessDescription) }}
              />
            ) : (
              <p className="max-w-2xl text-center text-lg text-slate-500 font-medium leading-relaxed m-0">
                A proven process, a skilled team and the right technology to deliver exceptional results.
              </p>
            )}
          </div>

          <div className="relative">
            {/* Connecting Horizontal Line (Desktop) */}
            <div className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-slate-100 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              {processSteps.map((step: any, idx: number) => {
                const isEven = idx % 2 === 1;
                return (
                  <div key={idx} className="relative z-10 flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-full ${isEven ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-blue-50 text-blue-500 shadow-sm'} flex items-center justify-center mb-6 border border-white`}>
                      {renderStepIcon(idx)}
                    </div>
                    <h4 className="text-[15px] font-bold text-[#0f172a] uppercase tracking-wider mb-3">{step.title}</h4>
                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          5. LET'S TALK
      ===================================================== */}
      <section className="py-12 lg:py-16 bg-slate-50 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left Image Grid with Badge */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative min-w-0">
              <div className="grid grid-cols-2 gap-3 sm:gap-6 items-center">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-white">
                  <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600" alt="Professional Woman" className="w-full h-[200px] sm:h-[320px] object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg border border-white mt-10 sm:mt-20">
                  <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=600" alt="Office Collaboration" className="w-full h-[160px] sm:h-[280px] object-cover" />
                </div>
              </div>

              {/* Center Floating Badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-4 sm:px-8 sm:py-6 rounded-xl sm:rounded-2xl shadow-2xl border border-slate-100 text-center min-w-[150px] sm:min-w-[220px]">
                <div className="text-[24px] sm:text-[36px] font-black text-[#0f172a] leading-none mb-1 sm:mb-2">200+</div>
                <div className="text-[10px] sm:text-[13px] font-bold text-slate-500 uppercase tracking-widest">Happy Clients<br />Worldwide</div>
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="min-w-0">
              <h2 className="mb-6 font-extrabold tracking-tight text-[#0f172a] leading-[1.1]">
                Let's Build Something Remarkable Together
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-none lg:max-w-lg">
                From startups to enterprises, we help businesses leverage technology to achieve more. Partner with I BACUS TECH and create solutions that make an impact.
              </p>
              <Link
                href="/contact-us"
                className="w-full sm:w-auto inline-flex h-14 px-8 bg-[#0055ff] text-white rounded-md items-center justify-center text-[14px] font-bold hover:bg-[#0044cc] transition-all shadow-xl shadow-blue-500/20"
              >
                Schedule a Consultation <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =====================================================
          6. BOTTOM CTA RIBBON
      ===================================================== */}
      <section className="bg-white py-8 lg:py-12 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl"
          >
            {/* Abstract Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center px-8 py-10 md:px-12 md:py-12 gap-8 md:gap-12">

              {/* Rocket Image */}
              <div className="hidden md:flex justify-center items-center w-32 h-32 relative">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                  <path d="M40 160 Q60 140 80 160 Q100 130 130 160 Q160 140 180 160 Q190 180 160 190 H60 Q30 180 40 160" fill="#f8fafc" opacity="0.9" />
                  <path d="M100 130 L90 180 Q100 200 110 180 Z" fill="#ef4444" />
                  <path d="M100 140 L95 170 Q100 185 105 170 Z" fill="#fbbf24" />
                  <path d="M100 30 Q120 70 120 120 L80 120 Q80 70 100 30" fill="#f8fafc" />
                  <path d="M80 120 L60 140 L80 130 Z" fill="#3b82f6" />
                  <path d="M120 120 L140 140 L120 130 Z" fill="#3b82f6" />
                  <circle cx="100" cy="80" r="10" fill="#3b82f6" />
                  <circle cx="100" cy="80" r="6" fill="#60a5fa" />
                </svg>
              </div>

              {/* Text Content */}
              <div className="text-center md:text-left z-10">
                <h2 className="font-bold !text-white leading-tight mb-3">
                  Ready to Start Your Project?
                </h2>
                <p className="text-slate-300 text-[15px] font-medium max-w-none md:max-w-md mx-auto md:mx-0">
                  Share your idea and we'll build a solution that drives real results.
                </p>
              </div>

              {/* Button */}
              <div className="text-center md:text-right z-10">
                <SiteButton
                  href="/contact-us"
                  className="bg-white !text-slate-900 rounded-[6px] px-8 py-3 font-bold text-[14px] hover:bg-slate-50 transition-colors shadow-xl whitespace-nowrap"
                >
                  Get a Free Quote <FiArrowRight className="inline-block ml-2" />
                </SiteButton>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
