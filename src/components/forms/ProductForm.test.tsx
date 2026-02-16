import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProductForm } from './ProductForm'
import { vi, describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('ProductForm', () => {
    it('renders correctly with empty fields when no initialData is provided', () => {
        render(<ProductForm onSubmit={vi.fn()} isSubmitting={false} />)

        expect(screen.getByLabelText(/Título/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Preço/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Categoria/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Criar Produto/i })).toBeInTheDocument()
    })

    it('validates required fields', async () => {
        const handleSubmit = vi.fn()
        const user = userEvent.setup()

        render(<ProductForm onSubmit={handleSubmit} isSubmitting={false} />)

        const submitButton = screen.getByRole('button', { name: /Criar Produto/i })
        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText('O título deve ter pelo menos 3 caracteres')).toBeInTheDocument()
        })

        expect(handleSubmit).not.toHaveBeenCalled()
    })

    it('submits form with correct data', async () => {
        const handleSubmit = vi.fn()
        const user = userEvent.setup()

        render(<ProductForm onSubmit={handleSubmit} isSubmitting={false} />)

        await user.type(screen.getByLabelText(/Título/i), 'Smartphone Teste')
        await user.type(screen.getByLabelText(/Preço/i), '1999.99')
        await user.type(screen.getByLabelText(/Categoria/i), 'Eletrônicos')
        await user.type(screen.getByLabelText(/Descrição/i), 'Um smartphone incrível')
        await user.type(screen.getByLabelText(/URL da Imagem/i), 'https://example.com/phone.jpg')

        await user.click(screen.getByRole('button', { name: /Criar Produto/i }))

        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledWith({
                title: 'Smartphone Teste',
                price: 1999.99,
                category: 'Eletrônicos',
                description: 'Um smartphone incrível',
                image: 'https://example.com/phone.jpg',
            }, expect.anything())
        })
    })

    it('populates form with initialData for editing', () => {
        const initialData = {
            id: 1,
            title: 'Produto Existente',
            price: 100,
            description: 'Desc',
            category: 'Cat',
            image: 'img.jpg',
            rating: { rate: 5, count: 10 }
        }

        render(<ProductForm onSubmit={vi.fn()} initialData={initialData} isSubmitting={false} />)

        expect(screen.getByLabelText(/Título/i)).toHaveValue('Produto Existente')
        expect(screen.getByLabelText(/Preço/i)).toHaveValue(100)
        expect(screen.getByRole('button', { name: /Atualizar Produto/i })).toBeInTheDocument()
    })
})
