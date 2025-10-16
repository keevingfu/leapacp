import axios, { AxiosError } from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse, ApiError } from './types'

// API Base URL - can be configured via environment variable
// Note: Knowledge Graph Service runs on port 8001
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1'

// Create Axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get auth token from localStorage
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Get tenant ID from localStorage
    const tenantId = localStorage.getItem('tenant_id')
    if (tenantId && config.headers) {
      config.headers['X-Tenant-ID'] = tenantId
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Return the data directly if it's an ApiResponse
    return response.data
  },
  (error: AxiosError<ApiError>) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const apiError: ApiError = {
        success: false,
        message: error.response.data?.message || 'An error occurred',
        errors: error.response.data?.errors,
        status: error.response.status,
      }

      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('auth_token')
          localStorage.removeItem('tenant_id')
          window.location.href = '/login'
          break
        case 403:
          // Forbidden
          console.error('Access forbidden:', apiError.message)
          break
        case 404:
          // Not found
          console.error('Resource not found:', apiError.message)
          break
        case 422:
          // Validation error
          console.error('Validation error:', apiError.errors)
          break
        case 500:
          // Server error
          console.error('Server error:', apiError.message)
          break
        default:
          console.error('API error:', apiError)
      }

      return Promise.reject(apiError)
    } else if (error.request) {
      // Request was made but no response received
      const networkError: ApiError = {
        success: false,
        message: 'Network error - no response from server',
        status: 0,
      }
      console.error('Network error:', error.request)
      return Promise.reject(networkError)
    } else {
      // Something else happened
      const unknownError: ApiError = {
        success: false,
        message: error.message || 'An unknown error occurred',
      }
      console.error('Unknown error:', error.message)
      return Promise.reject(unknownError)
    }
  }
)

// Helper function to handle API responses with type safety
export async function apiRequest<T = any>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: any,
  config?: any
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.request<ApiResponse<T>>({
      method,
      url,
      data,
      ...config,
    })
    // Response interceptor already returns response.data (the ApiResponse object)
    // So we return the response directly without accessing .data again
    return response as unknown as ApiResponse<T>
  } catch (error) {
    throw error
  }
}

// Convenience methods
export const api = {
  get: <T = any>(url: string, params?: any) =>
    apiRequest<T>('get', url, undefined, { params }),

  post: <T = any>(url: string, data?: any) =>
    apiRequest<T>('post', url, data),

  put: <T = any>(url: string, data?: any) =>
    apiRequest<T>('put', url, data),

  delete: <T = any>(url: string) =>
    apiRequest<T>('delete', url),
}

export default apiClient
