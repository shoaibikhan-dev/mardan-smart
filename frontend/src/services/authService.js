import axios from 'axios'

// ── Axios instance ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// ── Response interceptor: auto-refresh on 401 ───────────────────────────────
let isRefreshing = false

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    // If 401 and not already retried and not the refresh endpoint itself
    if (error.response?.status === 401 &&
        !original._retry &&
        !original.url?.includes('/auth/refresh') &&
        !original.url?.includes('/auth/login')) {
      original._retry = true
      if (!isRefreshing) {
        isRefreshing = true
        try {
          await api.post('/auth/refresh')
          isRefreshing = false
          return api(original) // retry original request
        } catch {
          isRefreshing = false
          if (!window.location.pathname.startsWith('/login') &&
              !window.location.pathname.startsWith('/register')) {
            window.location.href = '/login'
          }
        }
      }
    }
    return Promise.reject(error)
  }
)

// ── Auth API calls ───────────────────────────────────────────────────────────
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login',    data),
  logout:   ()     => api.post('/auth/logout'),
  getMe:    ()     => api.get('/auth/me'),
}

export default api
