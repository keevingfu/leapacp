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
  Activity,
  LogOut,
  User,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'

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
      { name: 'Data Pipeline Monitor', path: '/data-pipeline-monitor', icon: Activity },
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
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 border-r bg-gray-50 h-full overflow-y-auto flex flex-col">
      {/* User Info Section */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
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

      {/* Logout Button */}
      <div className="p-4 border-t bg-white">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
