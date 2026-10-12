import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import { apiClient } from '@/src/api/client'
import { KeyHighlights } from '@/src/shared/ui/KeyHighlights'

export const dynamic = 'force-dynamic';

type ServiceDetailPageProps = {
  params: Promise<{ slug: string }>
}

const resolveApiOrigin = (value: string | undefined) => {
  const fallback = 'http://localhost:5001'

  if (!value?.trim()) {
    return fallback
  }

  const withProtocol = /^https?:\/\//i.test(value.trim()) ? value.trim() : `http://${value.trim()}`

  try {
    return new URL(withProtocol).origin
  } catch {
    return fallback
  }
}

const resolveImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl?.trim()) {
    return null
  }

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl
  }

  return `${resolveApiOrigin(process.env.NEXT_PUBLIC_API_URL)}${imageUrl}`
}

function getCleanDescriptionHtml(rawDesc?: string | null): string {
  if (!rawDesc) return ''
  return rawDesc
    .replace(/<ul class="custom-key-highlights"[^>]*>[\s\S]*?<\/ul>/gi, '')
    .replace(/<ul[^>]*>([\s\S]*?)<\/ul>\s*$/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\u00a0/g, ' ')
    .trim()
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params
  const service = await apiClient.getServiceBySlug(slug).catch(() => null)

  if (!service) {
    notFound()
  }

  const imageSrc = resolveImageUrl(service.imageUrl)

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/services#all-services"
          className="group inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition-colors hover:text-[#e63946]"
        >
          <FiArrowLeft className="transition-transform group-hover:-translate-x-1" /> Back to Services
        </Link>
      </div>

      <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_14px_36px_rgba(35,24,21,0.06)] [isolation:isolate]">
        <div className="relative w-full max-h-[340px] sm:max-h-[380px] min-h-[220px] bg-slate-50 flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden rounded-t-3xl">
          {imageSrc ? (
            service.projectUrl ? (
              <a href={service.projectUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center max-h-[280px] sm:max-h-[320px] max-w-full">
                <img src={imageSrc} alt={service.title} className="max-h-[260px] sm:max-h-[300px] w-auto h-auto object-contain rounded-xl drop-shadow-md hover:opacity-90 transition-opacity" />
              </a>
            ) : (
              <img src={imageSrc} alt={service.title} className="max-h-[260px] sm:max-h-[300px] w-auto h-auto object-contain rounded-xl drop-shadow-md" />
            )
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-400">
              No service cover image
            </div>
          )}
        </div>

        <div className="space-y-8 p-6 sm:p-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e63946] mb-2">Service Overview</p>
            <h1 className="text-[36px] sm:text-[44px] lg:text-[54px] font-black leading-[1.15] text-slate-900">{service.title}</h1>
          </div>

          <div 
            className="text-base leading-8 text-slate-600 prose prose-slate max-w-none break-words [overflow-wrap:anywhere] max-w-full overflow-hidden text-justify"
            dangerouslySetInnerHTML={{ __html: getCleanDescriptionHtml(service.description) }}
          />

          {/* Key Highlights & Features */}
          <KeyHighlights
            description={service.description}
            cardTitle={service.title}
            tags={service.tags}
            className="pt-4 border-t border-slate-100"
          />
        </div>
      </article>
    </div>
  )
}
