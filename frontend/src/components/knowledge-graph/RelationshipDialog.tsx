import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateRelationship } from '@/hooks/useGraph'

const RELATIONSHIP_TYPES = [
  { value: 'HAS_FEATURE', label: 'Has Feature', properties: ['confidence'] },
  { value: 'SOLVES', label: 'Solves', properties: ['effectiveness'] },
  { value: 'APPLIES_TO', label: 'Applies To', properties: ['relevance'] },
  { value: 'TARGETS', label: 'Targets', properties: ['priority'] },
  { value: 'COMPARES_WITH', label: 'Compares With', properties: ['comparison_type'] },
  { value: 'HAS_OFFER', label: 'Has Offer', properties: [] },
  { value: 'SOLD_BY', label: 'Sold By', properties: [] },
  { value: 'GENERATED_FROM', label: 'Generated From', properties: [] },
] as const

interface RelationshipDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sourceId?: string
  targetId?: string
}

export function RelationshipDialog({ open, onOpenChange, sourceId, targetId }: RelationshipDialogProps) {
  const [relationshipType, setRelationshipType] = useState<string>('HAS_FEATURE')
  const [source, setSource] = useState<string>(sourceId || '')
  const [target, setTarget] = useState<string>(targetId || '')
  const [properties, setProperties] = useState<Record<string, any>>({})

  const createMutation = useCreateRelationship()

  const handleSave = async () => {
    await createMutation.mutateAsync({
      type: relationshipType,
      source_id: source,
      target_id: target,
      properties
    })
    onOpenChange(false)
    // Reset form
    setRelationshipType('HAS_FEATURE')
    setSource(sourceId || '')
    setTarget(targetId || '')
    setProperties({})
  }

  const handlePropertyChange = (key: string, value: any) => {
    setProperties(prev => ({ ...prev, [key]: value }))
  }

  const selectedRelType = RELATIONSHIP_TYPES.find(t => t.value === relationshipType)

  const renderPropertyFields = () => {
    if (!selectedRelType || selectedRelType.properties.length === 0) {
      return null
    }

    return (
      <div className="space-y-4">
        <Label className="text-sm font-medium">Relationship Properties</Label>
        {selectedRelType.properties.map((prop) => (
          <div key={prop} className="space-y-2">
            <Label htmlFor={prop} className="text-sm">
              {prop.charAt(0).toUpperCase() + prop.slice(1).replace(/_/g, ' ')}
            </Label>
            {prop === 'comparison_type' ? (
              <Select
                value={properties[prop] || 'feature'}
                onValueChange={(value) => handlePropertyChange(prop, value)}
              >
                <SelectTrigger id={prop}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="quality">Quality</SelectItem>
                  <SelectItem value="brand">Brand</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={prop}
                type="number"
                step="0.1"
                min="0"
                max={prop === 'priority' ? '10' : '1'}
                value={properties[prop] || (prop === 'priority' ? 5 : 0.8)}
                onChange={(e) => handlePropertyChange(prop, parseFloat(e.target.value))}
                placeholder={prop === 'priority' ? '1-10' : '0.0-1.0'}
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Relationship</DialogTitle>
          <DialogDescription>
            Connect two entities in the knowledge graph
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rel-type">Relationship Type *</Label>
            <Select value={relationshipType} onValueChange={setRelationshipType}>
              <SelectTrigger id="rel-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RELATIONSHIP_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source Entity ID *</Label>
            <Input
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Source entity ID"
              disabled={!!sourceId}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Target Entity ID *</Label>
            <Input
              id="target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Target entity ID"
              disabled={!!targetId}
            />
          </div>

          {renderPropertyFields()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!source || !target || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
