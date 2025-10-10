import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react'

const offers = [
  {
    id: 'offer_001',
    sku: 'MATT-PREMIUM-001',
    product: 'Premium Memory Foam Mattress',
    merchant: 'Shopify Store A',
    price: 899.00,
    currency: 'USD',
    stock: 45,
    region: 'US',
    availability: 'In Stock',
    validUntil: '2025-12-31',
  },
  {
    id: 'offer_002',
    sku: 'MATT-COOL-002',
    product: 'Cooling Gel Mattress Topper',
    merchant: 'Etsy Shop B',
    price: 129.99,
    currency: 'USD',
    stock: 120,
    region: 'US, CA',
    availability: 'In Stock',
    validUntil: '2025-12-31',
  },
  {
    id: 'offer_003',
    sku: 'MATT-LATEX-003',
    product: 'Organic Latex Mattress',
    merchant: 'Shopify Store A',
    price: 1299.00,
    currency: 'USD',
    stock: 12,
    region: 'US',
    availability: 'Low Stock',
    validUntil: '2025-12-31',
  },
  {
    id: 'offer_004',
    sku: 'BED-ADJUST-004',
    product: 'Adjustable Bed Frame',
    merchant: 'Custom Store C',
    price: 599.00,
    currency: 'USD',
    stock: 0,
    region: 'US, UK',
    availability: 'Out of Stock',
    validUntil: '2025-06-30',
  },
  {
    id: 'offer_005',
    sku: 'PILLOW-LUX-005',
    product: 'Luxury Pillow Set',
    merchant: 'Shopify Store A',
    price: 89.99,
    currency: 'USD',
    stock: 250,
    region: 'US, CA, UK',
    availability: 'In Stock',
    validUntil: '2025-12-31',
  },
]

const getAvailabilityBadge = (availability: string) => {
  switch (availability) {
    case 'In Stock':
      return <Badge variant="success">In Stock</Badge>
    case 'Low Stock':
      return <Badge variant="warning">Low Stock</Badge>
    case 'Out of Stock':
      return <Badge variant="destructive">Out of Stock</Badge>
    default:
      return <Badge variant="secondary">{availability}</Badge>
  }
}

export function Offers() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Offers Catalog</h1>
          <p className="text-muted-foreground">Manage product offers from knowledge graph</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Offer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">93% availability</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Merchants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$584</div>
            <p className="text-xs text-muted-foreground">Across all offers</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Offer List</CardTitle>
              <CardDescription>Browse and manage product offers</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search offers..." className="pl-8 w-64" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offer ID</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell className="font-mono text-xs">{offer.id}</TableCell>
                  <TableCell className="font-mono text-xs">{offer.sku}</TableCell>
                  <TableCell className="max-w-xs font-medium">{offer.product}</TableCell>
                  <TableCell>{offer.merchant}</TableCell>
                  <TableCell className="font-medium">
                    ${offer.price.toFixed(2)} {offer.currency}
                  </TableCell>
                  <TableCell>{offer.stock}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{offer.region}</Badge>
                  </TableCell>
                  <TableCell>{getAvailabilityBadge(offer.availability)}</TableCell>
                  <TableCell className="text-sm">{offer.validUntil}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-3 w-3" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>By order volume</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { product: 'Premium Memory Foam Mattress', orders: 145 },
              { product: 'Cooling Gel Mattress Topper', orders: 89 },
              { product: 'Organic Latex Mattress', orders: 67 },
            ].map((item) => (
              <div key={item.product} className="flex items-center justify-between">
                <span className="text-sm">{item.product}</span>
                <Badge>{item.orders} orders</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
            <CardDescription>Low stock and out of stock items</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { product: 'Adjustable Bed Frame', status: 'Out of Stock', stock: 0 },
              { product: 'Organic Latex Mattress', status: 'Low Stock', stock: 12 },
            ].map((item) => (
              <div key={item.product} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.product}</p>
                  <p className="text-xs text-muted-foreground">Stock: {item.stock}</p>
                </div>
                <Badge variant={item.stock === 0 ? 'destructive' : 'warning'}>
                  {item.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
