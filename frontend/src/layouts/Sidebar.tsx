import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Network,
  FileText,
  ShoppingCart,
  Settings,
  BarChart3,
  Database,
  TrendingUp,
  Target,
  Globe,
  LineChart,
  ShoppingBag,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Overview',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    ],
  },
  {
    name: 'GEO',
    items: [
      { name: 'Knowledge Graph', href: '/geo/knowledge-graph', icon: Network },
      { name: 'Data Collection', href: '/geo/data-collection', icon: Database },
      { name: 'Content Generation', href: '/geo/content-generation', icon: FileText },
      { name: 'Content Library', href: '/geo/content-library', icon: FileText },
    ],
  },
  {
    name: 'GEO Workflow',
    items: [
      { name: 'Workflow Dashboard', href: '/geo-workflow/dashboard', icon: TrendingUp },
      { name: 'On-site GEO', href: '/geo-workflow/onsite', icon: Target },
      { name: 'Off-site GEO', href: '/geo-workflow/offsite', icon: Globe },
      { name: 'GEO Monitoring', href: '/geo-workflow/monitoring', icon: LineChart },
    ],
  },
  {
    name: 'Commerce',
    items: [
      { name: 'Shopify GEO', href: '/geo-workflow/sweetnight-shopify', icon: ShoppingBag },
      { name: 'Amazon GEO', href: '/geo-workflow/amazon', icon: ShoppingCart },
      { name: 'Orders', href: '/commerce/orders', icon: ShoppingCart },
      { name: 'Offers', href: '/commerce/offers', icon: ShoppingCart },
    ],
  },
  {
    name: 'System',
    items: [
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 border-r bg-gray-50 h-full overflow-y-auto">
      <nav className="p-4 space-y-6">
        {navigation.map((section) => (
          <div key={section.name}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {section.name}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
