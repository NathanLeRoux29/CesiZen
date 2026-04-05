import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('adminUser')) || null,
    isLoggedIn: !!localStorage.getItem('adminUser'),
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post('http://localhost:3001/api/users/login', { email, password })
        const user = response.data.user
        
        if (!user.is_admin) {
          throw new Error("Accès réservé aux administrateurs")
        }
        
        this.user = user
        this.isLoggedIn = true
        localStorage.setItem('adminUser', JSON.stringify(user))
        return true
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    logout() {
      this.user = null
      this.isLoggedIn = false
      localStorage.removeItem('adminUser')
    }
  }
})
