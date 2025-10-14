/**
 * Pyramid Knowledge Graph Data
 * 8-Layer Architecture (Top to Bottom):
 * Brand → Product → Feature → PainPoint → Scenario → Persona → Value → Prompt
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
  { id: 0, name: 'Brand', type: 'Brand', color: '#6366f1', description: 'Brand identity and positioning' },
  { id: 1, name: 'Products', type: 'Product', color: '#3b82f6', description: 'Products and SKUs' },
  { id: 2, name: 'Features', type: 'Feature', color: '#10b981', description: 'Product features and technologies' },
  { id: 3, name: 'Pain Points', type: 'Problem', color: '#ef4444', description: 'User problems and pain points' },
  { id: 4, name: 'Scenarios', type: 'Scenario', color: '#8b5cf6', description: 'Usage scenarios and contexts' },
  { id: 5, name: 'Personas', type: 'UserGroup', color: '#f59e0b', description: 'User personas and segments' },
  { id: 6, name: 'Values', type: 'Value', color: '#14b8a6', description: 'Value propositions and offers' },
  { id: 7, name: 'Prompts', type: 'Prompt', color: '#ec4899', description: 'AI prompts and search intents' },
]

// Layer 0: Brand (顶部)
const brand: PyramidNode[] = [
  {
    id: 'BRAND1',
    type: 'Brand',
    layer: 0,
    label: 'SweetNight',
    description: 'Premium sleep solutions brand',
    color: '#6366f1',
    children: ['PROD1', 'PROD2', 'PROD3'],
  },
]

// Layer 1: Products
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

// Layer 2: Features (6 nodes - more than Layer 1)
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
  {
    id: 'F5',
    type: 'Feature',
    layer: 2,
    label: 'Hypoallergenic',
    description: 'Allergy-free materials',
    color: '#10b981',
    children: ['PP5'],
  },
  {
    id: 'F6',
    type: 'Feature',
    layer: 2,
    label: 'Motion Isolation',
    description: 'Reduces partner disturbance',
    color: '#10b981',
    children: ['PP6'],
  },
]

// Layer 3: Pain Points (8 nodes - more than Layer 2)
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
  {
    id: 'PP5',
    type: 'Problem',
    layer: 3,
    label: 'Allergy issues',
    description: 'Medium severity, frequency: 6/10',
    color: '#ef4444',
    children: ['S5'],
  },
  {
    id: 'PP6',
    type: 'Problem',
    layer: 3,
    label: 'Partner disturbance',
    description: 'Medium severity, frequency: 7/10',
    color: '#ef4444',
    children: ['S6'],
  },
  {
    id: 'PP7',
    type: 'Problem',
    layer: 3,
    label: 'Mattress too firm',
    description: 'Medium severity, frequency: 6/10',
    color: '#ef4444',
    children: ['S7'],
  },
  {
    id: 'PP8',
    type: 'Problem',
    layer: 3,
    label: 'Mattress too soft',
    description: 'Medium severity, frequency: 5/10',
    color: '#ef4444',
    children: ['S8'],
  },
]

// Layer 4: Scenarios (10 nodes - more than Layer 3)
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
  {
    id: 'S5',
    type: 'Scenario',
    layer: 4,
    label: 'Allergy season',
    description: 'High pollen and allergen exposure',
    color: '#8b5cf6',
    children: ['P5'],
  },
  {
    id: 'S6',
    type: 'Scenario',
    layer: 4,
    label: 'Light sleeper',
    description: 'Easily disturbed by movements',
    color: '#8b5cf6',
    children: ['P6'],
  },
  {
    id: 'S7',
    type: 'Scenario',
    layer: 4,
    label: 'Back sleeper',
    description: 'Sleeping on back position',
    color: '#8b5cf6',
    children: ['P7'],
  },
  {
    id: 'S8',
    type: 'Scenario',
    layer: 4,
    label: 'Stomach sleeper',
    description: 'Sleeping on stomach position',
    color: '#8b5cf6',
    children: ['P8'],
  },
  {
    id: 'S9',
    type: 'Scenario',
    layer: 4,
    label: 'Winter sleeping',
    description: 'Cold weather sleeping conditions',
    color: '#8b5cf6',
    children: ['P9'],
  },
  {
    id: 'S10',
    type: 'Scenario',
    layer: 4,
    label: 'Heavy person',
    description: 'Extra support needed',
    color: '#8b5cf6',
    children: ['P10'],
  },
]

// Layer 5: Personas (12 nodes - more than Layer 4)
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
  {
    id: 'P5',
    type: 'UserGroup',
    layer: 5,
    label: 'Allergy sufferers',
    description: 'People with allergies',
    color: '#f59e0b',
    children: ['V3'],
  },
  {
    id: 'P6',
    type: 'UserGroup',
    layer: 5,
    label: 'Couples',
    description: 'Partners sharing bed',
    color: '#f59e0b',
    children: ['V4'],
  },
  {
    id: 'P7',
    type: 'UserGroup',
    layer: 5,
    label: 'Athletes',
    description: 'Active recovery seekers',
    color: '#f59e0b',
    children: ['V5'],
  },
  {
    id: 'P8',
    type: 'UserGroup',
    layer: 5,
    label: 'Senior citizens',
    description: 'Elderly with joint pain',
    color: '#f59e0b',
    children: ['V6'],
  },
  {
    id: 'P9',
    type: 'UserGroup',
    layer: 5,
    label: 'Young professionals',
    description: 'Career-focused urbanites',
    color: '#f59e0b',
    children: ['V7'],
  },
  {
    id: 'P10',
    type: 'UserGroup',
    layer: 5,
    label: 'Heavy individuals',
    description: 'Need extra support',
    color: '#f59e0b',
    children: ['V8'],
  },
  {
    id: 'P11',
    type: 'UserGroup',
    layer: 5,
    label: 'Students',
    description: 'Budget-conscious students',
    color: '#f59e0b',
    children: ['V9'],
  },
  {
    id: 'P12',
    type: 'UserGroup',
    layer: 5,
    label: 'Families',
    description: 'Parents with kids',
    color: '#f59e0b',
    children: ['V10'],
  },
]

// Layer 6: Values (14 nodes - more than Layer 5)
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
  {
    id: 'V4',
    type: 'Value',
    layer: 6,
    label: 'Free Shipping',
    description: 'No delivery cost',
    color: '#14b8a6',
    children: ['PROMPT5'],
  },
  {
    id: 'V5',
    type: 'Value',
    layer: 6,
    label: '10 Year Warranty',
    description: 'Long-term protection',
    color: '#14b8a6',
    children: ['PROMPT6'],
  },
  {
    id: 'V6',
    type: 'Value',
    layer: 6,
    label: 'Eco Certified',
    description: 'Environment friendly',
    color: '#14b8a6',
    children: ['PROMPT7'],
  },
  {
    id: 'V7',
    type: 'Value',
    layer: 6,
    label: '24/7 Support',
    description: 'Always available help',
    color: '#14b8a6',
    children: ['PROMPT8'],
  },
  {
    id: 'V8',
    type: 'Value',
    layer: 6,
    label: 'Made in USA',
    description: 'American quality',
    color: '#14b8a6',
    children: ['PROMPT9'],
  },
  {
    id: 'V9',
    type: 'Value',
    layer: 6,
    label: '100 Night Trial',
    description: 'Extended test period',
    color: '#14b8a6',
    children: ['PROMPT10'],
  },
  {
    id: 'V10',
    type: 'Value',
    layer: 6,
    label: 'Easy Setup',
    description: 'No tools needed',
    color: '#14b8a6',
    children: ['PROMPT11'],
  },
  {
    id: 'V11',
    type: 'Value',
    layer: 6,
    label: 'CertiPUR-US',
    description: 'Certified foam safety',
    color: '#14b8a6',
    children: ['PROMPT12'],
  },
  {
    id: 'V12',
    type: 'Value',
    layer: 6,
    label: 'Bundle Deals',
    description: 'Save with packages',
    color: '#14b8a6',
    children: ['PROMPT13'],
  },
  {
    id: 'V13',
    type: 'Value',
    layer: 6,
    label: 'Financing Options',
    description: 'Pay over time',
    color: '#14b8a6',
    children: ['PROMPT14'],
  },
  {
    id: 'V14',
    type: 'Value',
    layer: 6,
    label: 'White Glove Delivery',
    description: 'Premium service',
    color: '#14b8a6',
    children: ['PROMPT15'],
  },
]

// Layer 7: Prompts (16 nodes - most at the bottom, forming inverted pyramid)
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
  {
    id: 'PROMPT5',
    type: 'Prompt',
    layer: 7,
    label: 'Free shipping mattress deals',
    description: 'Commercial search intent',
    color: '#ec4899',
  },
  {
    id: 'PROMPT6',
    type: 'Prompt',
    layer: 7,
    label: 'Mattress with 10 year warranty',
    description: 'Feature search intent',
    color: '#ec4899',
  },
  {
    id: 'PROMPT7',
    type: 'Prompt',
    layer: 7,
    label: 'Eco-friendly mattress brands',
    description: 'Informational search intent',
    color: '#ec4899',
  },
  {
    id: 'PROMPT8',
    type: 'Prompt',
    layer: 7,
    label: 'Best mattress for couples',
    description: 'Comparative search intent',
    color: '#ec4899',
  },
  {
    id: 'PROMPT9',
    type: 'Prompt',
    layer: 7,
    label: 'Made in USA mattress reviews',
    description: 'Review search intent',
    color: '#ec4899',
  },
  {
    id: 'PROMPT10',
    type: 'Prompt',
    layer: 7,
    label: '100 night trial mattress',
    description: 'Feature search intent',
    color: '#ec4899',
  },
  {
    id: 'PROMPT11',
    type: 'Prompt',
    layer: 7,
    label: 'Easy setup mattress in a box',
    description: 'Convenience search intent',
    color: '#ec4899',
  },
  {
    id: 'PROMPT12',
    type: 'Prompt',
    layer: 7,
    label: 'CertiPUR-US certified mattress',
    description: 'Safety search intent',
    color: '#ec4899',
  },
  {
    id: 'PROMPT13',
    type: 'Prompt',
    layer: 7,
    label: 'Mattress bundle deals and packages',
    description: 'Deal search intent',
    color: '#ec4899',
  },
  {
    id: 'PROMPT14',
    type: 'Prompt',
    layer: 7,
    label: 'Buy mattress with financing',
    description: 'Financial search intent',
    color: '#ec4899',
  },
  {
    id: 'PROMPT15',
    type: 'Prompt',
    layer: 7,
    label: 'White glove mattress delivery service',
    description: 'Premium service search intent',
    color: '#ec4899',
  },
  {
    id: 'PROMPT16',
    type: 'Prompt',
    layer: 7,
    label: 'Best mattress for side sleepers',
    description: 'Position-specific search intent',
    color: '#ec4899',
  },
]

// All nodes by layer
export const pyramidGraphData = {
  layers: pyramidLayers,
  nodes: [
    ...brand,
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
