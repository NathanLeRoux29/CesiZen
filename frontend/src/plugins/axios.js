import axios from 'axios'
import router from '@/router'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
    baseURL: `${API_URL}/api`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Intercepteur de requêtes - ajoute le token JWT
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
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
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            router.push('/Login')
        }
        return Promise.reject(error)
    }
)

export { api, API_URL }
export default api