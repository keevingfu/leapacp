import { api } from '@/lib/api/client'
import { API_ENDPOINTS, buildUrl } from '@/lib/api/endpoints'
import type {
  ApiResponse,
  GraphEntity,
  GraphRelationship,
  GraphQueryRequest,
  GraphQueryResponse,
  PaginationParams,
} from '@/lib/api/types'

// Entity CRUD Operations
export const graphService = {
  // Get all entities with optional filters
  getEntities: async (params?: PaginationParams & {
    type?: string
    search?: string
  }): Promise<ApiResponse<GraphEntity[]>> => {
    const url = buildUrl(API_ENDPOINTS.GRAPH.ENTITIES, params)
    return api.get<GraphEntity[]>(url)
  },

  // Get single entity by ID
  getEntity: async (id: string): Promise<ApiResponse<GraphEntity>> => {
    return api.get<GraphEntity>(API_ENDPOINTS.GRAPH.ENTITY_BY_ID(id))
  },

  // Create new entity
  createEntity: async (data: {
    type: GraphEntity['type']
    properties: Record<string, any>
  }): Promise<ApiResponse<GraphEntity>> => {
    return api.post<GraphEntity>(API_ENDPOINTS.GRAPH.ENTITIES, data)
  },

  // Update entity
  updateEntity: async (
    id: string,
    data: Partial<{
      properties: Record<string, any>
    }>
  ): Promise<ApiResponse<GraphEntity>> => {
    return api.put<GraphEntity>(API_ENDPOINTS.GRAPH.ENTITY_BY_ID(id), data)
  },

  // Delete entity
  deleteEntity: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(API_ENDPOINTS.GRAPH.ENTITY_BY_ID(id))
  },

  // Relationship Operations
  getRelationships: async (params?: PaginationParams & {
    source_id?: string
    target_id?: string
    type?: string
  }): Promise<ApiResponse<GraphRelationship[]>> => {
    const url = buildUrl(API_ENDPOINTS.GRAPH.RELATIONSHIPS, params)
    return api.get<GraphRelationship[]>(url)
  },

  createRelationship: async (data: {
    type: string
    source_id: string
    target_id: string
    properties?: Record<string, any>
  }): Promise<ApiResponse<GraphRelationship>> => {
    return api.post<GraphRelationship>(API_ENDPOINTS.GRAPH.RELATIONSHIPS, data)
  },

  deleteRelationship: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(API_ENDPOINTS.GRAPH.RELATIONSHIP_BY_ID(id))
  },

  // Cypher Query Execution
  executeQuery: async (
    request: GraphQueryRequest
  ): Promise<ApiResponse<GraphQueryResponse>> => {
    return api.post<GraphQueryResponse>(API_ENDPOINTS.GRAPH.QUERY, request)
  },

  // Get graph statistics
  getStats: async (): Promise<ApiResponse<{
    total_nodes: number
    total_relationships: number
    node_types: Record<string, number>
    relationship_types: Record<string, number>
  }>> => {
    return api.get(API_ENDPOINTS.GRAPH.STATS)
  },

  // Helper methods for specific entity types
  products: {
    getAll: async (params?: PaginationParams) => {
      return graphService.getEntities({ ...params, type: 'Product' })
    },

    create: async (properties: {
      name: string
      sku?: string
      category?: string
      brand?: string
      description?: string
      [key: string]: any
    }) => {
      return graphService.createEntity({ type: 'Product', properties })
    },
  },

  features: {
    getAll: async (params?: PaginationParams) => {
      return graphService.getEntities({ ...params, type: 'Feature' })
    },

    create: async (properties: {
      name: string
      type?: string
      value?: string
      description?: string
      [key: string]: any
    }) => {
      return graphService.createEntity({ type: 'Feature', properties })
    },
  },

  scenarios: {
    getAll: async (params?: PaginationParams) => {
      return graphService.getEntities({ ...params, type: 'Scenario' })
    },

    create: async (properties: {
      name: string
      description?: string
      tags?: string[]
      [key: string]: any
    }) => {
      return graphService.createEntity({ type: 'Scenario', properties })
    },
  },

  problems: {
    getAll: async (params?: PaginationParams) => {
      return graphService.getEntities({ ...params, type: 'Problem' })
    },

    create: async (properties: {
      description: string
      severity?: string
      frequency?: number
      [key: string]: any
    }) => {
      return graphService.createEntity({ type: 'Problem', properties })
    },
  },

  offers: {
    getAll: async (params?: PaginationParams) => {
      return graphService.getEntities({ ...params, type: 'Offer' })
    },

    create: async (properties: {
      offer_id: string
      sku: string
      merchant_id: string
      price: number
      currency: string
      availability: string
      [key: string]: any
    }) => {
      return graphService.createEntity({ type: 'Offer', properties })
    },
  },

  // Query helpers for common patterns
  queries: {
    // Get product with all related entities
    getProductGraph: async (productId: string) => {
      const query = `
        MATCH (p:Product {id: $productId})
        OPTIONAL MATCH (p)-[r1:HAS_FEATURE]->(f:Feature)
        OPTIONAL MATCH (p)-[r2:SOLVES]->(prob:Problem)
        OPTIONAL MATCH (p)-[r3:APPLIES_TO]->(s:Scenario)
        OPTIONAL MATCH (p)-[r4:HAS_OFFER]->(o:Offer)
        RETURN p,
               collect(DISTINCT {rel: r1, node: f}) as features,
               collect(DISTINCT {rel: r2, node: prob}) as problems,
               collect(DISTINCT {rel: r3, node: s}) as scenarios,
               collect(DISTINCT {rel: r4, node: o}) as offers
      `
      return graphService.executeQuery({ query, params: { productId } })
    },

    // Get products by scenario
    getProductsByScenario: async (scenarioId: string) => {
      const query = `
        MATCH (s:Scenario {id: $scenarioId})<-[:APPLIES_TO]-(p:Product)
        RETURN p
      `
      return graphService.executeQuery({ query, params: { scenarioId } })
    },

    // Get problems solved by product
    getProblemsSolvedByProduct: async (productId: string) => {
      const query = `
        MATCH (p:Product {id: $productId})-[r:SOLVES]->(prob:Problem)
        RETURN prob, r.effectiveness as effectiveness
        ORDER BY r.effectiveness DESC
      `
      return graphService.executeQuery({ query, params: { productId } })
    },
  },
}

export default graphService
