import { MainLayout } from './layouts/MainLayout'
import { Dashboard } from './pages/Dashboard'
import { Analytics } from './pages/Analytics'
import { KnowledgeGraph } from './pages/KnowledgeGraph'
import { DataCollection } from './pages/DataCollection'
import { ContentGeneration } from './pages/ContentGeneration'
import { ContentLibrary } from './pages/ContentLibrary'
import { GeoWorkflowDashboard } from './pages/GeoWorkflowDashboard'
import { OnsiteGeo } from './pages/OnsiteGeo'
import { OffsiteGeo } from './pages/OffsiteGeo'
import { GeoMonitoring } from './pages/GeoMonitoring'
import { SweetnightShopifyGeo } from './pages/SweetnightShopifyGeo'
import { AmazonGeo } from './pages/AmazonGeo'
import { Orders } from './pages/Orders'
import { Offers } from './pages/Offers'
import { Settings } from './pages/Settings'
import { useUIStore } from './store'

function App() {
  const currentPage = useUIStore((state) => state.currentPage)

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'analytics':
        return <Analytics />
      case 'knowledge-graph':
        return <KnowledgeGraph />
      case 'data-collection':
        return <DataCollection />
      case 'content-generation':
        return <ContentGeneration />
      case 'content-library':
        return <ContentLibrary />
      case 'workflow-dashboard':
        return <GeoWorkflowDashboard />
      case 'onsite-geo':
        return <OnsiteGeo />
      case 'offsite-geo':
        return <OffsiteGeo />
      case 'geo-monitoring':
        return <GeoMonitoring />
      case 'shopify-geo':
        return <SweetnightShopifyGeo />
      case 'amazon-geo':
        return <AmazonGeo />
      case 'orders':
        return <Orders />
      case 'offers':
        return <Offers />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return <MainLayout>{renderPage()}</MainLayout>
}

export default App
