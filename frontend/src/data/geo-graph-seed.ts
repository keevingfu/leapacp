/**
 * GEO Knowledge Graph Seed Data
 * 8-Layer Architecture: Brand → Product → Feature → PainPoint → Scenario → Persona → Value → Prompt
 */

export interface GraphNode {
  id: string
  type: string
  properties: Record<string, any>
  layer?: number  // Add layer information for hierarchy
}

export interface GraphRelationship {
  id: string
  source_id: string
  target_id: string
  type: string
  properties?: Record<string, any>
}

// Layer 0: Brand (品牌)
const brand: GraphNode[] = [
  { id: 'BRAND1', type: 'Brand', layer: 0, properties: { name: 'SweetNight', description: 'Premium sleep solutions brand', founded: 2017 } },
]

// Layer 1: Products (产品) - moved from Layer 6
const products: GraphNode[] = [
  { id: 'PROD1', type: 'Product', layer: 1, properties: { name: 'Sweetnight Breeze', sku: 'SN-BREEZE-001', category: 'Mattress', brand: 'Sweetnight', description: 'Cooling gel memory foam mattress' } },
  { id: 'PROD2', type: 'Product', layer: 1, properties: { name: 'Sweetnight Organic', sku: 'SN-ORGANIC-001', category: 'Mattress', brand: 'Sweetnight', description: 'Organic cotton eco-friendly mattress' } },
  { id: 'PROD3', type: 'Product', layer: 1, properties: { name: 'Sweetnight Plus', sku: 'SN-PLUS-001', category: 'Mattress', brand: 'Sweetnight', description: 'Premium memory foam with edge support' } },
]

// Layer 2: Features (产品特性) - 6 nodes
const features: GraphNode[] = [
  { id: 'F1', type: 'Feature', layer: 2, properties: { name: 'Cooling Gel', description: 'Advanced cooling gel technology', category: 'material' } },
  { id: 'F2', type: 'Feature', layer: 2, properties: { name: 'Memory Foam', description: 'Pressure-relieving memory foam', category: 'material' } },
  { id: 'F3', type: 'Feature', layer: 2, properties: { name: 'Organic Cotton', description: 'Breathable organic cotton cover', category: 'material' } },
  { id: 'F4', type: 'Feature', layer: 2, properties: { name: 'Edge Support', description: 'Reinforced edge support system', category: 'structure' } },
  { id: 'F5', type: 'Feature', layer: 2, properties: { name: 'Hypoallergenic', description: 'Allergy-free materials', category: 'material' } },
  { id: 'F6', type: 'Feature', layer: 2, properties: { name: 'Motion Isolation', description: 'Reduces partner disturbance', category: 'comfort' } },
]

// Layer 3: Pain Points (用户痛点) - 8 nodes
const painPoints: GraphNode[] = [
  { id: 'PP1', type: 'Problem', layer: 3, properties: { description: 'Overheating at night', severity: 'high', frequency: 8 } },
  { id: 'PP2', type: 'Problem', layer: 3, properties: { description: 'Back pain after sleep', severity: 'critical', frequency: 9 } },
  { id: 'PP3', type: 'Problem', layer: 3, properties: { description: 'Poor edge stability', severity: 'medium', frequency: 6 } },
  { id: 'PP4', type: 'Problem', layer: 3, properties: { description: 'Chemical smell', severity: 'medium', frequency: 5 } },
  { id: 'PP5', type: 'Problem', layer: 3, properties: { description: 'Allergy issues', severity: 'medium', frequency: 6 } },
  { id: 'PP6', type: 'Problem', layer: 3, properties: { description: 'Partner disturbance', severity: 'medium', frequency: 7 } },
  { id: 'PP7', type: 'Problem', layer: 3, properties: { description: 'Mattress too firm', severity: 'medium', frequency: 6 } },
  { id: 'PP8', type: 'Problem', layer: 3, properties: { description: 'Mattress too soft', severity: 'medium', frequency: 5 } },
]

