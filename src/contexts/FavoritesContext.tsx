import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

interface FavoritesContextType {
  favorites: Set<number>
  toggleFavorite: (id: number) => void
  addFavorites: (ids: number[]) => void
  removeFavorites: (ids: number[]) => void
  isFavorite: (id: number) => boolean
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<number>>(() => {
    if (typeof window === 'undefined') return new Set()
    const stored = localStorage.getItem('productFavorites')
    return stored ? new Set(JSON.parse(stored)) : new Set()
  })

  useEffect(() => {
    localStorage.setItem('productFavorites', JSON.stringify([...favorites]))
  }, [favorites])

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const addFavorites = (productIds: number[]) => {
    setFavorites((prev) => {
      const newSet = new Set(prev)
      productIds.forEach((id) => newSet.add(id))
      return newSet
    })
  }

  const removeFavorites = (productIds: number[]) => {
    setFavorites((prev) => {
      const newSet = new Set(prev)
      productIds.forEach((id) => newSet.delete(id))
      return newSet
    })
  }

  const isFavorite = (productId: number) => favorites.has(productId)

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        addFavorites,
        removeFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
