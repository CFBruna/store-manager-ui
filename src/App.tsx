import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { ProductDetails } from './pages/ProductDetails'

import { ProductFormPage } from './pages/ProductFormPage'
import { NotFound } from './pages/NotFound'
import { ComingSoon } from './pages/ComingSoon'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Toaster } from './components/ui/Toast'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { Favorites } from './pages/Favorites'

import { FavoritesProvider } from './contexts/FavoritesContext'

function App() {
  return (
    <ErrorBoundary>
      <FavoritesProvider>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/product/new" element={<ProductFormPage />} />
            <Route path="/product/:id/edit" element={<ProductFormPage />} />

            {/* Demo Routes */}
            <Route path="/catalog" element={<ComingSoon />} />
            <Route path="/clients" element={<ComingSoon />} />
            <Route path="/history" element={<ComingSoon />} />
            <Route path="/stats" element={<ComingSoon />} />
            <Route path="/settings" element={<ComingSoon />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </DashboardLayout>
      </FavoritesProvider>
    </ErrorBoundary>
  )
}

export default App
