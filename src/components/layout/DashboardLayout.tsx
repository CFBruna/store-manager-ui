import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Menu,
  X,
  Store,
  ChevronRight,
  ShoppingCart,
  Users,
  History,
  BarChart3,
  Settings,
  Star,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'
import { useProducts } from '../../hooks/useProducts'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { label: 'Produtos', href: '/', icon: LayoutDashboard },
    { label: 'Favoritos', href: '/favorites', icon: Star },

    { label: 'Catálogo Online', href: '/catalog', icon: ShoppingCart },
    { label: 'Clientes', href: '/clients', icon: Users },
    { label: 'Histórico', href: '/history', icon: History },
    { label: 'Estatísticas', href: '/stats', icon: BarChart3 },
  ]

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const sidebarWidth = 'w-20'

  const { data: products } = useProducts()
  const totalCount = products?.length || 0

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/') return 'Produtos'
    if (path === '/favorites') return 'Favoritos'
    if (path === '/catalog') return 'Catálogo Online'
    if (path === '/clients') return 'Clientes'
    if (path === '/history') return 'Histórico'
    if (path === '/stats') return 'Estatísticas'
    if (path === '/settings') return 'Configurações'
    if (path === '/product/new') return 'Novo Produto'
    if (path.includes('/edit')) return 'Editar Produto'
    if (path.startsWith('/product/')) return 'Detalhes do Produto'
    return 'Store Manager'
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Match Reference */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 bg-[#2D3748] border-r border-gray-800 transition-all duration-300 lg:translate-x-0',
          sidebarWidth,
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center justify-center relative px-4 border-b border-gray-700/50">
            <Link
              to="/"
              className="flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              <Store className="w-9 h-9 text-teal-500 flex-shrink-0" />
            </Link>
            {/* Close button for mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white absolute right-4"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 px-2 py-3 text-xs font-normal rounded-lg transition-all group',
                    isActive
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white',
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-[10px] leading-tight text-center">
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* Settings Button */}
          <div className="px-2 py-2 border-t border-gray-700">
            <Link
              to="/settings"
              onClick={() =>
                toast.info('Configurações indisponíveis na versão demo')
              }
              className="flex flex-col items-center justify-center gap-1 px-2 py-3 text-xs font-normal rounded-lg transition-all text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              <Settings className="w-6 h-6" />
              <span className="text-[10px] leading-tight">Config</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-20 transition-all duration-300">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              <Menu />
            </Button>
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {getPageTitle()}
              </h1>
              {location.pathname === '/' && (
                <span className="text-sm text-gray-500">
                  {totalCount} itens cadastrados
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button
              onClick={() =>
                toast.info('Central de Ajuda indisponível na versão demo')
              }
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold">
                ?
              </div>
              <span className="text-sm font-medium">Ajuda</span>
            </button>

            <button
              className="flex items-center gap-3 pl-6 border-l border-gray-200 hover:opacity-80 transition-opacity text-left"
              onClick={() => toast.info('Menu de usuário em desenvolvimento')}
            >
              <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-xs font-bold text-white">
                SM
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-none">
                  Store Manager
                </p>
                <p className="text-xs text-gray-500 mt-1">admin@loja.com</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
            </button>
          </div>
        </header>

        <main className="flex-1 bg-white">
          <div className="max-w-7xl mx-auto px-8 py-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
