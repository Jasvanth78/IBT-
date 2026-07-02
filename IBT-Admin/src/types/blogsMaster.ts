export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export type BlogMasterItem = {
  id: string
  title: string
  slug: string
  content: string
  imageUrl: string | null
  status: BlogStatus
  featured: boolean
  category: string | null
  publishedAt: string | null
  quickTips?: string[]
  createdAt: string
  updatedAt: string
}

export type BlogMasterPayload = {
  title?: string
  slug?: string
  content?: string
  imageUrl?: string | null
  status?: BlogStatus
  featured?: boolean
  category?: string | null
  publishedAt?: string | null
  quickTips?: string[]
}

export type BlogListMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export type BlogListResult = {
  items: BlogMasterItem[]
  meta: BlogListMeta
}
