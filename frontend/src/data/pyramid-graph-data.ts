/**
 * Pyramid Knowledge Graph Data
 * 7-Layer Architecture (Top to Bottom):
 * Product → Feature → PainPoint → Scenario → Persona → Value → Prompt
 */

export interface PyramidNode {
  id: string
  type: string
  layer: number
  label: string
  description?: string
  color: string
  children?: string[] // IDs of child nodes
}

export interface PyramidLayer {
  id: number
  name: string
  type: string
  color: string
  description: string
}

// Layer definitions (Top to Bottom)
export const pyramidLayers: PyramidLayer[] = [
  { id: 1, name: 'Products', type: 'Product', color: '#3b82f6', description: 'Products and SKUs' },
  { id: 2, name: 'Features', type: 'Feature', color: '#10b981', description: 'Product features and technologies' },
  { id: 3, name: 'Pain Points', type: 'Problem', color: '#ef4444', description: 'User problems and pain points' },
  { id: 4, name: 'Scenarios', type: 'Scenario', color: '#8b5cf6', description: 'Usage scenarios and contexts' },
  { id: 5, name: 'Personas', type: 'UserGroup', color: '#f59e0b', description: 'User personas and segments' },
  { id: 6, name: 'Values', type: 'Value', color: '#14b8a6', description: 'Value propositions and offers' },
  { id: 7, name: 'Prompts', type: 'Prompt', color: '#ec4899', description: 'AI prompts and search intents' },
]

// Layer 1: Products (顶部)
const products: PyramidNode[] = [
  {
    id: 'PROD1',
    type: 'Product',
    layer: 1,
    label: 'Sweetnight Breeze',
    description: 'Cooling gel memory foam mattress',
    color: '#3b82f6',
    children: ['F1', 'F2'],
  },
  {
    id: 'PROD2',
    type: 'Product',
    layer: 1,
    label: 'Sweetnight Organic',
    description: 'Organic cotton eco-friendly mattress',
    color: '#3b82f6',
    children: ['F3'],
  },
  {
    id: 'PROD3',
    type: 'Product',
    layer: 1,
    label: 'Sweetnight Plus',
    description: 'Premium memory foam with edge support',
    color: '#3b82f6',
    children: ['F2', 'F4'],
  },
]

// Layer 2: Features
const features: PyramidNode[] = [
  {
    id: 'F1',
    type: 'Feature',
    layer: 2,
    label: 'Cooling Gel',
    description: 'Advanced cooling gel technology',
    color: '#10b981',
    children: ['PP1'],
  },
  {
    id: 'F2',
    type: 'Feature',
    layer: 2,
    label: 'Memory Foam',
    description: 'Pressure-relieving memory foam',
    color: '#10b981',
    children: ['PP2'],
  },
  {
    id: 'F3',
    type: 'Feature',
    layer: 2,
    label: 'Organic Cotton',
    description: 'Breathable organic cotton cover',
    color: '#10b981',
    children: ['PP4'],
  },
  {
    id: 'F4',
    type: 'Feature',
    layer: 2,
    label: 'Edge Support',
    description: 'Reinforced edge support system',
    color: '#10b981',
    children: ['PP3'],
  },
]

// Layer 3: Pain Points
const painPoints: PyramidNode[] = [
  {
    id: 'PP1',
    type: 'Problem',
    layer: 3,
    label: 'Overheating at night',
    description: 'High severity, frequency: 8/10',
    color: '#ef4444',
    children: ['S1'],
  },
  {
    id: 'PP2',
    type: 'Problem',
    layer: 3,
    label: 'Back pain after sleep',
    description: 'Critical severity, frequency: 9/10',
    color: '#ef4444',
    children: ['S2'],
  },
  {
    id: 'PP3',
    type: 'Problem',
    layer: 3,
    label: 'Poor edge stability',
    description: 'Medium severity, frequency: 6/10',
    color: '#ef4444',
    children: ['S3'],
  },
  {
    id: 'PP4',
    type: 'Problem',
    layer: 3,
    label: 'Chemical smell',
    description: 'Medium severity, frequency: 5/10',
    color: '#ef4444',
    children: ['S4'],
  },
]

