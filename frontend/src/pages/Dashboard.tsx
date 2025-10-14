import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  TrendingUp,
  Users,
  FileText,
  ShoppingCart,
  Database,
  Globe,
  Target,
  Zap,
  Clock
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'

const metrics = [
  {
    title: 'Total Citations',
    value: '12,450',
    change: '+12.5%',
    icon: TrendingUp,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Active Users',
    value: '3,245',
    change: '+8.2%',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Content Generated',
    value: '845',
    change: '+23.1%',
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Orders',
    value: '234',
    change: '+15.3%',
    icon: ShoppingCart,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    title: 'Knowledge Graph Entities',
    value: '1,234',
    change: '+18.5%',
    icon: Database,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  {
    title: 'GEO Visibility',
    value: '89.2%',
    change: '+5.3%',
    icon: Globe,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
  },
  {
    title: 'Conversion Rate',
    value: '3.4%',
    change: '+0.8%',
    icon: Target,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
  {
    title: 'Avg Response Time',
    value: '1.2s',
    change: '-0.3s',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
]

// Citations trend data
const citationsTrendData = [
  { month: 'Jan', citations: 4000, conversions: 120 },
  { month: 'Feb', citations: 5200, conversions: 145 },
  { month: 'Mar', citations: 6800, conversions: 180 },
  { month: 'Apr', citations: 8100, conversions: 210 },
  { month: 'May', citations: 9500, conversions: 245 },
  { month: 'Jun', citations: 12450, conversions: 320 },
]

// Content generation by type
const contentTypeData = [
  { name: 'Video Scripts', value: 245, color: '#6366f1' },
  { name: 'Long Form', value: 180, color: '#8b5cf6' },
  { name: 'Comparisons', value: 156, color: '#ec4899' },
  { name: 'FAQ', value: 132, color: '#f59e0b' },
  { name: 'Q&A', value: 98, color: '#10b981' },
  { name: 'Infographics', value: 34, color: '#3b82f6' },
]

// Platform distribution
const platformData = [
  { name: 'ChatGPT', value: 4500 },
  { name: 'Perplexity', value: 3200 },
  { name: 'Claude', value: 2800 },
  { name: 'Gemini', value: 1950 },
]

// Entity growth data
const entityGrowthData = [
  { month: 'Jan', products: 45, features: 120, scenarios: 80 },
  { month: 'Feb', products: 52, features: 145, scenarios: 95 },
  { month: 'Mar', products: 68, features: 178, scenarios: 112 },
  { month: 'Apr', products: 81, features: 210, scenarios: 135 },
  { month: 'May', products: 95, features: 248, scenarios: 158 },
  { month: 'Jun', products: 112, features: 289, scenarios: 182 },
]

// Top products data
const topProducts = [
  { name: 'CloudSync Pro', citations: 1245, conversions: 89, revenue: '$12,340' },
  { name: 'DataGuard Suite', citations: 1089, conversions: 76, revenue: '$10,890' },
  { name: 'WorkFlow Master', citations: 967, conversions: 68, revenue: '$9,670' },
  { name: 'SecureVault', citations: 845, conversions: 59, revenue: '$8,450' },
  { name: 'TeamSync', citations: 723, conversions: 51, revenue: '$7,230' },
]

// Recent activities
const recentActivities = [
  { time: '2 min ago', action: 'New content generated', detail: 'Video script for CloudSync Pro' },
  { time: '15 min ago', action: 'Order placed', detail: 'Order #1234 - DataGuard Suite' },
  { time: '1 hour ago', action: 'Entity created', detail: 'New product: AI Assistant Pro' },
  { time: '2 hours ago', action: 'Citation spike detected', detail: '+45% on WorkFlow Master' },
  { time: '3 hours ago', action: 'Data collection completed', detail: 'YouTube: 1,234 new videos analyzed' },
]

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Leap ACP</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-full ${metric.bgColor} flex items-center justify-center`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Citations & Conversions Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Citations & Conversions Trend</CardTitle>
          <CardDescription>Monthly performance overview</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={citationsTrendData}>
              <defs>
                <linearGradient id="colorCitations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="citations"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorCitations)"
                name="Citations"
              />
              <Area
                type="monotone"
                dataKey="conversions"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorConversions)"
                name="Conversions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Content Type Distribution & Platform Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Type Distribution</CardTitle>
            <CardDescription>Generated content by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>Citations by AI platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Graph Growth */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Graph Growth</CardTitle>
          <CardDescription>Entity count growth over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={entityGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
              />
              <Legend />
              <Line type="monotone" dataKey="products" stroke="#6366f1" strokeWidth={2} name="Products" />
              <Line type="monotone" dataKey="features" stroke="#8b5cf6" strokeWidth={2} name="Features" />
              <Line type="monotone" dataKey="scenarios" stroke="#ec4899" strokeWidth={2} name="Scenarios" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Products & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Products with highest citations and conversions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.citations} citations · {product.conversions} conversions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 border-b pb-3 last:border-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{activity.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
