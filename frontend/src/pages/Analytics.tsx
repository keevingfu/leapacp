import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const citationData = [
  { month: 'Jan', citations: 450, clicks: 320, conversions: 45 },
  { month: 'Feb', citations: 580, clicks: 420, conversions: 62 },
  { month: 'Mar', citations: 720, clicks: 580, conversions: 89 },
  { month: 'Apr', citations: 890, clicks: 720, conversions: 112 },
  { month: 'May', citations: 1020, clicks: 850, conversions: 145 },
  { month: 'Jun', citations: 1245, clicks: 980, conversions: 178 },
]

const contentPerformance = [
  { type: 'Blog Posts', generated: 145, published: 132, citations: 450 },
  { type: 'Product Guides', generated: 89, published: 85, citations: 680 },
  { type: 'FAQs', generated: 234, published: 210, citations: 320 },
  { type: 'Videos', generated: 45, published: 42, citations: 280 },
  { type: 'Comparisons', generated: 67, published: 61, citations: 590 },
]

const funnelData = [
  { stage: 'AI Citations', count: 12450, percentage: 100 },
  { stage: 'Clicks', count: 3680, percentage: 29.6 },
  { stage: 'Product Views', count: 1850, percentage: 14.9 },
  { stage: 'Add to Cart', count: 680, percentage: 5.5 },
  { stage: 'Orders', count: 234, percentage: 1.9 },
]

export function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Performance metrics and conversion analytics</p>
      </div>

      <Tabs defaultValue="citations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="citations">Citations Trend</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
        </TabsList>

        <TabsContent value="citations">
          <Card>
            <CardHeader>
              <CardTitle>AI Citations Trend</CardTitle>
              <CardDescription>Monthly trend of AI citations, clicks, and conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={citationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="citations" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="conversions" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance by Type</CardTitle>
              <CardDescription>Content generation and citation performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={contentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="generated" fill="#3b82f6" />
                  <Bar dataKey="published" fill="#10b981" />
                  <Bar dataKey="citations" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel">
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
                        className="bg-primary h-8 rounded-full flex items-center justify-end pr-4 text-white text-sm font-medium transition-all"
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
      </Tabs>
    </div>
  )
}
