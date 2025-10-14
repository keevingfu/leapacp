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
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Overview',
    items: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    ],
  },
  {
    name: 'GEO',
    items: [
      { name: 'Knowledge Graph', path: '/knowledge-graph', icon: Network },
      { name: 'Data Collection', path: '/data-collection', icon: Database },
      { name: 'Content Generation', path: '/content-generation', icon: FileText },
      { name: 'Content Library', path: '/content-library', icon: FileText },
    ],
  },
  {
    name: 'GEO Workflow',
    items: [
      { name: 'Workflow Dashboard', path: '/geo-workflow/dashboard', icon: TrendingUp },
      { name: 'On-site GEO', path: '/geo-workflow/onsite', icon: Target },
      { name: 'Off-site GEO', path: '/geo-workflow/offsite', icon: Globe },
      { name: 'GEO Monitoring', path: '/geo-workflow/monitoring', icon: LineChart },
    ],
  },
  {
    name: 'Commerce',
    items: [
      { name: 'Shopify GEO', path: '/shopify-geo', icon: ShoppingBag },
      { name: 'Amazon GEO', path: '/amazon-geo', icon: ShoppingCart },
      { name: 'Offers', path: '/offers', icon: ShoppingCart },
      { name: 'Orders', path: '/orders', icon: ShoppingCart },
    ],
  },
  {
    name: 'System',
    items: [
      { name: 'Settings', path: '/settings', icon: Settings },
    ],
  },
]

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-gray-50 h-full overflow-y-auto">
      <nav className="p-4 space-y-6">
        {navigation.map((section) => (
          <div key={section.name}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {section.name}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-700 hover:bg-gray-200'
                      )
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
