import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from './ui/Button'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

interface Props {
    children?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-red-100 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Ops! Algo deu errado.
                        </h1>

                        <p className="text-gray-500 mb-6">
                            Ocorreu um erro inesperado na aplicação. Nossa equipe foi notificada.
                        </p>

                        {this.state.error && (
                            <div className="bg-gray-50 p-3 rounded text-left text-xs text-gray-500 font-mono mb-6 overflow-auto max-h-32">
                                {this.state.error.toString()}
                            </div>
                        )}

                        <Button
                            onClick={() => window.location.reload()}
                            className="w-full gap-2 items-center justify-center"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Recarregar Página
                        </Button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
