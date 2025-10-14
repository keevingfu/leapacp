import { useState, useRef, useCallback } from 'react'
import { Download, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { pyramidGraphData, getChildren, type PyramidNode } from '@/data/pyramid-graph-data'

const LAYER_HEIGHT = 150
const NODE_WIDTH = 160
const NODE_HEIGHT = 60
const NODE_SPACING_X = 20
const NODE_SPACING_Y = 80
const INITIAL_MAX_LAYER = 3 // Show first 3 layers initially

interface ExpandedState {
  [nodeId: string]: boolean
}

export function PyramidGraph() {
  const [expandedNodes, setExpandedNodes] = useState<ExpandedState>({})
  const [zoom, setZoom] = useState(1)
  const svgRef = useRef<SVGSVGElement>(null)

  // Toggle node expansion
  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }))
  }, [])

  // Get visible nodes based on expansion state
  const getVisibleNodes = useCallback((): PyramidNode[] => {
    const visible: PyramidNode[] = []
    const queue: string[] = []

    // Start with all layer 1 nodes
    pyramidGraphData.nodes
      .filter((node) => node.layer === 1)
      .forEach((node) => queue.push(node.id))

    const visited = new Set<string>()

    while (queue.length > 0) {
      const nodeId = queue.shift()!
      if (visited.has(nodeId)) continue
      visited.add(nodeId)

      const node = pyramidGraphData.nodeMap[nodeId]
      if (!node) continue

      // Add node if within initial layer range OR parent is expanded
      if (node.layer <= INITIAL_MAX_LAYER || hasExpandedParent(node.id)) {
        visible.push(node)

        // If this node is expanded, add its children to queue
        if (expandedNodes[nodeId] && node.children) {
          node.children.forEach((childId) => queue.push(childId))
        }
      }
    }

    return visible
  }, [expandedNodes])

  // Check if node has an expanded parent
  const hasExpandedParent = (nodeId: string): boolean => {
    const parents = pyramidGraphData.nodes.filter(
      (n) => n.children && n.children.includes(nodeId)
    )
    return parents.some((parent) => expandedNodes[parent.id])
  }

  // Calculate node positions
  const calculateNodePosition = useCallback(
    (node: PyramidNode, layerNodes: PyramidNode[]) => {
      const layer = node.layer
      const nodesInLayer = layerNodes.filter((n) => n.layer === layer)
      const nodeIndex = nodesInLayer.findIndex((n) => n.id === node.id)

      // Calculate pyramid width for this layer (wider at bottom)
      const pyramidWidthMultiplier = layer / 7 + 0.3 // Gradually widen
      const totalWidth = nodesInLayer.length * (NODE_WIDTH + NODE_SPACING_X) * pyramidWidthMultiplier

      const x = (nodeIndex - (nodesInLayer.length - 1) / 2) * (NODE_WIDTH + NODE_SPACING_X) * pyramidWidthMultiplier
      const y = (layer - 1) * (NODE_HEIGHT + NODE_SPACING_Y)

      return { x, y, totalWidth }
    },
    []
  )

  const visibleNodes = getVisibleNodes()
  const maxLayer = Math.max(...visibleNodes.map((n) => n.layer))

  // Calculate viewBox dimensions
  const maxWidth = Math.max(
    ...visibleNodes.map((node) => {
      const pos = calculateNodePosition(node, visibleNodes)
      return Math.abs(pos.x) + NODE_WIDTH / 2
    })
  )
  const viewBoxWidth = maxWidth * 2 + 200
  const viewBoxHeight = maxLayer * (NODE_HEIGHT + NODE_SPACING_Y) + 200

  // Export SVG
  const exportSVG = () => {
    if (!svgRef.current) return

    const svgData = svgRef.current.outerHTML
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'knowledge-graph-pyramid.svg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Render connections
  const renderConnections = () => {
    const connections: JSX.Element[] = []

    visibleNodes.forEach((node) => {
      if (!node.children) return

      const nodePos = calculateNodePosition(node, visibleNodes)
      const nodeX = nodePos.x
      const nodeY = nodePos.y + NODE_HEIGHT

      node.children.forEach((childId) => {
        const childNode = visibleNodes.find((n) => n.id === childId)
        if (!childNode) return

        const childPos = calculateNodePosition(childNode, visibleNodes)
        const childX = childPos.x
        const childY = childPos.y

        // Draw curved connection
        const midY = (nodeY + childY) / 2
        const path = `M ${nodeX},${nodeY} C ${nodeX},${midY} ${childX},${midY} ${childX},${childY}`

        connections.push(
          <path
            key={`${node.id}-${childId}`}
            d={path}
            stroke={node.color}
            strokeWidth="2"
            fill="none"
            opacity="0.4"
            strokeDasharray={expandedNodes[node.id] ? '0' : '5,5'}
          />
        )
      })
    })

    return connections
  }

  // Render nodes
  const renderNodes = () => {
    return visibleNodes.map((node) => {
      const pos = calculateNodePosition(node, visibleNodes)
      const hasChildren = node.children && node.children.length > 0
      const isExpanded = expandedNodes[node.id]
      const canExpand = hasChildren && node.layer < 7

      return (
        <g
          key={node.id}
          transform={`translate(${pos.x - NODE_WIDTH / 2}, ${pos.y})`}
          onClick={() => canExpand && toggleNode(node.id)}
          style={{ cursor: canExpand ? 'pointer' : 'default' }}
        >
          {/* Node background */}
          <rect
            width={NODE_WIDTH}
            height={NODE_HEIGHT}
            rx="8"
            fill={node.color}
            opacity="0.9"
            stroke={isExpanded ? '#ffffff' : node.color}
            strokeWidth={isExpanded ? '3' : '0'}
          />

          {/* Node label */}
          <text
            x={NODE_WIDTH / 2}
            y={NODE_HEIGHT / 2 - 5}
            textAnchor="middle"
            fill="white"
            fontSize="13"
            fontWeight="600"
          >
            {node.label.length > 20 ? node.label.substring(0, 20) + '...' : node.label}
          </text>

          {/* Layer indicator */}
          <text
            x={NODE_WIDTH / 2}
            y={NODE_HEIGHT / 2 + 12}
            textAnchor="middle"
            fill="white"
            fontSize="10"
            opacity="0.8"
          >
            Layer {node.layer}
          </text>

          {/* Expand indicator */}
          {canExpand && (
            <circle
              cx={NODE_WIDTH - 15}
              cy={15}
              r="8"
              fill="white"
              opacity="0.9"
            />
          )}
          {canExpand && (
            <text
              x={NODE_WIDTH - 15}
              y={19}
              textAnchor="middle"
              fill={node.color}
              fontSize="12"
              fontWeight="bold"
            >
              {isExpanded ? '-' : '+'}
            </text>
          )}

          {/* Hover tooltip */}
          <title>{node.description || node.label}</title>
        </g>
      )
    })
  }

  return (
    <div className="relative w-full h-full">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setZoom(1)}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button size="sm" onClick={exportSVG}>
          <Download className="h-4 w-4 mr-2" />
          Export SVG
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 bg-white p-3 rounded-lg shadow-md">
        <h3 className="text-sm font-semibold mb-2">Layers</h3>
        <div className="space-y-1">
          {pyramidGraphData.layers.map((layer) => (
            <div key={layer.id} className="flex items-center gap-2 text-xs">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: layer.color }}
              />
              <span>{layer.name}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Click nodes with + to expand</p>
      </div>

      {/* SVG Canvas */}
      <div className="w-full h-full overflow-auto">
        <svg
          ref={svgRef}
          viewBox={`${-viewBoxWidth / 2} 0 ${viewBoxWidth} ${viewBoxHeight}`}
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
          }}
          className="bg-gray-50"
        >
          {/* Render connections first (behind nodes) */}
          <g opacity="0.6">{renderConnections()}</g>

          {/* Render nodes */}
          <g>{renderNodes()}</g>
        </svg>
      </div>
    </div>
  )
}
