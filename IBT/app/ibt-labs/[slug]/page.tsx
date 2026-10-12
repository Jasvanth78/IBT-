import { notFound } from 'next/navigation'
import Link from 'next/link'
import { apiClient } from '@/src/api/client'
import { FiArrowLeft, FiExternalLink, FiGithub, FiLayers, FiCalendar } from 'react-icons/fi'

export const dynamic = 'force-dynamic';

type LabDetailPageProps = {
  params: Promise<{ slug: string }>
}

const resolveApiOrigin = (value: string | undefined) => {
  const fallback = 'http://localhost:5001'
  if (!value?.trim()) return fallback
  const withProtocol = /^https?:\/\//i.test(value.trim()) ? value.trim() : `http://${value.trim()}`
  try { return new URL(withProtocol).origin } catch { return fallback }
}

const resolveImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl?.trim()) return null
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl
  return `${resolveApiOrigin(process.env.NEXT_PUBLIC_API_URL)}${imageUrl}`
}

export default async function LabDetailPage({ params }: LabDetailPageProps) {
  const { slug } = await params
  const project = await apiClient.getProjectBySlug(slug).catch(() => null)

  if (!project) notFound()

  const imageSrc = resolveImageUrl(project.imageUrl)

  return (
    <div className="min-h-full bg-slate-50/50 pb-20">
      {/* Immersive Header */}
      <section className="relative h-[40vh] min-h-[400px] w-full overflow-hidden bg-slate-900 lg:h-[50vh]">
        {imageSrc ? (
          <img src={imageSrc} alt={project.title} className="h-full w-full object-cover opacity-60" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-800">
            <FiLayers className="text-9xl text-white/5" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <Link
            href="/ibt-labs"
            className="group mb-6 inline-flex items-center gap-2 text-sm font-bold text-white/70 transition-colors hover:text-white"
          >
            <FiArrowLeft className="transition-transform group-hover:-translate-x-1" /> Back to Labs
          </Link>
          <div className="flex flex-wrap items-center gap-3">

            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white/90 backdrop-blur-md">
              {project.status}
            </span>
          </div>
          <h1 className="mt-4 text-[36px] sm:text-[44px] lg:text-[54px] font-black leading-[1.15] text-white">
            {project.title}
          </h1>
        </div>
      </section>

      <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="rounded-[2.5rem] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] sm:p-12">
              <h2 className="text-2xl font-black text-slate-900">About the Project</h2>
              <div
                className="mt-6 text-lg leading-relaxed text-slate-600 prose prose-slate max-w-none [&_p]:mb-4 text-justify"
                dangerouslySetInnerHTML={{ __html: project.content || project.description }}
              />

              {project.gallery && project.gallery.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-black text-slate-900">Project Gallery</h3>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {project.gallery.map((img, idx) => (
                      <div key={idx} className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                        <img src={resolveImageUrl(img) || ''} alt={`Gallery ${idx}`} className="aspect-video w-full object-cover transition-transform hover:scale-105" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Links */}
            {(project.projectUrl || project.repoUrl) && (
              <section className="rounded-3xl bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
                <h3 className="text-lg font-black text-slate-900">Project Links</h3>
                <div className="mt-6 flex flex-col gap-3">
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 py-4 font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 hover:shadow-xl active:scale-[0.98]"
                    >
                      <FiExternalLink /> Live Preview
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
                    >
                      <FiGithub /> View Source
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Project Info .*/}
            <section className="rounded-3xl bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
              <h3 className="text-lg font-black text-slate-900">Technical Details</h3>

              <div className="mt-6 space-y-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tech Stack</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.techStack && project.techStack.length > 0 ? project.techStack.map(tech => (
                      <span key={tech} className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 uppercase">
                        {tech}
                      </span>
                    )) : <span className="text-sm text-slate-400 italic">Not specified</span>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <FiCalendar />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Published</p>
                    <p className="font-bold text-slate-700">
                      {project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        : 'Recently'}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
