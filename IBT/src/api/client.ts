import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

type ApiResponse<T> = {
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
  total?: number;
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
  projectUrl?: string | null;
  tags?: string[];
};

export type PublicLabProject = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string | null;
  imageUrl?: string | null;
  gallery?: string[];
  tags?: string[];
  techStack?: string[];
  projectUrl?: string | null;
  repoUrl?: string | null;
  status?: 'ONGOING' | 'COMPLETED' | 'ARCHIVED';
  featured?: boolean;
  order?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export type PublicContact = {
  id: string;
  type: 'PHONE' | 'EMAIL' | 'ADDRESS';
  value: string;
  order?: number;
};

export type PublicPartner = {
  id: string;
  name: string;
  logoUrl?: string | null;
  website?: string | null;
  order?: number;
};

export type PublicPartnerCollege = {
  id: string;
  name: string;
  logoUrl?: string | null;
  website?: string | null;
  order?: number;
};

export type PublicClient = {
  id: string;
  name: string;
  logoUrl?: string | null;
  website?: string | null;
  order?: number;
};

export type PublicTestimonial = {
  id: string;
  name: string;
  content: string;
  role?: string | null;
  company?: string | null;
  avatarUrl?: string | null;
  order?: number;
};

export type PublicSocialLink = {
  id: string;
  platform: string;
  url: string;
  logoUrl?: string | null;
  order?: number | null;
};

export type PublicBlog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  description?: string | null;
  imageUrl?: string | null;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured?: boolean;
  category?: string | null;
  publishedAt?: string | null;
  quickTips?: string[];
};

export type PublicBranch = {
  id: string;
  name: string;
  location?: string | null;
  address?: string | null;
  mapUrl?: string | null;
  type?: string | null;
  order?: number | null;
  _count?: {
    teamMembers?: number;
  };
};

export type PublicTeamBranch = {
  order?: number;
  branch: {
    id: string;
    name: string;
    location?: string | null;
    type?: string | null;
  };
};

export type PublicMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  linkedinUrl?: string | null;
  avatarUrl?: string | null;
  branches?: PublicTeamBranch[];
};

/**
 * Centralized API Client using Axios with Interceptors
 * Handles both public and CMS endpoints with a clean, organized interface
 */
class ApiClient {
  private axiosInstance: AxiosInstance;
  private baseUrl: string;
  private publicPrefix = '/api/public/v1';
  private cmsPrefix = '/api';

