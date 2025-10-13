import { useState } from 'react'
import { useCreateEntity, useCreateRelationship } from './useGraph'
import { geoGraphSeedData } from '@/data/geo-graph-seed'
import { useUIStore } from '@/store'

export function useImportGeoGraph() {
  const [isImporting, setIsImporting] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0, stage: '' })

  const createEntity = useCreateEntity()
  const createRelationship = useCreateRelationship()
  const { addNotification } = useUIStore()

  const importGraph = async () => {
    try {
      setIsImporting(true)

      const totalSteps = geoGraphSeedData.nodes.length + geoGraphSeedData.relationships.length
      let currentStep = 0

      // Step 1: Import all nodes
      setProgress({ current: 0, total: totalSteps, stage: 'Importing entities' })

      for (const node of geoGraphSeedData.nodes) {
        try {
          await createEntity.mutateAsync({
            type: node.type as any,
            properties: node.properties,
          })
          currentStep++
          setProgress({ current: currentStep, total: totalSteps, stage: 'Importing entities' })
        } catch (error) {
          console.error(`Failed to create entity ${node.id}:`, error)
          // Continue with other entities even if one fails
        }
      }

      // Small delay to ensure entities are created
      await new Promise(resolve => setTimeout(resolve, 500))

      // Step 2: Import all relationships
      setProgress({ current: currentStep, total: totalSteps, stage: 'Creating relationships' })

      for (const rel of geoGraphSeedData.relationships) {
        try {
          await createRelationship.mutateAsync({
            source_id: rel.source_id,
            target_id: rel.target_id,
            type: rel.type,
            properties: rel.properties,
          })
          currentStep++
          setProgress({ current: currentStep, total: totalSteps, stage: 'Creating relationships' })
        } catch (error) {
          console.error(`Failed to create relationship ${rel.id}:`, error)
          // Continue with other relationships even if one fails
        }
      }

      setProgress({ current: totalSteps, total: totalSteps, stage: 'Complete' })

      addNotification({
        type: 'success',
        title: 'GEO Graph Imported',
        message: `Successfully imported ${geoGraphSeedData.nodes.length} entities and ${geoGraphSeedData.relationships.length} relationships`,
      })

      return true
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Import Failed',
        message: error.message || 'Failed to import GEO graph',
      })
      return false
    } finally {
      setIsImporting(false)
    }
  }

  return {
    importGraph,
    isImporting,
    progress,
  }
}
