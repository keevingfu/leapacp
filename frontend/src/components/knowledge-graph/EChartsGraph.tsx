import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import type { GraphEntity, GraphRelationship } from '@/lib/api/types'

// Entity type colors - matching ECharts graph-webkit-dep style
const ENTITY_COLORS: Record<string, string> = {
  Product: '#5470c6',      // Blue
  Feature: '#91cc75',      // Green
  Problem: '#ee6666',      // Red
  UserGroup: '#fac858',    // Yellow
  Scenario: '#73c0de',     // Light Blue
  Competitor: '#9a60b4',   // Purple
  Offer: '#3ba272',        // Teal
  Merchant: '#fc8452',     // Orange
}

interface EChartsGraphProps {
  entities: GraphEntity[]
  relationships: GraphRelationship[]
}

export function EChartsGraph({ entities, relationships }: EChartsGraphProps) {
  // Convert graph data to ECharts format
  const option = useMemo<EChartsOption>(() => {
    // Extract unique categories from entities
    const categories = Array.from(new Set(entities.map((e) => e.type))).map((type) => ({
      name: type,
    }))

    // Convert entities to ECharts nodes
    const nodes = entities.map((entity) => {
      const category = categories.findIndex((c) => c.name === entity.type)

      // Calculate node size based on number of connections
      const connectionCount = relationships.filter(
        (r) => r.source_id === entity.id || r.target_id === entity.id
      ).length
      const symbolSize = Math.max(15, Math.min(50, 15 + connectionCount * 3))

      return {
        id: entity.id,
        name: entity.properties.name || entity.properties.description?.substring(0, 30) || entity.id,
        symbolSize,
        category,
        value: connectionCount,
        label: {
          show: symbolSize > 25, // Only show labels for nodes with more connections
        },
        itemStyle: {
          color: ENTITY_COLORS[entity.type] || '#999',
        },
      }
    })

    // Convert relationships to ECharts links
    const links = relationships.map((rel) => ({
      source: rel.source_id,
      target: rel.target_id,
      label: {
        show: false,
        formatter: rel.type,
      },
      lineStyle: {
        curveness: 0.2,
      },
    }))

    return {
      title: {
        text: 'Knowledge Graph',
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 16,
          fontWeight: 'normal',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.dataType === 'node') {
            const entity = entities.find((e) => e.id === params.data.id)
            if (entity) {
              return `
                <strong>${params.data.name}</strong><br/>
                Type: ${entity.type}<br/>
                Connections: ${params.data.value}
              `
            }
          } else if (params.dataType === 'edge') {
            return `Relationship: ${params.data.label.formatter}`
          }
          return params.name
        },
      },
      legend: [
        {
          data: categories.map((c) => c.name),
          orient: 'vertical',
          left: 10,
          top: 50,
          itemGap: 15,
          textStyle: {
            color: '#666',
          },
          formatter: (name: string) => {
            const count = entities.filter((e) => e.type === name).length
            return `${name} (${count})`
          },
        },
      ],
      series: [
        {
          type: 'graph',
          layout: 'force',
          data: nodes,
          links: links,
          categories: categories,
          roam: true, // Enable zoom and pan
          draggable: true, // Enable node dragging
          label: {
            position: 'right',
            formatter: '{b}',
            fontSize: 11,
            color: '#333',
          },
          labelLayout: {
            hideOverlap: true,
          },
          emphasis: {
            focus: 'adjacency',
            label: {
              show: true,
              fontSize: 12,
              fontWeight: 'bold',
            },
            lineStyle: {
              width: 3,
            },
          },
          force: {
            initLayout: 'none',      // Let force algorithm calculate from scratch
            repulsion: 500,          // Strong repulsion for natural spread
            gravity: 0.02,           // Very low gravity for loose organic layout
            edgeLength: [100, 250],  // Longer edges for spacious layout
            layoutAnimation: true,
            friction: 0.5,           // Moderate friction
          },
          lineStyle: {
            color: 'source',
            curveness: 0.2,
            opacity: 0.6,
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
      ],
      animationDuration: 1500,
      animationEasingUpdate: 'quinticInOut',
    }
  }, [entities, relationships])

  return (
    <ReactECharts
      option={option}
      style={{ height: '600px', width: '100%' }}
      opts={{ renderer: 'canvas' }}
      notMerge={true}
      lazyUpdate={true}
    />
  )
}
