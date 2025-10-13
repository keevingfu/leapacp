import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, Target, Globe, LineChart, CheckCircle2, AlertCircle, Clock } from 'lucide-react'

export function GeoWorkflowDashboard() {
  const overallMetrics = [
    { label: 'AI Visibility Score', value: '87%', trend: '+12%', status: 'good' },
    { label: 'Brand Mention Rate', value: '24.3%', trend: '+5.2%', status: 'good' },
    { label: 'Content Adoption Rate', value: '68%', trend: '+8%', status: 'good' },
    { label: 'Conversion from AI', value: '3.2%', trend: '+1.1%', status: 'warning' },
  ]

  const workflowModules = [
    {
      title: 'On-site GEO Optimization',
      icon: Target,
      description: 'Technical foundation, content structure, and schema optimization',
      progress: 75,
      status: 'In Progress',
      statusColor: 'bg-blue-500',
      completedTasks: 15,
      totalTasks: 20,
      href: '/geo-workflow/onsite',
    },
    {
      title: 'Off-site GEO Optimization',
      icon: Globe,
      description: 'Authority building, brand reputation, and multi-platform distribution',
      progress: 60,
      status: 'In Progress',
      statusColor: 'bg-yellow-500',
      completedTasks: 12,
      totalTasks: 20,
      href: '/geo-workflow/offsite',
    },
    {
      title: 'GEO Monitoring & Analytics',
      icon: LineChart,
      description: 'Performance tracking, iterative optimization, and ROI analysis',
      progress: 45,
      status: 'Planning',
      statusColor: 'bg-gray-500',
      completedTasks: 9,
      totalTasks: 20,
      href: '/geo-workflow/monitoring',
    },
  ]

  const recentActivities = [
    { id: 1, type: 'success', message: 'Schema markup deployed for 15 product pages', time: '2 hours ago' },
    { id: 2, type: 'warning', message: 'Site speed optimization pending for mobile pages', time: '5 hours ago' },
    { id: 3, type: 'success', message: 'Authority content published on 3 industry platforms', time: '1 day ago' },
    { id: 4, type: 'info', message: 'AI visibility report generated for Q1 2025', time: '2 days ago' },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">GEO Workflow Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive Generative Engine Optimization workflow management
        </p>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overallMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-3xl">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">{metric.trend}</span>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Modules */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Workflow Modules</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {workflowModules.map((module, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <module.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                    </div>
                  </div>
                  <Badge className={module.statusColor}>{module.status}</Badge>
                </div>
                <CardDescription className="mt-2">{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{module.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>{module.completedTasks} of {module.totalTasks} tasks completed</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline" onClick={() => window.location.href = module.href}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates and actions in GEO workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {activity.type === 'success' && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    {activity.type === 'warning' && (
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    )}
                    {activity.type === 'info' && (
                      <Clock className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Run On-site SEO Audit
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Globe className="h-4 w-4 mr-2" />
              Check Brand Mentions
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <LineChart className="h-4 w-4 mr-2" />
              Generate Performance Report
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              View AI Visibility Trends
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* GEO Workflow Process */}
      <Card>
        <CardHeader>
          <CardTitle>GEO Workflow Process</CardTitle>
          <CardDescription>Comprehensive optimization workflow stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Stage 1 */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">On-site Technical Foundation</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Site speed, mobile optimization, HTTPS, SSR, and technical SEO basics
                </p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Completed
              </Badge>
            </div>

            {/* Stage 2 */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Content Structure & Schema</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Semantic HTML, structured data, knowledge graph, and AI-friendly content
                </p>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                In Progress
              </Badge>
            </div>

            {/* Stage 3 */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Authority & Reputation Building</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Expert certification, original research, case studies, and brand authority
                </p>
              </div>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Planning
              </Badge>
            </div>

            {/* Stage 4 */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-bold">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Multi-platform Distribution & Monitoring</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Cross-platform content, media outreach, and continuous performance tracking
                </p>
              </div>
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                Pending
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
