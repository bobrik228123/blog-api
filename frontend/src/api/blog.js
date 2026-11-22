import { apiRequest } from './client.js'

const auth = token => ({ Authorization: `Bearer ${token}` })
export const getPosts = ({ skip = 0, limit = 9, search = '', sort = 'newest' } = {}) => {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit), search, sort })
  return apiRequest(`/post/?${params}`)
}
export const getPost = id => apiRequest(`/post/${id}`)
export const createPost = (body, token) => apiRequest('/post/', { method: 'POST', headers: { ...auth(token), 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
export const updatePost = (id, body, token) => apiRequest(`/post/${id}`, { method: 'PUT', headers: { ...auth(token), 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
export const deletePost = (id, token) => apiRequest(`/post/${id}`, { method: 'DELETE', headers: auth(token) })
export const login = (email, password) => {
  const body = new URLSearchParams({ username: email, password })
  return apiRequest('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
}
export const register = (email, password) => apiRequest('/users/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
export const getCurrentUser = token => apiRequest('/users/me', { headers: auth(token) })
export const getComments = id => apiRequest(`/posts/${id}/comments`)
export const createComment = (id, content, token) => apiRequest(`/posts/${id}/comments`, { method: 'POST', headers: { ...auth(token), 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) })
export const deleteComment = (id, token) => apiRequest(`/comments/${id}`, { method: 'DELETE', headers: auth(token) })
export const getLikes = async id => { const data = await apiRequest(`/like/${id}`); return data.likes_count }
export const getMyLikeStatus = (id, token) => apiRequest(`/like/${id}/me`, { headers: auth(token) })
export const addLike = (id, token) => apiRequest(`/like/?post_id=${id}`, { method: 'POST', headers: auth(token) })
export const removeLike = (id, token) => apiRequest(`/like/${id}`, { method: 'DELETE', headers: auth(token) })
