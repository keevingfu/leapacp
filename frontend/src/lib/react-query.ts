import { QueryClient } from '@tanstack/react-query'
import type { DefaultOptions } from '@tanstack/react-query'

// Default options for React Query
const defaultOptions: DefaultOptions = {
  queries: {
    // Stale time: 5 minutes
    staleTime: 5 * 60 * 1000,
    // Cache time: 10 minutes
    gcTime: 10 * 60 * 1000,
    // Retry failed requests 3 times
    retry: 3,
    // Retry delay increases exponentially
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Refetch on window focus
    refetchOnWindowFocus: true,
    // Don't refetch on mount if data is fresh
    refetchOnMount: false,
  },
  mutations: {
    // Retry failed mutations once
    retry: 1,
  },
}

// Create Query Client instance
export const queryClient = new QueryClient({
  defaultOptions,
})

// Query Keys - centralized query key management
export const queryKeys = {
  // Knowledge Graph
  graph: {
    all: ['graph'] as const,
    entities: () => [...queryKeys.graph.all, 'entities'] as const,
    entity: (id: string) => [...queryKeys.graph.entities(), id] as const,
    relationships: () => [...queryKeys.graph.all, 'relationships'] as const,
    relationship: (id: string) => [...queryKeys.graph.relationships(), id] as const,
    query: (cypher: string) => [...queryKeys.graph.all, 'query', cypher] as const,
    stats: () => [...queryKeys.graph.all, 'stats'] as const,
  },

  // Content
  content: {
    all: ['content'] as const,
    list: (filters?: any) => [...queryKeys.content.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.content.all, id] as const,
    metrics: (id: string) => [...queryKeys.content.detail(id), 'metrics'] as const,
    distributions: (id: string) => [...queryKeys.content.detail(id), 'distributions'] as const,
  },

  // Data Collection
  dataCollection: {
    all: ['dataCollection'] as const,
    sources: () => [...queryKeys.dataCollection.all, 'sources'] as const,
    source: (id: string) => [...queryKeys.dataCollection.sources(), id] as const,
    jobs: () => [...queryKeys.dataCollection.all, 'jobs'] as const,
    job: (id: string) => [...queryKeys.dataCollection.jobs(), id] as const,
  },

  // Offers
  offers: {
    all: ['offers'] as const,
    list: (filters?: any) => [...queryKeys.offers.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.offers.all, id] as const,
    byProduct: (productId: string) => [...queryKeys.offers.all, 'product', productId] as const,
  },

  // Orders
  orders: {
    all: ['orders'] as const,
    list: (filters?: any) => [...queryKeys.orders.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.orders.all, id] as const,
  },

  // Analytics
  analytics: {
    all: ['analytics'] as const,
    dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
    metrics: (filters?: any) => [...queryKeys.analytics.all, 'metrics', filters] as const,
    contentPerformance: () => [...queryKeys.analytics.all, 'contentPerformance'] as const,
    productPerformance: () => [...queryKeys.analytics.all, 'productPerformance'] as const,
  },

  // Tenants
  tenants: {
    all: ['tenants'] as const,
    list: () => [...queryKeys.tenants.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.tenants.all, id] as const,
    brands: (tenantId: string) => [...queryKeys.tenants.detail(tenantId), 'brands'] as const,
  },
}
