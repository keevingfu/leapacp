import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2, Circle, Zap, FileCode, BookOpen, Eye, Users } from 'lucide-react'

export function OnsiteGeo() {
  const modules = [
    {
      id: 'technical',
      name: 'Technical Foundation',
      icon: Zap,
      description: 'Provide efficient content crawling and parsing environment for AI engines',
      progress: 85,
      tasks: [
        { id: 1, name: 'Site speed optimization (<2.5s load time)', completed: true },
        { id: 2, name: 'Configure CDN and browser caching', completed: true },
        { id: 3, name: 'Mobile responsive design optimization', completed: true },
        { id: 4, name: 'HTTPS security deployment', completed: true },
        { id: 5, name: 'Server-side rendering (SSR) implementation', completed: false },
      ],
    },
    {
      id: 'content',
      name: 'Content Structure',
      icon: FileCode,
      description: 'Create AI-friendly content architecture and semantic system',
      progress: 70,
      tasks: [
        { id: 1, name: 'Standardize heading hierarchy (H1-H6)', completed: true },
        { id: 2, name: 'Optimize paragraph logic (4-5 sentences per paragraph)', completed: true },
        { id: 3, name: 'Apply FAQ format structure', completed: true },
        { id: 4, name: 'Provide definition-style content for key concepts', completed: false },
        { id: 5, name: 'Ensure contextual coherence', completed: false },
      ],
    },
    {
      id: 'schema',
      name: 'Schema Markup',
      icon: BookOpen,
      description: 'Provide clear content semantic identification for AI',
      progress: 60,
      tasks: [
        { id: 1, name: 'Deploy JSON-LD format structured data', completed: true },
        { id: 2, name: 'Implement Article schema markup', completed: true },
        { id: 3, name: 'Implement Product schema markup', completed: true },
        { id: 4, name: 'Implement FAQ schema markup', completed: false },
        { id: 5, name: 'Deploy llms.txt file for LLMs', completed: false },
        { id: 6, name: 'Build knowledge graph (entity relationships)', completed: false },
      ],
    },
    {
      id: 'readability',
      name: 'AI Readability',
      icon: Eye,
      description: 'Optimize content semantic clarity and extraction convenience',
      progress: 75,
      tasks: [
        { id: 1, name: 'Use semantic HTML tags', completed: true },
        { id: 2, name: 'Clearly annotate entities (people, places, brands)', completed: true },
        { id: 3, name: 'Optimize contextual coherence', completed: true },
        { id: 4, name: 'Control information density', completed: false },
        { id: 5, name: 'Balance detail and conciseness', completed: false },
      ],
    },
    {
      id: 'ux',
      name: 'User Experience',
      icon: Users,
      description: 'Improve overall page quality and trust signals',
      progress: 80,
      tasks: [
        { id: 1, name: 'Optimize Core Web Vitals (LCP, FID, CLS)', completed: true },
        { id: 2, name: 'Design clear navigation structure', completed: true },
        { id: 3, name: 'Implement breadcrumb navigation', completed: true },
        { id: 4, name: 'Build internal linking strategy', completed: true },
        { id: 5, name: 'Integrate multimedia content (images, videos)', completed: false },
      ],
    },
  ]

  const overallProgress = Math.round(
    modules.reduce((sum, module) => sum + module.progress, 0) / modules.length
  )

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">On-site GEO Optimization</h1>
        <p className="text-gray-600 mt-2">
          Technical foundation and content optimization for AI-friendly website
        </p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall On-site GEO Progress</CardTitle>
          <CardDescription>Comprehensive progress across all optimization modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">{overallProgress}%</span>
              <Badge className="bg-blue-500">In Progress</Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4">
              {modules.map((module) => (
                <div key={module.id} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <module.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="text-sm font-medium text-gray-900">{module.progress}%</div>
                  <div className="text-xs text-gray-500">{module.name}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Modules */}
      <Tabs defaultValue="technical" className="w-full">
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
                      <module.icon className="h-6 w-6 text-blue-600" />
                      {module.name}
                    </CardTitle>
                    <CardDescription className="mt-2">{module.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{module.progress}%</div>
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

            {/* Module Best Practices */}
            <Card>
              <CardHeader>
                <CardTitle>Best Practices & Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {module.id === 'technical' && (
                    <div className="space-y-2 text-sm text-gray-700">
                      <p className="font-medium">Key Technical Requirements:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Page load time must be under 2.5 seconds</li>
                        <li>Ensure mobile-first responsive design</li>
                        <li>Implement proper caching strategies (CDN + browser cache)</li>
                        <li>Use HTTPS for all pages to establish trust</li>
                        <li>Consider SSR to avoid JavaScript dependency for AI crawlers</li>
                      </ul>
                    </div>
                  )}
                  {module.id === 'content' && (
                    <div className="space-y-2 text-sm text-gray-700">
                      <p className="font-medium">Content Structure Guidelines:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Use clear H1-H6 heading hierarchy</li>
                        <li>Keep paragraphs to 4-5 sentences for readability</li>
                        <li>Apply FAQ format for common questions</li>
                        <li>Provide concise definitions for key concepts</li>
                        <li>Maintain contextual coherence throughout content</li>
                      </ul>
                    </div>
                  )}
                  {module.id === 'schema' && (
                    <div className="space-y-2 text-sm text-gray-700">
                      <p className="font-medium">Schema Markup Standards:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Use JSON-LD format for structured data</li>
                        <li>Implement Article, Product, FAQ, and Organization schemas</li>
                        <li>Deploy llms.txt file for large language model guidance</li>
                        <li>Build knowledge graph with entity relationships</li>
                        <li>Ensure schema validation via Google's Structured Data Testing Tool</li>
                      </ul>
                    </div>
                  )}
                  {module.id === 'readability' && (
                    <div className="space-y-2 text-sm text-gray-700">
                      <p className="font-medium">AI Readability Optimization:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Use semantic HTML5 tags (article, section, aside, etc.)</li>
                        <li>Clearly annotate named entities (people, places, brands)</li>
                        <li>Ensure logical flow and contextual coherence</li>
                        <li>Balance information density with readability</li>
                        <li>Provide high-value, concise information</li>
                      </ul>
                    </div>
                  )}
                  {module.id === 'ux' && (
                    <div className="space-y-2 text-sm text-gray-700">
                      <p className="font-medium">User Experience Standards:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Optimize Core Web Vitals: LCP &lt;2.5s, FID &lt;100ms, CLS &lt;0.1</li>
                        <li>Design clear and intuitive navigation structure</li>
                        <li>Implement breadcrumb navigation for better context</li>
                        <li>Build semantic internal linking network</li>
                        <li>Integrate multimedia content (images, videos, infographics)</li>
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
