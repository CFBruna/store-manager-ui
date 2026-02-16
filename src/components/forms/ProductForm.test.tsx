import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { ProductForm } from './ProductForm'
import { vi, describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock useProducts hook
vi.mock('../../hooks/useProducts', () => ({
  useProducts: () => ({
    data: [{ category: 'Eletrônicos' }],
    isLoading: false,
    error: null,
  }),
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  )
}

describe('ProductForm', () => {
  it('renders correctly with empty fields when no initialData is provided', () => {
    renderWithProvider(<ProductForm onSubmit={vi.fn()} isSubmitting={false} />)

    expect(screen.getByLabelText(/Título do Produto/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Preço/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Categoria/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Criar Produto/i }),
    ).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const handleSubmit = vi.fn()
    const user = userEvent.setup()

    renderWithProvider(
      <ProductForm onSubmit={handleSubmit} isSubmitting={false} />,
    )

    const submitButton = screen.getByRole('button', { name: /Criar Produto/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText('O título deve ter pelo menos 3 caracteres'),
      ).toBeInTheDocument()
    })

    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('submits form with correct data', async () => {
    const handleSubmit = vi.fn()

    renderWithProvider(
      <ProductForm onSubmit={handleSubmit} isSubmitting={false} />,
    )

    const titleInput = screen.getByLabelText(/Título do Produto/i)
    const priceInput = screen.getByLabelText(/Preço/i)
    const categorySelect = screen.getByLabelText(/Categoria/i)
    const descInput = screen.getByLabelText(/Descrição Detalhada/i)
    const stockInput = screen.getByLabelText(/Estoque/i)
    const imageInput = screen.getByLabelText(/URL da Imagem/i)

    fireEvent.change(titleInput, {
      target: { name: 'title', value: 'Smartphone Teste' },
    })
    fireEvent.change(priceInput, {
      target: { name: 'price', value: '1999.99' },
    })
    fireEvent.change(categorySelect, {
      target: { name: 'category', value: 'Eletrônicos' },
    })
    fireEvent.change(descInput, {
      target: { name: 'description', value: 'Um smartphone incrível' },
    })
    fireEvent.change(stockInput, { target: { name: 'stock', value: '50' } })
    fireEvent.change(imageInput, {
      target: { name: 'image', value: 'https://example.com/phone.jpg' },
    })

    const submitButton = screen.getByRole('button', { name: /Criar Produto/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled()
    })
  })

  it('populates form with initialData for editing', () => {
    const initialData = {
      id: 1,
      title: 'Produto Existente',
      price: 100,
      description: 'Desc',
      category: 'eletrônicos',
      image: 'img.jpg',
      rating: { rate: 5, count: 10 },
      stock: 50,
    }

    renderWithProvider(
      <ProductForm
        onSubmit={vi.fn()}
        initialData={initialData}
        isSubmitting={false}
      />,
    )

    expect(screen.getByLabelText(/Título do Produto/i)).toHaveValue(
      'Produto Existente',
    )
    expect(screen.getByLabelText(/Preço/i)).toHaveValue(100)
    expect(
      screen.getByRole('button', { name: /Salvar Alterações/i }),
    ).toBeInTheDocument()
  })
})
