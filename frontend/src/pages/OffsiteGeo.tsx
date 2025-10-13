import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2, Circle, Award, Shield, Link2, Share2, Megaphone } from 'lucide-react'

export function OffsiteGeo() {
  const modules = [
    {
      id: 'authority',
      name: 'Authority Building',
      icon: Award,
      description: 'Establish professional authority position in AI systems',
      progress: 65,
      tasks: [
        { id: 1, name: 'Obtain industry expert certification and qualifications', completed: true },
        { id: 2, name: 'Publish original research and white papers', completed: true },
        { id: 3, name: 'Create and share case studies', completed: true },
        { id: 4, name: 'Publish industry data reports and insights', completed: false },
        { id: 5, name: 'Establish thought leadership in niche areas', completed: false },
      ],
    },
    {
      id: 'reputation',
      name: 'Brand Reputation',
      icon: Shield,
      description: 'Actively manage AI perception and description of brand',
      progress: 70,
      tasks: [
        { id: 1, name: 'Set up real-time brand mention monitoring system', completed: true },
        { id: 2, name: 'Monitor AI platform brand mentions', completed: true },
        { id: 3, name: 'Correct inaccurate information in AI responses', completed: true },
        { id: 4, name: 'Systematically promote positive authoritative content', completed: false },
        { id: 5, name: 'Handle negative information promptly', completed: false },
      ],
    },
    {
      id: 'backlinks',
      name: 'New-Era Link Building',
      icon: Link2,
      description: 'Build authoritative link network for AI era',
      progress: 55,
      tasks: [
        { id: 1, name: 'Publish authoritative soft articles on industry media', completed: true },
        { id: 2, name: 'Distribute press releases via authoritative news platforms', completed: true },
        { id: 3, name: 'Register in industry directories and professional platforms', completed: false },
        { id: 4, name: 'Build academic citations in research papers', completed: false },
        { id: 5, name: 'Establish link relationships with authority sites', completed: false },
      ],
    },
    {
      id: 'distribution',
      name: 'Multi-platform Distribution',
      icon: Share2,
      description: 'Establish wide presence in AI training data sources',
      progress: 60,
      tasks: [
        { id: 1, name: 'Create entries on Wikipedia and Baidu Baike', completed: true },
        { id: 2, name: 'Build professional image on LinkedIn and Twitter', completed: true },
        { id: 3, name: 'Publish professional content on YouTube', completed: true },
        { id: 4, name: 'Participate in industry podcasts and interviews', completed: false },
        { id: 5, name: 'Distribute content across 10+ platforms', completed: false },
      ],
    },
    {
      id: 'pr',
      name: 'Media & PR Activities',
      icon: Megaphone,
      description: 'Establish authoritative voice through traditional media channels',
      progress: 50,
      tasks: [
        { id: 1, name: 'Accept authoritative media interviews', completed: true },
        { id: 2, name: 'Speak at industry conferences and events', completed: true },
        { id: 3, name: 'Implement systematic PR communication plan', completed: false },
        { id: 4, name: 'Collaborate with industry KOLs and influencers', completed: false },
        { id: 5, name: 'Build relationships with key journalists', completed: false },
      ],
    },
  ]

  const overallProgress = Math.round(
    modules.reduce((sum, module) => sum + module.progress, 0) / modules.length
  )

  const platformMetrics = [
    { platform: 'Wikipedia', mentions: 12, status: 'active' },
    { platform: 'LinkedIn', mentions: 45, status: 'active' },
    { platform: 'Industry Media', mentions: 28, status: 'active' },
    { platform: 'YouTube', mentions: 8, status: 'growing' },
    { platform: 'Podcasts', mentions: 5, status: 'growing' },
    { platform: 'Academic Papers', mentions: 3, status: 'pending' },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Off-site GEO Optimization</h1>
        <p className="text-gray-600 mt-2">
          Authority building, brand reputation, and multi-platform presence optimization
        </p>
      </div>

      {/* Overall Progress & Platform Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Off-site GEO Progress</CardTitle>
            <CardDescription>Progress across all external optimization modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{overallProgress}%</span>
                <Badge className="bg-yellow-500">In Progress</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-600 h-3 rounded-full transition-all"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {modules.map((module) => (
                  <div key={module.id} className="flex items-center gap-2">
                    <module.icon className="h-4 w-4 text-gray-600" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">{module.name}</div>
                      <div className="text-sm font-medium text-gray-900">{module.progress}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution Metrics</CardTitle>
            <CardDescription>Brand mentions across different platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {platformMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-50">
                      <Share2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{metric.platform}</div>
                      <div className="text-xs text-gray-500">{metric.mentions} mentions</div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      metric.status === 'active'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : metric.status === 'growing'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }
                  >
                    {metric.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Modules */}
      <Tabs defaultValue="authority" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {modules.map((module) => (
            <TabsTrigger key={module.id} value={module.id}>
              <module.icon className="h-4 w-4 mr-2" />
              {module.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {modules.map((module) => (
          <TabsContent key={module.id} value={module.id} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <module.icon className="h-6 w-6 text-yellow-600" />
                      {module.name}
                    </CardTitle>
                    <CardDescription className="mt-2">{module.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-600">{module.progress}%</div>
                    <div className="text-xs text-gray-500">Complete</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {module.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p
                          className={`text-sm ${
                            task.completed ? 'text-gray-900 font-medium' : 'text-gray-600'
                          }`}
                        >
                          {task.name}
                        </p>
                      </div>
                      {task.completed && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Completed
                        </Badge>
                      )}
                      {!task.completed && (
                        <Button size="sm" variant="outline">
                          Start
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Module Strategy & Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Strategy & Implementation Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {module.id === 'authority' && (
                    <div className="space-y-2 text-sm text-gray-700">
                      <p className="font-medium">Authority Building Strategy:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Obtain professional certifications and industry recognitions</li>
                        <li>Publish original research, white papers, and case studies</li>
                        <li>Share expertise through data reports and industry insights</li>
                        <li>Build E-E-A-T signals (Experience, Expertise, Authoritativeness, Trust)</li>
                        <li>Establish thought leadership in specific niche areas</li>
                      </ul>
                    </div>
                  )}
                  {module.id === 'reputation' && (
                    <div className="space-y-2 text-sm text-gray-700">
                      <p className="font-medium">Brand Reputation Management:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Implement real-time monitoring of brand mentions across AI platforms</li>
                        <li>Proactively correct inaccurate or negative information in AI responses</li>
                        <li>Systematically promote positive authoritative content</li>
                        <li>Report and correct misinformation to AI platform providers</li>
                        <li>Build consistent brand narrative across all channels</li>
                      </ul>
                    </div>
                  )}
                  {module.id === 'backlinks' && (
                    <div className="space-y-2 text-sm text-gray-700">
                      <p className="font-medium">New-Era Link Building Tactics:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Publish high-quality soft articles on authoritative industry media</li>
                        <li>Distribute press releases through trusted news platforms</li>
                        <li>Register brand profiles in professional directories and platforms</li>
                        <li>Build academic citations in research papers and studies</li>
                        <li>Focus on quality over quantity - prioritize authoritative sources</li>
                      </ul>
                    </div>
                  )}
                  {module.id === 'distribution' && (
                    <div className="space-y-2 text-sm text-gray-700">
                      <p className="font-medium">Multi-platform Distribution Strategy:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Create and maintain entries on Wikipedia, Baidu Baike, and other knowledge platforms</li>
                        <li>Build professional presence on LinkedIn, Twitter, and social media</li>
                        <li>Publish educational content on YouTube and video platforms</li>
                        <li>Participate in industry podcasts and interview programs</li>
                        <li>Ensure wide presence in AI training data sources</li>
                      </ul>
                    </div>
                  )}
                  {module.id === 'pr' && (
                    <div className="space-y-2 text-sm text-gray-700">
                      <p className="font-medium">Media & PR Activity Guidelines:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Accept interviews from authoritative media to establish expert image</li>
                        <li>Speak at professional conferences and industry events</li>
                        <li>Implement systematic PR communication plans</li>
                        <li>Collaborate with industry KOLs and thought leaders</li>
                        <li>Build long-term relationships with key journalists and media outlets</li>
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