// Layer 4: Scenarios (使用场景) - 10 nodes
const scenarios: GraphNode[] = [
  { id: 'S1', type: 'Scenario', layer: 4, properties: { name: 'Summer sleeping', description: 'Hot weather sleeping conditions', tags: ['seasonal', 'temperature'] } },
  { id: 'S2', type: 'Scenario', layer: 4, properties: { name: 'Side sleeping', description: 'Sleeping on side position', tags: ['posture', 'comfort'] } },
  { id: 'S3', type: 'Scenario', layer: 4, properties: { name: 'Couple sharing', description: 'Two people sharing one bed', tags: ['usage', 'space'] } },
  { id: 'S4', type: 'Scenario', layer: 4, properties: { name: 'Small bedroom', description: 'Limited bedroom space', tags: ['space', 'size'] } },
  { id: 'S5', type: 'Scenario', layer: 4, properties: { name: 'Allergy season', description: 'High pollen and allergen exposure', tags: ['health', 'seasonal'] } },
  { id: 'S6', type: 'Scenario', layer: 4, properties: { name: 'Light sleeper', description: 'Easily disturbed by movements', tags: ['sensitivity', 'sleep'] } },
  { id: 'S7', type: 'Scenario', layer: 4, properties: { name: 'Back sleeper', description: 'Sleeping on back position', tags: ['posture', 'support'] } },
  { id: 'S8', type: 'Scenario', layer: 4, properties: { name: 'Stomach sleeper', description: 'Sleeping on stomach position', tags: ['posture', 'comfort'] } },
  { id: 'S9', type: 'Scenario', layer: 4, properties: { name: 'Winter sleeping', description: 'Cold weather sleeping conditions', tags: ['seasonal', 'temperature'] } },
  { id: 'S10', type: 'Scenario', layer: 4, properties: { name: 'Heavy person', description: 'Extra support needed', tags: ['support', 'weight'] } },
]

// Layer 5: Personas (用户画像) - 12 nodes
const personas: GraphNode[] = [
  { id: 'P1', type: 'UserGroup', layer: 5, properties: { name: 'Hot sleepers', description: 'People who overheat during sleep' } },
  { id: 'P2', type: 'UserGroup', layer: 5, properties: { name: 'Back pain sufferers', description: 'People with chronic back issues' } },
  { id: 'P3', type: 'UserGroup', layer: 5, properties: { name: 'Eco-conscious buyers', description: 'Environmentally aware consumers' } },
  { id: 'P4', type: 'UserGroup', layer: 5, properties: { name: 'Budget shoppers', description: 'Price-sensitive consumers' } },
  { id: 'P5', type: 'UserGroup', layer: 5, properties: { name: 'Allergy sufferers', description: 'People with allergies' } },
  { id: 'P6', type: 'UserGroup', layer: 5, properties: { name: 'Couples', description: 'Partners sharing bed' } },
  { id: 'P7', type: 'UserGroup', layer: 5, properties: { name: 'Athletes', description: 'Active recovery seekers' } },
  { id: 'P8', type: 'UserGroup', layer: 5, properties: { name: 'Senior citizens', description: 'Elderly with joint pain' } },
  { id: 'P9', type: 'UserGroup', layer: 5, properties: { name: 'Young professionals', description: 'Career-focused urbanites' } },
  { id: 'P10', type: 'UserGroup', layer: 5, properties: { name: 'Heavy individuals', description: 'Need extra support' } },
  { id: 'P11', type: 'UserGroup', layer: 5, properties: { name: 'Students', description: 'Budget-conscious students' } },
  { id: 'P12', type: 'UserGroup', layer: 5, properties: { name: 'Families', description: 'Parents with kids' } },
]

