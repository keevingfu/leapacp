import { useCallback, useState, useEffect, useMemo } from 'react'
import ReactFlow, {
  type Node,
  type Edge,
  addEdge,
  type Connection,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Search, Link as LinkIcon, Code, RefreshCw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useEntities, useRelationships, useGraphStats } from '@/hooks/useGraph'
import { EntityDialog } from '@/components/knowledge-graph/EntityDialog'
import { RelationshipDialog } from '@/components/knowledge-graph/RelationshipDialog'
import { QueryDialog } from '@/components/knowledge-graph/QueryDialog'
import type { GraphEntity, GraphRelationship } from '@/lib/api/types'

// Entity type colors
const ENTITY_COLORS: Record<string, string> = {
  Product: '#3b82f6',
  Feature: '#10b981',
  Problem: '#ef4444',
  UserGroup: '#f59e0b',
  Scenario: '#8b5cf6',
  Competitor: '#ec4899',
  Offer: '#14b8a6',
  Merchant: '#f97316',
}

export function KnowledgeGraph() {
  const [searchTerm, setSearchTerm] = useState('')
  const [entityDialogOpen, setEntityDialogOpen] = useState(false)
  const [relationshipDialogOpen, setRelationshipDialogOpen] = useState(false)
  const [queryDialogOpen, setQueryDialogOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<GraphEntity | null>(null)

  // Fetch data from backend
  const { data: entitiesResponse, refetch: refetchEntities } = useEntities({ search: searchTerm })
  const { data: relationshipsResponse, refetch: refetchRelationships } = useRelationships()
  const { data: statsResponse } = useGraphStats()

  const entities = useMemo(() => entitiesResponse?.data || [], [entitiesResponse?.data])
  const relationships = useMemo(() => relationshipsResponse?.data || [], [relationshipsResponse?.data])
  const stats = statsResponse?.data

  // Convert entities to nodes
  const graphNodes = useMemo<Node[]>(() => {
    return entities.map((entity, index) => ({
      id: entity.id,
      type: 'default',
      data: {
        label: entity.properties.name || entity.properties.description?.substring(0, 30) || entity.id,
        entity
      },
      position: {
        x: (index % 5) * 250,
        y: Math.floor(index / 5) * 150
      },
      style: {
        background: ENTITY_COLORS[entity.type] || '#6b7280',
        color: '#fff',
        borderRadius: '8px',
        padding: '10px'
      },
    }))
  }, [entities])

  // Convert relationships to edges
  const graphEdges = useMemo<Edge[]>(() => {
    return relationships.map((rel) => ({
      id: rel.id,
      source: rel.source_id,
      target: rel.target_id,
      label: rel.type,
      animated: ['HAS_FEATURE', 'SOLVES'].includes(rel.type),
    }))
  }, [relationships])

  const [nodes, setNodes, onNodesChange] = useNodesState(graphNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphEdges)

  // Update nodes and edges when data changes
  useEffect(() => {
    setNodes(graphNodes)
  }, [graphNodes])

  useEffect(() => {
    setEdges(graphEdges)
  }, [graphEdges])

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        // Open relationship dialog with pre-filled source and target
        setRelationshipDialogOpen(true)
      }
    },
    []
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const entity = node.data.entity as GraphEntity
    setSelectedEntity(entity)
    setEntityDialogOpen(true)
  }, [])

  const handleRefresh = () => {
    refetchEntities()
    refetchRelationships()
  }

  // Calculate entity type counts
  const entityTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    entities.forEach((entity) => {
      counts[entity.type] = (counts[entity.type] || 0) + 1
    })
    return counts
  }, [entities])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Graph</h1>
          <p className="text-muted-foreground">Product knowledge visualization and management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => setQueryDialogOpen(true)}>
            <Code className="h-4 w-4 mr-2" />
            Query
          </Button>
          <Button variant="outline" onClick={() => setRelationshipDialogOpen(true)}>
            <LinkIcon className="h-4 w-4 mr-2" />
            Add Relationship
          </Button>
          <Button onClick={() => {
            setSelectedEntity(null)
            setEntityDialogOpen(true)
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Entity
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Graph Visualization</CardTitle>
            <CardDescription>
              Interactive product knowledge graph
              {entities.length > 0 && ` - ${entities.length} entities, ${relationships.length} relationships`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] border rounded-lg bg-gray-50">
              {entities.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Knowledge Graph Data</h3>
                  <p className="text-gray-500 mb-6 max-w-md">
                    Your knowledge graph is empty. Start by adding entities like Products, Features, or Problems to build your product knowledge base.
                  </p>
                  <Button onClick={() => {
                    setSelectedEntity(null)
                    setEntityDialogOpen(true)
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Entity
                  </Button>
                </div>
              ) : (
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={onNodeClick}
                  fitView
                >
                  <Background />
                  <Controls />
                  <MiniMap />
                </ReactFlow>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Entity Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(ENTITY_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center justify-between">
                  <Badge style={{ backgroundColor: color }}>{type}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {entityTypeCounts[type] || 0}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search entities..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Entities</span>
                <span className="font-medium">{stats?.total_nodes || entities.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Relationships</span>
                <span className="font-medium">{stats?.total_relationships || relationships.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium">Just now</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <EntityDialog
        open={entityDialogOpen}
        onOpenChange={(open) => {
          setEntityDialogOpen(open)
          if (!open) setSelectedEntity(null)
        }}
        entity={selectedEntity}
      />

      <RelationshipDialog
        open={relationshipDialogOpen}
        onOpenChange={setRelationshipDialogOpen}
      />

      <QueryDialog
        open={queryDialogOpen}
        onOpenChange={setQueryDialogOpen}
      />
    </div>
  )
}
