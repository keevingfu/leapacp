// API Endpoints Configuration

export const API_ENDPOINTS = {
  // Knowledge Graph APIs
  GRAPH: {
    ENTITIES: '/graph/entities',
    ENTITY_BY_ID: (id: string) => `/graph/entities/${id}`,
    RELATIONSHIPS: '/graph/relationships',
    RELATIONSHIP_BY_ID: (id: string) => `/graph/relationships/${id}`,
    QUERY: '/graph/query',
    STATS: '/graph/stats',
  },

  // Content APIs
  CONTENT: {
    LIST: '/content',
    BY_ID: (id: string) => `/content/${id}`,
    GENERATE: '/content/generate',
    SCORE: (id: string) => `/content/${id}/score`,
    PUBLISH: (id: string) => `/content/${id}/publish`,
    DISTRIBUTIONS: (id: string) => `/content/${id}/distributions`,
    METRICS: (id: string) => `/content/${id}/metrics`,
  },

  // Data Collection APIs
  DATA_COLLECTION: {
    SOURCES: '/data-collection/sources',
    SOURCE_BY_ID: (id: string) => `/data-collection/sources/${id}`,
    JOBS: '/data-collection/jobs',
    JOB_BY_ID: (id: string) => `/data-collection/jobs/${id}`,
    START_COLLECTION: '/data-collection/start',
    PLATFORMS: '/data-collection/platforms',
  },

  // Offer Catalog APIs
  OFFERS: {
    LIST: '/offers',
    BY_ID: (id: string) => `/offers/${id}`,
    CREATE: '/offers',
    UPDATE: (id: string) => `/offers/${id}`,
    DELETE: (id: string) => `/offers/${id}`,
    BY_PRODUCT: (productId: string) => `/offers?product_id=${productId}`,
  },

  // Commerce/Order APIs
  COMMERCE: {
    ORDERS: '/commerce/orders',
    ORDER_BY_ID: (id: string) => `/commerce/orders/${id}`,
    CREATE_ORDER: '/commerce/orders',
    CANCEL_ORDER: (id: string) => `/commerce/orders/${id}/cancel`,
    ORDER_STATUS: (id: string) => `/commerce/orders/${id}/status`,
  },

  // ACP Gateway APIs
  ACP: {
    CREATE_ORDER: '/acp/v1/orders.create',
    ORDER_STATUS: '/acp/v1/orders.status',
    CANCEL_ORDER: '/acp/v1/orders.cancel',
  },

  // Analytics APIs
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    METRICS: '/analytics/metrics',
    CONTENT_PERFORMANCE: '/analytics/content-performance',
    PRODUCT_PERFORMANCE: '/analytics/product-performance',
    CONVERSION_FUNNEL: '/analytics/conversion-funnel',
    ATTRIBUTION: '/analytics/attribution',
  },

  // Auth APIs
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    VERIFY_2FA: '/auth/verify-2fa',
  },

  // Tenant/Organization APIs
  TENANTS: {
    LIST: '/tenants',
    BY_ID: (id: string) => `/tenants/${id}`,
    CREATE: '/tenants',
    UPDATE: (id: string) => `/tenants/${id}`,
    BRANDS: (tenantId: string) => `/tenants/${tenantId}/brands`,
  },

  // Settings APIs
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
    INTEGRATIONS: '/settings/integrations',
    NOTIFICATIONS: '/settings/notifications',
  },
}

// Helper function to build URL with query parameters
export function buildUrl(endpoint: string, params?: Record<string, any>): string {
  if (!params) return endpoint

  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')

  return queryString ? `${endpoint}?${queryString}` : endpoint
}
