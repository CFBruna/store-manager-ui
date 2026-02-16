export function normalizeName(name: string): string {
  if (!name) return ''
  const trimmed = name.trim()
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

export function normalizeCategory(category: string): string {
  if (!category) return ''
  const trimmed = category.trim().toLowerCase()
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}
