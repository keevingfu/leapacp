import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Eye, FileCheck, DollarSign, Calendar, Target } from 'lucide-react'

export function GeoMonitoring() {
  // AI Visibility Metrics Data
  const visibilityData = [
    { month: 'Jan', mentionRate: 18, answerAdoptionRate: 55, firstScreenRate: 42 },
    { month: 'Feb', mentionRate: 20, answerAdoptionRate: 60, firstScreenRate: 48 },
    { month: 'Mar', mentionRate: 22, answerAdoptionRate: 65, firstScreenRate: 52 },
    { month: 'Apr', mentionRate: 24, answerAdoptionRate: 68, firstScreenRate: 58 },
  ]

  // Content Quality Metrics Data
  const qualityData = [
    { metric: 'Semantic Structure', score: 85 },
    { metric: 'Authority Validation', score: 78 },
    { metric: 'Timeliness', score: 92 },
    { metric: 'Relevance', score: 88 },
    { metric: 'Accuracy', score: 95 },
  ]

  // Business Conversion Metrics
  const conversionData = [
    { month: 'Jan', aiTraffic: 1200, leads: 45, conversions: 12 },
    { month: 'Feb', aiTraffic: 1500, leads: 58, conversions: 15 },
    { month: 'Mar', aiTraffic: 1800, leads: 72, conversions: 19 },
    { month: 'Apr', aiTraffic: 2100, leads: 85, conversions: 23 },
  ]

  const keyMetrics = [
    {
      category: 'AI Visibility',
      icon: Eye,
      metrics: [
        { label: 'Brand Mention Rate', value: '24.3%', description: 'Frequency of brand mentions in target AI responses' },
        { label: 'Answer Adoption Rate', value: '68%', description: 'Percentage of content directly adopted by AI' },
        { label: 'First Screen Rate', value: '58%', description: 'Percentage appearing in first screen of AI answers' },
      ],
    },
    {
      category: 'Content Quality',
      icon: FileCheck,
      metrics: [
        { label: 'Semantic Structure Index', value: '85/100', description: 'Degree of content understanding by AI' },
        { label: 'Authority Validation', value: '78%', description: 'Cross-verification by multiple authority sources' },
        { label: 'Timeliness Coefficient', value: '92/100', description: 'Content timeliness and relevance score' },
      ],
    },
    {
      category: 'Business Conversion',
      icon: DollarSign,
      metrics: [
        { label: 'AI-Driven Traffic', value: '2,100', description: 'Monthly traffic from AI recommendations' },
        { label: 'Lead Conversion Rate', value: '4.05%', description: 'Business leads from AI channel' },
        { label: 'ROI', value: '3.2x', description: 'GEO investment to business return ratio' },
      ],
    },
  ]

  const optimizationTimeline = [
    {
      phase: '30-Day Sprint',
      icon: Target,
      color: 'bg-blue-500',
      tasks: [
        'Basic optimization and quick adjustments',
        'Technical foundation improvements',
        'Initial content structure refinement',
        'Quick wins implementation',
      ],
      status: 'Completed',
    },
    {
      phase: '60-Day Deep Dive',
      icon: Target,
      color: 'bg-green-500',
      tasks: [
        'Content system comprehensive optimization',
        'Authority building initiatives',
        'Schema markup deployment',
        'Multi-platform content distribution',
      ],
      status: 'In Progress',
    },
    {
      phase: '90-Day Evaluation',
      icon: Target,
      color: 'bg-yellow-500',
      tasks: [
        'Comprehensive effectiveness assessment',
        'Strategy adjustment and refinement',
        'ROI analysis and reporting',
        'Long-term optimization roadmap',
      ],
      status: 'Planning',
    },
    {
      phase: 'Quarterly Review',
      icon: Calendar,
      color: 'bg-purple-500',
      tasks: [
        'Long-term strategic planning',
        'Resource allocation optimization',
        'Competitive analysis update',
        'Annual goal alignment',
      ],
      status: 'Scheduled',
    },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">GEO Monitoring & Analytics</h1>
        <p className="text-gray-600 mt-2">
          Performance tracking, iterative optimization, and ROI analysis
        </p>
      </div>

      {/* Key Performance Indicators */}
      <Tabs defaultValue="visibility" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {keyMetrics.map((category) => (
            <TabsTrigger key={category.category} value={category.category.toLowerCase().replace(' ', '-')}>
              <category.icon className="h-4 w-4 mr-2" />
              {category.category}
            </TabsTrigger>
          ))}
        </TabsList>

        {keyMetrics.map((category) => (
          <TabsContent
            key={category.category}
            value={category.category.toLowerCase().replace(' ', '-')}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {category.metrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardDescription>{metric.label}</CardDescription>
                    <CardTitle className="text-3xl">{metric.value}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{metric.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Data Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Visibility Trends */}
        <Card>
          <CardHeader>
            <CardTitle>AI Visibility Trends</CardTitle>
            <CardDescription>Monthly performance across visibility metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visibilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="mentionRate" stroke="#3b82f6" name="Mention Rate (%)" strokeWidth={2} />
                <Line type="monotone" dataKey="answerAdoptionRate" stroke="#10b981" name="Adoption Rate (%)" strokeWidth={2} />
                <Line type="monotone" dataKey="firstScreenRate" stroke="#f59e0b" name="First Screen Rate (%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Content Quality Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Content Quality Scores</CardTitle>
            <CardDescription>Current performance across quality dimensions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={qualityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="metric" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Business Conversion Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Business Conversion Metrics</CardTitle>
          <CardDescription>AI-driven traffic, leads, and conversions over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="aiTraffic" stroke="#3b82f6" name="AI Traffic" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="leads" stroke="#10b981" name="Leads" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#f59e0b" name="Conversions" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Continuous Optimization Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Continuous Optimization Timeline</CardTitle>
          <CardDescription>Iterative improvement process and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {optimizationTimeline.map((phase, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${phase.color} text-white flex-shrink-0`}>
                  <phase.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{phase.phase}</h4>
                    <Badge
                      variant="outline"
                      className={
                        phase.status === 'Completed'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : phase.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : phase.status === 'Planning'
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }
                    >
                      {phase.status}
                    </Badge>
                  </div>
                  <ul className="space-y-1">
                    {phase.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button className="flex-1">
          <TrendingUp className="h-4 w-4 mr-2" />
          Generate Full Report
        </Button>
        <Button variant="outline" className="flex-1">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Review Meeting
        </Button>
        <Button variant="outline" className="flex-1">
          <FileCheck className="h-4 w-4 mr-2" />
          Export Analytics Data
        </Button>
      </div>
    </div>
  )
}
