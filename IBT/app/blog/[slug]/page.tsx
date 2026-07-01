import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  FiArrowLeft, FiShare2, FiSearch, FiMail, FiArrowRight, FiEye, FiActivity, FiShield, FiCheckCircle
} from 'react-icons/fi'
import { apiClient } from '@/src/api/client'
import { ShareArticleButton } from './ShareArticleButton'
import { BlogProgressBar } from './BlogProgressBar'
import { formatCategoryName } from '@/src/utils/category'

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const blogs = await apiClient.getPublicBlogs(1, 100);
    const paths = blogs.items.map((blog) => ({
      slug: blog.slug,
    }));
    return paths.length > 0 ? paths : [{ slug: 'latest' }];
  } catch (error) {
    console.error('Error generating static params for blogs:', error);
    return [{ slug: 'latest' }];
  }
}

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>
}

const resolveApiOrigin = (value: string | undefined) => {
  const fallback = 'http://localhost:5000'
  if (!value?.trim()) return fallback
  const withProtocol = /^https?:\/\//i.test(value.trim()) ? value.trim() : `http://${value.trim()}`
  try { return new URL(withProtocol).origin } catch { return fallback }
}

const resolveImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl?.trim()) return null
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl
  return `${resolveApiOrigin(process.env.NEXT_PUBLIC_API_URL)}${imageUrl}`
}

const getExcerpt = (text?: string | null) => {
  if (!text) return ''
  const clean = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return clean.slice(0, 160) + (clean.length > 160 ? '...' : '')
}

