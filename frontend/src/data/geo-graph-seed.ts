/**
 * GEO Knowledge Graph Seed Data
 * 7-Layer Architecture: Feature → PainPoint → Scenario → Persona → Value → Product → Prompt
 */

export interface GraphNode {
  id: string
  type: string
  properties: Record<string, any>
}

export interface GraphRelationship {
  id: string
  source_id: string
  target_id: string
  type: string
  properties?: Record<string, any>
}

// Layer 1: Features (产品特性)
const features: GraphNode[] = [
  { id: 'F1', type: 'Feature', properties: { name: 'Cooling Gel', description: 'Advanced cooling gel technology', category: 'material' } },
  { id: 'F2', type: 'Feature', properties: { name: 'Memory Foam', description: 'Pressure-relieving memory foam', category: 'material' } },
  { id: 'F3', type: 'Feature', properties: { name: 'Organic Cotton', description: 'Breathable organic cotton cover', category: 'material' } },
  { id: 'F4', type: 'Feature', properties: { name: 'Edge Support', description: 'Reinforced edge support system', category: 'structure' } },
]

// Layer 2: Pain Points (用户痛点)
const painPoints: GraphNode[] = [
  { id: 'PP1', type: 'Problem', properties: { description: 'Overheating at night', severity: 'high', frequency: 8 } },
  { id: 'PP2', type: 'Problem', properties: { description: 'Back pain after sleep', severity: 'critical', frequency: 9 } },
  { id: 'PP3', type: 'Problem', properties: { description: 'Poor edge stability', severity: 'medium', frequency: 6 } },
  { id: 'PP4', type: 'Problem', properties: { description: 'Chemical smell', severity: 'medium', frequency: 5 } },
]

// Layer 3: Scenarios (使用场景)
const scenarios: GraphNode[] = [
  { id: 'S1', type: 'Scenario', properties: { name: 'Summer sleeping', description: 'Hot weather sleeping conditions', tags: ['seasonal', 'temperature'] } },
  { id: 'S2', type: 'Scenario', properties: { name: 'Side sleeping', description: 'Sleeping on side position', tags: ['posture', 'comfort'] } },
  { id: 'S3', type: 'Scenario', properties: { name: 'Couple sharing', description: 'Two people sharing one bed', tags: ['usage', 'space'] } },
  { id: 'S4', type: 'Scenario', properties: { name: 'Small bedroom', description: 'Limited bedroom space', tags: ['space', 'size'] } },
]

// Layer 4: Personas (用户画像)
const personas: GraphNode[] = [
  { id: 'P1', type: 'UserGroup', properties: { name: 'Hot sleepers', description: 'People who overheat during sleep' } },
  { id: 'P2', type: 'UserGroup', properties: { name: 'Back pain sufferers', description: 'People with chronic back issues' } },
  { id: 'P3', type: 'UserGroup', properties: { name: 'Eco-conscious buyers', description: 'Environmentally aware consumers' } },
  { id: 'P4', type: 'UserGroup', properties: { name: 'Budget shoppers', description: 'Price-sensitive consumers' } },
]

// Layer 5: Values (价值主张)
const values: GraphNode[] = [
  { id: 'V1', type: 'Offer', properties: { offer_id: 'VALUE-001', sku: 'UNDER-300', price: 299, currency: 'USD', availability: 'in_stock' } },
  { id: 'V2', type: 'Offer', properties: { offer_id: 'VALUE-002', sku: 'PREMIUM-500', price: 499, currency: 'USD', availability: 'in_stock' } },
  { id: 'V3', type: 'Offer', properties: { offer_id: 'VALUE-003', sku: 'TRIAL-100', price: 0, currency: 'USD', availability: 'pre_order' } },
]

// Layer 6: Products (产品)
const products: GraphNode[] = [
  { id: 'PROD1', type: 'Product', properties: { name: 'Sweetnight Breeze', sku: 'SN-BREEZE-001', category: 'Mattress', brand: 'Sweetnight', description: 'Cooling gel memory foam mattress' } },
  { id: 'PROD2', type: 'Product', properties: { name: 'Sweetnight Organic', sku: 'SN-ORGANIC-001', category: 'Mattress', brand: 'Sweetnight', description: 'Organic cotton eco-friendly mattress' } },
  { id: 'PROD3', type: 'Product', properties: { name: 'Sweetnight Plus', sku: 'SN-PLUS-001', category: 'Mattress', brand: 'Sweetnight', description: 'Premium memory foam with edge support' } },
]

// Layer 7: Prompts (AI提示词)
const prompts: GraphNode[] = [
  { id: 'PROMPT1', type: 'Scenario', properties: { name: 'Best mattress for hot sleepers under $300', description: 'Comparative search intent', tags: ['P0', 'high-intent'] } },
  { id: 'PROMPT2', type: 'Scenario', properties: { name: 'How to fix back pain with memory foam', description: 'How-to search intent', tags: ['P1', 'educational'] } },
  { id: 'PROMPT3', type: 'Scenario', properties: { name: 'Cooling gel vs memory foam comparison', description: 'Comparison search intent', tags: ['P0', 'decision'] } },
  { id: 'PROMPT4', type: 'Scenario', properties: { name: 'Organic mattress under $300', description: 'Transactional search intent', tags: ['P1', 'commercial'] } },
]

