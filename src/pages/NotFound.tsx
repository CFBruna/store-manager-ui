import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function NotFound() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-gray-200">404</h1>
                <h2 className="text-3xl font-bold text-gray-900 mt-4">
                    Página Não Encontrada
                </h2>
                <p className="text-gray-600 mt-2 mb-8">
                    A página que você está procurando não existe ou foi movida.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link to="/">
                        <Button size="lg" className="gap-2">
                            <Home className="w-4 h-4" />
                            Voltar ao Início
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
