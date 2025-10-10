import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Filter, Eye, Edit, Trash2, Download } from 'lucide-react'

const contentItems = [
  {
    id: 'cont_001',
    title: 'Best Mattresses for Side Sleepers in 2025',
    type: 'Blog Post',
    status: 'Published',
    score: 8.5,
    citations: 145,
    views: 2340,
    publishedAt: '2025-01-15',
  },
  {
    id: 'cont_002',
    title: 'Memory Foam vs Latex Mattress: Complete Comparison',
    type: 'Comparison',
    status: 'Published',
    score: 9.1,
    citations: 289,
    views: 5670,
    publishedAt: '2025-01-12',
  },
  {
    id: 'cont_003',
    title: 'How to Choose the Right Mattress Firmness',
    type: 'Guide',
    status: 'Draft',
    score: 7.8,
    citations: 0,
    views: 0,
    publishedAt: null,
  },
  {
    id: 'cont_004',
    title: 'Mattress FAQs: Top 20 Questions Answered',
    type: 'FAQ',
    status: 'Published',
    score: 8.9,
    citations: 178,
    views: 3210,
    publishedAt: '2025-01-10',
  },
  {
    id: 'cont_005',
    title: 'Cooling Mattress Technology Explained',
    type: 'Blog Post',
    status: 'Review',
    score: 8.2,
    citations: 0,
    views: 0,
    publishedAt: null,
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Published':
      return <Badge variant="success">Published</Badge>
    case 'Draft':
      return <Badge variant="secondary">Draft</Badge>
    case 'Review':
      return <Badge variant="warning">Review</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

const getScoreColor = (score: number) => {
  if (score >= 9) return 'text-green-600 font-bold'
  if (score >= 8) return 'text-green-500 font-medium'
  if (score >= 7) return 'text-yellow-600'
  return 'text-gray-600'
}

export function ContentLibrary() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Content Library</h1>
          <p className="text-muted-foreground">Manage and track all generated content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">845</div>
            <p className="text-xs text-muted-foreground">+89 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">712</div>
            <p className="text-xs text-muted-foreground">84.3% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Citations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450</div>
            <p className="text-xs text-muted-foreground">+1,230 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.4</div>
            <p className="text-xs text-muted-foreground">+0.3 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Content Items</CardTitle>
              <CardDescription>Browse and manage your content library</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search content..." className="pl-8 w-64" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Citations</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium max-w-md">
                    {item.title}
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className={getScoreColor(item.score)}>
                    {item.score.toFixed(1)}
                  </TableCell>
                  <TableCell>{item.citations.toLocaleString()}</TableCell>
                  <TableCell>{item.views.toLocaleString()}</TableCell>
                  <TableCell>{item.publishedAt || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
