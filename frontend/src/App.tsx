import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { Dashboard } from './pages/Dashboard'
import { Analytics } from './pages/Analytics'
import { KnowledgeGraph } from './pages/KnowledgeGraph'
import { DataCollection } from './pages/DataCollection'
import { ContentGeneration } from './pages/ContentGeneration'
import { ContentLibrary } from './pages/ContentLibrary'
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
          <Route path="commerce/orders" element={<Orders />} />
          <Route path="commerce/offers" element={<Offers />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
