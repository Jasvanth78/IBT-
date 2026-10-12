'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient, type PublicService } from '@/src/api/client';
import { resolveImageUrl } from '@/src/utils/image';
import { generateKeyHighlights } from '@/src/utils/highlights';
import { Loader } from '@/src/shared/ui/Loader';
import {
  FiArrowRight,
  FiBriefcase,
  FiGlobe,
  FiStar,
  FiCode,
  FiSearch,
  FiFileText,
  FiLayout,
  FiCheckSquare,
  FiCloud,
  FiUsers,
  FiClock,
  FiShield,
  FiHeadphones,
  FiX,
  FiCheckCircle,
  FiZap,
  FiCpu,
  FiShoppingCart,
  FiPlusSquare,
  FiBookOpen,
  FiUser,
  FiTruck,
  FiRefreshCw,
  FiChevronUp
} from 'react-icons/fi';
import { useSocketSettings } from '@/src/providers/SocketSettingsProvider';

function stripHtml(raw?: string | null): string {
  if (!raw) return '';
  return raw
    .replace(/<ul class="custom-key-highlights"[^>]*>[\s\S]*?<\/ul>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Custom Tech Brand SVG Icons for 100% render reliability
function ReactIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" fill="none">
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

function NextjsIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 180 180" fill="none">
      <circle cx="90" cy="90" r="90" fill="#000" />
      <path d="M149.508 157.52L69.142 54H54V125.97H66.8136V69.7564L139.699 164.745C143.141 162.604 146.417 160.187 149.508 157.52Z" fill="white" />
      <path d="M115 54H127.814V126H115V54Z" fill="white" />
    </svg>
  );
}

function NodeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <path d="M128 0L238.85 64V192L128 256L17.15 192V64L128 0Z" fill="#5FA04E" />
    </svg>
  );
}

function MongoIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <path d="M128 0C128 0 180 80 180 144C180 184 150 216 128 224C106 216 76 184 76 144C76 80 128 0 128 0Z" fill="#47A248" />
    </svg>
  );
}

function PrismaIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <path d="M228 178L138 22L28 178L128 234L228 178Z" fill="#2D3748" />
    </svg>
  );
}

function FlutterIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <path d="M152.1 0L38.4 113.7L77.9 153.2L231.1 0H152.1ZM152.1 113.7L96.8 169L136.3 208.5L191.6 153.2L152.1 113.7ZM136.3 208.5L183.7 256H231.1L183.7 208.5H136.3Z" fill="#02569B" />
    </svg>
  );
}

function FirebaseIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <path d="M42.2 189.6L79.1 19.3L114.7 86.4L42.2 189.6Z" fill="#FFCA28" />
      <path d="M141.2 96.1L168.9 43.5L213.8 189.6L141.2 96.1Z" fill="#FFA000" />
      <path d="M42.2 189.6L128 240L213.8 189.6L141.2 96.1L42.2 189.6Z" fill="#F57C00" />
    </svg>
  );
}

function AwsIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <path d="M60 170 C100 200, 160 200, 200 170" stroke="#FF9900" strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d="M190 160 L205 175 L185 180" fill="#FF9900" />
    </svg>
  );
}

function DockerIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <rect x="50" y="100" width="30" height="30" rx="4" fill="#2496ED" />
      <rect x="90" y="100" width="30" height="30" rx="4" fill="#2496ED" />
      <rect x="130" y="100" width="30" height="30" rx="4" fill="#2496ED" />
      <rect x="90" y="60" width="30" height="30" rx="4" fill="#2496ED" />
      <path d="M20 140 C50 180 180 180 230 140" stroke="#2496ED" strokeWidth="16" fill="none" />
    </svg>
  );
}

export interface ProductProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  tags: string[];
  icon: React.ComponentType<{ className?: string; size?: number }>;
  iconColor: string;
  iconBg: string;
  featured?: boolean;
  imageUrl?: string | null;
  mockupType: 'bloomcraft' | 'ibtwebsite' | 'careersheet' | 'aiinterview' | 'innovation' | 'ecommerce' | 'hospital' | 'school' | 'taskflow' | 'portfolio' | 'fooddelivery' | 'generic';
  features: string[];
}





