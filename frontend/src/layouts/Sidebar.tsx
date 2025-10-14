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
import { useUIStore } from '@/store'

const navigation = [
  {
    name: 'Overview',
    items: [
      { name: 'Dashboard', page: 'dashboard', icon: LayoutDashboard },
      { name: 'Analytics', page: 'analytics', icon: BarChart3 },
    ],
  },
  {
    name: 'GEO',
    items: [
      { name: 'Knowledge Graph', page: 'knowledge-graph', icon: Network },
      { name: 'Data Collection', page: 'data-collection', icon: Database },
      { name: 'Content Generation', page: 'content-generation', icon: FileText },
      { name: 'Content Library', page: 'content-library', icon: FileText },
    ],
  },
  {
    name: 'GEO Workflow',
    items: [
      { name: 'Workflow Dashboard', page: 'workflow-dashboard', icon: TrendingUp },
      { name: 'On-site GEO', page: 'onsite-geo', icon: Target },
      { name: 'Off-site GEO', page: 'offsite-geo', icon: Globe },
      { name: 'GEO Monitoring', page: 'geo-monitoring', icon: LineChart },
    ],
  },
  {
    name: 'Commerce',
    items: [
      { name: 'Shopify GEO', page: 'shopify-geo', icon: ShoppingBag },
      { name: 'Amazon GEO', page: 'amazon-geo', icon: ShoppingCart },
      { name: 'Orders', page: 'orders', icon: ShoppingCart },
      { name: 'Offers', page: 'offers', icon: ShoppingCart },
    ],
  },
  {
    name: 'System',
    items: [
      { name: 'Settings', page: 'settings', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const { currentPage, setCurrentPage } = useUIStore()

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
                const isActive = currentPage === item.page
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => setCurrentPage(item.page)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </button>
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
