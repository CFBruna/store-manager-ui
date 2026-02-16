import { Link } from 'react-router-dom'
import { ArrowLeft, Wrench } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function ComingSoon() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mb-6">
          <Wrench className="w-10 h-10 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Em Breve</h2>
        <p className="text-gray-600 mb-8">
          Estamos trabalhando nesta funcionalidade. Em breve estará disponível!
        </p>
        <Link to="/">
          <Button size="lg" variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar aos Produtos
          </Button>
        </Link>
      </div>
    </div>
  )
}
