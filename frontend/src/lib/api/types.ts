// API Response Types

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string[]>
  meta?: {
    page?: number
    per_page?: number
    total?: number
  }
}

export interface PaginationParams {
  page?: number
  per_page?: number
  sort_by?: string
  order?: 'asc' | 'desc'
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
  status?: number
}

// Knowledge Graph Types
export interface GraphEntity {
  id: string
  type: 'Product' | 'Feature' | 'Scenario' | 'Problem' | 'UserGroup' | 'Competitor' | 'Offer' | 'Merchant' | 'Content'
  properties: Record<string, any>
  created_at?: string
  updated_at?: string
}

export interface GraphRelationship {
  id: string
  type: string
  source_id: string
  target_id: string
  properties?: Record<string, any>
  created_at?: string
}

export interface GraphQueryRequest {
  query: string
  params?: Record<string, any>
}

export interface GraphQueryResponse {
  nodes: GraphEntity[]
  relationships: GraphRelationship[]
  records: any[]
}

// Content Types
export interface ContentItem {
  content_id: string
  type: 'video_script' | 'long_form' | 'comparison' | 'faq' | 'qa' | 'infographic'
  title: string
  body: string
  platform?: string
  url?: string
  status: 'draft' | 'pending_review' | 'approved' | 'published' | 'rejected'
  score?: number
  tenant_id?: string
  brand_id?: string
  created_at: string
  updated_at?: string
}

export interface ContentGenerationRequest {
  type: ContentItem['type']
  product_id?: string
  scenario_id?: string
  problem_id?: string
  template?: string
  parameters?: Record<string, any>
}

export interface ContentScoreResponse {
  content_id: string
  score: number
  breakdown: {
    relevance: number
    readability: number
    seo: number
    originality: number
  }
  suggestions: string[]
}

// Data Collection Types
export interface DataSource {
  source_id: string
  platform: 'youtube' | 'reddit' | 'quora' | 'medium' | 'amazon' | 'shopify'
  url: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  collected_at?: string
  data_count?: number
}

export interface CollectionJob {
  job_id: string
  source_id: string
  platform: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  started_at?: string
  completed_at?: string
  error_message?: string
}

// Offer Types
export interface Offer {
  offer_id: string
  sku: string
  merchant_id: string
  merchant_name?: string
  price: number
  currency: string
  availability: 'in_stock' | 'out_of_stock' | 'preorder'
  stock_level?: number
  valid_from?: string
  valid_until?: string
  region?: string
  product_id?: string
}

export interface OfferQueryParams extends PaginationParams {
  product_id?: string
  merchant_id?: string
  region?: string
  min_price?: number
  max_price?: number
  availability?: Offer['availability']
}

// Order Types
export interface Order {
  acp_order_id: string
  user_hash: string
  merchant_id: string
  offer_id: string
  quantity: number
  amount: number
  currency: string
  state: 'created' | 'risk_check' | 'validate_offer' | 'payment_authorize' |
         'merchant_order' | 'capture' | 'fulfilling' | 'closed' | 'refunded' | 'cancelled'
  created_at: string
  updated_at?: string
}

export interface OrderCreateRequest {
  offer_id: string
  quantity: number
  user_data: {
    email?: string
    shipping_address?: any
  }
  payment_token?: string
}

// Analytics Types
export interface AnalyticsMetric {
  metric_name: string
  value: number
  change_percent?: number
  period: string
}

export interface AnalyticsDashboard {
  overview: {
    total_content: number
    total_impressions: number
    total_clicks: number
    total_conversions: number
    avg_citation_rate: number
  }
  metrics: AnalyticsMetric[]
  top_content: ContentItem[]
  top_products: GraphEntity[]
}