// Relationships: Building the 7-layer graph
const relationships: GraphRelationship[] = [
  // Layer 1 → Layer 2: Features RELIEVE Pain Points
  { id: 'R1', source_id: 'F1', target_id: 'PP1', type: 'RELIEVES', properties: { effectiveness: 0.9 } },
  { id: 'R2', source_id: 'F2', target_id: 'PP2', type: 'RELIEVES', properties: { effectiveness: 0.85 } },
  { id: 'R3', source_id: 'F3', target_id: 'PP4', type: 'RELIEVES', properties: { effectiveness: 0.8 } },
  { id: 'R4', source_id: 'F4', target_id: 'PP3', type: 'RELIEVES', properties: { effectiveness: 0.75 } },

  // Layer 2 → Layer 3: Pain Points OCCUR_IN Scenarios
  { id: 'R5', source_id: 'PP1', target_id: 'S1', type: 'OCCURS_IN', properties: { frequency: 'high' } },
  { id: 'R6', source_id: 'PP2', target_id: 'S2', type: 'OCCURS_IN', properties: { frequency: 'high' } },
  { id: 'R7', source_id: 'PP3', target_id: 'S3', type: 'OCCURS_IN', properties: { frequency: 'medium' } },
  { id: 'R8', source_id: 'PP4', target_id: 'S4', type: 'OCCURS_IN', properties: { frequency: 'low' } },

  // Layer 3 → Layer 4: Scenarios TARGET Personas
  { id: 'R9', source_id: 'S1', target_id: 'P1', type: 'TARGETS', properties: { relevance: 0.95 } },
  { id: 'R10', source_id: 'S2', target_id: 'P2', type: 'TARGETS', properties: { relevance: 0.9 } },
  { id: 'R11', source_id: 'S4', target_id: 'P3', type: 'TARGETS', properties: { relevance: 0.85 } },
  { id: 'R12', source_id: 'S3', target_id: 'P4', type: 'TARGETS', properties: { relevance: 0.8 } },

  // Layer 4 → Layer 5: Personas SEEK Values
  { id: 'R13', source_id: 'P1', target_id: 'V1', type: 'SEEKS', properties: { priority: 'high' } },
  { id: 'R14', source_id: 'P2', target_id: 'V2', type: 'SEEKS', properties: { priority: 'high' } },
  { id: 'R15', source_id: 'P3', target_id: 'V2', type: 'SEEKS', properties: { priority: 'medium' } },
  { id: 'R16', source_id: 'P4', target_id: 'V1', type: 'SEEKS', properties: { priority: 'critical' } },

  // Layer 5 → Layer 6: Values SUPPORTED_BY Products
  { id: 'R17', source_id: 'V1', target_id: 'PROD1', type: 'HAS_OFFER', properties: { availability: 'in_stock' } },
  { id: 'R18', source_id: 'V2', target_id: 'PROD3', type: 'HAS_OFFER', properties: { availability: 'in_stock' } },
  { id: 'R19', source_id: 'V1', target_id: 'PROD2', type: 'HAS_OFFER', properties: { availability: 'in_stock' } },
  { id: 'R20', source_id: 'V3', target_id: 'PROD1', type: 'HAS_OFFER', properties: { availability: 'pre_order' } },

  // Layer 6 → Layer 1: Products HAVE Features
  { id: 'R21', source_id: 'PROD1', target_id: 'F1', type: 'HAS_FEATURE', properties: { confidence: 1.0 } },
  { id: 'R22', source_id: 'PROD1', target_id: 'F2', type: 'HAS_FEATURE', properties: { confidence: 0.9 } },
  { id: 'R23', source_id: 'PROD2', target_id: 'F3', type: 'HAS_FEATURE', properties: { confidence: 1.0 } },
  { id: 'R24', source_id: 'PROD3', target_id: 'F2', type: 'HAS_FEATURE', properties: { confidence: 1.0 } },
  { id: 'R25', source_id: 'PROD3', target_id: 'F4', type: 'HAS_FEATURE', properties: { confidence: 1.0 } },

  // Layer 7 → Layer 2: Prompts ADDRESS Pain Points
  { id: 'R26', source_id: 'PROMPT1', target_id: 'PP1', type: 'APPLIES_TO', properties: { intent: 'comparative' } },
  { id: 'R27', source_id: 'PROMPT2', target_id: 'PP2', type: 'APPLIES_TO', properties: { intent: 'educational' } },
  { id: 'R28', source_id: 'PROMPT3', target_id: 'PP1', type: 'APPLIES_TO', properties: { intent: 'comparison' } },
  { id: 'R29', source_id: 'PROMPT4', target_id: 'PP4', type: 'APPLIES_TO', properties: { intent: 'transactional' } },
]

export const geoGraphSeedData = {
  nodes: [
    ...features,
    ...painPoints,
    ...scenarios,
    ...personas,
    ...values,
    ...products,
    ...prompts,
  ],
  relationships,
}

// Export layer metadata for visualization
export const layerMetadata = {
  layers: [
    { id: 1, name: 'Features', type: 'Feature', color: '#10b981', description: 'Product features and technologies' },
    { id: 2, name: 'Pain Points', type: 'Problem', color: '#ef4444', description: 'User problems and pain points' },
    { id: 3, name: 'Scenarios', type: 'Scenario', color: '#8b5cf6', description: 'Usage scenarios and contexts' },
    { id: 4, name: 'Personas', type: 'UserGroup', color: '#f59e0b', description: 'User personas and segments' },
    { id: 5, name: 'Values', type: 'Offer', color: '#14b8a6', description: 'Value propositions and offers' },
    { id: 6, name: 'Products', type: 'Product', color: '#3b82f6', description: 'Products and SKUs' },
    { id: 7, name: 'Prompts', type: 'Scenario', color: '#ec4899', description: 'AI prompts and search intents' },
  ],
}
