import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FiAlertTriangle, FiArrowLeft, FiRefreshCw, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi'
import { ActionButton, Dropdown, Input, Loader, RichTextEditor, Toast } from '../../component'
import {
  createBlogsMasterItem,
  getBlogMasterItemById,
  updateBlogsMasterItem,
  uploadBlogImage,
} from '../../api/blogsMaster'
import type { BlogMasterItem, BlogMasterPayload, BlogStatus } from '../../types/blogsMaster'
import { ImageUploadField } from './components/ImageUploadField'

type ApiError = {
  message?: string
}

type ToastVariant = 'success' | 'error'

type FormValues = {
  title: string
  slug: string
  content: string
  imageUrl: string
  category: string
  status: BlogStatus
  featured: boolean
  publishedAt: string
  quickTips: string[]
}

const STATUS_FORM_OPTIONS = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Archived', value: 'ARCHIVED' },
]

const FEATURED_FORM_OPTIONS = [
  { label: 'No', value: 'false' },
  { label: 'Yes', value: 'true' },
]

const EMPTY_FORM: FormValues = {
  title: '',
  slug: '',
  content: '',
  imageUrl: '',
  category: '',
  status: 'DRAFT',
  featured: false,
  publishedAt: '',
  quickTips: [],
}

function getApiErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<ApiError>
  return axiosError.response?.data?.message ?? fallback
}

