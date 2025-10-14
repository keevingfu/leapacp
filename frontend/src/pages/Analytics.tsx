import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  Clock,
  MousePointer,
  Eye
} from 'lucide-react'
// ECharts components (NEW - not replacing existing Recharts)
import { BarChart as EChartsBar, LineChart as EChartsLine, PieChart as EChartsPie } from '@/components/charts'

// Key Metrics
const keyMetrics = [
  {
    title: 'Total Citations',
    value: '12,450',
    change: '+12.5%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Click-through Rate',
    value: '29.6%',
    change: '+2.3%',
    trend: 'up',
    icon: MousePointer,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Conversion Rate',
    value: '1.9%',
    change: '+0.4%',
    trend: 'up',
    icon: Target,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Total Revenue',
    value: '$45,890',
    change: '+18.2%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    title: 'Avg. Session',
    value: '3.4 min',
    change: '+0.8 min',
    trend: 'up',
    icon: Clock,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
  },
  {
    title: 'Page Views',
    value: '23,450',
    change: '+15.3%',
    trend: 'up',
    icon: Eye,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
]

// Citations trend data
const citationData = [
  { month: 'Jan', citations: 450, clicks: 320, conversions: 45, revenue: 4500 },
  { month: 'Feb', citations: 580, clicks: 420, conversions: 62, revenue: 6200 },
  { month: 'Mar', citations: 720, clicks: 580, conversions: 89, revenue: 8900 },
  { month: 'Apr', citations: 890, clicks: 720, conversions: 112, revenue: 11200 },
  { month: 'May', citations: 1020, clicks: 850, conversions: 145, revenue: 14500 },
  { month: 'Jun', citations: 1245, clicks: 980, conversions: 178, revenue: 17800 },
]

// Content performance
const contentPerformance = [
  { type: 'Blog Posts', generated: 145, published: 132, citations: 450, engagement: 78 },
  { type: 'Product Guides', generated: 89, published: 85, citations: 680, engagement: 92 },
  { type: 'FAQs', generated: 234, published: 210, citations: 320, engagement: 65 },
  { type: 'Videos', generated: 45, published: 42, citations: 280, engagement: 88 },
  { type: 'Comparisons', generated: 67, published: 61, citations: 590, engagement: 85 },
]

// Conversion funnel
const funnelData = [
  { stage: 'AI Citations', count: 12450, percentage: 100 },
  { stage: 'Clicks', count: 3680, percentage: 29.6 },
  { stage: 'Product Views', count: 1850, percentage: 14.9 },
  { stage: 'Add to Cart', count: 680, percentage: 5.5 },
  { stage: 'Orders', count: 234, percentage: 1.9 },
]

// Platform performance
const platformData = [
  { name: 'ChatGPT', citations: 4500, clicks: 1350, conversions: 95, revenue: 9500 },
  { name: 'Perplexity', citations: 3200, clicks: 1050, conversions: 68, revenue: 6800 },
  { name: 'Claude', citations: 2800, clicks: 890, conversions: 52, revenue: 5200 },
  { name: 'Gemini', citations: 1950, clicks: 580, conversions: 19, revenue: 1900 },
]

// Platform distribution pie chart
const platformDistribution = [
  { name: 'ChatGPT', value: 36, color: '#6366f1' },
  { name: 'Perplexity', value: 26, color: '#8b5cf6' },
  { name: 'Claude', value: 22, color: '#ec4899' },
  { name: 'Gemini', value: 16, color: '#f59e0b' },
]

// ROI analysis
const roiData = [
  { month: 'Jan', investment: 8000, revenue: 12000, profit: 4000 },
  { month: 'Feb', investment: 9500, revenue: 15500, profit: 6000 },
  { month: 'Mar', investment: 11000, revenue: 19800, profit: 8800 },
  { month: 'Apr', investment: 12500, revenue: 24600, profit: 12100 },
  { month: 'May', investment: 14000, revenue: 31200, profit: 17200 },
  { month: 'Jun', investment: 16000, revenue: 38900, profit: 22900 },
]

// Content quality metrics (radar chart)
const contentQualityData = [
  { subject: 'Relevance', A: 85, fullMark: 100 },
  { subject: 'Originality', A: 92, fullMark: 100 },
  { subject: 'Readability', A: 78, fullMark: 100 },
  { subject: 'SEO Score', A: 88, fullMark: 100 },
  { subject: 'Engagement', A: 82, fullMark: 100 },
  { subject: 'Citation Rate', A: 90, fullMark: 100 },
]

// User behavior data
const userBehaviorData = [
  { time: '00:00', sessions: 120, pageViews: 580, bounceRate: 45 },
  { time: '04:00', sessions: 80, pageViews: 320, bounceRate: 52 },
  { time: '08:00', sessions: 450, pageViews: 2100, bounceRate: 38 },
  { time: '12:00', sessions: 680, pageViews: 3400, bounceRate: 35 },
  { time: '16:00', sessions: 720, pageViews: 3800, bounceRate: 32 },
  { time: '20:00', sessions: 580, pageViews: 2900, bounceRate: 40 },
]

// Geographic performance
const geographicData = [
  { country: 'United States', citations: 5200, conversions: 112, revenue: 22400 },
  { country: 'United Kingdom', citations: 2800, conversions: 58, revenue: 11600 },
  { country: 'Canada', citations: 1650, conversions: 34, revenue: 6800 },
  { country: 'Australia', citations: 1200, conversions: 21, revenue: 4200 },
  { country: 'Germany', citations: 980, conversions: 15, revenue: 3000 },
]

// Top performing keywords
const topKeywords = [
  { keyword: 'best memory foam mattress', citations: 1245, conversions: 45, ctr: 32.5 },
  { keyword: 'cooling mattress reviews', citations: 1089, conversions: 38, ctr: 28.9 },
  { keyword: 'organic mattress comparison', citations: 967, conversions: 34, ctr: 26.2 },
  { keyword: 'affordable bed in box', citations: 845, conversions: 29, ctr: 24.8 },
  { keyword: 'back pain mattress', citations: 723, conversions: 25, ctr: 22.1 },
]

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b']

export function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Performance metrics and conversion analytics</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {keyMetrics.map((metric) => (
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
              <p className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
                {metric.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="roi">ROI</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="echarts">ECharts View</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Monthly citations, clicks, conversions, and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={citationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis yAxisId="left" stroke="#6b7280" />
                  <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="citations"
                    fill="#6366f1"
                    stroke="#6366f1"
                    fillOpacity={0.3}
                    name="Citations"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="clicks"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Clicks"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="conversions"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Conversions"
                  />
                  <Bar yAxisId="right" dataKey="revenue" fill="#8b5cf6" name="Revenue ($)" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>From AI citations to completed orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funnelData.map((stage, index) => (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{stage.stage}</span>
                      <div className="text-right">
                        <span className="font-bold text-lg">{stage.count.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({stage.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-8">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-8 rounded-full flex items-center justify-end pr-4 text-white text-sm font-medium transition-all"
                        style={{ width: `${stage.percentage}%` }}
                      >
                        {index < funnelData.length - 1 && (
                          <span className="text-xs">
                            ↓ {((funnelData[index + 1].count / stage.count) * 100).toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance by Type</CardTitle>
              <CardDescription>Generation, publication, and citation metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={contentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="type" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                  />
                  <Legend />
                  <Bar dataKey="generated" fill="#6366f1" radius={[8, 8, 0, 0]} name="Generated" />
                  <Bar dataKey="published" fill="#10b981" radius={[8, 8, 0, 0]} name="Published" />
                  <Bar dataKey="citations" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Citations" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>Citation share by AI platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={platformDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {platformDistribution.map((entry, index) => (
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
                <CardDescription>Detailed metrics by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformData.map((platform, index) => (
                    <div key={platform.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: platformDistribution[index].color }}
                          />
                          <span className="font-medium">{platform.name}</span>
                        </div>
                        <span className="text-sm font-bold text-green-600">
                          ${platform.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground grid grid-cols-3 gap-2">
                        <div>Citations: {platform.citations.toLocaleString()}</div>
                        <div>Clicks: {platform.clicks.toLocaleString()}</div>
                        <div>Conv: {platform.conversions}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Keywords</CardTitle>
              <CardDescription>Keywords driving the most citations and conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topKeywords.map((keyword, index) => (
                  <div key={keyword.keyword} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{keyword.keyword}</p>
                        <p className="text-xs text-muted-foreground">
                          {keyword.citations} citations · {keyword.conversions} conversions · {keyword.ctr}% CTR
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ROI Tab */}
        <TabsContent value="roi">
          <Card>
            <CardHeader>
              <CardTitle>ROI Analysis</CardTitle>
              <CardDescription>Investment, revenue, and profit trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={roiData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
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
                    dataKey="revenue"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#6366f1"
                    fillOpacity={1}
                    fill="url(#colorProfit)"
                    name="Profit"
                  />
                  <Line type="monotone" dataKey="investment" stroke="#ef4444" strokeWidth={2} name="Investment" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quality Tab */}
        <TabsContent value="quality">
          <Card>
            <CardHeader>
              <CardTitle>Content Quality Metrics</CardTitle>
              <CardDescription>Multi-dimensional quality assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={contentQualityData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" stroke="#6b7280" />
                  <PolarRadiusAxis stroke="#6b7280" />
                  <Radar
                    name="Quality Score"
                    dataKey="A"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Behavior by Time</CardTitle>
              <CardDescription>Sessions, page views, and bounce rate throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={userBehaviorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#6b7280" />
                  <YAxis yAxisId="left" stroke="#6b7280" />
                  <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sessions" fill="#6366f1" name="Sessions" />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="pageViews"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Page Views"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="bounceRate"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Bounce Rate (%)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Performance</CardTitle>
              <CardDescription>Performance metrics by country</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={geographicData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="country" type="category" width={120} stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                  />
                  <Legend />
                  <Bar dataKey="citations" fill="#6366f1" name="Citations" />
                  <Bar dataKey="conversions" fill="#10b981" name="Conversions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ECharts Tab - NEW: Added ECharts visualization without replacing existing Recharts */}
        <TabsContent value="echarts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ECharts Visualization Demo</CardTitle>
              <CardDescription>Alternative visualization using ECharts library (Recharts tabs remain unchanged)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Monthly Citations Line Chart */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Monthly Citations Trend</h3>
                  <EChartsLine
                    data={citationData.map(d => ({ name: d.month, value: d.citations }))}
                    title="Citations Over Time"
                    xAxisLabel="Month"
                    yAxisLabel="Citations"
                    color="#6366f1"
                    smooth={true}
                    areaStyle={true}
                    height="350px"
                  />
                </div>

                {/* Platform Distribution Pie Chart */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Platform Distribution</h3>
                  <EChartsPie
                    data={platformDistribution}
                    title="Citation Share by Platform"
                    showLegend={true}
                    radius={['40%', '70%']}
                    height="350px"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Content Performance Comparison</h3>
                <EChartsBar
                  data={contentPerformance.map(d => ({ name: d.type, value: d.citations }))}
                  title="Citations by Content Type"
                  xAxisLabel="Content Type"
                  yAxisLabel="Citations"
                  color="#10b981"
                  height="400px"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Revenue Trend */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Revenue Trend</h3>
                  <EChartsLine
                    data={roiData.map(d => ({ name: d.month, value: d.revenue }))}
                    title="Monthly Revenue"
                    xAxisLabel="Month"
                    yAxisLabel="Revenue ($)"
                    color="#10b981"
                    smooth={true}
                    areaStyle={true}
                    height="350px"
                  />
                </div>

                {/* Geographic Performance */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Geographic Performance</h3>
                  <EChartsBar
                    data={geographicData.map(d => ({ name: d.country, value: d.citations }))}
                    title="Citations by Country"
                    xAxisLabel="Country"
                    yAxisLabel="Citations"
                    color="#f59e0b"
                    height="350px"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