// Layer 6: Values (价值主张) - 14 nodes
const values: GraphNode[] = [
  { id: 'V1', type: 'Offer', layer: 6, properties: { offer_id: 'VALUE-001', sku: 'UNDER-300', price: 299, currency: 'USD', availability: 'in_stock', name: 'Under $300' } },
  { id: 'V2', type: 'Offer', layer: 6, properties: { offer_id: 'VALUE-002', sku: 'PREMIUM-500', price: 499, currency: 'USD', availability: 'in_stock', name: 'Premium $500' } },
  { id: 'V3', type: 'Offer', layer: 6, properties: { offer_id: 'VALUE-003', sku: 'TRIAL-100', price: 0, currency: 'USD', availability: 'pre_order', name: 'Free Trial' } },
  { id: 'V4', type: 'Offer', layer: 6, properties: { offer_id: 'VALUE-004', sku: 'FREE-SHIP', price: 0, currency: 'USD', availability: 'in_stock', name: 'Free Shipping' } },
  { id: 'V5', type: 'Offer', layer: 6, properties: { offer_id: 'VALUE-005', sku: '10Y-WARRANTY', price: 0, currency: 'USD', availability: 'in_stock', name: '10 Year Warranty' } },
  { id: 'V6', type: 'Offer', layer: 6, properties: { offer_id: 'VALUE-006', sku: 'ECO-CERT', price: 0, currency: 'USD', availability: 'in_stock', name: 'Eco Certified' } },
  { id: 'V7', type: 'Offer', layer: 6, properties: { offer_id: 'VALUE-007', sku: '24-7-SUPPORT', price: 0, currency: 'USD', availability: 'in_stock', name: '24/7 Support' } },
  { id: 'V8', type: 'Offer', layer: 6, properties: { offer_id: 'VALUE-008', sku: 'MADE-USA', price: 0, currency: 'USD', availability: 'in_stock', name: 'Made in USA' } },
  { id: 'V9', type: 'Offer', layer: 6, properties: { offer_id: 'VALUE-009', sku: '100N-TRIAL', price: 0, currency: 'USD', availability: 'in_stock', name: '100 Night Trial' } },
  { id: 'V10', type: 'Offer', layer: 6, properties: { offer_id: 'VALUE-010', sku: 'EASY-SETUP', price: 0, currency: 'USD', availability: 'in_stock', name: 'Easy Setup' } },
  { id: 'V11', type: 'Offer', layer: 6, properties: { offer_id: 'VALUE-011', sku: 'CERTIPUR', price: 0, currency: 'USD', availability: 'in_stock', name: 'CertiPUR-US' } },
  { id: 'V12', type: 'Offer', layer: 6, properties: { offer_id: 'VALUE-012', sku: 'BUNDLE', price: 399, currency: 'USD', availability: 'in_stock', name: 'Bundle Deals' } },
  { id: 'V13', type: 'Offer', layer: 6, properties: { offer_id: 'VALUE-013', sku: 'FINANCING', price: 0, currency: 'USD', availability: 'in_stock', name: 'Financing Options' } },
  { id: 'V14', type: 'Offer', layer: 6, properties: { offer_id: 'VALUE-014', sku: 'WHITE-GLOVE', price: 99, currency: 'USD', availability: 'in_stock', name: 'White Glove Delivery' } },
]

