import { api } from '@/lib/api/client'
import { API_ENDPOINTS, buildUrl } from '@/lib/api/endpoints'
import type {
  ApiResponse,
  DataSource,
  CollectionJob,
  PaginationParams,
} from '@/lib/api/types'

export const dataCollectionService = {
  // Get all data sources
  getSources: async (params?: PaginationParams & {
    platform?: string
    status?: string
  }): Promise<ApiResponse<DataSource[]>> => {
    const url = buildUrl(API_ENDPOINTS.DATA_COLLECTION.SOURCES, params)
    return api.get<DataSource[]>(url)
  },

  // Get single data source
  getSource: async (id: string): Promise<ApiResponse<DataSource>> => {
    return api.get<DataSource>(API_ENDPOINTS.DATA_COLLECTION.SOURCE_BY_ID(id))
  },

  // Create data source
  createSource: async (data: {
    platform: DataSource['platform']
    url: string
    config?: Record<string, any>
  }): Promise<ApiResponse<DataSource>> => {
    return api.post<DataSource>(API_ENDPOINTS.DATA_COLLECTION.SOURCES, data)
  },

  // Delete data source
  deleteSource: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(API_ENDPOINTS.DATA_COLLECTION.SOURCE_BY_ID(id))
  },

  // Get all collection jobs
  getJobs: async (params?: PaginationParams & {
    status?: string
    platform?: string
  }): Promise<ApiResponse<CollectionJob[]>> => {
    const url = buildUrl(API_ENDPOINTS.DATA_COLLECTION.JOBS, params)
    return api.get<CollectionJob[]>(url)
  },

  // Get single collection job
  getJob: async (id: string): Promise<ApiResponse<CollectionJob>> => {
    return api.get<CollectionJob>(API_ENDPOINTS.DATA_COLLECTION.JOB_BY_ID(id))
  },

  // Start collection job
  startCollection: async (data: {
    source_id?: string
    platform: string
    url?: string
    config?: Record<string, any>
  }): Promise<ApiResponse<CollectionJob>> => {
    return api.post<CollectionJob>(API_ENDPOINTS.DATA_COLLECTION.START_COLLECTION, data)
  },

  // Get available platforms
  getPlatforms: async (): Promise<ApiResponse<{
    platform: string
    name: string
    description: string
    supported_data_types: string[]
  }[]>> => {
    return api.get(API_ENDPOINTS.DATA_COLLECTION.PLATFORMS)
  },
}

export default dataCollectionService
