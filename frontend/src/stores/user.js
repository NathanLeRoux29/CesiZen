// Store pour gérer l'état de l'utilisateur connecté
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // État
  const isLoggedIn = ref(false)
  const user = ref({
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

  // Actions
  const login = (userData) => {
    isLoggedIn.value = true
    user.value = { ...user.value, ...userData }
  }

  const logout = () => {
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
  }

  const updateUser = (userData) => {
    user.value = { ...user.value, ...userData }
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

  const deleteAccount = () => {
    logout()
  }

  return {
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