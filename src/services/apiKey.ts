const STORAGE_KEY = 'glm_api_key'

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(STORAGE_KEY) ?? ''
}

export function saveApiKey(apiKey: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, apiKey.trim())
}

export function clearApiKey(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}
