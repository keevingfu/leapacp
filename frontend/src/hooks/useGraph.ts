import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/react-query'
import { graphService } from '@/services/graphService'
import type {
  GraphEntity,
  GraphRelationship,
  GraphQueryRequest,
  PaginationParams,
} from '@/lib/api/types'
import { useUIStore } from '@/store'

// Entities Hooks
export function useEntities(params?: PaginationParams & { type?: string; search?: string }) {
  return useQuery({
    queryKey: queryKeys.graph.entities(),
    queryFn: () => graphService.getEntities(params),
  })
}

export function useEntity(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.graph.entity(id),
    queryFn: () => graphService.getEntity(id),
    enabled: !!id && enabled,
  })
}

export function useCreateEntity() {
  const queryClient = useQueryClient()
  const { addNotification } = useUIStore()

  return useMutation({
    mutationFn: graphService.createEntity,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.graph.entities() })
      addNotification({
        type: 'success',
        title: 'Entity Created',
        message: `Successfully created ${response.data?.type} entity`,
      })
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: error.message || 'Failed to create entity',
      })
    },
  })
}

export function useUpdateEntity() {
  const queryClient = useQueryClient()
  const { addNotification } = useUIStore()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      graphService.updateEntity(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.graph.entity(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.graph.entities() })
      addNotification({
        type: 'success',
        title: 'Entity Updated',
        message: 'Successfully updated entity',
      })
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Failed to update entity',
      })
    },
  })
}

export function useDeleteEntity() {
  const queryClient = useQueryClient()
  const { addNotification } = useUIStore()

  return useMutation({
    mutationFn: (id: string) => graphService.deleteEntity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.graph.entities() })
      addNotification({
        type: 'success',
        title: 'Entity Deleted',
        message: 'Successfully deleted entity',
      })
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Deletion Failed',
        message: error.message || 'Failed to delete entity',
      })
    },
  })
}

// Relationships Hooks
export function useRelationships(params?: {
  source_id?: string
  target_id?: string
  type?: string
}) {
  return useQuery({
    queryKey: queryKeys.graph.relationships(),
    queryFn: () => graphService.getRelationships(params),
  })
}

export function useCreateRelationship() {
  const queryClient = useQueryClient()
  const { addNotification } = useUIStore()

  return useMutation({
    mutationFn: graphService.createRelationship,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.graph.relationships() })
      addNotification({
        type: 'success',
        title: 'Relationship Created',
        message: 'Successfully created relationship',
      })
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: error.message || 'Failed to create relationship',
      })
    },
  })
}

export function useDeleteRelationship() {
  const queryClient = useQueryClient()
  const { addNotification } = useUIStore()

  return useMutation({
    mutationFn: (id: string) => graphService.deleteRelationship(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.graph.relationships() })
      addNotification({
        type: 'success',
        title: 'Relationship Deleted',
        message: 'Successfully deleted relationship',
      })
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Deletion Failed',
        message: error.message || 'Failed to delete relationship',
      })
    },
  })
}

// Query Execution Hook
export function useGraphQuery(request: GraphQueryRequest, enabled = true) {
  return useQuery({
    queryKey: queryKeys.graph.query(request.cypher),
    queryFn: () => graphService.executeQuery(request),
    enabled,
  })
}

export function useExecuteQuery() {
  const { addNotification } = useUIStore()

  return useMutation({
    mutationFn: graphService.executeQuery,
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Query Failed',
        message: error.message || 'Failed to execute query',
      })
    },
  })
}

// Stats Hook
export function useGraphStats() {
  return useQuery({
    queryKey: queryKeys.graph.stats(),
    queryFn: graphService.getStats,
    // Refetch stats every 5 minutes
    refetchInterval: 5 * 60 * 1000,
  })
}

// Specific Entity Type Hooks
export function useProducts(params?: PaginationParams) {
  return useQuery({
    queryKey: [...queryKeys.graph.entities(), 'products'],
    queryFn: () => graphService.products.getAll(params),
  })
}

export function useFeatures(params?: PaginationParams) {
  return useQuery({
    queryKey: [...queryKeys.graph.entities(), 'features'],
    queryFn: () => graphService.features.getAll(params),
  })
}

export function useScenarios(params?: PaginationParams) {
  return useQuery({
    queryKey: [...queryKeys.graph.entities(), 'scenarios'],
    queryFn: () => graphService.scenarios.getAll(params),
  })
}

export function useProblems(params?: PaginationParams) {
  return useQuery({
    queryKey: [...queryKeys.graph.entities(), 'problems'],
    queryFn: () => graphService.problems.getAll(params),
  })
}

// Complex Query Hooks
export function useProductGraph(productId: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.graph.entity(productId), 'graph'],
    queryFn: () => graphService.queries.getProductGraph(productId),
    enabled: !!productId && enabled,
  })
}

export function useProductsByScenario(scenarioId: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.graph.entities(), 'byScenario', scenarioId],
    queryFn: () => graphService.queries.getProductsByScenario(scenarioId),
    enabled: !!scenarioId && enabled,
  })
}

export function useProblemsSolvedByProduct(productId: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.graph.entity(productId), 'problems'],
    queryFn: () => graphService.queries.getProblemsSolvedByProduct(productId),
    enabled: !!productId && enabled,
  })
}
