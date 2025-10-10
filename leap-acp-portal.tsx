Cool, 我想先从前端开始，也就是先根据项目的整个业务流程，通过不同角色使用平台的角度出发来构建所有前端应用交互页面，前端应用交互页面可以参考“leap - acp - portal.tsx”文件，不用全部照搬该文件，要根据项目整体结构来生成对应功能模块的应用交互页面。然后再基于前端交互页面和后端业务数据结构来构建逐渐完善后端的开发，请根据这个方向从新调整开发计划，并能保障每次执行完任务都要对项目是否可以运行进行检查。import React, { useState, useEffect } from 'react';
import { ChevronRight, Home, Search, Package, ShoppingCart, BarChart3, Settings, Users, Brain, FileText, Send, DollarSign, TrendingUp, Activity, Globe, Target, Zap, AlertCircle, CheckCircle, Clock, Filter, Download, Plus, Edit, Trash2, Eye, RefreshCw, Link, Award, Layers, Database, PieChart, Calendar, CreditCard, Truck, UserCheck, Shield, Bell, LogOut, Menu, X, ChevronDown, Upload, Copy, ExternalLink, Hash, Tag, BookOpen, MessageSquare, Youtube, Twitter, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userProfile, setUserProfile] = useState({
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Manager',
    tenant: 'ABC Corp',
    avatar: 'JS'
  });

  // Navigation structure
  const navigation = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 }
      ]
    },
    {
      title: 'GEO Optimization',
      items: [
        { id: 'knowledge-graph', label: 'Knowledge Graph', icon: Brain },
        { id: 'content-generation', label: 'Content Generation', icon: FileText },
        { id: 'content-scoring', label: 'Content Scoring', icon: Award },
        { id: 'distribution', label: 'Multi-Platform Distribution', icon: Send },
        { id: 'citations', label: 'AI Citations', icon: Target }
      ]
    },
    {
      title: 'Commerce',
      items: [
        { id: 'offers', label: 'Offer Management', icon: Package },
        { id: 'orders', label: 'Order Management', icon: ShoppingCart },
        { id: 'payments', label: 'Payments & Settlement', icon: CreditCard },
        { id: 'fulfillment', label: 'Fulfillment', icon: Truck }
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'team', label: 'Team Management', icon: Users },
        { id: 'brands', label: 'Brand Management', icon: Shield },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  // Dashboard Component
  const Dashboard = () => {
    const metrics = [
      { label: 'AI Citations', value: '1,234', change: '+15%', trend: 'up', icon: Target },
      { label: 'Content Published', value: '87', change: '+23%', trend: 'up', icon: FileText },
      { label: 'Orders Today', value: '456', change: '+32%', trend: 'up', icon: ShoppingCart },
      { label: 'Revenue', value: '$156,789', change: '+28%', trend: 'up', icon: DollarSign },
      { label: 'Conversion Rate', value: '35.6%', change: '+2.1%', trend: 'up', icon: TrendingUp },
      { label: 'Order Success Rate', value: '96.2%', change: '-0.3%', trend: 'down', icon: CheckCircle }
    ];

    const recentOrders = [
      { id: 'ORD-001', customer: 'Sarah Johnson', product: 'Cool Mattress Queen', amount: '$299.99', status: 'processing', time: '5 min ago' },
      { id: 'ORD-002', customer: 'Michael Chen', product: 'Memory Foam Pillow', amount: '$89.99', status: 'shipped', time: '12 min ago' },
      { id: 'ORD-003', customer: 'Emily Davis', product: 'Bamboo Sheets Set', amount: '$149.99', status: 'delivered', time: '1 hour ago' },
      { id: 'ORD-004', customer: 'Robert Wilson', product: 'Cool Mattress King', amount: '$399.99', status: 'processing', time: '2 hours ago' }
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your platform overview</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Last 30 Days
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm">{metric.label}</p>
                  <p className="text-2xl font-bold mt-2">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    {metric.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {metric.change}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <metric.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Conversion Funnel</h2>
            <div className="space-y-3">
              {[
                { stage: 'AI Citations', value: 1234, percentage: 100 },
                { stage: 'Offer Displayed', value: 890, percentage: 72 },
                { stage: 'Clicked', value: 623, percentage: 50 },
                { stage: 'Orders Created', value: 456, percentage: 37 },
                { stage: 'Orders Completed', value: 439, percentage: 36 }
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.stage}</span>
                    <span className="font-medium">{item.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Orders</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{order.id}</p>
                      <p className="text-xs text-gray-600">{order.customer} • {order.product}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{order.amount}</p>
                    <div className="flex items-center justify-end space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Knowledge Graph Component
  const KnowledgeGraph = () => {
    const [selectedEntity, setSelectedEntity] = useState(null);
    const entities = [
      { id: 'prod_1', type: 'Product', name: 'Cool Mattress Queen', connections: 12 },
      { id: 'feat_1', type: 'Feature', name: 'Gel-infused Memory Foam', connections: 8 },
      { id: 'scen_1', type: 'Scenario', name: 'Summer Sleep', connections: 6 },
      { id: 'prob_1', type: 'Problem', name: 'Night Sweats', connections: 5 },
      { id: 'user_1', type: 'UserGroup', name: 'Hot Sleepers', connections: 7 }
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Knowledge Graph</h1>
            <p className="text-gray-600 mt-1">Manage entities and relationships</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4 inline mr-2" />
              Import Data
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 inline mr-2" />
              Add Entity
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Graph Visualization</h2>
            <div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Brain className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <p className="text-gray-600">Interactive Knowledge Graph</p>
                <p className="text-sm text-gray-500 mt-1">Nodes: 1,234 | Relationships: 5,678</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Entity Explorer</h2>
            <div className="space-y-2">
              {entities.map((entity) => (
                <button
                  key={entity.id}
                  onClick={() => setSelectedEntity(entity)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedEntity?.id === entity.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{entity.name}</p>
                      <p className="text-xs text-gray-600">{entity.type}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">{entity.connections} links</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All Entities →
            </button>
          </div>
        </div>

        {selectedEntity && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold">{selectedEntity.name}</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                  {selectedEntity.type}
                </span>
              </div>
              <button
                onClick={() => setSelectedEntity(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Properties</p>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">SKU: MAT-COOL-Q</p>
                  <p className="text-sm text-gray-600">Category: Mattresses</p>
                  <p className="text-sm text-gray-600">Price Range: $250-$350</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Relationships</p>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">HAS_FEATURE → 5 features</p>
                  <p className="text-sm text-gray-600">SOLVES → 3 problems</p>
                  <p className="text-sm text-gray-600">TARGETS → 2 user groups</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Actions</p>
                <div className="space-y-2">
                  <button className="w-full px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm">
                    Edit Entity
                  </button>
                  <button className="w-full px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 text-sm">
                    View Relations
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Content Generation Component
  const ContentGeneration = () => {
    const [contentType, setContentType] = useState('youtube');
    const [generatingContent, setGeneratingContent] = useState(false);
    
    const contentTypes = [
      { id: 'youtube', label: 'YouTube Script', icon: Youtube, time: '30-60s' },
      { id: 'medium', label: 'Medium Article', icon: FileText, time: '45-90s' },
      { id: 'quora', label: 'Quora Answer', icon: MessageSquare, time: '20-30s' },
      { id: 'reddit', label: 'Reddit Post', icon: MessageSquare, time: '20-30s' },
      { id: 'twitter', label: 'Twitter Thread', icon: Twitter, time: '15-20s' }
    ];

    const generatedContent = [
      { id: 1, title: 'Best Cooling Mattress Review 2025', type: 'YouTube Script', score: 92, status: 'approved' },
      { id: 2, title: 'How to Choose the Right Mattress for Hot Sleepers', type: 'Medium Article', score: 88, status: 'pending' },
      { id: 3, title: 'SweetNight vs Competitors Comparison', type: 'Quora Answer', score: 85, status: 'draft' }
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Generation</h1>
            <p className="text-gray-600 mt-1">AI-powered content creation for multiple platforms</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 inline mr-2" />
            New Content
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Generate New Content</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {contentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setContentType(type.id)}
                    className={`p-3 rounded-lg border transition-all ${
                      contentType === type.id
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <type.icon className="w-5 h-5 mx-auto mb-1" />
                    <p className="text-xs font-medium">{type.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{type.time}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option>Cool Mattress Queen</option>
                  <option>Memory Foam Pillow</option>
                  <option>Bamboo Sheets Set</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option>Hot Sleepers</option>
                  <option>Side Sleepers</option>
                  <option>Back Pain Sufferers</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Parameters</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select className="px-3 py-2 border border-gray-300 rounded-lg">
                  <option>Short Length</option>
                  <option>Medium Length</option>
                  <option>Long Length</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg">
                  <option>Professional Tone</option>
                  <option>Friendly Tone</option>
                  <option>Casual Tone</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Keywords (comma-separated)"
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <button
              onClick={() => setGeneratingContent(true)}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              disabled={generatingContent}
            >
              {generatingContent ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating Content...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Content
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Content</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                <Filter className="w-3.5 h-3.5 inline mr-1" />
                Filter
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {generatedContent.map((content) => (
              <div key={content.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{content.title}</p>
                    <p className="text-sm text-gray-600">{content.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="flex items-center">
                      <Award className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{content.score}/100</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      content.status === 'approved' ? 'bg-green-100 text-green-800' :
                      content.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {content.status}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Order Management Component
  const OrderManagement = () => {
    const orders = [
      { 
        id: 'ORD-20251009-A12345', 
        customer: 'John Doe', 
        product: 'Cool Mattress Queen',
        amount: '$299.99', 
        status: 'processing',
        merchant: 'SweetNight Official',
        created: '2025-10-09 10:30:45',
        payment: 'Visa **** 4242'
      },
      {
        id: 'ORD-20251009-A12346',
        customer: 'Jane Smith',
        product: 'Memory Foam Pillow Set',
        amount: '$89.99',
        status: 'shipped',
        merchant: 'SweetNight Official',
        created: '2025-10-09 09:15:30',
        payment: 'Apple Pay'
      },
      {
        id: 'ORD-20251009-A12347',
        customer: 'Robert Johnson',
        product: 'Bamboo Sheets King',
        amount: '$149.99',
        status: 'delivered',
        merchant: 'SweetNight Official',
        created: '2025-10-08 14:22:10',
        payment: 'Affirm'
      }
    ];

    const [selectedOrder, setSelectedOrder] = useState(null);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-1">Track and manage all ACP orders</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4 inline mr-2" />
              Filter
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 inline mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold mt-1">1,234</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold mt-1">45</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shipped Today</p>
                <p className="text-2xl font-bold mt-1">123</p>
              </div>
              <Truck className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold mt-1">96.2%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Orders</h2>
              <div className="flex space-x-2">
                <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg">
                  <option>All Status</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg w-64"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        {order.id}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.created}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button className="text-gray-500 hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-500 hover:text-green-600">
                          <Truck className="w-4 h-4" />
                        </button>
                        <button className="text-gray-500 hover:text-red-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-medium">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedOrder.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      selectedOrder.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-medium">{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium">{selectedOrder.payment}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Product</p>
                    <p className="font-medium">{selectedOrder.product}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-medium">{selectedOrder.amount}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Order Timeline</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>Order created - {selectedOrder.created}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>Payment authorized - 2025-10-09 10:31:00</span>
                    </div>
                    {selectedOrder.status === 'shipped' && (
                      <div className="flex items-center text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>Order shipped - 2025-10-10 14:30:00</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    Cancel Order
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Offer Management Component
  const OfferManagement = () => {
    const offers = [
      {
        id: 'offer_xyz123',
        product: 'Cool Mattress Queen',
        sku: 'MAT-COOL-QUEEN',
        price: '$299.99',
        originalPrice: '$399.99',
        discount: '25%',
        stock: 287,
        region: 'US',
        status: 'active'
      },
      {
        id: 'offer_abc456',
        product: 'Memory Foam Pillow',
        sku: 'PIL-MEM-STD',
        price: '$49.99',
        originalPrice: '$79.99',
        discount: '38%',
        stock: 1024,
        region: 'US, CA',
        status: 'active'
      }
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Offer Management</h1>
            <p className="text-gray-600 mt-1">Manage product offers and pricing</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 inline mr-2" />
            Create Offer
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{offer.product}</h3>
                  <p className="text-sm text-gray-600">SKU: {offer.sku}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  offer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {offer.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Price</span>
                  <div className="text-right">
                    <span className="font-bold">{offer.price}</span>
                    <span className="text-sm text-gray-500 line-through ml-2">{offer.originalPrice}</span>
                    <span className="text-sm text-green-600 ml-1">({offer.discount} off)</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Stock</span>
                  <span className="font-medium">{offer.stock} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Region</span>
                  <span className="font-medium">{offer.region}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4 pt-4 border-t">
                <button className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium">
                  Edit
                </button>
                <button className="flex-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 text-sm font-medium">
                  Duplicate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Analytics Component
  const Analytics = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Performance metrics and insights</p>
          </div>
          <div className="flex space-x-3">
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 3 Months</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4 inline mr-2" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">AI Citation Trend</h2>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-center">
                <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-gray-600">Citation trend chart visualization</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Platform Performance</h2>
            <div className="space-y-3">
              {[
                { platform: 'YouTube', citations: 456, performance: 85 },
                { platform: 'Medium', citations: 312, performance: 72 },
                { platform: 'Reddit', citations: 289, performance: 68 },
                { platform: 'Quora', citations: 234, performance: 64 },
                { platform: 'Twitter', citations: 189, performance: 58 }
              ].map((item) => (
                <div key={item.platform}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.platform}</span>
                    <span className="font-medium">{item.citations} citations</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                      style={{ width: `${item.performance}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Attribution Analysis</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm font-medium text-gray-700">Content</th>
                  <th className="text-center py-2 text-sm font-medium text-gray-700">Impressions</th>
                  <th className="text-center py-2 text-sm font-medium text-gray-700">Clicks</th>
                  <th className="text-center py-2 text-sm font-medium text-gray-700">Orders</th>
                  <th className="text-center py-2 text-sm font-medium text-gray-700">Revenue</th>
                  <th className="text-center py-2 text-sm font-medium text-gray-700">ROI</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 text-sm">Best Cooling Mattress Review</td>
                  <td className="text-center py-2 text-sm">23,456</td>
                  <td className="text-center py-2 text-sm">1,234</td>
                  <td className="text-center py-2 text-sm">45</td>
                  <td className="text-center py-2 text-sm">$13,473</td>
                  <td className="text-center py-2 text-sm font-medium text-green-600">670%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-sm">Summer Sleep Guide</td>
                  <td className="text-center py-2 text-sm">18,902</td>
                  <td className="text-center py-2 text-sm">987</td>
                  <td className="text-center py-2 text-sm">32</td>
                  <td className="text-center py-2 text-sm">$9,587</td>
                  <td className="text-center py-2 text-sm font-medium text-green-600">520%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Settings Component
  const SettingsPage = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {[
                { label: 'General', icon: Settings },
                { label: 'API Keys', icon: Shield },
                { label: 'Integrations', icon: Link },
                { label: 'Notifications', icon: Bell },
                { label: 'Security', icon: Shield }
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 text-gray-900"
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">General Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    defaultValue="ABC Corp"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>UTC-8 (Pacific Time)</option>
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC+0 (London)</option>
                  </select>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render based on current page
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'knowledge-graph': return <KnowledgeGraph />;
      case 'content-generation': return <ContentGeneration />;
      case 'orders': return <OrderManagement />;
      case 'offers': return <OfferManagement />;
      case 'analytics': return <Analytics />;
      case 'settings': return <SettingsPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className={`flex items-center ${!sidebarOpen && 'justify-center'}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                {sidebarOpen && (
                  <span className="ml-3 font-bold text-lg">Leap ACP</span>
                )}
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4">
            {navigation.map((section) => (
              <div key={section.title} className="mb-6">
                {sidebarOpen && (
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === item.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {sidebarOpen && <span className="ml-3">{item.label}</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <div className={`flex items-center ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {userProfile.avatar}
              </div>
              {sidebarOpen && (
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                  <p className="text-xs text-gray-500">{userProfile.role}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 border border-gray-300 rounded-lg w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;