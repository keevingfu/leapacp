import { api } from '@/lib/api/client'
import { API_ENDPOINTS, buildUrl } from '@/lib/api/endpoints'
import type {
  ApiResponse,
  ContentItem,
  ContentGenerationRequest,
  ContentScoreResponse,
  PaginationParams,
} from '@/lib/api/types'

export const contentService = {
  // Get all content items
  getContentList: async (params?: PaginationParams & {
    type?: string
    status?: string
    platform?: string
  }): Promise<ApiResponse<ContentItem[]>> => {
    const url = buildUrl(API_ENDPOINTS.CONTENT.LIST, params)
    return api.get<ContentItem[]>(url)
  },

  // Get single content item
  getContent: async (id: string): Promise<ApiResponse<ContentItem>> => {
    return api.get<ContentItem>(API_ENDPOINTS.CONTENT.BY_ID(id))
  },

  // Generate new content
  generateContent: async (
    request: ContentGenerationRequest
  ): Promise<ApiResponse<ContentItem>> => {
    return api.post<ContentItem>(API_ENDPOINTS.CONTENT.GENERATE, request)
  },

  // Update content
  updateContent: async (
    id: string,
    data: Partial<ContentItem>
  ): Promise<ApiResponse<ContentItem>> => {
    return api.put<ContentItem>(API_ENDPOINTS.CONTENT.BY_ID(id), data)
  },

  // Delete content
  deleteContent: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(API_ENDPOINTS.CONTENT.BY_ID(id))
  },

  // Score content
  scoreContent: async (id: string): Promise<ApiResponse<ContentScoreResponse>> => {
    return api.post<ContentScoreResponse>(API_ENDPOINTS.CONTENT.SCORE(id))
  },

  // Publish content
  publishContent: async (id: string, data: {
    platforms: string[]
    schedule_at?: string
  }): Promise<ApiResponse<ContentItem>> => {
    return api.post<ContentItem>(API_ENDPOINTS.CONTENT.PUBLISH(id), data)
  },

  // Get content distributions
  getDistributions: async (id: string): Promise<ApiResponse<any[]>> => {
    return api.get(API_ENDPOINTS.CONTENT.DISTRIBUTIONS(id))
  },

  // Get content metrics
  getMetrics: async (id: string): Promise<ApiResponse<{
    impressions: number
    clicks: number
    conversions: number
    engagement_rate: number
  }>> => {
    return api.get(API_ENDPOINTS.CONTENT.METRICS(id))
  },
}

export default contentService