// Layer 4: Scenarios
const scenarios: PyramidNode[] = [
  {
    id: 'S1',
    type: 'Scenario',
    layer: 4,
    label: 'Summer sleeping',
    description: 'Hot weather sleeping conditions',
    color: '#8b5cf6',
    children: ['P1'],
  },
  {
    id: 'S2',
    type: 'Scenario',
    layer: 4,
    label: 'Side sleeping',
    description: 'Sleeping on side position',
    color: '#8b5cf6',
    children: ['P2'],
  },
  {
    id: 'S3',
    type: 'Scenario',
    layer: 4,
    label: 'Couple sharing',
    description: 'Two people sharing one bed',
    color: '#8b5cf6',
    children: ['P4'],
  },
  {
    id: 'S4',
    type: 'Scenario',
    layer: 4,
    label: 'Small bedroom',
    description: 'Limited bedroom space',
    color: '#8b5cf6',
    children: ['P3'],
  },
]

// Layer 5: Personas
const personas: PyramidNode[] = [
  {
    id: 'P1',
    type: 'UserGroup',
    layer: 5,
    label: 'Hot sleepers',
    description: 'People who overheat during sleep',
    color: '#f59e0b',
    children: ['V1'],
  },
  {
    id: 'P2',
    type: 'UserGroup',
    layer: 5,
    label: 'Back pain sufferers',
    description: 'People with chronic back issues',
    color: '#f59e0b',
    children: ['V2'],
  },
  {
    id: 'P3',
    type: 'UserGroup',
    layer: 5,
    label: 'Eco-conscious buyers',
    description: 'Environmentally aware consumers',
    color: '#f59e0b',
    children: ['V2'],
  },
  {
    id: 'P4',
    type: 'UserGroup',
    layer: 5,
    label: 'Budget shoppers',
    description: 'Price-sensitive consumers',
    color: '#f59e0b',
    children: ['V1'],
  },
]

// Layer 6: Values
const values: PyramidNode[] = [
  {
    id: 'V1',
    type: 'Value',
    layer: 6,
    label: 'Under $300',
    description: 'Affordable price point',
    color: '#14b8a6',
    children: ['PROMPT1', 'PROMPT4'],
  },
  {
    id: 'V2',
    type: 'Value',
    layer: 6,
    label: 'Premium $500',
    description: 'High-end quality',
    color: '#14b8a6',
    children: ['PROMPT2'],
  },
  {
    id: 'V3',
    type: 'Value',
    layer: 6,
    label: 'Free Trial',
    description: 'Risk-free testing',
    color: '#14b8a6',
    children: ['PROMPT3'],
  },
]

// Layer 7: Prompts (底部)
const prompts: PyramidNode[] = [
  {
    id: 'PROMPT1',
    type: 'Prompt',
    layer: 7,
    label: 'Best mattress for hot sleepers under $300',
    description: 'Comparative search intent',
    color: '#ec4899',
  },
  {
    id: 'PROMPT2',
    type: 'Prompt',
    layer: 7,
    label: 'How to fix back pain with memory foam',
    description: 'How-to search intent',
    color: '#ec4899',
  },
  {
    id: 'PROMPT3',
    type: 'Prompt',
    layer: 7,
    label: 'Cooling gel vs memory foam comparison',
    description: 'Comparison search intent',
    color: '#ec4899',
  },
  {
    id: 'PROMPT4',
    type: 'Prompt',
    layer: 7,
    label: 'Organic mattress under $300',
    description: 'Transactional search intent',
    color: '#ec4899',
  },
]

// All nodes by layer
export const pyramidGraphData = {
  layers: pyramidLayers,
  nodes: [
    ...products,
    ...features,
    ...painPoints,
    ...scenarios,
    ...personas,
    ...values,
    ...prompts,
  ],
  // Map for quick lookup
  nodeMap: {} as Record<string, PyramidNode>,
}

// Build node map
pyramidGraphData.nodes.forEach((node) => {
  pyramidGraphData.nodeMap[node.id] = node
})

// Helper function to get children of a node
export function getChildren(nodeId: string): PyramidNode[] {
  const node = pyramidGraphData.nodeMap[nodeId]
  if (!node || !node.children) return []

  return node.children
    .map((childId) => pyramidGraphData.nodeMap[childId])
    .filter(Boolean)
}

// Helper function to get all nodes in a layer
export function getNodesInLayer(layer: number): PyramidNode[] {
  return pyramidGraphData.nodes.filter((node) => node.layer === layer)
}

// Helper function to get parent nodes
export function getParents(nodeId: string): PyramidNode[] {
  return pyramidGraphData.nodes.filter(
    (node) => node.children && node.children.includes(nodeId)
  )
}
