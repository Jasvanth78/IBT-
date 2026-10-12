import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FiRefreshCw, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi'
import { getSettings, saveSettings, uploadServicesImage } from '../../../../api/settings'
import { ActionButton, Input, Loader, Toast, RichTextEditor } from '../../../../component'
import { ImageUploadField } from '../../components/ImageUploadField'
import { useSocketSettings } from '../../../../providers/SocketSettingsProvider'
import { SETTINGS_KEYS, type SettingEntity, type SettingsFormValues } from '../../../../types/settings'

type ApiError = { message?: string }

const SETTINGS_QUERY_KEY = ['settings']

const DEFAULT_VALUES: any = {
  productsHeroTitle: 'Turning Ideas Into',
  productsHeroHighlight: 'Real Digital',
  productsHeroDescription: 'We build scalable web applications, mobile apps, AI solutions and enterprise software that solve real business problems and create real impact.',
  productsHeroImageUrl: '',
  productsHeroProjectsDelivered: '250+',
  productsHeroClientSatisfaction: '98%',
  productsMicroAppsTitle: 'Solve Real Business Problems',
  productsMicroAppsSubtitle: 'MICRO APPS THAT',
  productsMicroAppsLeftIntro: 'I-BacusTech helps businesses solve their everyday challenges by building small, focused applications called Micro-Apps.',
  productsMicroAppsLeftHeading: 'What is a Micro-App?',
  productsMicroAppsLeftText: 'A Micro-App is an application designed to solve one specific business problem.\n\nFor example, customers may make a payment but never receive a proper receipt. Instead of investing in a large billing system, a single Micro-App can generate a receipt instantly and send it via email or WhatsApp.',
  productsMicroAppsLeftBullets: [
    'Focused on solving one problem at a time',
    'Cost effective to build than purchasing large applications with features you may never use',
    'Quick to deploy, develop, and display',
    'Available as either a ready product or cloud-based service, depending on your needs.'
  ],
  productsMicroAppsRightTextTop: 'At I-BacusTech, we build technology solutions that solve real business problems.\n\nWe help startups, small and medium-sized businesses, and enterprise transform ideas into practical digital solutions. From custom web and mobile applications to powerful platforms, AI systems, and business automation, we develop software that simplifies operations, improves efficiency, and supports business growth.\n\nWith over 10+ years of industry experience and a team of 50+ passionate professionals, we turn ideas into scalable, reliable, and future-ready software solutions.\n\nOur approach combines technical expertise with a strong understanding of business processes to deliver applications that are practical, impactful, and built to grow with you.\n\nWe at I-BacusTech believe in understanding each client\'s business before writing a single line of code. By working closely with our clients, analyzing workflows, and identifying challenges, we create solutions that deliver measurable results.\n\nWhether you need a custom enterprise application, an AI-driven solution, a cloud platform, a business intelligence dashboard, or a progressive web app — we\'re here to help you innovate, scale, and stay ahead in today\'s fast-moving business world.',
  productsMicroAppsRightHeading: 'Why Business Choose I-BacusTech:',
  productsMicroAppsRightBullets: [
    '10+ years of technology and digital transformation experience',
    'Custom solutions tailored to your business',
    'Expertise in AI, Web, Mobile, ERP, Cloud, and Data Analytics',
    'Agile development with transparent communication',
    'Secure, scalable, and future-ready applications',
    'Dedicated support beyond project delivery'
  ],
  productsMicroAppsRightTextBottom: 'Our mission is simple: to empower businesses with innovative technology solutions that improve productivity, create customer success, and enable sustainable growth.',
}

