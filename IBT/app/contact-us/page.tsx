import { Key, Suspense } from 'react'
import { ContactFormClient } from '@/src/features/contact/ContactFormClient'
import { apiClient } from '@/src/api/client'
import type { PublicBranch } from '@/src/api/client'
import type { SiteSettingsRealtimePayload } from '@/src/types/socket'
import { fetchSiteSettings } from '@/src/api/settings'
import { formatAddress } from '@/src/utils/address'

export const dynamic = 'force-dynamic'

type Props = {}

const stripHtmlTags = (value?: string | null) => {
  if (!value) return null
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .trim() || null
}

export default async function ContactPage(_: Props) {
  // Server-side fetch of settings and branches
  const settings = (await fetchSiteSettings().catch(() => ({} as SiteSettingsRealtimePayload))) as SiteSettingsRealtimePayload
  const branches = await apiClient.getBranches(1, 10).then((r) => r.items).catch(() => [] as PublicBranch[])

  const heroTitle = stripHtmlTags(settings.contactHeroTitle)
  const heroDescription = stripHtmlTags(settings.contactHeroDescription)

  const officeBranches = Array.isArray(settings.contactBranches) && settings.contactBranches.length > 0
    ? settings.contactBranches.map((branch, index) => ({
      id: branch?.id ?? `contact-branch-${index}`,
      name: branch?.title ?? branch?.name ?? `Office ${index + 1}`,
      address: branch?.address ?? branch?.location ?? null,
      mapLink: branch?.mapLink ?? null,
    }))
    : branches.map((branch) => ({
      id: branch.id,
      name: branch.name,
      address: branch.address ?? branch.location ?? null,
      mapLink: null,
    }))

  return (
    <div className="min-h-screen bg-white text-[#0f172a] font-sans antialiased selection:bg-rose-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

        {/* =====================================================
            TOP HERO & FORM CONTAINER GRID
        ===================================================== */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">

          {/* LEFT: TEXT CONTENT & CORPORATE INFO CARDS */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            <div>
              <span className="text-[16px] font-bold uppercase tracking-[0.2em] text-[#e63946]">
                GET IN TOUCH
              </span>
              <h1 className="mt-3 text-[24px] sm:text-[28px] lg:text-[40px] font-black tracking-tight text-[#0f172a] leading-[1.1]">
                Let's build
                something <span className='text-red-600'>Impactful
                  together</span>
              </h1>
              <p className="pt-4 text-sm text-[#475569] leading-relaxed font-medium">
                Share your requirements with us, and our team will get back to you within 24 hours.
              </p>
            </div>

            {/* DIRECT CHANNELS CARDS */}
            <div className="space-y-4 w-full">
              {/* EMAIL HUB */}
              <div className="flex items-start gap-2 sm:gap-4 bg-[#f8fafc] border border-slate-100 rounded-2xl p-3 sm:p-5 hover:shadow-md transition duration-200">
                <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-[#e63946] border border-rose-100/40">
                  <svg className="h-4.5 w-4.5 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wide">Email Us</h3>
                  <p className="text-xs sm:text-sm font-bold text-[#0f172a] mt-0.5">info@ibacustech.com</p>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1">We reply within 24 hours</p>
                </div>
              </div>

              {/* CALL HUB */}
              <div className="flex items-start gap-2 sm:gap-4 bg-[#f8fafc] border border-slate-100 rounded-2xl p-3 sm:p-5 hover:shadow-md transition duration-200">
                <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/40">
                  <svg className="h-4.5 w-4.5 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wide">Call Us</h3>
                  <p className="text-xs sm:text-sm font-bold text-[#0f172a] mt-0.5 pl-2">+91 9003562715</p>
                  <p className="text-[9px] min-[360px]:text-[10px] sm:text-xs text-slate-400 font-medium mt-1 whitespace-nowrap">Mon – Fri | 10:00 AM – 06:00 PM</p>
                </div>
              </div>

              {/* LOCATION HUB */}
              <div className="flex items-start gap-2 sm:gap-4 bg-[#f8fafc] border border-slate-100 rounded-2xl p-3 sm:p-5 hover:shadow-md transition duration-200">
                <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/40">
                  <svg className="h-4.5 w-4.5 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wide">Visit Us</h3>
                  <p className="text-xs sm:text-sm font-bold text-[#0f172a] mt-0.5 leading-snug">
                    I-BACUS-TECH, 3rd Floor,<br /> 6C, Chitra Nagar, Saravanampatti, <br />Coimbatore - 641035.
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1">We'd love to meet you!</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTACT FORM MODULE */}
          <div className="lg:col-span-7 w-full bg-white rounded-3xl border border-slate-100 shadow-2xl p-1 sm:p-2">
            <Suspense fallback={<div className="py-20 text-center text-sm font-medium text-slate-400">Loading interactive interface…</div>}>
              {/* @ts-ignore server -> client prop passing explicitly allowed */}
              <ContactFormClient initialSettings={settings} initialBranches={branches} />
            </Suspense>
          </div>
        </div>

        {/* =====================================================
            MIDDLE SECTION: CORPORATE OFFFICE REGIONS GRID
        ===================================================== */}
        <div className="mt-24 border-t border-slate-100 pt-16">
          <div className="mb-10 text-left">
            <span className="text-[16px] font-bold uppercase tracking-wider !text-red-500">OUR OFFICES</span>
            <h2 className="text-3xl font-extrabold text-[#0f172a] mt-3 tracking-tight">Visit Our Offices</h2>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* OFFICES LISTING COLUMN */}
            <div className="lg:col-span-5 space-y-4">
              {officeBranches.length > 0 ? (
                officeBranches.map((branch, index) => (
                  <div key={branch.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-slate-200 transition">
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-0.5 bg-blue-50 border border-blue-100 text-[9px] font-bold text-blue-600 uppercase rounded">
                        <h4 className="text-sm font-extrabold text-slate-900">{branch.name}</h4>
                      </span>

                      {/* <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                        {branch.address ? formatAddress(branch.address).split('\n').map((line: string, i: number, arr: any[]) => (
                          <span key={i}>
                            {line.trim()}
                            {i < arr.length - 1 && <br />}
                          </span>
                        )) : 'Address infrastructure pending configuration.'}
                      </p> */}
                      <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                        {branch.address ? (
                          branch.address.split(',').map((line: string, i: number, arr: string[]) => (
                            <span key={i}>
                              {line.trim()}
                              {i < arr.length - 1 && ','}
                              <br />
                            </span>
                          ))
                        ) : (
                          'Address infrastructure pending configuration.'
                        )}
                      </p>
                      <a
                        href={branch.mapLink || '#'}
                        target={branch.mapLink ? "_blank" : undefined}
                        rel="noreferrer noopener"
                        className="inline-flex items-center text-xs font-bold text-blue-600 pt-2 group-hover:text-blue-700"
                      >
                        View on Map <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
                      </a>
                    </div>

                    {/* Image representation for branches */}
                    <div className="h-20 w-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                      <img
                        src={index % 2 === 0
                          ? "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=260"
                          : "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=260"
                        }
                        alt="Office Architecture Space"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-[9px] font-bold text-blue-600 uppercase rounded">GLOBAL HUB</span>
                      <h4 className="text-sm font-extrabold text-slate-900">IBT – Coimbatore</h4>
                      <p className="text-xs text-slate-500">
                        123 Innovation Drive<br />
                        Tech City<br />
                        Coimbatore, TN
                      </p>
                      <button className="inline-flex items-center text-xs font-bold text-blue-600 pt-2">View on Map →</button>
                    </div>
                    <div className="h-16 w-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <div className="h-full w-full bg-slate-200" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* MAP GRAPHICAL CONTAINER BLOCK */}
            <div className="lg:col-span-7 relative h-[340px] sm:h-[400px] w-full rounded-3xl overflow-hidden border border-slate-100 shadow-xl bg-slate-50">
              <img
                src="/map.png"
                alt="Coimbatore regional spatial layout coordinate visualization"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Custom floating tooltip card mimicking structural Google embed maps viewport layout */}
              <div className="absolute top-4 left-4 bg-white p-3 rounded-xl shadow-lg border border-slate-100 max-w-xs z-10 hidden sm:block">
                <h5 className="text-xs font-bold text-slate-900">IBACUS TECH SOLUTION</h5>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">I-BACUS-TECH, 3rd Floor, 6C, Chitra Nagar, Saravanampatti, Coimbatore, Tamil Nadu-641035.</p>
                <button className="text-[10px] font-bold text-blue-600 mt-2 block hover:underline"></button>
              </div>

              {/* Central Pin Anchor */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                <div className="h-4 w-4 bg-[#e63946] rounded-full animate-ping absolute opacity-45" />
                <div className="h-4 w-4 bg-[#e63946] border-2 border-white rounded-full shadow-md relative" />
              </div>
            </div>

          </div>
        </div>

        {/* =====================================================
            BOTTOM ROW: ENGAGEMENT CALL TO ACTION INTERFACE
        ===================================================== */}
        <div className="mt-20 bg-[#0a1128] rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,57,70,0.12),transparent_60%)] pointer-events-none" />
          <div className="relative z-10 text-center sm:text-left w-full sm:w-auto">
            <h3 className="text-xl font-extrabold !text-white sm:text-2xl tracking-tight text-center sm:text-left">Ready to start your next project?</h3>
            <p 
              className="text-xs text-slate-400 pt-6 font-medium text-center sm:text-left"
              style={{ textAlign: 'inherit' }}
            >
              Let's discuss how we can turn your ideas into reality.
            </p>
          </div>
          <a
            href="/contact-us"
            className="relative z-10 bg-white text-[#0a1128] rounded-xl px-6 py-3 text-xs font-bold shadow-sm hover:bg-slate-50 transition shrink-0 tracking-wide flex items-center justify-center gap-1.5 text-center"
          >
            <span>Schedule a Free Consultation</span>
            <span className="shrink-0 font-normal">→</span>
          </a>
        </div>

      </div>
    </div>
  )
}
