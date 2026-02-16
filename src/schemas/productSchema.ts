import { z } from 'zod'

export const productSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  price: z.number().positive('O preço deve ser positivo'),
  description: z
    .string()
    .min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  image: z.string().url('URL da imagem inválida'),
  category: z.string().min(3, 'A categoria deve ter pelo menos 3 caracteres'),
  stock: z
    .number()
    .int('O estoque deve ser um número inteiro')
    .min(0, 'O estoque não pode ser negativo'),
})

export type ProductFormValues = z.infer<typeof productSchema>