const formatPublishedAt = (value?: string | null) => {
  if (!value) return 'May 14, 2025' // Fallback to match design
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'May 14, 2025'
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params
  const allBlogsData = await apiClient.getPublicBlogs(1, 100).catch(() => ({ items: [] }));
  const allBlogs = allBlogsData.items;
  
  const currentIndex = allBlogs.findIndex((b) => b.slug === slug);
  const blog = await apiClient.getPublicBlogBySlug(slug).catch(() => null);

  if (!blog) {
    notFound()
  }

  // Previous and Next Articles (assuming sorted by descending date)
  const nextArticle = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
  const previousArticle = currentIndex !== -1 && currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;

  // Recent Posts
  const recentPosts = allBlogs.filter((p) => p.slug !== slug).slice(0, 4);

  // Categories
  const categoryCounts: Record<string, number> = {};
  allBlogs.forEach((b) => {
    if (b.category) {
      categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
    }
  });
  const categories = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const imageSrc = resolveImageUrl(blog.imageUrl) || 'https://images.unsplash.com/photo-1614064641936-a5926622ab93?auto=format&fit=crop&q=80&w=1600'

  // We fall back to the beautifully styled static content from the design only if there is no text content in the database.
  const cleanContent = blog.content?.replace(/<[^>]*>/g, '').trim() || '';
  const hasRichContent = cleanContent.length > 0;

  return (
    <div className="min-h-screen bg-[#f8faff] font-sans pt-10 pb-20">
      <BlogProgressBar />
      <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#e63946] transition-colors hover:text-red-700"
          >
            <FiArrowLeft className="transition-transform group-hover:-translate-x-1" size={16} /> Back to Blog
          </Link>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 lg:gap-16">
          
          {/* =========================================
              LEFT COLUMN: MAIN ARTICLE
          ========================================= */}
          <article className="w-full">
            
            {/* Header Section */}
            <div className="mb-10">
              <span className="inline-block px-3 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.15em] mb-6">
                {formatCategoryName(blog.category) || 'SECURITY'}
              </span>
              
              <h1 className="text-[36px] sm:text-[44px] lg:text-[52px] font-black text-[#0f172a] leading-[1.1] mb-6 tracking-tight">
                {blog.title || 'Designing for Accessibility: A Complete Guide'}
              </h1>
              
              <p className="text-[17px] sm:text-[19px] text-slate-500 font-medium leading-relaxed max-w-3xl mb-8">
                {blog.description || getExcerpt(blog.content)}
              </p>
              
              {/* Author and Share Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-y border-slate-200/60">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 text-[#e63946] flex items-center justify-center font-black text-lg shrink-0">
                    IB
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-bold text-slate-900 text-[15px] leading-none">IBT Editorial Team</span>
                    <span className="text-[12px] font-medium text-slate-500 mt-1">
                      {formatPublishedAt(blog.publishedAt)}
                    </span>
                  </div>
                </div>
                
                <div className="self-end sm:self-auto">
                  <ShareArticleButton 
                    title={blog.title || 'Designing for Accessibility: A Complete Guide'} 
                    description={blog.description || getExcerpt(blog.content)} 
                  />
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative w-full h-[200px] sm:h-[300px] rounded-2xl overflow-hidden mb-10 shadow-sm border border-slate-100 bg-slate-50">
              <img 
                src={imageSrc} 
                alt={blog.title} 
                className="w-full h-full object-cover" 
              />
            </div>

            {hasRichContent ? (
               <div
                 className="max-w-none text-slate-600 text-[17px] leading-[1.8]
                            [&_p]:text-slate-600 [&_p]:leading-[1.8] [&_p]:text-[17px] [&_p]:mb-6
                            [&_h2]:text-[28px] [&_h2]:font-black [&_h2]:text-[#0f172a] [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-4
                            [&_h3]:text-[22px] [&_h3]:font-bold [&_h3]:text-[#0f172a] [&_h3]:tracking-tight [&_h3]:mt-8 [&_h3]:mb-3
                            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-6
                            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:mb-6
                            [&_li]:text-slate-600 [&_li]:text-[17px] [&_li]:leading-[1.8]
                            [&_a]:text-[#e63946] [&_a]:font-semibold [&_a]:underline hover:[&_a]:text-red-700
                            [&_img]:rounded-2xl [&_img]:my-8 [&_img]:shadow-md [&_img]:max-h-[400px] [&_img]:object-cover
                            [&_strong]:text-slate-900 [&_strong]:font-bold
                            [&_blockquote]:border-l-4 [&_blockquote]:border-red-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-slate-500
                            [&_table]:min-w-full [&_table]:border-collapse [&_table]:text-[15px]
                            [&_th]:border-b [&_th]:border-r [&_th]:border-slate-200 last:[&_th]:border-r-0 [&_th]:bg-slate-50/80 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-bold [&_th]:text-[#0f172a]
                            [&_td]:border-b [&_td]:border-r [&_td]:border-slate-200 last:[&_td]:border-r-0 [&_td]:px-4 [&_td]:py-3 [&_td]:text-slate-600 [&_td]:leading-relaxed
                            [&_tr]:border-b [&_tr]:border-slate-200 last:[&_tr]:border-b-0 [&_tr]:hover:bg-slate-50/50"
                 dangerouslySetInnerHTML={{ 
                   __html: blog.content
                     .replace(/&nbsp;/gi, ' ')
                     .replace(/\u00a0/g, ' ')
                     .replace(/<table/gi, '<div class="overflow-x-auto overflow-hidden w-full border border-slate-200 rounded-xl my-6"><table')
                     .replace(/<\/table>/gi, '</table></div>')
                 }}
               />
            ) : (
              // Hardcoded 100% matched design content if backend content is empty or short
              <div className="text-slate-600 text-[17px] leading-[1.8]">
                <h2 className="text-[28px] font-black text-[#0f172a] mb-6 mt-2 tracking-tight">Introduction</h2>
                <p className="mb-6">
                  Accessibility is no longer a-nice-to-have—it's a necessity. In today's digital landscape, designing for accessibility ensures that people of all abilities can perceive, understand, navigate, and interact with digital products effectively.
                </p>
                <p className="mb-10">
                  This guide walks you through key principles, best practices, and practical steps to build inclusive experiences.
                </p>

                <h3 className="text-[22px] font-black text-[#0f172a] mb-6 tracking-tight">1. Understand Accessibility Principles</h3>
                <p className="mb-6">
                  The foundation of accessible design lies in the WCAG (Web Content Accessibility Guidelines) principles, also known as POUR:
                </p>
                
                <ul className="space-y-6 mb-12">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-[#e63946] flex items-center justify-center shrink-0 border border-red-100">
                      <FiEye size={18} />
                    </div>
                    <div>
                      <strong className="text-slate-900 font-bold">Perceivable</strong> – Information must be presentable to users in ways they can perceive.
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 border border-orange-100">
                      <FiActivity size={18} />
                    </div>
                    <div>
                      <strong className="text-slate-900 font-bold">Operable</strong> – Interface components must be operable.
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0 border border-green-100">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H15"/><path d="M10 21V18"/><path d="M14 21V18"/><path d="M12 18V15"/><path d="M10.29 11.29A4 4 0 1 1 15 12V15H9V12A4 4 0 0 1 10.29 11.29Z"/></svg>
                    </div>
                    <div>
                      <strong className="text-slate-900 font-bold">Understandable</strong> – Information and operation must be understandable.
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 border border-purple-100">
                      <FiShield size={18} />
                    </div>
                    <div>
                      <strong className="text-slate-900 font-bold">Robust</strong> – Content must be robust enough to be interpreted reliably by assistive technologies.
                    </div>
                  </li>
                </ul>

                <h3 className="text-[22px] font-black text-[#0f172a] mb-6 tracking-tight">2. Key Best Practices</h3>
                <ul className="space-y-4 mb-12">
                  {[
                    "Use semantic HTML and proper heading structure.",
                    "Ensure sufficient color contrast.",
                    "Provide alternative text for images.",
                    "Design keyboard navigability.",
                    "Use clear, consistent and descriptive labels."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 text-[#e63946] shrink-0">
                        <FiCheckCircle size={18} />
                      </div>
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-[22px] font-black text-[#0f172a] mb-6 tracking-tight">3. Tools to Help You</h3>
                <p className="mb-6">Use these tools to evaluate and improve accessibility:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                  {/* Tool 1 */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-800 text-xl">A</div>
                      <span className="font-bold text-slate-900 text-[15px]">axe DevTools</span>
                    </div>
                    <p className="text-[13px] text-slate-500 leading-relaxed">Browser extension for accessibility testing.</p>
                  </div>
                  {/* Tool 2 */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">W</div>
                      <span className="font-bold text-slate-900 text-[15px]">WAVE</span>
                    </div>
                    <p className="text-[13px] text-slate-500 leading-relaxed">Web accessibility evaluation tool.</p>
                  </div>
                  {/* Tool 3 */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center font-bold text-xl"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22H22L12 2Z"/></svg></div>
                      <span className="font-bold text-slate-900 text-[15px]">Lighthouse</span>
                    </div>
                    <p className="text-[13px] text-slate-500 leading-relaxed">Audit performance, accessibility & more.</p>
                  </div>
                  {/* Tool 4 */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-green-50 text-green-500 flex items-center justify-center font-bold text-xl"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></div>
                      <span className="font-bold text-slate-900 text-[15px]">Color Contrast Checker</span>
                    </div>
                    <p className="text-[13px] text-slate-500 leading-relaxed">Check contrast ratios for accessibility.</p>
                  </div>
                </div>

                <h2 className="text-[28px] font-black text-[#0f172a] mb-6 tracking-tight">Conclusion</h2>
                <p className="mb-10">
                  Designing for accessibility leads to better user experiences for everyone. By following these principles and practices, you can create digital products that are not only compliant but truly inclusive.
                </p>
              </div>
            )}

            {/* Navigation Footer */}
            <div className="mt-16 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {previousArticle ? (
                <Link href={`/blog/${previousArticle.slug}`} className="group flex flex-col items-start p-6 rounded-2xl border border-slate-200 bg-white hover:border-[#e63946] hover:shadow-lg transition-all">
                  <div className="flex items-center gap-2 text-[12px] font-bold text-[#e63946] uppercase tracking-widest mb-3">
                    <FiArrowLeft className="transition-transform group-hover:-translate-x-1" /> Previous Article
                  </div>
                  <h4 className="text-[17px] font-bold text-[#0f172a] leading-tight group-hover:text-[#e63946] transition-colors line-clamp-2">
                    {previousArticle.title}
                  </h4>
                </Link>
              ) : <div />}
              
              {nextArticle ? (
                <Link href={`/blog/${nextArticle.slug}`} className="group flex flex-col items-end text-right p-6 rounded-2xl border border-slate-200 bg-white hover:border-[#e63946] hover:shadow-lg transition-all">
                  <div className="flex items-center gap-2 text-[12px] font-bold text-[#e63946] uppercase tracking-widest mb-3">
                    Next Article <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                  </div>
                  <h4 className="text-[17px] font-bold text-[#0f172a] leading-tight group-hover:text-[#e63946] transition-colors line-clamp-2">
                    {nextArticle.title}
                  </h4>
                </Link>
              ) : <div />}
            </div>

          </article>

          {/* =========================================
              RIGHT COLUMN: SIDEBAR
          ========================================= */}
          <aside className="w-full space-y-10 hidden lg:block">
            
            {/* Search Box */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search articles..." 
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e63946] transition-all shadow-sm"
              />
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>



            {/* Recent Posts */}
            {recentPosts.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3 className="text-[18px] font-black text-[#0f172a] mb-3">Recent Posts</h3>
                <div className="space-y-6">
                  {recentPosts.map((post) => (
                    <Link href={`/blog/${post.slug}`} key={post.id} className="group flex gap-4 items-center">
                      <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                        <img 
                          src={resolveImageUrl(post.imageUrl) || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=200&q=80'} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-[#0f172a] leading-snug group-hover:text-[#e63946] transition-colors line-clamp-2 mb-1">
                          {post.title}
                        </h4>
                        <p className="text-[11px] font-medium text-slate-500">{formatPublishedAt(post.publishedAt)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </aside>
        </div>
      </div>
    </div>
  )
}
