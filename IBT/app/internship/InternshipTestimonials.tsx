'use client'

import { useState, useEffect, useCallback } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

type Testimonial = {
  id: string
  name: string
  content: string
  role?: string | null
  avatarUrl?: string | null
}

function normalizeApiBaseUrl(raw: string | undefined) {
  const fallback = 'http://localhost:5001'
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

export function InternshipTestimonials({
  testimonials,
  title,
}: {
  testimonials: Testimonial[]
  title: string
}) {
  const perPage = 3
  const totalPages = Math.max(1, Math.ceil(testimonials.length / perPage))
  const [currentPage, setCurrentPage] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [isAnimating, setIsAnimating] = useState(false)

  const goTo = useCallback(
    (page: number, dir: 'next' | 'prev') => {
      if (isAnimating || page === currentPage) return
      setDirection(dir)
      setIsAnimating(true)
      // Short exit delay, then swap page
      setTimeout(() => {
        setCurrentPage(page)
        // After swap, allow entry animation
        setTimeout(() => setIsAnimating(false), 50)
      }, 300)
    },
    [isAnimating, currentPage]
  )

  const goNext = useCallback(() => {
    if (currentPage >= totalPages - 1) return
    goTo(currentPage + 1, 'next')
  }, [currentPage, totalPages, goTo])

  const goPrev = useCallback(() => {
    if (currentPage <= 0) return
    goTo(currentPage - 1, 'prev')
  }, [currentPage, totalPages, goTo])

  // Current page slice
  const start = currentPage * perPage
  const visibleTestimonials = testimonials.slice(start, start + perPage)

  // Animation classes
  const slideClass = isAnimating
    ? 'opacity-0 translate-y-4'
    : 'opacity-100 translate-y-0'

  return (
    <section className="py-16 lg:py-24 bg-[#f8faff]">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h3 className="text-[18px] font-bold uppercase tracking-widest !text-red-500 mb-3">
              {title}
            </h3>
            <h2 className="text-[32px] md:text-[40px] font-black tracking-tight text-[#0f172a]">
              Real Experiences & Real Growth
            </h2>
          </div>

          {/* Nav Arrows */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2 mt-6 md:mt-0 self-end md:self-auto">
              <button
                onClick={goPrev}
                disabled={currentPage <= 0}
                aria-label="Previous testimonials"
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 transition-all shadow-sm ${currentPage <= 0
                  ? 'bg-slate-50 text-slate-300 cursor-not-allowed opacity-60'
                  : 'bg-white text-slate-500 hover:text-[#0f172a] hover:border-slate-300 hover:shadow-md'
                  }`}
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                onClick={goNext}
                disabled={currentPage >= totalPages - 1}
                aria-label="Next testimonials"
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 transition-all shadow-sm ${currentPage >= totalPages - 1
                  ? 'bg-slate-50 text-slate-300 cursor-not-allowed opacity-60'
                  : 'bg-white text-slate-500 hover:text-[#0f172a] hover:border-slate-300 hover:shadow-md'
                  }`}
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Cards Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ease-out ${slideClass}`}
        >
          {visibleTestimonials.map((testimonial, idx) => (
            <div
              key={testimonial.id || `${currentPage}-${idx}`}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between relative hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Red Quote Mark decoration */}
              <div className="absolute top-8 left-8 text-red-500 opacity-20 text-4xl font-serif">
                &ldquo;
              </div>

              <p className="text-[14px] text-slate-600 font-medium leading-relaxed mb-8 relative z-10 pl-8 pt-2">
                {testimonial.content}
              </p>

              <div className="flex items-center gap-4 border-t border-slate-100 pt-6 mt-auto">
                <img
                  src={
                    resolveImageUrl(testimonial.avatarUrl) ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                  }
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover object-top bg-slate-100"
                />
                <div>
                  <h4 className="text-[15px] font-bold text-[#0f172a]">
                    {testimonial.name}
                  </h4>
                  <p className="text-[12px] font-medium text-slate-500">
                    {testimonial.role || 'Intern'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot Indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > currentPage ? 'next' : 'prev')}
                aria-label={`Go to testimonial page ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${i === currentPage
                  ? 'w-6 h-1.5 bg-[#e63946]'
                  : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