function settingsToForm(settings: SettingEntity[]): any {
  const map = new Map(settings.map((item) => [item.key, item.value]))

  const readString = (key: keyof typeof SETTINGS_KEYS, fallback: string) => {
    const value = map.get(SETTINGS_KEYS[key])
    return typeof value === 'string' ? value : fallback
  }

  const readJson = (key: keyof typeof SETTINGS_KEYS, fallback: any) => {
    const val = map.get(SETTINGS_KEYS[key])
    if (Array.isArray(val)) {
      return val.length > 0 ? val : fallback
    }
    if (typeof val === 'string' && val.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(val)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch { }
    }
    return fallback
  }

  return {
    productsHeroTitle: readString('PRODUCTS_HERO_TITLE', DEFAULT_VALUES.productsHeroTitle),
    productsHeroHighlight: readString('PRODUCTS_HERO_HIGHLIGHT', DEFAULT_VALUES.productsHeroHighlight),
    productsHeroDescription: readString('PRODUCTS_HERO_DESCRIPTION', DEFAULT_VALUES.productsHeroDescription),
    productsHeroImageUrl: readString('PRODUCTS_HERO_IMAGE_URL', DEFAULT_VALUES.productsHeroImageUrl),
    productsHeroProjectsDelivered: readString('PRODUCTS_HERO_PROJECTS_DELIVERED', DEFAULT_VALUES.productsHeroProjectsDelivered),
    productsHeroClientSatisfaction: readString('PRODUCTS_HERO_CLIENT_SATISFACTION', DEFAULT_VALUES.productsHeroClientSatisfaction),
    productsMicroAppsTitle: readString('PRODUCTS_MICRO_APPS_TITLE', DEFAULT_VALUES.productsMicroAppsTitle),
    productsMicroAppsSubtitle: readString('PRODUCTS_MICRO_APPS_SUBTITLE', DEFAULT_VALUES.productsMicroAppsSubtitle),
    productsMicroAppsLeftIntro: readString('PRODUCTS_MICRO_APPS_LEFT_INTRO', DEFAULT_VALUES.productsMicroAppsLeftIntro),
    productsMicroAppsLeftHeading: readString('PRODUCTS_MICRO_APPS_LEFT_HEADING', DEFAULT_VALUES.productsMicroAppsLeftHeading),
    productsMicroAppsLeftText: readString('PRODUCTS_MICRO_APPS_LEFT_TEXT', DEFAULT_VALUES.productsMicroAppsLeftText),
    productsMicroAppsLeftBullets: readJson('PRODUCTS_MICRO_APPS_LEFT_BULLETS', DEFAULT_VALUES.productsMicroAppsLeftBullets),
    productsMicroAppsRightTextTop: readString('PRODUCTS_MICRO_APPS_RIGHT_TEXT_TOP', DEFAULT_VALUES.productsMicroAppsRightTextTop),
    productsMicroAppsRightHeading: readString('PRODUCTS_MICRO_APPS_RIGHT_HEADING', DEFAULT_VALUES.productsMicroAppsRightHeading),
    productsMicroAppsRightBullets: readJson('PRODUCTS_MICRO_APPS_RIGHT_BULLETS', DEFAULT_VALUES.productsMicroAppsRightBullets),
    productsMicroAppsRightTextBottom: readString('PRODUCTS_MICRO_APPS_RIGHT_TEXT_BOTTOM', DEFAULT_VALUES.productsMicroAppsRightTextBottom),
  }
}

