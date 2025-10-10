import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sparkles, Download, Copy, RefreshCw } from 'lucide-react'

export function ContentGeneration() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Generation</h1>
        <p className="text-muted-foreground">AI-powered content generation workspace</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Content Generator</CardTitle>
            <CardDescription>Generate high-quality content based on product knowledge</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Content Type</label>
              <Tabs defaultValue="blog" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="blog">Blog Post</TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                  <TabsTrigger value="guide">Guide</TabsTrigger>
                  <TabsTrigger value="comparison">Comparison</TabsTrigger>
                </TabsList>

                <TabsContent value="blog" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Topic</label>
                    <Input placeholder="e.g., Best mattresses for side sleepers" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Keywords</label>
                    <Input placeholder="e.g., mattress, side sleeper, comfort" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tone</label>
                    <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                      <option>Professional</option>
                      <option>Casual</option>
                      <option>Educational</option>
                      <option>Persuasive</option>
                    </select>
                  </div>
                </TabsContent>

                <TabsContent value="faq" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Product</label>
                    <Input placeholder="Select product from knowledge graph" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Number of Questions</label>
                    <Input type="number" defaultValue="10" />
                  </div>
                </TabsContent>

                <TabsContent value="guide" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Guide Title</label>
                    <Input placeholder="e.g., Complete Guide to Choosing a Mattress" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Audience</label>
                    <Input placeholder="e.g., First-time mattress buyers" />
                  </div>
                </TabsContent>

                <TabsContent value="comparison" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Products to Compare</label>
                    <Input placeholder="Select 2-3 products" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Comparison Aspects</label>
                    <Input placeholder="e.g., Price, Comfort, Durability" />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium">Generated Content Preview</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-500 italic">Generated content will appear here...</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generation History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: 'Best Mattresses for...', type: 'Blog', time: '5 min ago', status: 'completed' },
                { title: 'Memory Foam FAQ', type: 'FAQ', time: '1 hour ago', status: 'completed' },
                { title: 'Mattress Buying Guide', type: 'Guide', time: '2 hours ago', status: 'completed' },
              ].map((item, index) => (
                <div key={index} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                    <Badge variant="success" className="text-xs">{item.type}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Generated Today</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">This Week</span>
                <span className="font-medium">45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="font-medium">96.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg. Quality Score</span>
                <span className="font-medium">8.4/10</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Knowledge Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Knowledge Graph</span>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Collected Content</span>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Product Data</span>
                <Badge variant="success">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
