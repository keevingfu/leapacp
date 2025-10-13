import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="geo/knowledge-graph" element={<KnowledgeGraph />} />
          <Route path="geo/data-collection" element={<DataCollection />} />
          <Route path="geo/content-generation" element={<ContentGeneration />} />
          <Route path="geo/content-library" element={<ContentLibrary />} />
          <Route path="geo-workflow/dashboard" element={<GeoWorkflowDashboard />} />
          <Route path="geo-workflow/onsite" element={<OnsiteGeo />} />
          <Route path="geo-workflow/offsite" element={<OffsiteGeo />} />
          <Route path="geo-workflow/monitoring" element={<GeoMonitoring />} />
          <Route path="geo-workflow/sweetnight-shopify" element={<SweetnightShopifyGeo />} />
          <Route path="geo-workflow/amazon" element={<AmazonGeo />} />
          <Route path="commerce/orders" element={<Orders />} />
          <Route path="commerce/offers" element={<Offers />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