function toDateTimeLocalValue(value: string | null) {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

function toIsoValue(value: string) {
  if (!value.trim()) {
    return null
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString()
}

function isContentEmpty(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .trim().length === 0
}

function mapItemToForm(item: BlogMasterItem): FormValues {
  return {
    title: item.title,
    slug: item.slug,
    content: item.content,
    imageUrl: item.imageUrl ?? '',
    category: item.category ?? '',
    status: item.status,
    featured: item.featured,
    publishedAt: toDateTimeLocalValue(item.publishedAt),
    quickTips: item.quickTips ?? [],
  }
}

export function BlogFormPage() {
  const navigate = useNavigate()
  const { blogId } = useParams()
  const { state } = useLocation()
  const queryClient = useQueryClient()

  const isEditMode = Boolean(blogId)
  const draftKey = isEditMode ? `ibt_blog_draft_edit_${blogId}` : 'ibt_blog_draft_create'

  const [formValues, setFormValues] = useState<FormValues>(() => {
    if (state?.blog) {
      return mapItemToForm(state.blog as BlogMasterItem)
    }
    return EMPTY_FORM
  })

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [formError, setFormError] = useState('')

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastVariant, setToastVariant] = useState<ToastVariant>('success')

  const [draftToRestore, setDraftToRestore] = useState<{ formValues: FormValues; timestamp: number } | null>(null)

  const { data: fetchedBlog, isLoading: isFetchingBlog, isError: isFetchBlogError, error: fetchBlogError, refetch: refetchBlog } = useQuery({
    queryKey: ['master-blog', blogId],
    queryFn: () => getBlogMasterItemById(blogId!),
    enabled: isEditMode && !state?.blog,
  })

  useEffect(() => {
    if (fetchedBlog && !state?.blog) {
      setFormValues(mapItemToForm(fetchedBlog))
    }
  }, [fetchedBlog, state?.blog])

  // Check for draft on mount or when details finish loading
  useEffect(() => {
    if (isEditMode && isFetchingBlog) return

    const savedDraft = window.localStorage.getItem(draftKey)
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft) as { formValues: FormValues; timestamp: number }
        
        // Check if the draft is actually different from the current form values
        const hasDiff = Object.keys(EMPTY_FORM).some((k) => {
          const key = k as keyof FormValues
          return parsed.formValues[key] !== formValues[key]
        })

        if (hasDiff) {
          setDraftToRestore(parsed)
        }
      } catch (e) {
        console.warn('Failed to parse blog draft:', e)
      }
    }
  }, [isEditMode, isFetchingBlog, fetchedBlog, draftKey])

  // Auto-save draft as user edits form values
  useEffect(() => {
    if (isEditMode && isFetchingBlog) return
    if (draftToRestore) return

    const isFormEmpty = Object.keys(EMPTY_FORM).every((k) => {
      const key = k as keyof FormValues
      return formValues[key] === EMPTY_FORM[key]
    })
    
    const initialFormValues = fetchedBlog ? mapItemToForm(fetchedBlog) : EMPTY_FORM
    const isUnchanged = Object.keys(EMPTY_FORM).every((k) => {
      const key = k as keyof FormValues
      return formValues[key] === initialFormValues[key]
    })

    if (isFormEmpty || isUnchanged) {
      return
    }

    const draftData = {
      formValues,
      timestamp: Date.now(),
    }
    window.localStorage.setItem(draftKey, JSON.stringify(draftData))
  }, [formValues, isEditMode, isFetchingBlog, fetchedBlog, draftKey, draftToRestore])

  const handleRestoreDraft = () => {
    if (draftToRestore) {
      setFormValues(draftToRestore.formValues)
      setDraftToRestore(null)
    }
  }

  const handleDiscardDraft = () => {
    window.localStorage.removeItem(draftKey)
    setDraftToRestore(null)
  }

  const createMutation = useMutation({
    mutationFn: createBlogsMasterItem,
    onSuccess: () => {
      window.localStorage.removeItem(draftKey)
      queryClient.invalidateQueries({ queryKey: ['master-blogs'] })
      navigate('/admin/master/blogs', {
        state: { toastMessage: 'Blog created successfully.', toastVariant: 'success' },
      })
    },
    onError: (err) => {
      setToastVariant('error')
      setToastMessage(getApiErrorMessage(err, 'Failed to create blog.'))
      setToastOpen(true)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ itemId, payload }: { itemId: string; payload: Parameters<typeof updateBlogsMasterItem>[1] }) =>
      updateBlogsMasterItem(itemId, payload),
    onSuccess: () => {
      window.localStorage.removeItem(draftKey)
      queryClient.invalidateQueries({ queryKey: ['master-blogs'] })
      queryClient.invalidateQueries({ queryKey: ['master-blog', blogId] })
      navigate('/admin/master/blogs', {
        state: { toastMessage: 'Blog updated successfully.', toastVariant: 'success' },
      })
    },
    onError: (err) => {
      setToastVariant('error')
      setToastMessage(getApiErrorMessage(err, 'Failed to update blog.'))
      setToastOpen(true)
    },
  })

  const uploadImageMutation = useMutation({
    mutationFn: uploadBlogImage,
  })

  const setFieldValue = (key: keyof FormValues, value: string | boolean) => {
    setFormValues((previous) => ({
      ...previous,
      [key]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formValues.title.trim()) {
      setFormError('Title is required.')
      return
    }

    if (!formValues.slug.trim()) {
      setFormError('Slug is required.')
      return
    }

    if (isContentEmpty(formValues.content)) {
      setFormError('Content is required.')
      return
    }

    const save = async () => {
      let imageUrl = formValues.imageUrl.trim()

      if (selectedImageFile) {
        const uploaded = await uploadImageMutation.mutateAsync(selectedImageFile)
        imageUrl = uploaded.relativeUrl || uploaded.absoluteUrl
      }

      const payload: BlogMasterPayload = {
        title: formValues.title.trim(),
        slug: formValues.slug.trim(),
        content: formValues.content,
        imageUrl: imageUrl || null,
        category: formValues.category.trim() || null,
        status: formValues.status,
        featured: formValues.featured,
        publishedAt: toIsoValue(formValues.publishedAt),
        quickTips: (formValues.quickTips || []).map((t) => t.trim()).filter(Boolean),
      }

      if (!isEditMode) {
        createMutation.mutate(payload)
      } else if (blogId) {
        updateMutation.mutate({
          itemId: blogId,
          payload,
        })
      }
    }

    setFormError('')
    save().catch((err) => {
      setToastVariant('error')
      setToastMessage(getApiErrorMessage(err, 'Failed to save blog.'))
      setToastOpen(true)
    })
  }

  if (isFetchingBlog) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="flex items-center gap-3 rounded-[var(--ui-radius-lg)] border border-[var(--ui-border)] bg-white px-6 py-5 shadow-[var(--ui-shadow-md)]">
          <Loader size="lg" label="Loading blog details" />
          <p className="text-sm font-semibold text-[var(--ui-muted)]">Loading blog details...</p>
        </div>
      </div>
    )
  }

  if (isFetchBlogError) {
    return (
      <div className="grid flex-1 place-items-center p-4">
        <div className="w-full max-w-xl rounded-[var(--ui-radius-lg)] border border-red-200 bg-red-50 p-8 text-center shadow-[var(--ui-shadow-md)]">
          <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-red-100 text-red-600">
            <FiAlertTriangle />
          </div>
          <p className="text-base font-semibold text-red-800">Could not load blog</p>
          <p className="mt-1 text-sm text-red-700">{getApiErrorMessage(fetchBlogError, 'Unable to load blog details.')}</p>
          <div className="mt-5 flex justify-center gap-3">
            <ActionButton intent="ghost" onClick={() => navigate('/admin/master/blogs')} leftIcon={<FiArrowLeft />}>
              Back to Blogs
            </ActionButton>
            <ActionButton intent="secondary" onClick={() => refetchBlog()} leftIcon={<FiRefreshCw />}>
              Retry
            </ActionButton>
          </div>
        </div>
      </div>
    )
  }

  const isSaving = createMutation.isPending || updateMutation.isPending || uploadImageMutation.isPending

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] w-full flex-col">
      <Toast
        open={toastOpen}
        message={toastMessage}
        variant={toastVariant}
        title={toastVariant === 'success' ? 'Success' : 'Error'}
        onClose={() => setToastOpen(false)}
      />

      <div className="sticky top-[4.5rem] z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--ui-border)] bg-white px-4 py-3 shadow-[var(--ui-shadow-sm)] md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/master/blogs')}
            className="rounded-md cursor-pointer p-1.5 text-[var(--ui-muted)] transition-colors hover:bg-[var(--ui-surface-muted)] hover:text-[var(--ui-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ui-primary)]/40"
            aria-label="Back to blogs"
            title="Back to blogs"
          >
            <FiArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-bold text-[var(--ui-text)]">
            {isEditMode ? 'Edit Blog' : 'Create Blog'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex h-full flex-1 flex-col">
        {draftToRestore && (
          <div className="mx-4 mt-4 flex flex-col gap-3 rounded-[var(--ui-radius-lg)] border border-amber-200 bg-amber-50 p-4 shadow-[var(--ui-shadow-sm)] sm:flex-row sm:items-center sm:justify-between md:mx-6">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-600">
                <FiAlertTriangle size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800">Unsaved draft found</p>
                <p className="text-xs text-amber-700 font-medium">
                  We found a newer unsaved draft from {new Date(draftToRestore.timestamp).toLocaleString()}.
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0 justify-end">
              <button
                type="button"
                onClick={handleRestoreDraft}
                className="rounded-md bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition"
              >
                Restore Draft
              </button>
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="rounded-md border border-amber-300 bg-white px-3.5 py-1.5 text-xs font-bold text-amber-700 shadow-sm hover:bg-amber-50 transition"
              >
                Discard
              </button>
            </div>
          </div>
        )}
        <div className="mx-auto w-full flex-1">
          <div className="space-y-6">
            <div className="bg-white p-5 shadow-sm sm:p-6">
              <div className="grid gap-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Input
                    label="Title"
                    placeholder="How We Built a Scalable OCR Pipeline"
                    value={formValues.title}
                    onChange={(event) => setFieldValue('title', event.target.value)}
                    helperText="Title of the blog"
                  />

                  <Input
                    label="Slug"
                    placeholder="how-we-built-scalable-ocr-pipeline"
                    value={formValues.slug}
                    onChange={(event) => setFieldValue('slug', event.target.value)}
                    helperText="Use lowercase letters, numbers, and hyphens"
                  />
                </div>
                <RichTextEditor
                  label="Content"
                  value={formValues.content}
                  onChange={(nextValue) => setFieldValue('content', nextValue)}
                  placeholder="Write the full blog post here..."
                  helperText="Supports headings, bold/italic/underline, lists, quotes, code blocks, links, separators, and undo/redo."
                  minHeight={400}
                  showImportButton={true}
                />

                <div className=''>
                  <ImageUploadField
                    label="Cover Image"
                    selectedFile={selectedImageFile}
                    existingImageUrl={formValues.imageUrl}
                    previewAlt="Blog cover preview"
                    helperText="Optional image for blog listing/details"
                    onRemove={() => {
                      setSelectedImageFile(null)
                      setFieldValue('imageUrl', '')
                    }}
                    onFileChange={setSelectedImageFile}
                  />

                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Input
                    label="Category"
                    placeholder="engineering"
                    value={formValues.category}
                    onChange={(event) => setFieldValue('category', event.target.value)}
                  />

                  <Input
                    label="Published At"
                    type="datetime-local"
                    value={formValues.publishedAt}
                    onChange={(event) => setFieldValue('publishedAt', event.target.value)}
                  />
                </div>

                {/* Quick Tips Section */}
                <div className="rounded-xl border border-[var(--ui-border)] p-5 bg-[var(--ui-surface-muted)]/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="grid gap-0.5">
                      <span className="text-sm font-semibold text-[var(--ui-text)]">Quick Tips (Manual)</span>
                      <span className="text-xs text-[var(--ui-muted)]">These tips are displayed on the right sidebar of the blog details page.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormValues((prev) => ({
                          ...prev,
                          quickTips: [...(prev.quickTips || []), ''],
                        }))
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#e63946] bg-white px-3 py-1.5 text-xs font-bold text-[#e63946] shadow-sm hover:bg-red-50 transition-colors"
                    >
                      <FiPlus size={14} /> Add Tip
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(formValues.quickTips || []).map((tip, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <Input
                            placeholder={`Tip ${index + 1}`}
                            value={tip}
                            onChange={(e) => {
                              const updated = [...(formValues.quickTips || [])]
                              updated[index] = e.target.value
                              setFormValues((prev) => ({
                                ...prev,
                                quickTips: updated,
                              }))
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (formValues.quickTips || []).filter((_, i) => i !== index)
                            setFormValues((prev) => ({
                              ...prev,
                              quickTips: updated,
                            }))
                          }}
                          className="mt-1.5 p-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                          title="Remove Tip"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    ))}

                    {(formValues.quickTips || []).length === 0 && (
                      <p className="text-xs text-[var(--ui-muted)] italic">No quick tips added yet. Click "Add Tip" to add one.</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <span className="text-sm font-semibold text-[var(--ui-text)]">Status</span>
                    <Dropdown
                      options={STATUS_FORM_OPTIONS}
                      value={formValues.status}
                      onChange={(value) => setFieldValue('status', value as BlogStatus)}
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <span className="text-sm font-semibold text-[var(--ui-text)]">Featured</span>
                    <Dropdown
                      options={FEATURED_FORM_OPTIONS}
                      value={formValues.featured ? 'true' : 'false'}
                      onChange={(value) => setFieldValue('featured', value === 'true')}
                    />
                  </div>
                </div>

                {formError ? <p className="text-sm font-medium text-[var(--ui-danger)]">{formError}</p> : null}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-10 border-t border-[var(--ui-border)] bg-white/95 px-4 py-3 backdrop-blur-sm">
          <div className="mx-auto flex w-full flex-wrap items-center justify-end gap-3 px-2">
            <ActionButton
              type="button"
              intent="ghost"
              onClick={() => navigate('/admin/master/blogs')}
              disabled={isSaving}
            >
              Cancel
            </ActionButton>

            <ActionButton
              type="submit"
              intent="primary"
              loading={isSaving}
              leftIcon={<FiSave />}
              disabled={isSaving}
            >
              {isEditMode ? 'Save Changes' : 'Create Blog'}
            </ActionButton>
          </div>
        </div>
      </form>
    </div>
  )
}
