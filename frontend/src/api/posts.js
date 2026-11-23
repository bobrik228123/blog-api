import { apiRequest } from './client.js'

export function getPosts({ skip = 0, limit = 9, search = '', sort = 'newest' } = {}) {
  const params = new URLSearchParams({ skip, limit, search, sort })
  return apiRequest(`/post/?${params.toString()}`)
}
