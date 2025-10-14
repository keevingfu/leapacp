import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { Download, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { pyramidGraphData, getChildren, type PyramidNode } from '@/data/pyramid-graph-data'

const LAYER_SPACING = 120 // Vertical spacing between layers
const NODE_SPACING_X = 140 // Horizontal spacing between nodes (increased for gaps)
const INITIAL_MAX_LAYER = 7 // Show all 8 layers (0-7) initially

// Uniform circle sizes for all nodes
const getNodeRadius = (layer: number): number => {
  return 30  // Same size for all circles
}

interface ExpandedState {
  [nodeId: string]: boolean
}

export function PyramidGraph() {
  // Initialize all nodes as expanded
  const initialExpandedState = useMemo(() => {
    const expanded: ExpandedState = {}
    pyramidGraphData.nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        expanded[node.id] = true
      }
    })
    return expanded
  }, [])

  const [expandedNodes, setExpandedNodes] = useState<ExpandedState>(initialExpandedState)
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

    // Start with all layer 0 nodes (Brand)
    pyramidGraphData.nodes
      .filter((node) => node.layer === 0)
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
      const totalWidth = nodesInLayer.length * NODE_SPACING_X * pyramidWidthMultiplier

      const x = (nodeIndex - (nodesInLayer.length - 1) / 2) * NODE_SPACING_X * pyramidWidthMultiplier
      const y = layer * LAYER_SPACING

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
      const radius = getNodeRadius(node.layer)
      return Math.abs(pos.x) + radius
    })
  )
  const viewBoxWidth = maxWidth * 2 + 200
  const viewBoxHeight = maxLayer * LAYER_SPACING + 200

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
      const nodeRadius = getNodeRadius(node.layer)
      const nodeX = nodePos.x
      const nodeY = nodePos.y + nodeRadius

      node.children.forEach((childId) => {
        const childNode = visibleNodes.find((n) => n.id === childId)
        if (!childNode) return

        const childPos = calculateNodePosition(childNode, visibleNodes)
        const childRadius = getNodeRadius(childNode.layer)
        const childX = childPos.x
        const childY = childPos.y - childRadius

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

  // Render nodes as circles
  const renderNodes = () => {
    return visibleNodes.map((node) => {
      const pos = calculateNodePosition(node, visibleNodes)
      const radius = getNodeRadius(node.layer)
      const hasChildren = node.children && node.children.length > 0
      const isExpanded = expandedNodes[node.id]
      const canExpand = hasChildren && node.layer < 7

      return (
        <g
          key={node.id}
          transform={`translate(${pos.x}, ${pos.y})`}
          onClick={() => canExpand && toggleNode(node.id)}
          style={{ cursor: canExpand ? 'pointer' : 'default' }}
        >
          {/* Node circle */}
          <circle
            r={radius}
            fill={node.color}
            opacity="0.9"
            stroke={isExpanded ? '#ffffff' : node.color}
            strokeWidth={isExpanded ? '3' : '0'}
          />

          {/* Node label - display complete text */}
          <text
            y="4"
            textAnchor="middle"
            fill="black"
            fontSize="12"
            fontWeight="600"
          >
            {node.label}
          </text>

          {/* Layer indicator (only for Brand and Products) */}
          {node.layer <= 1 && (
            <text
              y="20"
              textAnchor="middle"
              fill="black"
              fontSize="9"
              opacity="0.8"
            >
              L{node.layer}
            </text>
          )}

          {/* Expand indicator */}
          {canExpand && (
            <>
              <circle
                cx={radius - 8}
                cy={-radius + 8}
                r="6"
                fill="white"
                opacity="0.9"
              />
              <text
                x={radius - 8}
                y={-radius + 11}
                textAnchor="middle"
                fill={node.color}
                fontSize="10"
                fontWeight="bold"
              >
                {isExpanded ? '-' : '+'}
              </text>
            </>
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
          {pyramidGraphData.layers.map((layer) => {
            const layerNodeCount = pyramidGraphData.nodes.filter(n => n.layer === layer.id).length
            return (
              <div key={layer.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: layer.color }}
                  />
                  <span>{layer.name}</span>
                </div>
                <span className="text-gray-500 font-medium">{layerNodeCount}</span>
              </div>
            )
          })}
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
          <div className="font-medium mb-1">Total: {pyramidGraphData.nodes.length} nodes</div>
          <div>All layers expanded</div>
        </div>
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
