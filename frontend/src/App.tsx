import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { Dashboard } from './pages/Dashboard'
import { Analytics } from './pages/Analytics'
import { KnowledgeGraph } from './pages/KnowledgeGraph'
import { DataCollection } from './pages/DataCollection'
import { ContentGeneration } from './pages/ContentGeneration'
import { ContentLibrary } from './pages/ContentLibrary'
import DataPipelineMonitor from './pages/DataPipelineMonitor'
import { GeoWorkflowDashboard } from './pages/GeoWorkflowDashboard'
import { OnsiteGeo } from './pages/OnsiteGeo'
import { OffsiteGeo } from './pages/OffsiteGeo'
import { GeoMonitoring } from './pages/GeoMonitoring'
import { SweetnightShopifyGeo } from './pages/SweetnightShopifyGeo'
import { AmazonGeo } from './pages/AmazonGeo'
import { Orders } from './pages/Orders'
import { Offers } from './pages/Offers'
import { Settings } from './pages/Settings'

function App() {
  return (
    <MainLayout>
      <Routes>
        {/* Overview Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />

        {/* GEO Routes */}
        <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
        <Route path="/data-collection" element={<DataCollection />} />
        <Route path="/data-pipeline-monitor" element={<DataPipelineMonitor />} />
        <Route path="/content-generation" element={<ContentGeneration />} />
        <Route path="/content-library" element={<ContentLibrary />} />

        {/* GEO Workflow Routes */}
        <Route path="/geo-workflow/dashboard" element={<GeoWorkflowDashboard />} />
        <Route path="/geo-workflow/onsite" element={<OnsiteGeo />} />
        <Route path="/geo-workflow/offsite" element={<OffsiteGeo />} />
        <Route path="/geo-workflow/monitoring" element={<GeoMonitoring />} />

        {/* Commerce Routes */}
        <Route path="/shopify-geo" element={<SweetnightShopifyGeo />} />
        <Route path="/amazon-geo" element={<AmazonGeo />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/offers" element={<Offers />} />

        {/* System Routes */}
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </MainLayout>
  )
}

export default App
