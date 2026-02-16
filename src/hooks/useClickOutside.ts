import { useEffect, RefObject } from 'react'

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      if (!ref.current || ref.current.contains(target)) {
        return
      }
      handler()
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}