export function ProductsContentMasterPage() {
  const queryClient = useQueryClient()
  const { connection } = useSocketSettings()
  const [values, setValues] = useState<SettingsFormValues>(DEFAULT_VALUES)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success')
  const [activeTab, setActiveTab] = useState<'hero' | 'microapps'>('hero')
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const lastRealtimeUpdateRef = useRef<string | null>(null)

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: getSettings,
  })

  useEffect(() => {
    if (!data) return
    setValues(settingsToForm(data))
  }, [data])

  useEffect(() => {
    if (!connection.lastUpdateAt || lastRealtimeUpdateRef.current === connection.lastUpdateAt) return
    lastRealtimeUpdateRef.current = connection.lastUpdateAt
    void queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY })
  }, [connection.lastUpdateAt, queryClient])

  const mutation = useMutation({
    mutationFn: (formValues: SettingsFormValues) =>
      saveSettings({
        values: formValues,
        currentSettings: data ?? [],
      }),
    onSuccess: () => {
      setToastVariant('success')
      setToastMessage('Products content updated successfully.')
      setToastOpen(true)
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY })
    },
    onError: (err) => {
      const axiosError = err as AxiosError<ApiError>
      setToastVariant('error')
      setToastMessage(axiosError.response?.data?.message ?? 'Failed to update content.')
      setToastOpen(true)
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate(values)
  }

  const handleReset = () => {
    if (data) setValues(settingsToForm(data))
  }

  const setValue = <K extends keyof SettingsFormValues>(key: K, value: SettingsFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleImageChange = async (field: string, file: File | null) => {
    if (!file) {
      setValue(field as keyof SettingsFormValues, '' as any)
      return
    }

    try {
      setUploadingField(field)
      const uploaded = await uploadServicesImage(file)
      setValue(field as keyof SettingsFormValues, uploaded.absoluteUrl as any)
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>
      setToastVariant('error')
      setToastMessage(axiosError.response?.data?.message ?? 'Failed to upload image.')
      setToastOpen(true)
    } finally {
      setUploadingField(null)
    }
  }

  const handleAddBullet = (field: 'productsMicroAppsLeftBullets' | 'productsMicroAppsRightBullets') => {
    const list = [...(values[field] as string[])]
    list.push('')
    setValue(field, list as any)
  }

  const handleRemoveBullet = (field: 'productsMicroAppsLeftBullets' | 'productsMicroAppsRightBullets', index: number) => {
    const list = [...(values[field] as string[])]
    list.splice(index, 1)
    setValue(field, list as any)
  }

  const handleUpdateBullet = (field: 'productsMicroAppsLeftBullets' | 'productsMicroAppsRightBullets', index: number, val: string) => {
    const list = [...(values[field] as string[])]
    list[index] = val
    setValue(field, list as any)
  }

  if (isPending) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center p-8">
        <Loader size="lg" label="Loading content..." />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] p-8 gap-4">
        <div className="text-red-500 font-medium">Failed to load content.</div>
        <ActionButton intent="secondary" onClick={() => refetch()}>Retry</ActionButton>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] w-full flex-col">
      <Toast
        open={toastOpen}
        message={toastMessage}
        variant={toastVariant}
        title={toastVariant === 'success' ? 'Success' : 'Error'}
        onClose={() => setToastOpen(false)}
      />

      {/* Header Tabs */}
      <div className="sticky top-[4.5rem] z-20 border-b border-[var(--ui-border)] bg-white/95 px-4 pt-4 backdrop-blur-sm lg:px-6">
        <div className="flex flex-wrap items-center gap-6">
          <button
            type="button"
            className={`border-b-2 pb-3 text-sm font-semibold transition-colors ${
              activeTab === 'hero' ? 'border-[var(--ui-primary)] text-[var(--ui-primary)]' : 'border-transparent text-[var(--ui-muted)] hover:text-[var(--ui-text)]'
            }`}
            onClick={() => setActiveTab('hero')}
          >
            Hero Section
          </button>
          <button
            type="button"
            className={`border-b-2 pb-3 text-sm font-semibold transition-colors ${
              activeTab === 'microapps' ? 'border-[var(--ui-primary)] text-[var(--ui-primary)]' : 'border-transparent text-[var(--ui-muted)] hover:text-[var(--ui-text)]'
            }`}
            onClick={() => setActiveTab('microapps')}
          >
            Micro Apps Section
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex h-full flex-1 flex-col">
        <div className="mx-auto w-full max-w-6xl flex-1 p-4 lg:p-6">
          
          {/* HERO TAB */}
          {activeTab === 'hero' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="rounded-[var(--ui-radius-lg)] border border-[var(--ui-border)] bg-white shadow-sm overflow-hidden">
                <div className="border-b border-[var(--ui-border)] bg-[var(--ui-surface-muted)] px-5 py-4">
                  <h3 className="text-lg font-bold text-[var(--ui-text)]">Hero Section</h3>
                  <p className="text-sm text-[var(--ui-muted)] mt-1">Configure the main top section of the products page.</p>
                </div>
                <div className="p-5 space-y-6">
                  <Input
                    label="Hero Title"
                    value={values.productsHeroTitle}
                    onChange={(e) => setValue('productsHeroTitle', e.target.value)}
                    placeholder="Turning Ideas Into"
                  />
                  <Input
                    label="Hero Highlight (Red Text)"
                    value={values.productsHeroHighlight}
                    onChange={(e) => setValue('productsHeroHighlight', e.target.value)}
                    placeholder="Real Digital"
                  />
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-[var(--ui-text)]">Hero Description</label>
                    <textarea
                      value={values.productsHeroDescription}
                      onChange={(e) => setValue('productsHeroDescription', e.target.value)}
                      className="w-full h-24 rounded-[var(--ui-radius)] border border-[var(--ui-border)] p-3 text-sm focus:border-[var(--ui-primary)] focus:outline-none"
                    />
                  </div>
                  {uploadingField === 'productsHeroImageUrl' ? (
                    <div className="flex h-52 w-full items-center justify-center rounded-xl border border-dashed border-[var(--ui-border)] bg-slate-50/50">
                      <Loader size="md" label="Uploading hero image..." />
                    </div>
                  ) : (
                    <ImageUploadField
                      label="Hero Image URL (Optional)"
                      selectedFile={null}
                      existingImageUrl={values.productsHeroImageUrl}
                      previewAlt="Hero Image"
                      helperText="Upload an image to display in the hero section."
                      onFileChange={(file) => handleImageChange('productsHeroImageUrl', file)}
                      onRemove={() => handleImageChange('productsHeroImageUrl', null)}
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Projects Delivered Metric"
                      value={values.productsHeroProjectsDelivered}
                      onChange={(e) => setValue('productsHeroProjectsDelivered', e.target.value)}
                      placeholder="250+"
                    />
                    <Input
                      label="Client Satisfaction Metric"
                      value={values.productsHeroClientSatisfaction}
                      onChange={(e) => setValue('productsHeroClientSatisfaction', e.target.value)}
                      placeholder="98%"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MICRO APPS TAB */}
          {activeTab === 'microapps' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="rounded-[var(--ui-radius-lg)] border border-[var(--ui-border)] bg-white shadow-sm overflow-hidden">
                <div className="border-b border-[var(--ui-border)] bg-[var(--ui-surface-muted)] px-5 py-4">
                  <h3 className="text-lg font-bold text-[var(--ui-text)]">Micro Apps Section - General</h3>
                </div>
                <div className="p-5 space-y-6">
                  <Input
                    label="Subtitle (Red Badge)"
                    value={values.productsMicroAppsSubtitle}
                    onChange={(e) => setValue('productsMicroAppsSubtitle', e.target.value)}
                  />
                  <Input
                    label="Main Title"
                    value={values.productsMicroAppsTitle}
                    onChange={(e) => setValue('productsMicroAppsTitle', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LEFT COLUMN */}
                <div className="rounded-[var(--ui-radius-lg)] border border-[var(--ui-border)] bg-white shadow-sm overflow-hidden">
                  <div className="border-b border-[var(--ui-border)] bg-[var(--ui-surface-muted)] px-5 py-4">
                    <h3 className="text-lg font-bold text-[var(--ui-text)]">Left Column</h3>
                  </div>
                  <div className="p-5 space-y-6">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-[var(--ui-text)]">Intro Text (Red I-BacusTech)</label>
                      <textarea
                        value={values.productsMicroAppsLeftIntro}
                        onChange={(e) => setValue('productsMicroAppsLeftIntro', e.target.value)}
                        className="w-full h-20 rounded-[var(--ui-radius)] border border-[var(--ui-border)] p-3 text-sm focus:border-[var(--ui-primary)] focus:outline-none"
                      />
                    </div>
                    
                    <Input
                      label="Heading (What is a Micro-App?)"
                      value={values.productsMicroAppsLeftHeading}
                      onChange={(e) => setValue('productsMicroAppsLeftHeading', e.target.value)}
                    />

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-[var(--ui-text)]">Main Text (Below Heading)</label>
                      <RichTextEditor
                        value={values.productsMicroAppsLeftText || ''}
                        onChange={(val) => setValue('productsMicroAppsLeftText', val)}
                        placeholder="Write your content here..."
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="block text-sm font-medium text-[var(--ui-text)]">Checkmark Bullet Points</label>
                      {(values.productsMicroAppsLeftBullets as string[])?.map((pt, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <textarea
                            className="flex-1 rounded border border-[var(--ui-border)] p-2 text-sm h-16"
                            value={pt}
                            onChange={(e) => handleUpdateBullet('productsMicroAppsLeftBullets', index, e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveBullet('productsMicroAppsLeftBullets', index)}
                            className="mt-1 p-2 text-red-500 hover:bg-red-50 rounded"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <ActionButton
                        type="button"
                        intent="secondary"
                        size="sm"
                        onClick={() => handleAddBullet('productsMicroAppsLeftBullets')}
                        leftIcon={<FiPlus />}
                      >
                        Add Bullet Point
                      </ActionButton>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="rounded-[var(--ui-radius-lg)] border border-[var(--ui-border)] bg-white shadow-sm overflow-hidden">
                  <div className="border-b border-[var(--ui-border)] bg-[var(--ui-surface-muted)] px-5 py-4">
                    <h3 className="text-lg font-bold text-[var(--ui-text)]">Right Column</h3>
                  </div>
                  <div className="p-5 space-y-6">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-[var(--ui-text)]">Top Paragraphs</label>
                      <RichTextEditor
                        value={values.productsMicroAppsRightTextTop || ''}
                        onChange={(val) => setValue('productsMicroAppsRightTextTop', val)}
                        placeholder="Write your content here..."
                      />
                    </div>
                    
                    <Input
                      label="Heading (Why Business Choose I-BacusTech:)"
                      value={values.productsMicroAppsRightHeading}
                      onChange={(e) => setValue('productsMicroAppsRightHeading', e.target.value)}
                    />

                    <div className="space-y-3 pt-2">
                      <label className="block text-sm font-medium text-[var(--ui-text)]">Dot Bullet Points</label>
                      {(values.productsMicroAppsRightBullets as string[])?.map((pt, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            className="flex-1 rounded border border-[var(--ui-border)] p-2 text-sm"
                            value={pt}
                            onChange={(e) => handleUpdateBullet('productsMicroAppsRightBullets', index, e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveBullet('productsMicroAppsRightBullets', index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <ActionButton
                        type="button"
                        intent="secondary"
                        size="sm"
                        onClick={() => handleAddBullet('productsMicroAppsRightBullets')}
                        leftIcon={<FiPlus />}
                      >
                        Add Bullet Point
                      </ActionButton>
                    </div>

                    <div className="space-y-1.5 pt-4">
                      <label className="block text-sm font-medium text-[var(--ui-text)]">Bottom Footer Text</label>
                      <textarea
                        value={values.productsMicroAppsRightTextBottom}
                        onChange={(e) => setValue('productsMicroAppsRightTextBottom', e.target.value)}
                        className="w-full h-20 rounded-[var(--ui-radius)] border border-[var(--ui-border)] p-3 text-sm focus:border-[var(--ui-primary)] focus:outline-none"
                      />
                    </div>

                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 z-30 border-t border-[var(--ui-border)] bg-white/95 px-4 py-3 backdrop-blur-sm lg:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-end gap-3">
            <ActionButton
              type="button"
              intent="ghost"
              onClick={handleReset}
              disabled={mutation.isPending}
              leftIcon={<FiRefreshCw />}
            >
              Reset Changes
            </ActionButton>

            <ActionButton
              type="submit"
              intent="primary"
              loading={mutation.isPending}
              leftIcon={<FiSave />}
              disabled={mutation.isPending}
            >
              Save Content
            </ActionButton>
          </div>
        </div>
      </form>
    </div>
  )
}
