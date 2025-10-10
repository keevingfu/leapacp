import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Key, Database, Bell, Shield } from 'lucide-react'

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage platform configuration and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Brand Information</CardTitle>
              <CardDescription>Configure your brand settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand Name</label>
                <Input placeholder="Your Brand Name" defaultValue="Premium Mattress Co." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Website URL</label>
                <Input placeholder="https://..." defaultValue="https://example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Business Email</label>
                <Input type="email" placeholder="contact@..." defaultValue="contact@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Industry</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                  <option>Home & Furniture</option>
                  <option>E-commerce</option>
                  <option>Retail</option>
                  <option>Other</option>
                </select>
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Preferences</CardTitle>
              <CardDescription>Customize your platform experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Timezone</p>
                  <p className="text-sm text-muted-foreground">Set your preferred timezone</p>
                </div>
                <select className="flex h-9 w-48 rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                  <option>UTC-8 (Pacific)</option>
                  <option>UTC-5 (Eastern)</option>
                  <option>UTC+0 (GMT)</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Language</p>
                  <p className="text-sm text-muted-foreground">Platform display language</p>
                </div>
                <select className="flex h-9 w-48 rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                  <option>English</option>
                  <option>中文</option>
                  <option>Español</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage API keys for external integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Reddit API', status: 'Active', key: 'reddit_***********' },
                { name: 'YouTube Data API', status: 'Active', key: 'AIza***********' },
                { name: 'Stripe API', status: 'Active', key: 'sk_test_***********' },
                { name: 'Firecrawl API', status: 'Not Set', key: null },
              ].map((api) => (
                <div key={api.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{api.name}</p>
                      {api.key ? (
                        <p className="text-xs font-mono text-muted-foreground">{api.key}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">No API key configured</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={api.status === 'Active' ? 'success' : 'secondary'}>
                      {api.status}
                    </Badge>
                    <Button size="sm" variant="outline">Configure</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Connections</CardTitle>
              <CardDescription>Manage database integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Neo4j', status: 'Connected', url: 'bolt://localhost:7687' },
                { name: 'PostgreSQL', status: 'Connected', url: 'localhost:5437' },
                { name: 'MongoDB', status: 'Connected', url: 'localhost:27018' },
                { name: 'Redis', status: 'Connected', url: 'localhost:6382' },
              ].map((db) => (
                <div key={db.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{db.name}</p>
                      <p className="text-xs text-muted-foreground">{db.url}</p>
                    </div>
                  </div>
                  <Badge variant="success">{db.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>E-commerce Platforms</CardTitle>
              <CardDescription>Connect your merchant stores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Shopify', stores: 2, status: 'Connected' },
                { name: 'Etsy', stores: 1, status: 'Connected' },
                { name: 'WooCommerce', stores: 0, status: 'Not Connected' },
              ].map((platform) => (
                <div key={platform.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{platform.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {platform.stores > 0 ? `${platform.stores} stores connected` : 'No stores'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={platform.status === 'Connected' ? 'success' : 'secondary'}>
                      {platform.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      {platform.status === 'Connected' ? 'Manage' : 'Connect'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'New Orders', description: 'Get notified when new orders are created', enabled: true },
                { title: 'Order Status Changes', description: 'Updates on order fulfillment', enabled: true },
                { title: 'Low Stock Alerts', description: 'When product inventory is low', enabled: true },
                { title: 'Content Published', description: 'When new content is published', enabled: false },
                { title: 'System Updates', description: 'Important platform updates', enabled: true },
              ].map((notification) => (
                <div key={notification.title} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.description}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={notification.enabled} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage authentication and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Enable</Button>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Change Password</label>
                <Input type="password" placeholder="Current password" />
                <Input type="password" placeholder="New password" />
                <Input type="password" placeholder="Confirm new password" />
                <Button>Update Password</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>Active sessions and devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Current Session</p>
                    <p className="text-xs text-muted-foreground">Chrome on macOS • Last active: Now</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
