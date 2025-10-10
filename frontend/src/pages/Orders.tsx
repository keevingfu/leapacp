import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Eye, Download, RefreshCw } from 'lucide-react'

const orders = [
  {
    id: 'ord_12450',
    product: 'Premium Memory Foam Mattress',
    customer: 'user_**45',
    amount: 899.00,
    status: 'Fulfilled',
    merchant: 'Shopify Store A',
    createdAt: '2025-01-15 14:30',
    source: 'ChatGPT',
  },
  {
    id: 'ord_12449',
    product: 'Cooling Gel Mattress Topper',
    customer: 'user_**78',
    amount: 129.99,
    status: 'Processing',
    merchant: 'Etsy Shop B',
    createdAt: '2025-01-15 13:15',
    source: 'Claude',
  },
  {
    id: 'ord_12448',
    product: 'Organic Latex Mattress',
    customer: 'user_**92',
    amount: 1299.00,
    status: 'Payment Authorized',
    merchant: 'Shopify Store A',
    createdAt: '2025-01-15 11:45',
    source: 'ChatGPT',
  },
  {
    id: 'ord_12447',
    product: 'Adjustable Bed Frame',
    customer: 'user_**34',
    amount: 599.00,
    status: 'Fulfilled',
    merchant: 'Custom Store C',
    createdAt: '2025-01-15 10:20',
    source: 'Gemini',
  },
  {
    id: 'ord_12446',
    product: 'Luxury Pillow Set',
    customer: 'user_**56',
    amount: 89.99,
    status: 'Refunded',
    merchant: 'Shopify Store A',
    createdAt: '2025-01-15 09:05',
    source: 'ChatGPT',
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Fulfilled':
      return <Badge variant="success">Fulfilled</Badge>
    case 'Processing':
      return <Badge variant="default">Processing</Badge>
    case 'Payment Authorized':
      return <Badge variant="warning">Authorized</Badge>
    case 'Refunded':
      return <Badge variant="destructive">Refunded</Badge>
    case 'Cancelled':
      return <Badge variant="secondary">Cancelled</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export function Orders() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">ACP order management and tracking</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">+23 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$145K</div>
            <p className="text-xs text-muted-foreground">+18.2% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.2%</div>
            <p className="text-xs text-muted-foreground">Order completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$620</div>
            <p className="text-xs text-muted-foreground">+$45 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Order List</CardTitle>
              <CardDescription>Recent orders from AI agents</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search orders..." className="pl-8 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">{order.id}</TableCell>
                  <TableCell className="max-w-xs">{order.product}</TableCell>
                  <TableCell className="font-mono text-xs">{order.customer}</TableCell>
                  <TableCell className="font-medium">${order.amount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.merchant}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.source}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{order.createdAt}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Status Flow</CardTitle>
            <CardDescription>SAGA state machine transitions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { stage: 'Created', count: 234, color: 'bg-blue-500' },
                { stage: 'Risk Check', count: 230, color: 'bg-blue-400' },
                { stage: 'Payment Authorized', count: 228, color: 'bg-green-500' },
                { stage: 'Merchant Order', count: 225, color: 'bg-green-400' },
                { stage: 'Captured', count: 223, color: 'bg-green-600' },
                { stage: 'Fulfilled', count: 221, color: 'bg-green-700' },
              ].map((stage) => (
                <div key={stage.stage} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <span className="flex-1 text-sm">{stage.stage}</span>
                  <span className="text-sm font-medium">{stage.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Merchants</CardTitle>
            <CardDescription>Order volume by merchant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Shopify Store A', orders: 145, revenue: '$89,450' },
              { name: 'Etsy Shop B', orders: 56, revenue: '$34,200' },
              { name: 'Custom Store C', orders: 33, revenue: '$21,800' },
            ].map((merchant) => (
              <div key={merchant.name} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{merchant.name}</p>
                  <p className="text-xs text-muted-foreground">{merchant.orders} orders</p>
                </div>
                <span className="font-bold">{merchant.revenue}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