  constructor() {
    this.baseUrl = this.normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL);
    this.axiosInstance = this.createAxiosInstance();
  }

  private normalizeBaseUrl(value: string | undefined): string {
    const fallback = 'http://localhost:5000';

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
  }

  private createAxiosInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request Interceptor
    instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add any auth tokens or custom headers here if needed
        // Example: config.headers.Authorization = `Bearer ${token}`;
        console.log('[API Request]', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('[API Response]', response.status, response.config.url);
        return response;
      },
      (error) => {
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          console.warn('[API Timeout]', error.config.url);
          error.message = 'The server is taking too long to respond. Please try again.';
        } else {
          console.warn('[API Response Error]', error.response?.status, error.message);
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }

  private buildUrl(path: string, prefix: string): string {
    return `${prefix}${path}`;
  }

  private async request<T>(
    path: string,
    prefix: string,
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    const url = this.buildUrl(path, prefix);

    try {
      const response = await this.axiosInstance.get<ApiResponse<T>>(url, {
        params: params ? Object.fromEntries(
          Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
        ) : undefined,
      });

      return (response.data as ApiResponse<T>)?.data ?? (response.data as T);
    } catch (error) {
      throw error;
    }
  }

  private async requestPaginated<T>(
    path: string,
    prefix: string,
    params?: Record<string, string | number | undefined>
  ): Promise<PaginatedResult<T>> {
    const url = this.buildUrl(path, prefix);

    try {
      const response = await this.axiosInstance.get<ApiResponse<T[]>>(url, {
        params: params ? Object.fromEntries(
          Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
        ) : undefined,
      });

      return {
        items: (response.data as ApiResponse<T[]>)?.data ?? [],
        meta: {
          ...((response.data as ApiResponse<T[]>)?.meta ?? {}),
          totalItems:
            (response.data as ApiResponse<T[]>)?.meta?.totalItems ??
            (response.data as ApiResponse<T[]>)?.meta?.total,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * PUBLIC API ENDPOINTS
   */
  async getStats(page = 1, limit = 4): Promise<PaginatedResult<PublicStat>> {
    return this.requestPaginated<PublicStat>('/stats', this.publicPrefix, { page, limit });
  }

  async getServices(page = 1, limit = 6): Promise<PaginatedResult<PublicService>> {
    return this.requestPaginated<PublicService>('/services', this.publicPrefix, { page, limit });
  }

  async getProjects(page = 1, limit = 6): Promise<PaginatedResult<PublicLabProject>> {
    return this.requestPaginated<PublicLabProject>('/projects', this.publicPrefix, { page, limit });
  }

  async getPartners(page = 1, limit = 10): Promise<PaginatedResult<PublicPartner>> {
    return this.requestPaginated<PublicPartner>('/partners', this.publicPrefix, { page, limit });
  }

  async getPartnerColleges(page = 1, limit = 10): Promise<PaginatedResult<PublicPartnerCollege>> {
    return this.requestPaginated<PublicPartnerCollege>('/partner-colleges', this.publicPrefix, { page, limit });
  }

  async getClients(page = 1, limit = 10): Promise<PaginatedResult<PublicClient>> {
    return this.requestPaginated<PublicClient>('/clients', this.publicPrefix, { page, limit });
  }

  async getTestimonials(page = 1, limit = 6): Promise<PaginatedResult<PublicTestimonial>> {
    return this.requestPaginated<PublicTestimonial>('/testimonials', this.publicPrefix, { page, limit });
  }

  async getSocialLinks(page = 1, limit = 20): Promise<PaginatedResult<PublicSocialLink>> {
    return this.requestPaginated<PublicSocialLink>('/social-links', this.publicPrefix, { page, limit });
  }

  async getSettings() {
    return this.request('/settings/current', this.publicPrefix);
  }

  async getServiceBySlug(slug: string): Promise<PublicService> {
    return this.request<PublicService>(`/services/slug/${encodeURIComponent(slug)}`, this.publicPrefix);
  }

  async getProjectBySlug(slug: string): Promise<PublicLabProject> {
    return this.request<PublicLabProject>(`/projects/slug/${encodeURIComponent(slug)}`, this.publicPrefix);
  }

  async getPublicBlogs(page = 1, limit = 10): Promise<PaginatedResult<PublicBlog>> {
    return this.requestPaginated<PublicBlog>('/blogs', this.publicPrefix, { page, limit });
  }

  async getPublicBlogBySlug(slug: string): Promise<PublicBlog> {
    return this.request<PublicBlog>(`/blogs/slug/${encodeURIComponent(slug)}`, this.publicPrefix);
  }

  async getTeam(page = 1, limit = 12, branchId?: string): Promise<PaginatedResult<PublicMember>> {
    return this.requestPaginated<PublicMember>('/team', this.publicPrefix, { page, limit, branchId });
  }

  async getBranches(page = 1, limit = 10): Promise<PaginatedResult<PublicBranch>> {
    return this.requestPaginated<PublicBranch>('/branches', this.publicPrefix, { page, limit });
  }

  /**
   * CMS API ENDPOINTS
   */
  async getContacts(page = 1, limit = 50): Promise<PaginatedResult<PublicContact>> {
    return this.requestPaginated<PublicContact>('/contacts/v1', this.cmsPrefix, { page, limit });
  }

  async getBlog(page = 1, limit = 10) {
    return this.requestPaginated('/blogs/v1', this.cmsPrefix, { page, limit });
  }

  async getServices_CMS(page = 1, limit = 20) {
    return this.requestPaginated('/services/v1', this.cmsPrefix, { page, limit });
  }

  async submitContactForm(data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    subject?: string;
    message: string;
  }): Promise<ApiResponse<null>> {
    const url = this.buildUrl('/contact/submit', this.publicPrefix);
    const response = await this.axiosInstance.post<ApiResponse<null>>(url, data);
    return response.data;
  }

  async submitLabIdea(formData: FormData): Promise<ApiResponse<any>> {
    const url = this.buildUrl('/lab-ideas/v1/submit', this.cmsPrefix); // It's under /api/lab-ideas/v1/submit
    const response = await this.axiosInstance.post<ApiResponse<any>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