// Layer 7: Prompts (AI提示词) - 16 nodes
const prompts: GraphNode[] = [
  { id: 'PROMPT1', type: 'Scenario', layer: 7, properties: { name: 'Best mattress for hot sleepers under $300', description: 'Comparative search intent', tags: ['P0', 'high-intent'] } },
  { id: 'PROMPT2', type: 'Scenario', layer: 7, properties: { name: 'How to fix back pain with memory foam', description: 'How-to search intent', tags: ['P1', 'educational'] } },
  { id: 'PROMPT3', type: 'Scenario', layer: 7, properties: { name: 'Cooling gel vs memory foam comparison', description: 'Comparison search intent', tags: ['P0', 'decision'] } },
  { id: 'PROMPT4', type: 'Scenario', layer: 7, properties: { name: 'Organic mattress under $300', description: 'Transactional search intent', tags: ['P1', 'commercial'] } },
  { id: 'PROMPT5', type: 'Scenario', layer: 7, properties: { name: 'Free shipping mattress deals', description: 'Commercial search intent', tags: ['P1', 'deal'] } },
  { id: 'PROMPT6', type: 'Scenario', layer: 7, properties: { name: 'Mattress with 10 year warranty', description: 'Feature search intent', tags: ['P0', 'warranty'] } },
  { id: 'PROMPT7', type: 'Scenario', layer: 7, properties: { name: 'Eco-friendly mattress brands', description: 'Informational search intent', tags: ['P1', 'eco'] } },
  { id: 'PROMPT8', type: 'Scenario', layer: 7, properties: { name: 'Best mattress for couples', description: 'Comparative search intent', tags: ['P0', 'couples'] } },
  { id: 'PROMPT9', type: 'Scenario', layer: 7, properties: { name: 'Made in USA mattress reviews', description: 'Review search intent', tags: ['P1', 'reviews'] } },
  { id: 'PROMPT10', type: 'Scenario', layer: 7, properties: { name: '100 night trial mattress', description: 'Feature search intent', tags: ['P0', 'trial'] } },
  { id: 'PROMPT11', type: 'Scenario', layer: 7, properties: { name: 'Easy setup mattress in a box', description: 'Convenience search intent', tags: ['P1', 'convenience'] } },
  { id: 'PROMPT12', type: 'Scenario', layer: 7, properties: { name: 'CertiPUR-US certified mattress', description: 'Safety search intent', tags: ['P0', 'safety'] } },
  { id: 'PROMPT13', type: 'Scenario', layer: 7, properties: { name: 'Mattress bundle deals and packages', description: 'Deal search intent', tags: ['P1', 'bundle'] } },
  { id: 'PROMPT14', type: 'Scenario', layer: 7, properties: { name: 'Buy mattress with financing', description: 'Financial search intent', tags: ['P1', 'financing'] } },
  { id: 'PROMPT15', type: 'Scenario', layer: 7, properties: { name: 'White glove mattress delivery service', description: 'Premium service search intent', tags: ['P0', 'premium'] } },
  { id: 'PROMPT16', type: 'Scenario', layer: 7, properties: { name: 'Best mattress for side sleepers', description: 'Position-specific search intent', tags: ['P0', 'side-sleeper'] } },
]

