import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Play, Pause, RefreshCw } from 'lucide-react'

const collectionTasks = [
  { id: 'task_001', platform: 'Reddit', keywords: 'mattress, sleep quality', status: 'running', collected: 245, lastRun: '5 min ago' },
  { id: 'task_002', platform: 'YouTube', keywords: 'best mattress 2025', status: 'completed', collected: 89, lastRun: '1 hour ago' },
  { id: 'task_003', platform: 'Quora', keywords: 'back pain mattress', status: 'pending', collected: 0, lastRun: 'Never' },
  { id: 'task_004', platform: 'Medium', keywords: 'sleep health', status: 'running', collected: 56, lastRun: '10 min ago' },
  { id: 'task_005', platform: 'Reddit', keywords: 'memory foam vs latex', status: 'failed', collected: 12, lastRun: '2 hours ago' },
]

const recentContent = [
  { source: 'r/Mattress', title: 'Best mattress for side sleepers?', type: 'Discussion', sentiment: 'Positive', collected: '15 min ago' },
  { source: 'YouTube', title: 'Top 5 Mattresses for Back Pain Relief', type: 'Video', sentiment: 'Neutral', collected: '1 hour ago' },
  { source: 'Quora', title: 'What makes a mattress good for hot sleepers?', type: 'Question', sentiment: 'Neutral', collected: '2 hours ago' },
  { source: 'r/Sleep', title: 'Memory foam vs spring mattress comparison', type: 'Review', sentiment: 'Positive', collected: '3 hours ago' },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'running':
      return <Badge variant="default">Running</Badge>
    case 'completed':
      return <Badge variant="success">Completed</Badge>
    case 'pending':
      return <Badge variant="secondary">Pending</Badge>
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

const getSentimentBadge = (sentiment: string) => {
  switch (sentiment) {
    case 'Positive':
      return <Badge variant="success">{sentiment}</Badge>
    case 'Negative':
      return <Badge variant="destructive">{sentiment}</Badge>
    default:
      return <Badge variant="secondary">{sentiment}</Badge>
  }
}

export function DataCollection() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Data Collection</h1>
          <p className="text-muted-foreground">Manage multi-platform content collection tasks</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">+180 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">2 running tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Reddit, YouTube, Quora, Medium</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collection Tasks</CardTitle>
          <CardDescription>Manage and monitor data collection tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task ID</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Keywords</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Collected</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collectionTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-mono text-sm">{task.id}</TableCell>
                  <TableCell>{task.platform}</TableCell>
                  <TableCell className="max-w-xs truncate">{task.keywords}</TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>{task.collected}</TableCell>
                  <TableCell>{task.lastRun}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {task.status === 'running' ? (
                        <Button size="sm" variant="outline">
                          <Pause className="h-3 w-3" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          <Play className="h-3 w-3" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recently Collected Content</CardTitle>
          <CardDescription>Latest content from all platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Collected</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentContent.map((content, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{content.source}</TableCell>
                  <TableCell className="max-w-md">{content.title}</TableCell>
                  <TableCell>{content.type}</TableCell>
                  <TableCell>{getSentimentBadge(content.sentiment)}</TableCell>
                  <TableCell>{content.collected}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
