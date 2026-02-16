import { createContext } from 'react'

export interface FavoritesContextType {
  favorites: Set<number>
  toggleFavorite: (id: number) => void
  addFavorites: (ids: number[]) => void
  removeFavorites: (ids: number[]) => void
  isFavorite: (id: number) => boolean
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
)
