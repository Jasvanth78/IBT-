import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiCheckCircle, FiGlobe, FiZap, FiArrowRight, FiShield, FiClock, FiUsers, FiExternalLink } from 'react-icons/fi';
import { apiClient } from '@/src/api/client';
import { KeyHighlights } from '@/src/shared/ui/KeyHighlights';

export const dynamic = 'force-dynamic';

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const resolveApiOrigin = (value: string | undefined) => {
  const fallback = 'http://localhost:5001';
  if (!value?.trim()) return fallback;
  const withProtocol = /^https?:\/\//i.test(value.trim()) ? value.trim() : `http://${value.trim()}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return fallback;
  }
};

const resolveImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl?.trim()) return null;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return `${resolveApiOrigin(process.env.NEXT_PUBLIC_API_URL)}${imageUrl}`;
};

// Fallback hardcoded product data mapping
const fallbackProducts: Record<string, {
  title: string;
  category: string;
  description: string;
  tags: string[];
  features: string[];
  imageUrl?: string;
}> = {
  bloomcraft: {
    title: 'BloomCraft',
    category: 'AI',
    description: 'BloomCraft is an AI-driven personal development ecosystem designed to empower individuals with custom roadmap creation, daily goal tracking, intelligent skill evaluation, and real-time habit optimization algorithms.',
    tags: ['React', 'Node.js', 'MongoDB', 'AI'],
    features: ['AI Goal Assessment Engine', 'Personalized Growth Roadmaps', 'Habit Tracking Analytics', 'Interactive Progress Dashboard'],
  },
  'ibt-website': {
    title: 'IBT Website',
    category: 'Web',
    description: 'The official digital flagship for I-BACUS TECH, built with high-performance SSR architecture, interactive WebGL accents, real-time WebSocket dynamic state, and high conversion landing pages.',
    tags: ['Next.js', 'React', 'Prisma', 'MongoDB'],
    features: ['Server-Side Rendered Next.js 16', 'Realtime Socket Updates', 'Custom CMS Integration', 'SEO Optimized Architecture'],
  },
  'career-sheet': {
    title: 'Career Sheet',
    category: 'Web',
    description: 'Smart automated job application management platform equipped with resume ATS rating scanners, job board crawlers, application pipeline trackers, and automated email follow-up triggers.',
    tags: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
    features: ['Instant Resume ATS Match Score', 'Job Application Pipeline Board', 'Automated Email Follow-up Reminders', 'Analytics & Salary Insights'],
  },
};

function getCleanDescriptionHtml(rawDesc?: string | null): string {
  if (!rawDesc) return '';
  return rawDesc
    .replace(/<ul class="custom-key-highlights"[^>]*>[\s\S]*?<\/ul>/gi, '')
    .replace(/<ul[^>]*>([\s\S]*?)<\/ul>\s*$/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\u00a0/g, ' ')
    .trim();
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  // Try fetching from backend API first
  const serviceItem = await apiClient.getServiceBySlug(slug).catch(() => null);

  let title = serviceItem?.title;
  let description = serviceItem?.description;
  let category = serviceItem?.categoryType || 'Product';
  let tags = serviceItem?.tags || [];
  let imageSrc = resolveImageUrl(serviceItem?.imageUrl);
  let features: string[] | undefined = undefined;

  // If not found in API, check fallback mock data
  if (!serviceItem && fallbackProducts[slug.toLowerCase()]) {
    const fb = fallbackProducts[slug.toLowerCase()];
    title = fb.title;
    description = fb.description;
    category = fb.category;
    tags = fb.tags;
    features = fb.features;
  }

  const projectUrl = serviceItem?.projectUrl;

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased py-12">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/products#all-products"
            className="group inline-flex items-center gap-2 text-md font-bold text-slate-600 transition-colors hover:text-[#e63946]"
          >
            <FiArrowLeft className="transition-transform group-hover:-translate-x-1" /> Back to All Products
          </Link>
        </div>

        {/* Product Detail Card */}
        <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl [isolation:isolate]">

          {/* Header Image / Media Frame */}
          <div className="relative w-full max-h-[340px] sm:max-h-[380px] min-h-[220px] bg-slate-50 flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden rounded-t-3xl">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={title}
                className="max-h-[260px] sm:max-h-[300px] w-auto h-auto object-contain drop-shadow-md rounded-xl overflow-hidden"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                <FiZap size={48} className="text-[#e63946]" />
                <span className="text-sm font-bold text-slate-700">{title} Preview</span>
              </div>
            )}
          </div>

          {/* Body Content */}
          <div className="p-8 sm:p-12 space-y-8">

            {/* Title & Category Badge */}
            <div>
              <span className="inline-block bg-rose-50 text-[#e63946] text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                {category}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                {title}
              </h1>
            </div>

            {/* External Link / Project URL if provided by Admin */}
            {projectUrl && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                <div className="w-full sm:w-auto">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#e63946]">Visit Site</span>
                  <p className="text-sm font-semibold text-slate-800 break-all mt-0.5">{projectUrl}</p>
                </div>
                <a
                  href={projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e63946] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#c1121f] transition shrink-0 shadow-sm w-full sm:w-auto"
                >
                  Visit Live Site <FiExternalLink size={14} />
                </a>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                Overview & Architecture
              </h2>
              <div
                className="text-base sm:text-lg leading-relaxed text-slate-600 prose prose-slate max-w-none break-words [overflow-wrap:anywhere] max-w-full overflow-hidden text-justify"
                dangerouslySetInnerHTML={{ __html: getCleanDescriptionHtml(description) }}
              />
            </div>

            {/* Key Features */}
            <KeyHighlights
              description={description}
              cardTitle={title}
              tags={tags}
              features={features}
            />

            {/* Tech Stack */}
            {tags.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Technologies Used
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-slate-100 text-slate-700 text-xs font-bold px-3.5 py-1.5 rounded-lg border border-slate-200/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Banner */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Want a custom software product like this?</h3>
                <p className="text-xs text-slate-500">Contact our engineering team to turn your ideas into enterprise reality.</p>
              </div>
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e63946] px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-[#c1121f] transition cursor-pointer shrink-0 w-full sm:w-auto"
              >
                Get In Touch <FiArrowRight size={16} />
              </Link>
            </div>

          </div>

        </article>

      </div>
    </div>
  );
}
