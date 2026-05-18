// Store pour gérer l'état de l'utilisateur connecté
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/plugins/axios'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

function loadStoredAuth() {
    const token = localStorage.getItem(TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)
    return {
        token: token || null,
        user: storedUser ? JSON.parse(storedUser) : null
    }
}

export const useUserStore = defineStore('user', () => {
    const stored = loadStoredAuth()

    const token = ref(stored.token)
    const isLoggedIn = ref(!!stored.token && !!stored.user)
    const user = ref(stored.user || {
        id: null,
        name: '',
        email: '',
        avatar: '',
        stats: {
            articlesViewed: 0,
            favoritesCount: 0,
            breathingExercises: 0
        }
    })

    const setAuth = (authToken, userData) => {
        token.value = authToken
        isLoggedIn.value = true
        user.value = { ...user.value, ...userData }
        localStorage.setItem(TOKEN_KEY, authToken)
        localStorage.setItem(USER_KEY, JSON.stringify(user.value))
    }

    const login = (userData) => {
        isLoggedIn.value = true
        user.value = { ...user.value, ...userData }
        if (userData.token) {
            token.value = userData.token
            localStorage.setItem(TOKEN_KEY, userData.token)
        }
        localStorage.setItem(USER_KEY, JSON.stringify(user.value))
    }

    const logout = () => {
        token.value = null
        isLoggedIn.value = false
        user.value = {
            id: null,
            name: '',
            email: '',
            avatar: '',
            stats: {
                articlesViewed: 0,
                favoritesCount: 0,
                breathingExercises: 0
            }
        }
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
    }

    const updateUser = async (userData) => {
        try {
            const response = await api.put('/users/profile', {
                username: userData.name,
                email: userData.email
            }, {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            })
            user.value = { ...user.value, ...response.data.user, name: response.data.user.username }
            localStorage.setItem(USER_KEY, JSON.stringify(user.value))
            return response.data
        } catch (error) {
            console.error('Erreur mise à jour profil:', error)
            throw error
        }
    }

    const incrementArticlesViewed = () => {
        user.value.stats.articlesViewed++
    }

    const incrementFavorites = () => {
        user.value.stats.favoritesCount++
    }

    const incrementBreathingExercises = () => {
        user.value.stats.breathingExercises++
    }

    const deleteAccount = async () => {
        try {
            await api.delete('/users/account')
        } catch (error) {
            console.error('Erreur suppression compte:', error)
            throw error
        } finally {
            logout()
        }
    }

    return {
        token,
        isLoggedIn,
        user,
        login,
        logout,
        updateUser,
        incrementArticlesViewed,
        incrementFavorites,
        incrementBreathingExercises,
        deleteAccount
    }
})