type PublicResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
};

export type PaginationMeta = {
  page?: number;
  limit?: number;
  totalPages?: number;
  totalItems?: number;
};

export type PaginatedResult<T> = {
  items: T[];
  meta: PaginationMeta;
};

export type PublicStat = {
  id: string;
  label: string;
  value: string;
  category?: string | null;
  order?: number;
};

export type PublicService = {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string | null;
  tags?: string[];
};

export type PublicContact = {
  id: string;
  type: 'PHONE' | 'EMAIL' | 'ADDRESS';
  value: string;
  order?: number;
};

const normalizeApiBaseUrl = (value: string | undefined) => {
  const fallback = 'http://localhost:5001';

  if (!value?.trim()) {
    return fallback;
  }

  const trimmed = value.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    return parsed.origin;
  } catch {
    return fallback;
  }
};

const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

const buildUrl = (
  path: string,
  params?: Record<string, string | number | undefined>,
  apiPrefix = '/api/public/v1',
) => {
  const url = new URL(`${apiPrefix}${path}`, API_BASE_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }

      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
};

async function fetchPublicData<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  // Deprecated: Use apiClient from @/src/api/client instead
  // This is kept for backward compatibility only
  const { apiClient } = await import('./client');
  
  if (path === '/stats') {
    const result = await apiClient.getStats(params?.page as number, params?.limit as number);
    return result.items as T;
  }
  if (path === '/services') {
    const result = await apiClient.getServices(params?.page as number, params?.limit as number);
    return result.items as T;
  }
  
  throw new Error(`Unsupported path: ${path}`);
}

async function fetchPublicPaginatedData<T>(
  path: string,
  params: Record<string, string | number | undefined>,
): Promise<PaginatedResult<T>> {
  // Deprecated: Use apiClient from @/src/api/client instead
  // This is kept for backward compatibility only
  const { apiClient } = await import('./client');
  
  if (path === '/stats') {
    return apiClient.getStats(params?.page as number, params?.limit as number) as Promise<PaginatedResult<T>>;
  }
  if (path === '/services') {
    return apiClient.getServices(params?.page as number, params?.limit as number) as Promise<PaginatedResult<T>>;
  }
  
  throw new Error(`Unsupported path: ${path}`);
}

export async function fetchPublicStatsPage(page = 1, limit = 4): Promise<PaginatedResult<PublicStat>> {
  return fetchPublicPaginatedData<PublicStat>('/stats', { page, limit });
}

export async function fetchPublicServicesPage(page = 1, limit = 6): Promise<PaginatedResult<PublicService>> {
  return fetchPublicPaginatedData<PublicService>('/services', { page, limit });
}

export async function fetchPublicContactsPage(page = 1, limit = 12): Promise<PaginatedResult<PublicContact>> {
  // Deprecated: Use apiClient from @/src/api/client instead
  // This is kept for backward compatibility only
  const { apiClient } = await import('./client');
  return apiClient.getContacts(page, limit);
}
