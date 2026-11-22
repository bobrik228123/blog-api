const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: 'application/json', ...options.headers },
    ...options,
  })
  if (!response.ok) {
    let detail = `Request failed (${response.status})`
    try { const payload = await response.json(); detail = payload.detail || detail } catch { /* Response may have no JSON body. */ }
    throw new Error(detail)
  }
  if (response.status === 204) return null
  return response.json()
}
