import { useCallback } from 'react'
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
import { Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    data: { label: 'Premium Mattress' },
    position: { x: 250, y: 0 },
    style: { background: '#3b82f6', color: '#fff', borderRadius: '8px', padding: '10px' },
  },
  {
    id: '2',
    data: { label: 'Cooling Technology' },
    position: { x: 100, y: 100 },
    style: { background: '#10b981', color: '#fff', borderRadius: '8px', padding: '10px' },
  },
  {
    id: '3',
    data: { label: 'Pressure Relief' },
    position: { x: 400, y: 100 },
    style: { background: '#10b981', color: '#fff', borderRadius: '8px', padding: '10px' },
  },
  {
    id: '4',
    data: { label: 'Hot Sleepers' },
    position: { x: 0, y: 200 },
    style: { background: '#f59e0b', color: '#fff', borderRadius: '8px', padding: '10px' },
  },
  {
    id: '5',
    data: { label: 'Back Pain' },
    position: { x: 250, y: 200 },
    style: { background: '#ef4444', color: '#fff', borderRadius: '8px', padding: '10px' },
  },
  {
    id: '6',
    data: { label: 'Side Sleepers' },
    position: { x: 500, y: 200 },
    style: { background: '#f59e0b', color: '#fff', borderRadius: '8px', padding: '10px' },
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', label: 'HAS_FEATURE', animated: true },
  { id: 'e1-3', source: '1', target: '3', label: 'HAS_FEATURE', animated: true },
  { id: 'e2-4', source: '2', target: '4', label: 'SOLVES' },
  { id: 'e3-5', source: '3', target: '5', label: 'SOLVES' },
  { id: 'e3-6', source: '3', target: '6', label: 'TARGETS' },
]

export function KnowledgeGraph() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Graph</h1>
          <p className="text-muted-foreground">Product knowledge visualization and management</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Entity
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Graph Visualization</CardTitle>
            <CardDescription>Interactive product knowledge graph</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] border rounded-lg">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
              >
                <Background />
                <Controls />
                <MiniMap />
              </ReactFlow>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Entity Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge style={{ backgroundColor: '#3b82f6' }}>Product</Badge>
                <span className="text-sm text-muted-foreground">12</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge style={{ backgroundColor: '#10b981' }}>Feature</Badge>
                <span className="text-sm text-muted-foreground">45</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge style={{ backgroundColor: '#ef4444' }}>Problem</Badge>
                <span className="text-sm text-muted-foreground">28</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge style={{ backgroundColor: '#f59e0b' }}>User Group</Badge>
                <span className="text-sm text-muted-foreground">15</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search entities..." className="pl-8" />
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
                <span className="font-medium">100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Relationships</span>
                <span className="font-medium">256</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium">2 hours ago</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
