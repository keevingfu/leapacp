import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateEntity, useUpdateEntity } from '@/hooks/useGraph'
import type { GraphEntity } from '@/lib/api/types'

const ENTITY_TYPES = [
  'Product',
  'Feature',
  'Scenario',
  'Problem',
  'UserGroup',
  'Competitor',
  'Offer',
  'Merchant'
] as const

interface EntityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entity?: GraphEntity | null
}

export function EntityDialog({ open, onOpenChange, entity }: EntityDialogProps) {
  const [entityType, setEntityType] = useState<string>(entity?.type || 'Product')
  const [properties, setProperties] = useState<Record<string, any>>(entity?.properties || {})

  const createMutation = useCreateEntity()
  const updateMutation = useUpdateEntity()

  useEffect(() => {
    if (entity) {
      setEntityType(entity.type)
      setProperties(entity.properties)
    } else {
      setEntityType('Product')
      setProperties({})
    }
  }, [entity])

  const handleSave = async () => {
    if (entity) {
      await updateMutation.mutateAsync({
        id: entity.id,
        data: { type: entityType, properties }
      })
    } else {
      await createMutation.mutateAsync({
        type: entityType as any,
        properties
      })
    }
    onOpenChange(false)
  }

  const handlePropertyChange = (key: string, value: any) => {
    setProperties(prev => ({ ...prev, [key]: value }))
  }

  const renderPropertyFields = () => {
    switch (entityType) {
      case 'Product':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={properties.name || ''}
                onChange={(e) => handlePropertyChange('name', e.target.value)}
                placeholder="Product name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={properties.sku || ''}
                onChange={(e) => handlePropertyChange('sku', e.target.value)}
                placeholder="SKU-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={properties.category || ''}
                onChange={(e) => handlePropertyChange('category', e.target.value)}
                placeholder="e.g., Mattress"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={properties.brand || ''}
                onChange={(e) => handlePropertyChange('brand', e.target.value)}
                placeholder="e.g., Sweetnight"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={properties.description || ''}
                onChange={(e) => handlePropertyChange('description', e.target.value)}
                placeholder="Product description"
                rows={3}
              />
            </div>
          </>
        )
      case 'Feature':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={properties.name || ''}
                onChange={(e) => handlePropertyChange('name', e.target.value)}
                placeholder="Feature name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={properties.type || ''}
                onChange={(e) => handlePropertyChange('type', e.target.value)}
                placeholder="e.g., material, technology"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={properties.value || ''}
                onChange={(e) => handlePropertyChange('value', e.target.value)}
                placeholder="Feature value"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={properties.description || ''}
                onChange={(e) => handlePropertyChange('description', e.target.value)}
                placeholder="Feature description"
                rows={3}
              />
            </div>
          </>
        )
      case 'Problem':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={properties.description || ''}
                onChange={(e) => handlePropertyChange('description', e.target.value)}
                placeholder="Problem description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select
                value={properties.severity || 'medium'}
                onValueChange={(value) => handlePropertyChange('severity', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency (1-10)</Label>
              <Input
                id="frequency"
                type="number"
                min="1"
                max="10"
                value={properties.frequency || 5}
                onChange={(e) => handlePropertyChange('frequency', parseInt(e.target.value))}
              />
            </div>
          </>
        )
      case 'Scenario':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={properties.name || ''}
                onChange={(e) => handlePropertyChange('name', e.target.value)}
                placeholder="Scenario name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={properties.description || ''}
                onChange={(e) => handlePropertyChange('description', e.target.value)}
                placeholder="Scenario description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={Array.isArray(properties.tags) ? properties.tags.join(', ') : ''}
                onChange={(e) => handlePropertyChange('tags', e.target.value.split(',').map((t: string) => t.trim()))}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </>
        )
      case 'UserGroup':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={properties.name || ''}
                onChange={(e) => handlePropertyChange('name', e.target.value)}
                placeholder="User group name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={properties.description || ''}
                onChange={(e) => handlePropertyChange('description', e.target.value)}
                placeholder="User group description"
                rows={3}
              />
            </div>
          </>
        )
      case 'Offer':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="offer_id">Offer ID *</Label>
              <Input
                id="offer_id"
                value={properties.offer_id || ''}
                onChange={(e) => handlePropertyChange('offer_id', e.target.value)}
                placeholder="OFFER-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={properties.sku || ''}
                onChange={(e) => handlePropertyChange('sku', e.target.value)}
                placeholder="SKU-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="merchant_id">Merchant ID</Label>
              <Input
                id="merchant_id"
                value={properties.merchant_id || ''}
                onChange={(e) => handlePropertyChange('merchant_id', e.target.value)}
                placeholder="merchant_123"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={properties.price || ''}
                  onChange={(e) => handlePropertyChange('price', parseFloat(e.target.value))}
                  placeholder="99.99"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={properties.currency || 'USD'}
                  onChange={(e) => handlePropertyChange('currency', e.target.value)}
                  placeholder="USD"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Select
                value={properties.availability || 'in_stock'}
                onValueChange={(value) => handlePropertyChange('availability', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="pre_order">Pre-order</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )
      default:
        return (
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={properties.name || ''}
              onChange={(e) => handlePropertyChange('name', e.target.value)}
              placeholder="Entity name"
            />
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{entity ? 'Edit Entity' : 'Create New Entity'}</DialogTitle>
          <DialogDescription>
            {entity ? 'Update entity properties' : 'Create a new entity in the knowledge graph'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!entity && (
            <div className="space-y-2">
              <Label htmlFor="entity-type">Entity Type *</Label>
              <Select value={entityType} onValueChange={setEntityType}>
                <SelectTrigger id="entity-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ENTITY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {renderPropertyFields()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