// Custom SVGs for High Resolution Device Mockups
function DeviceMockupFrame({ type, title, imageUrl }: { type: string; title: string; imageUrl?: string | null }) {
  if (imageUrl) {
    return (
      <div className="relative w-full aspect-[16/10] bg-slate-50/80 rounded-xl overflow-hidden border border-slate-200/80 flex items-center justify-center p-2 group-hover:scale-[1.02] transition-transform duration-500">
        <img
          src={resolveImageUrl(imageUrl)}
          alt={title}
          className="max-h-full max-w-full w-auto h-auto object-contain object-center rounded-lg drop-shadow-sm"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[16/10] bg-slate-900 rounded-t-xl overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col group-hover:scale-[1.02] transition-transform duration-500">
      {/* Laptop top bar header */}
      <div className="h-6 bg-slate-800 border-b border-slate-700/80 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
        </div>
        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded">
          <span>https://</span><span className="text-slate-200">{title.toLowerCase().replace(/\s+/g, '')}.ibacustech.com</span>
        </div>
        <div className="w-4"></div>
      </div>

      {/* Screen Inner Viewport */}
      <div className="flex-1 bg-[#0f172a] overflow-hidden p-3 relative text-white flex flex-col">
        {type === 'bloomcraft' && (
          <div className="h-full flex flex-col gap-2.5 bg-slate-900/90 rounded-lg p-3 border border-pink-500/20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 text-[10px] font-bold">🌸</div>
                <span className="text-xs font-bold text-pink-300">BloomCraft AI</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[9px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full">Growth Score: 94%</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 flex-1">
              <div className="col-span-2 bg-slate-800/80 rounded-md p-2 flex flex-col justify-between border border-slate-700/40">
                <span className="text-[9px] text-slate-400 font-medium">Daily Assessment Curve</span>
                <svg className="w-full h-16 text-pink-500" viewBox="0 0 100 40">
                  <path d="M0 30 Q25 5, 50 20 T100 10" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M0 30 Q25 5, 50 20 T100 10 L100 40 L0 40 Z" fill="url(#pinkGrad)" opacity="0.2" />
                  <defs>
                    <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="bg-slate-800/80 rounded-md p-2 flex flex-col gap-1.5 border border-slate-700/40">
                <span className="text-[9px] font-semibold text-pink-400">AI Goals</span>
                <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-pink-500 w-4/5"></div></div>
                <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-purple-500 w-3/5"></div></div>
                <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 w-9/10"></div></div>
              </div>
            </div>
          </div>
        )}

        {type === 'ibtwebsite' && (
          <div className="h-full flex flex-col gap-2 bg-slate-900 rounded-lg p-3 border border-red-500/20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-red-600 flex items-center justify-center font-bold text-[10px] text-white">I</div>
                <span className="text-xs font-bold text-white">I-BACUS TECH</span>
              </div>
              <div className="flex gap-1.5 text-[8px] text-slate-400">
                <span className="text-red-400 font-semibold">Home</span>
                <span>Services</span>
                <span>Products</span>
              </div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded p-2.5 flex flex-col justify-center items-start gap-1">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide">Enterprise Solutions</span>
              <span className="text-xs font-extrabold text-white">Transforming Digital Architecture</span>
              <div className="mt-1 bg-red-600 text-white text-[8px] font-semibold px-2 py-0.5 rounded shadow">Explore Services →</div>
            </div>
          </div>
        )}

        {type === 'careersheet' && (
          <div className="h-full flex flex-col gap-2 bg-slate-900 rounded-lg p-3 border border-indigo-500/20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center font-bold text-[10px] text-white">CS</div>
                <span className="text-xs font-bold text-indigo-200">CareerSheet Job Portal</span>
              </div>
              <span className="text-[8px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">ATS Match: 96%</span>
            </div>
            <div className="grid grid-cols-2 gap-2 flex-1">
              <div className="bg-slate-800/90 rounded p-2 flex flex-col gap-1 border border-slate-700/40">
                <span className="text-[9px] font-bold text-indigo-400">Resume Score</span>
                <span className="text-sm font-extrabold text-white">92 / 100</span>
                <div className="h-1 bg-indigo-500 rounded-full w-11/12 mt-1"></div>
              </div>
              <div className="bg-slate-800/90 rounded p-2 flex flex-col gap-1 border border-slate-700/40">
                <span className="text-[9px] font-bold text-emerald-400">Applications</span>
                <span className="text-sm font-extrabold text-white">18 Active</span>
                <div className="h-1 bg-emerald-500 rounded-full w-3/4 mt-1"></div>
              </div>
            </div>
          </div>
        )}

        {type === 'hero' && (
          <div className="h-full flex gap-3 bg-[#0d1527] rounded-lg p-3 border border-slate-700/50">
            <div className="w-12 bg-slate-900/90 rounded-md p-1.5 flex flex-col gap-2 shrink-0 border border-slate-800">
              <div className="w-5 h-5 rounded bg-red-600/90 flex items-center justify-center font-bold text-[9px]">I</div>
              <div className="h-1.5 w-full bg-slate-700 rounded"></div>
              <div className="h-1.5 w-full bg-slate-700 rounded"></div>
              <div className="h-1.5 w-full bg-red-500/80 rounded"></div>
              <div className="h-1.5 w-full bg-slate-700 rounded"></div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded border border-slate-800">
                <span className="text-[10px] font-bold text-slate-200">Digital Product Dashboard</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">Live Sync</span>
              </div>
              <div className="grid grid-cols-3 gap-2 flex-1">
                <div className="bg-slate-800/80 rounded p-2 border border-slate-700/50 flex flex-col justify-between">
                  <span className="text-[8px] text-slate-400">Total Users</span>
                  <span className="text-sm font-black text-white">142,850</span>
                  <span className="text-[8px] text-emerald-400">↑ 24% this week</span>
                </div>
                <div className="bg-slate-800/80 rounded p-2 border border-slate-700/50 flex flex-col justify-between">
                  <span className="text-[8px] text-slate-400">Uptime Rate</span>
                  <span className="text-sm font-black text-white">99.98%</span>
                  <span className="text-[8px] text-blue-400">Stable SLA</span>
                </div>
                <div className="bg-slate-800/80 rounded p-2 border border-slate-700/50 flex flex-col justify-between">
                  <span className="text-[8px] text-slate-400">Active API</span>
                  <span className="text-sm font-black text-white">1.2M req</span>
                  <span className="text-[8px] text-rose-400">Low Latency</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {['aiinterview', 'innovation', 'ecommerce', 'hospital', 'school', 'taskflow', 'portfolio', 'fooddelivery', 'generic'].includes(type) && (
          <div className="h-full flex flex-col justify-between bg-slate-900/90 rounded-lg p-3 border border-slate-700/60">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-red-400">⚡</div>
                <span className="text-xs font-bold text-slate-100">{title}</span>
              </div>
              <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">v2.4 Active</span>
            </div>
            <div className="grid grid-cols-2 gap-2 my-auto">
              <div className="bg-slate-800/60 rounded p-2 border border-slate-700/40">
                <div className="text-[9px] text-slate-400">Performance</div>
                <div className="text-xs font-bold text-emerald-400">99.4% SLA</div>
              </div>
              <div className="bg-slate-800/60 rounded p-2 border border-slate-700/40">
                <div className="text-[9px] text-slate-400">User Rating</div>
                <div className="text-xs font-bold text-yellow-400">4.9 / 5.0 ⭐</div>
              </div>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden w-full">
              <div className="h-full bg-gradient-to-r from-red-500 to-indigo-500 w-3/4"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AllProductsPage() {
  const [dynamicProducts, setDynamicProducts] = useState<ProductProject[]>([]);
  const [loading, setLoading] = useState(true);

  const { settings } = useSocketSettings();
  
  // Safe parsing helper for JSON arrays
  const parseJsonSafe = (val: any, fallback: any[]) => {
    if (Array.isArray(val) && val.length > 0) return val;
    if (typeof val === 'string' && val.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { }
    }
    return fallback;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiClient.getServices(1, 100, 'PRODUCT');
        if (res && res.items && res.items.length > 0) {
          const iconList = [FiZap, FiGlobe, FiBriefcase, FiCpu, FiShoppingCart, FiPlusSquare, FiBookOpen, FiUser, FiTruck];
          const mockupTypes: ProductProject['mockupType'][] = [
            'bloomcraft', 'ibtwebsite', 'careersheet', 'aiinterview',
            'innovation', 'ecommerce', 'hospital', 'school', 'taskflow',
            'portfolio', 'fooddelivery'
          ];

          const mapped: ProductProject[] = res.items.map((item: PublicService, idx: number) => ({
            id: item.id,
            slug: item.slug || item.id,
            title: item.title,
            category: 'Product',
            description: item.description,
            longDescription: item.description,
            tags: item.tags && item.tags.length > 0 ? item.tags : ['React', 'Node.js', 'Enterprise'],
            icon: iconList[idx % iconList.length],
            iconColor: 'text-[#e63946]',
            iconBg: 'bg-rose-50',
            featured: Boolean(item.isFeatured),
            imageUrl: item.imageUrl || null,
            mockupType: mockupTypes[idx % mockupTypes.length],
            features: generateKeyHighlights(item.description, item.title, item.tags)
          }));

          setDynamicProducts(mapped);
        }
      } catch (err) {
        console.warn('Could not fetch dynamic products, using fallback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!loading && typeof window !== 'undefined' && window.location.hash === '#all-products') {
      const element = document.getElementById('all-products');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [loading]);

  const [visibleCount, setVisibleCount] = useState(8);

  // Determine displayed projects
  const currentAllProjects = dynamicProducts;
  const displayedAllProjects = currentAllProjects.slice(0, visibleCount);


  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased">

      {/* =========================================================================
          1. HERO SECTION ("OUR PROJECTS")
      ========================================================================= */}
      <section className="relative overflow-hidden bg-white pt-10 pb-16 lg:pt-16 lg:pb-24">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-100/50 rounded-full filter blur-3xl -z-10 pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">

            {/* Left Content Column */}
            <div className="lg:col-span-6 text-left">
              <span className="text-[18px] font-bold uppercase tracking-[0.2em] text-[#e63946]">
                OUR PRODUCTS
              </span>

              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0f172a] leading-[1.15]">
                {settings.productsHeroTitle || 'Turning Ideas Into'} <br className="hidden lg:block" />
                <span className="text-[#e63946]">{settings.productsHeroHighlight || 'Real Digital'}</span> Products
              </h1>

              <p className="mt-6 pt-4 sm:mt-8 text-base sm:text-lg text-slate-600 leading-relaxed w-full max-w-full lg:max-w-xl whitespace-pre-wrap">
                {settings.productsHeroDescription || 'We build scalable web applications, mobile apps, AI solutions and enterprise software that solve real business problems and create real impact.'}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full">
                <a
                  href="#all-products"
                  className="inline-flex w-full sm:w-[210px] h-[52px] items-center justify-center gap-2 rounded-xl bg-[#e63946] px-6 text-sm font-bold text-white shadow-md shadow-red-500/20 transition hover:bg-[#c1121f]"
                >
                  View All Products <FiArrowRight size={16} />
                </a>

                <Link
                  href="/contact-us"
                  className="inline-flex w-full sm:w-[210px] h-[52px] items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-[#1d3557] shadow-sm transition hover:bg-slate-50"
                >
                  Contact Us
                </Link>
              </div>

              {/* Metric Cards (Moved here) */}
              <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-6 sm:gap-12">
                {/* Metric Card 1: Projects Delivered */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-4 bg-rose-50/40 border border-rose-100/50 py-3 px-4 rounded-2xl"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-[#e63946] border border-rose-100">
                    <FiBriefcase size={22} />
                  </div>
                  <div className="pr-2">
                    <div className="text-[22px] font-black text-[#0f172a] leading-none">{settings.productsHeroProjectsDelivered || '250+'}</div>
                    <div className="text-xs font-semibold text-slate-500 mt-1.5">Projects Delivered</div>
                  </div>
                </motion.div>

                {/* Metric Card 2: 98% Client Satisfaction */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-4 bg-amber-50/40 border border-amber-100/50 py-3 px-4 rounded-2xl"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 border border-amber-100">
                    <FiStar size={22} />
                  </div>
                  <div className="pr-2">
                    <div className="text-[22px] font-black text-[#0f172a] leading-none">{settings.productsHeroClientSatisfaction || '98%'}</div>
                    <div className="text-xs font-semibold text-slate-500 mt-1.5">Client Satisfaction</div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Hero Image & Floating Cards Column */}
            <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end mt-12 lg:mt-0">
              <div className="relative w-full max-w-[650px] xl:scale-110 origin-right">
                {/* Main Hero Laptop Image */}
                {settings.productsHeroImageUrl && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 [isolation:isolate] [transform:translateZ(0)]"
                  >
                    <img
                      src={resolveImageUrl(settings.productsHeroImageUrl)}
                      alt="I-BACUS TECH Digital Products Showcase"
                      className="w-full h-auto block rounded-3xl object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* =========================================================================
          2. MICRO APPS SECTION
      ========================================================================= */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Column */}
            <div className="lg:col-span-5 flex flex-col items-start text-left min-w-0">
              <span className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#e63946] mb-2 leading-none">
                {settings.productsMicroAppsSubtitle || 'MICRO APPS THAT'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1d3557] leading-tight mb-6">
                {settings.productsMicroAppsTitle || 'Solve Real Business Problems'}
              </h2>
              
              <p className="text-sm text-slate-600 leading-relaxed mb-6 whitespace-pre-wrap">
                {settings.productsMicroAppsLeftIntro ? (
                  <span>
                    <span className="font-semibold text-[#e63946] border-b border-red-200 pb-0.5">I-BacusTech</span> {settings.productsMicroAppsLeftIntro.replace(/^I-BacusTech /i, '')}
                  </span>
                ) : (
                  <>
                    <span className="font-semibold text-[#e63946] border-b border-red-200 pb-0.5">I-BacusTech</span> helps businesses solve their everyday challenges by building small, focused applications called <strong>Micro-Apps</strong>.
                  </>
                )}
              </p>
              
              <h3 className="text-lg font-bold text-[#1d3557] mb-3">{settings.productsMicroAppsLeftHeading || 'What is a Micro-App?'}</h3>
              <div 
                className="prose prose-sm max-w-none text-slate-600 prose-p:my-1.5 prose-p:leading-relaxed mb-6 prose-strong:font-bold prose-strong:text-[#1d3557] prose-a:text-blue-600 hover:prose-a:text-blue-700" 
                dangerouslySetInnerHTML={{ __html: (settings.productsMicroAppsLeftText || 'A Micro-App is an application designed to solve one specific business problem.<br/><br/>For example, customers may make a payment but never receive a proper receipt. Instead of investing in a large billing system, a single Micro-App can generate a receipt instantly and send it via email or WhatsApp.').replace(/&nbsp;|&#160;/g, ' ') }} 
              />
              
              <h3 className="text-[15px] font-bold text-[#1d3557] mb-4">Micro-Apps are:</h3>
              <ul className="space-y-3.5 mb-8">
                {parseJsonSafe(settings.productsMicroAppsLeftBullets, [
                  'Focused on solving one problem at a time',
                  'Cost effective to build than purchasing large applications with features you may never use',
                  'Quick to deploy, develop, and display',
                  'Available as either a ready product or cloud-based service, depending on your needs.'
                ]).map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg width={18} height={18} viewBox="0 0 24 24" className="text-[#e63946] shrink-0 mt-0.5">
                      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <span className="text-[13px] font-semibold text-slate-700 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Right Column */}
            <div className="lg:col-span-7 flex flex-col gap-2 text-[13px] text-slate-700 font-medium leading-relaxed pt-1 min-w-0">
              {settings.productsMicroAppsRightTextTop ? (
                <div 
                  className="prose prose-sm max-w-none prose-p:my-1.5 prose-p:leading-relaxed prose-strong:font-bold prose-strong:text-[#1d3557] prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-700" 
                  dangerouslySetInnerHTML={{ __html: settings.productsMicroAppsRightTextTop.replace(/&nbsp;|&#160;/g, ' ') }} 
                />
              ) : (
                <>
                  <p>
                    At <span className="font-bold border-b border-red-200 pb-0.5 text-[#1d3557]">I-BacusTech</span>, we build technology solutions that solve real business problems.
                  </p>
                  <p>
                    We help startups, small and medium-sized businesses, and enterprise <strong>transform ideas into practical digital solutions</strong>. From custom web and mobile applications to powerful platforms, AI systems, and business automation, we develop software that simplifies operations, improves efficiency, and supports business growth.
                  </p>
                  <p>
                    <strong>With over 10+ years of industry experience</strong> and a team of 50+ passionate <strong>professionals</strong>, we turn ideas into scalable, reliable, and future-ready software solutions.
                  </p>
                  <p>
                    Our approach combines technical expertise with a strong understanding of business processes to deliver applications that are practical, impactful, and built to grow with you.
                  </p>
                  <p>
                    We at I-BacusTech believe in understanding each client's business before writing a single line of code. By working closely with our clients, analyzing workflows, and identifying challenges, we create solutions that deliver measurable results.
                  </p>
                  <p>
                    Whether you need a custom enterprise application, an AI-driven solution, a cloud platform, a business intelligence dashboard, or a progressive web app — we're here to help you innovate, scale, and stay ahead in today's fast-moving business world.
                  </p>
                </>
              )}
              
              <h3 className="text-[15px] font-bold text-[#1d3557] mt-1.5 mb-1">{settings.productsMicroAppsRightHeading || 'Why Business Choose I-BacusTech:'}</h3>
              <ul className="grid sm:grid-cols-1 gap-1.5 mb-1 ml-1">
                {parseJsonSafe(settings.productsMicroAppsRightBullets, [
                  '10+ years of technology and digital transformation experience',
                  'Custom solutions tailored to your business',
                  'Expertise in AI, Web, Mobile, ERP, Cloud, and Data Analytics',
                  'Agile development with transparent communication',
                  'Secure, scalable, and future-ready applications',
                  'Dedicated support beyond project delivery'
                ]).map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <div className="w-[4px] h-[4px] rounded-full bg-slate-400 shrink-0 mt-2"></div>
                    <span className="text-[13px] font-semibold text-slate-700 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
              
              <p className="mt-1 whitespace-pre-wrap">
                {settings.productsMicroAppsRightTextBottom || 'Our mission is simple: to empower businesses with innovative technology solutions that improve productivity, create customer success, and enable sustainable growth.'}
              </p>
            </div>
            
          </div>
        </div>
      </section>



      {/* =========================================================================
          3. ALL PROJECTS SECTION
      ========================================================================= */}
      <section id="all-products" className="py-16 bg-white scroll-mt-24 sm:scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
            <div>
              <span className="text-[18px] font-bold uppercase tracking-[0.2em] text-[#e63946]">
                ALL PRODUCTS
              </span>
              
            </div>
            {!loading && currentAllProjects.length > 0 && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-[#e63946] text-xs font-extrabold self-start sm:self-auto shadow-xs">
                <span>Total: {currentAllProjects.length} Products</span>
              </div>
            )}
          </div>

          {/* Loading or Projects Grid */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader size="lg" label="Loading products..." />
            </div>
          ) : currentAllProjects.length === 0 ? (
            <div className="py-16 text-center text-slate-500 font-semibold border border-dashed border-slate-200 rounded-2xl">
              No products available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedAllProjects.map((project) => {
                const IconComp = project.icon;
                return (
                  <div
                    key={project.id}
                    className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between [isolation:isolate]"
                  >
                    {/* Top Preview */}
                    <div className="p-3 bg-slate-100/60 border-b border-slate-100 rounded-t-2xl overflow-hidden">
                      <DeviceMockupFrame type={project.mockupType} title={project.title} imageUrl={project.imageUrl} />
                    </div>

                    {/* Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Icon + Title */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${project.iconBg} ${project.iconColor}`}>
                            <IconComp size={15} />
                          </div>
                          <h4 className="text-sm font-bold text-[#0f172a] line-clamp-1">{project.title}</h4>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-3 overflow-hidden">
                          {stripHtml(project.description)}
                        </p>
                      </div>

                      <div className="mt-auto pt-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-2.5 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* View Details */}
                          <Link
                            href={`/products/${project.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#e63946] hover:text-[#c1121f] transition-all cursor-pointer ml-auto"
                          >
                            View Details <FiArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action buttons: Load More / Show Less */}
          {(currentAllProjects.length > visibleCount || visibleCount > 8) && (
            <div className="mt-10 flex justify-center gap-4 flex-wrap">
              {currentAllProjects.length > visibleCount && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-[#0f172a] shadow-sm hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer"
                >
                  View More Products <FiRefreshCw className="text-[#e63946]" size={15} />
                </button>
              )}
              {visibleCount > 8 && (
                <button
                  type="button"
                  onClick={() => setVisibleCount(8)}
                  className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-[#0f172a] shadow-sm hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer"
                >
                  Show Less <FiChevronUp className="text-[#e63946]" size={15} />
                </button>
              )}
            </div>
          )}

        </div>
      </section>



      {/* =========================================================================
          5. BOTTOM CTA BANNER ("Let's Build Your Next Successful Product")
      ========================================================================= */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-3xl p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

              {/* Left Column */}
              <div className="lg:col-span-4 xl:col-span-3 text-left">
                <h2 className="text-2xl mb-1 sm:text-3xl font-black text-[#0f172a] leading-tight">
                  Let's Build Your Next <br className="hidden lg:block" />
                  <span className="text-[#e63946]">Successful Product</span>
                </h2>

                <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We help startups and enterprises turn their ideas into scalable digital products.
                </p>

                <div className="mt-6 sm:mt-8 w-full">
                  <Link
                    href="/contact-us"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#e63946] px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-red-500/20 transition hover:bg-[#c1121f]"
                  >
                    Get In Touch <FiArrowRight size={15} />
                  </Link>
                </div>
              </div>

              {/* Right Column (4 Feature Cards in a Single Row) */}
              <div className="lg:col-span-8 xl:col-span-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between items-start gap-3 hover:shadow-md transition-all">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-[#e63946]">
                    <FiUsers size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f172a]">Expert Team</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">Skilled professionals with industry experience.</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between items-start gap-3 hover:shadow-md transition-all">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-[#e63946]">
                    <FiClock size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f172a]">On-Time Delivery</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">We deliver projects on time with quality assurance.</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between items-start gap-3 hover:shadow-md transition-all">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-[#e63946]">
                    <FiShield size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f172a]">Scalable Solutions</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">Future-ready solutions that grow with your business.</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between items-start gap-3 hover:shadow-md transition-all">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-[#e63946]">
                    <FiHeadphones size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f172a]">24/7 Support</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">We provide continuous support and maintenance.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
