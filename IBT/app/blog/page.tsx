import { apiClient } from '@/src/api/client'
import { BlogList } from '@/src/features/blog/components/BlogList'
import { FiArrowRight, FiFileText, FiGrid, FiUsers } from 'react-icons/fi'
import Link from 'next/link'
import { formatCategoryName } from '@/src/utils/category'

export const dynamic = 'force-dynamic'

const resolveApiOrigin = (value: string | undefined) => {
  const fallback = 'http://localhost:5000'
  if (!value?.trim()) return fallback
  const trimmed = value.trim()
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`
  try { return new URL(withProtocol).origin } catch { return fallback }
}

const formatPublishedAt = (value?: string | null) => {
  if (!value) return 'Latest edition'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Latest edition'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

const getCategoryCount = (items: Array<{ category?: string | null }>) => {
  return new Set(items.map((blog) => blog.category).filter(Boolean)).size
}

const getExcerpt = (text?: string | null) => {
  if (!text) return ''
  const clean = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return clean.slice(0, 120) + (clean.length > 120 ? '...' : '')
}

const resolveImageUrl = (imageUrl?: string | null, apiOrigin?: string) => {
  if (!imageUrl?.trim()) return null;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return `${apiOrigin}${imageUrl}`;
};

export default async function BlogPage() {
  const result = await apiClient.getPublicBlogs(1, 50).catch(() => null)
  const apiOrigin = resolveApiOrigin(process.env.NEXT_PUBLIC_API_URL)

  if (!result) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-20 text-center">
        <h1 className="text-4xl font-black text-slate-900">Our Blog</h1>
        <div className="mt-8 inline-block rounded-2xl border border-red-100 bg-red-50 p-6 text-[#e63946]">
          <p className="font-bold text-lg">Unable to load stories</p>
          <p className="mt-2 text-sm opacity-80">We&apos;re experiencing some technical issues. Please check back later.</p>
        </div>
      </div>
    )
  }

  const { items } = result
  const totalPosts = items.length
  const totalCategories = getCategoryCount(items)

  // Find the latest featured post (do not fallback to latest if not featured)
  const featuredPost = items.find((blog) => blog.featured)

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-900 font-sans">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="relative pt-12 pb-8 lg:pt-20 lg:pb-12 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <div className={featuredPost ? "grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center" : "max-w-3xl mx-auto"}>

            {/* Left Content */}
            <div className="relative z-10">
              <h3 className="text-[28px] font-bold uppercase tracking-[0.2em] !text-red-600 mb-4">
                IBT BLOG
              </h3>

              <h1 className="text-[40px] sm:text-[48px] lg:text-[56px] font-black text-[#0f172a] leading-[1.05] tracking-tight mb-6">
                Ideas, Insights &<br className="md:hidden" />
                <span className="text-[#e63946]"> Innovation</span>
              </h1>

              <p className="text-[15px] text-slate-500 font-medium leading-relaxed mb-10 max-w-md md:max-w-none lg:max-w-md">
                Explore expert perspectives, technical guides, industry trends, and innovation stories from the I BACUS TECH team.
              </p>

              {/* Stats Block */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#e63946] border border-red-100 flex items-center justify-center shrink-0">
                    <FiFileText size={18} />
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-[18px] font-black text-[#0f172a] leading-none mb-1">{totalPosts}+</div>
                    <div className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Articles Published</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#e63946] border border-red-100 flex items-center justify-center shrink-0">
                    <FiGrid size={18} />
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-[18px] font-black text-[#0f172a] leading-none mb-1">{totalCategories}+</div>
                    <div className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Categories</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Featured Article */}
            {featuredPost && (
              <div className="relative z-10 w-full">
                <Link href={`/blog/${featuredPost.slug}`} className="block group">
                  <div className="bg-white rounded-3xl overflow-hidden relative shadow-md border border-slate-100 hover:shadow-lg transition-shadow flex flex-col h-auto md:h-[400px]">
                    {featuredPost.imageUrl ? (
                      <div className="h-[180px] w-full relative overflow-hidden bg-slate-50 shrink-0">
                        <img
                          src={resolveImageUrl(featuredPost.imageUrl, apiOrigin) || ''}
                          alt={featuredPost.title}
                          className="w-full h-full object-contain bg-slate-50 transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full bg-[#e63946] text-white text-[10px] font-black uppercase tracking-widest shadow-sm">
                          FEATURED ARTICLE
                        </span>
                      </div>
                    ) : (
                      <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#e63946] text-white text-[10px] font-black uppercase tracking-widest">
                          FEATURED ARTICLE
                        </span>
                      </div>
                    )}
                    <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                      <div>
                        <p className="text-[11px] font-bold text-red-500 uppercase tracking-widest mb-2">
                          {formatCategoryName(featuredPost.category) || 'IBT JOURNAL'}
                        </p>
                        <h2 className="text-[20px] sm:text-[24px] font-black text-[#0f172a] leading-tight mb-2 group-hover:text-[#e63946] transition-colors">
                          {featuredPost.title}
                        </h2>
                        <p className="text-[13px] text-slate-500 font-medium line-clamp-2">
                          {featuredPost.description || getExcerpt(featuredPost.content)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                        <div className="text-[12px] font-medium text-slate-400">
                          {formatPublishedAt(featuredPost.publishedAt)}
                        </div>
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[#0f172a] group-hover:bg-[#e63946] group-hover:text-white transition-colors shrink-0">
                          <FiArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN BLOG LISTING (Client Component)
      ===================================================== */}
      <div className="mx-auto max-w-[1300px] px-4 pt-12 pb-20 sm:px-6 lg:px-8">
        <BlogList initialBlogs={items} apiOrigin={apiOrigin} />
      </div>

    </div>
  )
}
