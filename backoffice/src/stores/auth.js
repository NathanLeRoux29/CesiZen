import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Instance Axios dédiée au backoffice
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
})

// Intercepteur de requêtes - ajoute le token JWT
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Intercepteur de réponses - gère les erreurs 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken')
            localStorage.removeItem('adminUser')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// Exporter l'instance api pour l'utiliser directement dans les composants
export { api };

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('adminUser')) || null,
    token: localStorage.getItem('adminToken') || null,
    isLoggedIn: !!localStorage.getItem('adminToken'),
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post(`${API_URL}/api/users/login`, { email, password })
        const { token, user } = response.data

        if (!user.is_admin) {
          throw new Error("Accès réservé aux administrateurs")
        }

        this.token = token
        this.user = user
        this.isLoggedIn = true
        localStorage.setItem('adminToken', token)
        localStorage.setItem('adminUser', JSON.stringify(user))
        return true
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    logout() {
      this.token = null
      this.user = null
      this.isLoggedIn = false
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
    }
  }
})
