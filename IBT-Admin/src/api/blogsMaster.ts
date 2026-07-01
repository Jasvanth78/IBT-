import { apiClient } from './apiClient'
import type { MasterApiResponse } from '../types/servicesMaster'
import type { BlogListResult, BlogMasterItem, BlogMasterPayload, BlogStatus } from '../types/blogsMaster'

const BASE_PATH = '/api/blogs/v1'

export async function getBlogsMasterItems(params: {
  page: number
  limit: number
  search?: string
  category?: string
  status?: BlogStatus
  featured?: boolean
}) {
  const response = await apiClient.get<MasterApiResponse<BlogMasterItem[]>>(BASE_PATH, {
    params,
  })

  return {
    items: response.data.data,
    meta: response.data.meta ?? {
      page: params.page,
      limit: params.limit,
      total: response.data.data.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  } satisfies BlogListResult
}

export async function createBlogsMasterItem(payload: BlogMasterPayload) {
  const response = await apiClient.post<MasterApiResponse<BlogMasterItem>>(BASE_PATH, payload)
  return response.data.data
}

export async function getBlogMasterItemById(itemId: string) {
  const response = await apiClient.get<MasterApiResponse<BlogMasterItem>>(`${BASE_PATH}/${itemId}`)
  return response.data.data
}

export async function updateBlogsMasterItem(itemId: string, payload: BlogMasterPayload) {
  const response = await apiClient.patch<MasterApiResponse<BlogMasterItem>>(`${BASE_PATH}/${itemId}`, payload)
  return response.data.data
}

export async function deleteBlogsMasterItem(itemId: string) {
  const response = await apiClient.delete<MasterApiResponse<{ success: true }>>(`${BASE_PATH}/${itemId}`)
  return response.data.data
}

export async function uploadBlogImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiClient.post<
    MasterApiResponse<{
      category: string
      filename: string
      originalName: string
      mimeType: string
      size: number
      relativeUrl: string
      absoluteUrl: string
    }>
  >('/api/uploads/v1/blogs', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data.data
}

export async function importBlogDocument(
  file: File,
  onUploadProgress?: (progressEvent: any) => void
) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiClient.post<
    MasterApiResponse<{
      success: boolean
      html: string
      warnings: string[]
    }>
  >(`${BASE_PATH}/import-document`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  })

  return response.data.data
}
