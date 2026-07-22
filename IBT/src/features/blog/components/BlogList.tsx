'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiCalendar, FiMail, FiGrid, FiPhone } from 'react-icons/fi';
import { type PublicBlog } from '@/src/api/client';
import { Pagination } from '@/src/shared/ui/Pagination';
import { formatCategoryName } from '@/src/utils/category';

type BlogListProps = {
  initialBlogs: PublicBlog[];
  apiOrigin: string;
};

const POSTS_PER_PAGE = 4;

export function BlogList({ initialBlogs, apiOrigin }: BlogListProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('category');

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Posts');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    const cats = new Set(initialBlogs.map(b => b.category).filter(Boolean));
    return ['All Posts', ...Array.from(cats)];
  }, [initialBlogs]);

  // Sync state with URL search param and scroll into view
  useEffect(() => {
    if (categoryParam) {
      const matched = categories.find(
        cat => typeof cat === 'string' && cat.toLowerCase() === categoryParam.toLowerCase()
      );
      if (matched) {
        setSelectedCategory(matched as string);
      } else {
        setSelectedCategory(categoryParam);
      }

      // Smooth scroll to articles section
      const timer = setTimeout(() => {
        const section = document.getElementById('articles-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setSelectedCategory('All Posts');
    }
  }, [categoryParam, categories]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All Posts') {
      router.push('/blog#articles-section', { scroll: false });
    } else {
      router.push(`/blog?category=${encodeURIComponent(category)}#articles-section`, { scroll: false });
    }
    const section = document.getElementById('articles-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  const resolveImageUrl = (imageUrl?: string | null) => {
    if (!imageUrl?.trim()) return null;
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    return `${apiOrigin}${imageUrl}`;
  };

  const getExcerpt = (text?: string | null) => {
    if (!text) return '';
    return text.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim().slice(0, 100) + '...';
  };

  const formatPublishedAt = (value?: string | null) => {
    if (!value) return 'Latest edition';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Latest edition';

    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const filteredBlogs = useMemo(() => {
    // Exclude the featured article from the default "All Posts" listing to avoid duplicate display
    const featured = initialBlogs.find(blog => blog.featured);
    return initialBlogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase()) ||
        (blog.description || '').toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All Posts' ||
        (blog.category && blog.category.toLowerCase() === selectedCategory.toLowerCase());
      if (!matchesSearch || !matchesCategory) return false;
      if (featured && blog.id === featured.id && selectedCategory === 'All Posts') return false;
      return true;
    });
  }, [initialBlogs, search, selectedCategory]);

  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);
  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredBlogs.slice(start, start + POSTS_PER_PAGE);
  }, [filteredBlogs, currentPage]);

  // For Sidebar widgets
  const popularPosts = initialBlogs.slice(0, 4);
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    initialBlogs.forEach(blog => {
      if (blog.category) {
        counts[blog.category] = (counts[blog.category] || 0) + 1;
      }
    });
    return counts;
  }, [initialBlogs]);

  return (
    <div id="articles-section" className="space-y-12 scroll-mt-28">

      {/* =====================================================
          TOP BAR (Filters & Search)
      ===================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-slate-100 pb-8">

        {/* Categories List */}
        <div className="flex flex-nowrap gap-2 sm:gap-4 items-center overflow-x-auto pb-2 sm:pb-0 scrollbar-hide w-full lg:w-auto">
          {categories.map(cat => {
            const catStr = cat as string;
            const isActive = selectedCategory.toLowerCase() === catStr.toLowerCase();
            return (
              <button
                key={catStr}
                onClick={() => handleCategoryChange(catStr)}
                className={`whitespace-nowrap px-4 sm:px-5 py-2.5 rounded-lg text-[13px] font-bold transition-all duration-300 ${isActive
                  ? 'bg-[#e63946] text-white shadow-md shadow-red-500/20'
                  : 'bg-transparent text-slate-600 hover:text-[#0f172a] hover:bg-slate-100'
                  }`}
              >
                {formatCategoryName(catStr)}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-[300px] shrink-0">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-5 text-[14px] font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946]"
          />
        </div>
      </div>

      {/* =====================================================
          MAIN LAYOUT (Grid + Sidebar)
      ===================================================== */}
      <div className="grid lg:grid-cols-[1fr_350px] gap-12 items-start">

        {/* LEFT COLUMN: Blog Grid */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {paginatedBlogs.length > 0 ? (
              <motion.div
                key={selectedCategory + search + currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* 2-Column Grid */}
                <div className="grid sm:grid-cols-2 gap-8">
                  {paginatedBlogs.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">

                      {/* Thumbnail */}
                      <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                        {post.imageUrl ? (
                          <img
                            src={resolveImageUrl(post.imageUrl) || ''}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 italic text-xs font-bold uppercase tracking-widest">No Image</div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-3">
                          {formatCategoryName(post.category) || 'IBT JOURNAL'}
                        </p>
                        <h3 title={post.title} className="text-[18px] sm:text-[20px] font-black text-[#0f172a] leading-snug mb-3 group-hover:text-[#e63946] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-[14px] text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2">
                          {getExcerpt(post.description || post.content)}
                        </p>

                        <div className="mt-auto flex items-center gap-4 text-[12px] font-medium text-slate-400 pt-5 border-t border-slate-50">
                          <span className="flex items-center gap-1.5"><FiCalendar /> {formatPublishedAt(post.publishedAt)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => {
                        setCurrentPage(page);
                        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else if (typeof window !== 'undefined') {
                          window.scrollTo({ top: 400, behavior: 'smooth' });
                        }
                      }}
                    />
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 py-20 text-center bg-white">
                <p className="text-[18px] font-bold text-[#0f172a] mb-2">No articles found.</p>
                <p className="text-[14px] text-slate-500 mb-6">We couldn't find anything matching your criteria.</p>
                <button
                  onClick={() => { setSearch(''); handleCategoryChange('All Posts'); }}
                  className="px-6 py-3 bg-[#0f172a] text-white text-[13px] font-bold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

      
        <div className="w-full flex flex-col gap-8 lg:sticky lg:top-[6rem] self-start">

                {/* Popular Posts */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-100 shadow-sm">
            <h4 className="text-[16px] font-black text-[#0f172a] mb-3 pb-4 border-b border-slate-50">Popular Posts</h4>
            <div className="flex flex-col gap-6">
              {popularPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group flex gap-4 items-center">
                  <img
                    src={resolveImageUrl(post.imageUrl) || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200'}
                    alt={post.title}
                    className="w-20 h-16 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div className="relative">
                    <div className="group/tooltip relative">
                      <h5 className="text-[13px] font-bold text-[#0f172a] leading-snug line-clamp-2 mb-1 group-hover:text-[#e63946] transition-colors">
                        {post.title}
                      </h5>
                      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-64 max-w-[85vw] whitespace-normal rounded-lg bg-white border border-slate-200 px-3 py-2 text-[11px] font-bold tracking-wide text-[#0f172a] opacity-0 scale-95 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-200 z-50 text-center shadow-lg shadow-slate-200/50 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-t-white">
                        {post.title}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400">
                      {formatPublishedAt(post.publishedAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>


          {/* Need Help? CTA Card */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-100 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-50/50 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500" />
            <h4 className="text-[16px] font-black text-[#0f172a] flex items-center gap-2 relative z-10">
              <FiPhone className="text-[#e63946]" size={16} />
              Need Help?
            </h4>
            <p className="text-[12px] text-slate-500 font-medium leading-relaxed relative z-10">
              Contact our expert support team to find the best solutions customized for your specific business requirements.
            </p>
            <Link
              href="/contact-us"
              className="w-full py-2.5 rounded-xl bg-[#e63946] text-white hover:bg-red-600 font-bold text-xs transition-all text-center tracking-wider uppercase shadow-[0_4px_12px_rgba(230,57,70,0.15)] hover:shadow-[0_6px_20px_rgba(230,57,70,0.25)] relative z-10"
            >
              Contact Us
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