// Relationships: Building the 8-layer graph (0-7)
const relationships: GraphRelationship[] = [
  // Layer 0 → Layer 1: Brand HAS Products
  { id: 'R0-1', source_id: 'BRAND1', target_id: 'PROD1', type: 'HAS_PRODUCT', properties: { active: true } },
  { id: 'R0-2', source_id: 'BRAND1', target_id: 'PROD2', type: 'HAS_PRODUCT', properties: { active: true } },
  { id: 'R0-3', source_id: 'BRAND1', target_id: 'PROD3', type: 'HAS_PRODUCT', properties: { active: true } },

  // Layer 1 → Layer 2: Products HAVE Features
  { id: 'R1-1', source_id: 'PROD1', target_id: 'F1', type: 'HAS_FEATURE', properties: { confidence: 1.0 } },
  { id: 'R1-2', source_id: 'PROD1', target_id: 'F2', type: 'HAS_FEATURE', properties: { confidence: 0.9 } },
  { id: 'R1-3', source_id: 'PROD2', target_id: 'F3', type: 'HAS_FEATURE', properties: { confidence: 1.0 } },
  { id: 'R1-4', source_id: 'PROD3', target_id: 'F2', type: 'HAS_FEATURE', properties: { confidence: 1.0 } },
  { id: 'R1-5', source_id: 'PROD3', target_id: 'F4', type: 'HAS_FEATURE', properties: { confidence: 1.0 } },

  // Layer 2 → Layer 3: Features RELIEVE Pain Points
  { id: 'R2-1', source_id: 'F1', target_id: 'PP1', type: 'RELIEVES', properties: { effectiveness: 0.9 } },
  { id: 'R2-2', source_id: 'F2', target_id: 'PP2', type: 'RELIEVES', properties: { effectiveness: 0.85 } },
  { id: 'R2-3', source_id: 'F3', target_id: 'PP4', type: 'RELIEVES', properties: { effectiveness: 0.8 } },
  { id: 'R2-4', source_id: 'F4', target_id: 'PP3', type: 'RELIEVES', properties: { effectiveness: 0.75 } },

  // Layer 3 → Layer 4: Pain Points OCCUR_IN Scenarios
  { id: 'R3-1', source_id: 'PP1', target_id: 'S1', type: 'OCCURS_IN', properties: { frequency: 'high' } },
  { id: 'R3-2', source_id: 'PP2', target_id: 'S2', type: 'OCCURS_IN', properties: { frequency: 'high' } },
  { id: 'R3-3', source_id: 'PP3', target_id: 'S3', type: 'OCCURS_IN', properties: { frequency: 'medium' } },
  { id: 'R3-4', source_id: 'PP4', target_id: 'S4', type: 'OCCURS_IN', properties: { frequency: 'low' } },

  // Layer 4 → Layer 5: Scenarios TARGET Personas
  { id: 'R4-1', source_id: 'S1', target_id: 'P1', type: 'TARGETS', properties: { relevance: 0.95 } },
  { id: 'R4-2', source_id: 'S2', target_id: 'P2', type: 'TARGETS', properties: { relevance: 0.9 } },
  { id: 'R4-3', source_id: 'S4', target_id: 'P3', type: 'TARGETS', properties: { relevance: 0.85 } },
  { id: 'R4-4', source_id: 'S3', target_id: 'P4', type: 'TARGETS', properties: { relevance: 0.8 } },

  // Layer 5 → Layer 6: Personas SEEK Values
  { id: 'R5-1', source_id: 'P1', target_id: 'V1', type: 'SEEKS', properties: { priority: 'high' } },
  { id: 'R5-2', source_id: 'P2', target_id: 'V2', type: 'SEEKS', properties: { priority: 'high' } },
  { id: 'R5-3', source_id: 'P3', target_id: 'V2', type: 'SEEKS', properties: { priority: 'medium' } },
  { id: 'R5-4', source_id: 'P4', target_id: 'V1', type: 'SEEKS', properties: { priority: 'critical' } },

  // Layer 6 → Layer 1: Values HAS_OFFER Products
  { id: 'R6-1', source_id: 'V1', target_id: 'PROD1', type: 'HAS_OFFER', properties: { availability: 'in_stock' } },
  { id: 'R6-2', source_id: 'V2', target_id: 'PROD3', type: 'HAS_OFFER', properties: { availability: 'in_stock' } },
  { id: 'R6-3', source_id: 'V1', target_id: 'PROD2', type: 'HAS_OFFER', properties: { availability: 'in_stock' } },
  { id: 'R6-4', source_id: 'V3', target_id: 'PROD1', type: 'HAS_OFFER', properties: { availability: 'pre_order' } },

  // Layer 7 → Layer 3: Prompts ADDRESS Pain Points
  { id: 'R7-1', source_id: 'PROMPT1', target_id: 'PP1', type: 'APPLIES_TO', properties: { intent: 'comparative' } },
  { id: 'R7-2', source_id: 'PROMPT2', target_id: 'PP2', type: 'APPLIES_TO', properties: { intent: 'educational' } },
  { id: 'R7-3', source_id: 'PROMPT3', target_id: 'PP1', type: 'APPLIES_TO', properties: { intent: 'comparison' } },
  { id: 'R7-4', source_id: 'PROMPT4', target_id: 'PP4', type: 'APPLIES_TO', properties: { intent: 'transactional' } },
]

export const geoGraphSeedData = {
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
  relationships,
}

// Export layer metadata for visualization
export const layerMetadata = {
  layers: [
    { id: 0, name: 'Brand', type: 'Brand', color: '#6366f1', description: 'Brand identity and positioning' },
    { id: 1, name: 'Products', type: 'Product', color: '#3b82f6', description: 'Products and SKUs' },
    { id: 2, name: 'Features', type: 'Feature', color: '#10b981', description: 'Product features and technologies' },
    { id: 3, name: 'Pain Points', type: 'Problem', color: '#ef4444', description: 'User problems and pain points' },
    { id: 4, name: 'Scenarios', type: 'Scenario', color: '#8b5cf6', description: 'Usage scenarios and contexts' },
    { id: 5, name: 'Personas', type: 'UserGroup', color: '#f59e0b', description: 'User personas and segments' },
    { id: 6, name: 'Values', type: 'Offer', color: '#14b8a6', description: 'Value propositions and offers' },
    { id: 7, name: 'Prompts', type: 'Scenario', color: '#ec4899', description: 'AI prompts and search intents' },
  ],
}
