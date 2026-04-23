<template>
  <v-container class="user-page">
    <Title :message="'Mon Compte'" />

    <!-- Message si non connecté -->
    <v-alert
      v-if="!userStore.isLoggedIn"
      type="warning"
      variant="tonal"
      class="mt-4"
    >
      Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à votre compte.
      <template v-slot:append>
        <v-btn variant="text" color="primary" to="/Login">
          Se connecter
        </v-btn>
      </template>
    </v-alert>

    <!-- Contenu si connecté -->
    <div v-else>
      <!-- Section Profil -->
      <v-card class="profile-card mt-6 pa-6" elevation="0" rounded="lg">
        <div class="d-flex align-center flex-wrap">
          <div class="flex-grow-1">
            <h2 class="text-h5 font-weight-bold text-primary mb-1">
              {{ userStore.user.name }}
            </h2>
            <p class="text-body-1 text-medium-emphasis mb-0">
              {{ userStore.user.email }}
            </p>
          </div>
          <div class="d-flex gap-2 mt-4 mt-md-0">
            <v-btn
              color="primary"
              variant="outlined"
              rounded="lg"
              @click="openEditDialog"
            >
              <v-icon start>mdi-pencil</v-icon>
              Modifier
            </v-btn>
            <v-btn
              color="warning"
              variant="outlined"
              rounded="lg"
              @click="openPasswordDialog"
            >
              <v-icon start>mdi-lock</v-icon>
              Mot de passe
            </v-btn>
            <v-btn
              color="error"
              variant="outlined"
              rounded="lg"
              @click="handleLogout"
            >
              <v-icon start>mdi-logout</v-icon>
              Déconnexion
            </v-btn>
          </div>
        </div>
      </v-card>

      <!-- Section Statistiques -->
      <section class="mt-8">
        <Title :message="'Mes Statistiques'" />
        <v-row class="mt-4">
          <v-col cols="12" sm="4">
            <v-card class="stat-card pa-6 text-center" elevation="0" rounded="lg">
              <v-icon color="primary" size="48" class="mb-3">mdi-eye</v-icon>
              <h3 class="text-h4 font-weight-bold text-primary">
                {{ userStore.user.stats.articlesViewed }}
              </h3>
              <p class="text-body-2 text-medium-emphasis">
                Articles consultés
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card 
              class="stat-card pa-6 text-center cursor-pointer" 
              elevation="0" 
              rounded="lg"
              @click="openFavoritesDialog"
            >
              <v-icon color="primary" size="48" class="mb-3">mdi-heart</v-icon>
              <h3 class="text-h4 font-weight-bold text-primary">
                {{ userStore.user.stats.favoritesCount }}
              </h3>
              <p class="text-body-2 text-medium-emphasis">
                Articles Favoris
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card class="stat-card pa-6 text-center" elevation="0" rounded="lg">
              <v-icon color="primary" size="48" class="mb-3">mdi-meditation</v-icon>
              <h3 class="text-h4 font-weight-bold text-primary">
                {{ userStore.user.stats.breathingExercises }}
              </h3>
              <p class="text-body-2 text-medium-emphasis">
                Exercices de respiration
              </p>
            </v-card>
          </v-col>
        </v-row>
      </section>

      <!-- Section Actions -->
      <section class="mt-8">
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="action-card pa-6" elevation="0" rounded="lg" to="/diagnostics">
              <div class="d-flex align-center">
                <v-icon color="primary" size="40" class="mr-4">mdi-stethoscope</v-icon>
                <div>
                  <h3 class="text-h6 font-weight-bold text-primary">
                    Accéder aux Diagnostics
                  </h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    Évaluez votre bien-être
                  </p>
                </div>
                <v-spacer></v-spacer>
                <v-icon color="primary">mdi-chevron-right</v-icon>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="action-card pa-6" elevation="0" rounded="lg" to="/Breathing">
              <div class="d-flex align-center">
                <v-icon color="primary" size="40" class="mr-4">mdi-weather-windy</v-icon>
                <div>
                  <h3 class="text-h6 font-weight-bold text-primary">
                    Exercices de Respiration
                  </h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    Configurer vos séances
                  </p>
                </div>
                <v-spacer></v-spacer>
                <v-icon color="primary">mdi-chevron-right</v-icon>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </section>

      <!-- Section Suppression de compte -->
      <section class="mt-8 mb-8">
        <v-card class="danger-card pa-6" elevation="0" rounded="lg">
          <div class="d-flex align-center justify-space-between flex-wrap">
            <div>
              <h3 class="text-h6 font-weight-bold text-error mb-1">
                Supprimer mon compte
              </h3>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Cette action est irréversible. Toutes vos données seront perdues.
              </p>
            </div>
            <v-btn
              color="error"
              variant="outlined"
              rounded="lg"
              @click="deleteDialog = true"
              class="mt-4 mt-md-0"
            >
              <v-icon start>mdi-delete</v-icon>
              Supprimer le compte
            </v-btn>
          </div>
        </v-card>
      </section>
    </div>

    <!-- Dialog de modification du profil -->
    <v-dialog v-model="editDialog" max-width="500">
      <v-card class="favorites-modal pa-6" elevation="0" rounded="xl">
        <div class="d-flex align-center justify-space-between mb-6">
          <h2 class="text-h5 font-weight-bold text-primary d-flex align-center">
            <v-icon color="primary" class="mr-3">mdi-account-edit</v-icon>
            Modifier mon profil
          </h2>
          <v-btn icon="mdi-close" variant="text" @click="editDialog = false"></v-btn>
        </div>

        <v-divider class="mb-6 opacity-10"></v-divider>
        
        <v-form v-model="editFormValid">
          <v-text-field
            v-model="editForm.name"
            label="Nom"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            color="primary"
            :rules="[v => !!v || 'Le nom est requis']"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="editForm.email"
            label="Email"
            type="email"
            prepend-inner-icon="mdi-email"
            variant="outlined"
            color="primary"
            :rules="[
              v => !!v || 'L\'email est requis',
              v => /.+@.+\..+/.test(v) || 'L\'email doit être valide'
            ]"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="editForm.avatar"
            label="URL de l'avatar"
            prepend-inner-icon="mdi-image"
            variant="outlined"
            color="primary"
            class="mb-6"
          ></v-text-field>

          <div class="d-flex justify-end">
            <v-btn
              variant="text"
              @click="editDialog = false"
              class="mr-2"
            >
              Annuler
            </v-btn>
            <v-btn
              color="primary"
              variant="flat"
              rounded="lg"
              :disabled="!editFormValid"
              @click="saveProfile"
            >
              Enregistrer
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Dialog de modification du mot de passe -->
    <v-dialog v-model="passwordDialog" max-width="500">
      <v-card class="favorites-modal pa-6" elevation="0" rounded="xl">
        <div class="d-flex align-center justify-space-between mb-6">
          <h2 class="text-h5 font-weight-bold text-primary d-flex align-center">
            <v-icon color="primary" class="mr-3">mdi-lock-reset</v-icon>
            Modifier mon mot de passe
          </h2>
          <v-btn icon="mdi-close" variant="text" @click="closePasswordDialog"></v-btn>
        </div>

        <v-divider class="mb-6 opacity-10"></v-divider>

        <v-form v-model="passwordFormValid">
          <v-text-field
            v-model="passwordForm.currentPassword"
            label="Mot de passe actuel"
            :type="showCurrentPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
            variant="outlined"
            color="primary"
            :rules="[v => !!v || 'Le mot de passe est requis']"
            class="mb-4"
            @click:append-inner="showCurrentPassword = !showCurrentPassword"
          ></v-text-field>

          <v-text-field
            v-model="passwordForm.newPassword"
            label="Nouveau mot de passe"
            :type="showNewPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-plus"
            :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
            variant="outlined"
            color="primary"
            :rules="[
              v => !!v || 'Le nouveau mot de passe est requis',
              v => v.length >= 8 || 'Minimum 8 caractères'
            ]"
            class="mb-4"
            @click:append-inner="showNewPassword = !showNewPassword"
          ></v-text-field>

          <v-text-field
            v-model="passwordForm.confirmPassword"
            label="Confirmer le nouveau mot de passe"
            :type="showConfirmPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-check"
            :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
            variant="outlined"
            color="primary"
            :rules="[
              v => !!v || 'La confirmation est requise',
              v => v === passwordForm.newPassword || 'Les mots de passe ne correspondent pas'
            ]"
            class="mb-6"
            @click:append-inner="showConfirmPassword = !showConfirmPassword"
          ></v-text-field>

          <v-alert
            v-if="passwordError"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ passwordError }}
          </v-alert>

          <v-alert
            v-if="passwordSuccess"
            type="success"
            variant="tonal"
            class="mb-4"
          >
            {{ passwordSuccess }}
          </v-alert>

          <div class="d-flex justify-end">
            <v-btn
              variant="text"
              @click="closePasswordDialog"
              class="mr-2"
            >
              Annuler
            </v-btn>
            <v-btn
              color="primary"
              variant="flat"
              rounded="lg"
              :disabled="!passwordFormValid || savingPassword"
              :loading="savingPassword"
              @click="savePassword"
            >
              Enregistrer
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Dialog de confirmation de suppression -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="favorites-modal pa-6" elevation="0" rounded="xl">
        <div class="d-flex align-center justify-space-between mb-4">
          <h2 class="text-h5 font-weight-bold text-error d-flex align-center">
            <v-icon color="error" class="mr-3">mdi-alert-circle</v-icon>
            Confirmer la suppression
          </h2>
          <v-btn icon="mdi-close" variant="text" @click="deleteDialog = false"></v-btn>
        </div>

        <v-divider class="mb-6 opacity-10"></v-divider>
        <p class="text-body-1 mb-6 text-white">
          Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
        </p>
        <div class="d-flex justify-end">
          <v-btn
            variant="text"
            @click="deleteDialog = false"
            class="mr-2"
          >
            Annuler
          </v-btn>
          <v-btn
            color="error"
            variant="outlined"
            rounded="lg"
            @click="confirmDelete"
          >
            Supprimer
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Dialog des Articles Favoris -->
    <v-dialog v-model="favoritesDialog" max-width="800" scrollable>
      <v-card class="favorites-modal pa-6" elevation="0" rounded="xl">
        <div class="d-flex align-center justify-space-between mb-6">
          <h2 class="text-h5 font-weight-bold text-primary d-flex align-center">
            <v-icon color="primary" class="mr-3">mdi-heart</v-icon>
            Mes Articles Favoris
          </h2>
          <v-btn icon="mdi-close" variant="text" @click="favoritesDialog = false"></v-btn>
        </div>

        <v-divider class="mb-6 opacity-10"></v-divider>

        <v-card-text class="pa-0">
          <div v-if="loadingFavorites" class="text-center py-12">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <div v-else-if="favoriteArticles.length === 0" class="text-center py-12 opacity-70">
            <v-icon size="64" class="mb-4">mdi-heart-outline</v-icon>
            <p>Vous n'avez pas encore d'articles favoris.</p>
          </div>
          <v-row v-else class="ma-0">
            <v-col v-for="art in favoriteArticles" :key="art.id" cols="12">
              <v-card 
                class="favorite-article-item pa-4" 
                elevation="0" 
                rounded="lg"
                @click="goToArticle(art.id)"
              >
                <div class="d-flex align-center">
                  <v-icon color="primary" class="mr-4">mdi-file-document-outline</v-icon>
                  <div class="flex-grow-1">
                    <div class="d-flex align-center mb-1">
                      <span class="text-caption text-primary font-weight-bold text-uppercase mr-3">{{ art.category }}</span>
                    </div>
                    <h4 class="text-subtitle-1 font-weight-bold text-white mb-0">{{ art.title }}</h4>
                  </div>
                  <v-btn icon="mdi-arrow-right" variant="text" color="primary" size="small"></v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Title from '@/components/Title.vue'
import ArticleCard from '@/components/ArticleCard.vue'

const router = useRouter()
const userStore = useUserStore()

// Dialogs
const editDialog = ref(false)
const deleteDialog = ref(false)
const favoritesDialog = ref(false)
const passwordDialog = ref(false)

// Password form
const passwordFormValid = ref(false)
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')
const savingPassword = ref(false)

// État Favoris
const favoriteArticles = ref([])
const loadingFavorites = ref(false)

// Formulaire de modification
const editFormValid = ref(false)
const editForm = reactive({
  name: '',
  email: '',
  avatar: ''
})

// Ouvrir le dialog d'édition avec les données pré-remplies
const openEditDialog = () => {
  editForm.name = userStore.user.name
  editForm.email = userStore.user.email
  editDialog.value = true
}

// Password dialog
const openPasswordDialog = () => {
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordError.value = ''
  passwordSuccess.value = ''
  passwordDialog.value = true
}

const closePasswordDialog = () => {
  passwordDialog.value = false
  passwordError.value = ''
  passwordSuccess.value = ''
}

const savePassword = async () => {
  if (!passwordFormValid.value) return

  savingPassword.value = true
  passwordError.value = ''
  passwordSuccess.value = ''

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.token}`
      },
      body: JSON.stringify({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
    })

    const data = await response.json()

    if (!response.ok) {
      passwordError.value = data.error || 'Erreur lors du changement de mot de passe'
      return
    }

    passwordSuccess.value = 'Mot de passe mis à jour avec succès'
    setTimeout(() => {
      closePasswordDialog()
    }, 1500)
  } catch (error) {
    passwordError.value = 'Erreur de connexion au serveur'
  } finally {
    savingPassword.value = false
  }
}

// Gestion de la déconnexion
const handleLogout = () => {
  userStore.logout()
  router.push('/')
}

// Sauvegarder le profil
const saveProfile = async () => {
  if (!editFormValid.value) return

  try {
    await userStore.updateUser({
      name: editForm.name,
      email: editForm.email
    })
    editDialog.value = false
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  }
}

// Confirmer la suppression du compte
const confirmDelete = () => {
  userStore.deleteAccount()
  deleteDialog.value = false
  router.push('/')
}

// Favoris
const openFavoritesDialog = () => {
  favoritesDialog.value = true
  fetchFavorites()
}

const goToArticle = (id) => {
  favoritesDialog.value = false
  router.push(`/article/${id}`)
}

const fetchFavorites = async () => {
  if (!userStore.isLoggedIn) return
  loadingFavorites.value = true
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites/articles/user/${userStore.user.id}`, {
      headers: {
        Authorization: `Bearer ${userStore.token}`
      }
    })
    const data = await response.json()
    favoriteArticles.value = data
    userStore.user.stats.favoritesCount = data.length
  } catch (e) {
    console.error('Erreur fetch favorites:', e)
  } finally {
    loadingFavorites.value = false
  }
}

onMounted(() => {
  if (userStore.isLoggedIn) {
    fetchFavorites()
  }
})
</script>

<style scoped>
.user-page {
  max-width: 1400px;
  margin: 0 auto;
}

.profile-card,
.stat-card,
.action-card,
.danger-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(4, 255, 146, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: rgba(4, 255, 146, 0.3);
  transform: translateY(-2px);
}

.action-card {
  cursor: pointer;
}

.action-card:hover {
  border-color: rgba(4, 255, 146, 0.3);
  background: rgba(4, 255, 146, 0.05);
}

.danger-card {
  border-color: rgba(255, 82, 82, 0.2);
}

.danger-card:hover {
  border-color: rgba(255, 82, 82, 0.4);
}

.gap-2 {
  gap: 8px;
}

.favorites-modal {
  background: #1D1143 !important;
  border: 1px solid rgba(4, 255, 146, 0.2);
  overflow-x: hidden !important;
}

.opacity-70 {
  opacity: 0.7;
}

.cursor-pointer {
  cursor: pointer;
}

.favorite-article-item {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
  cursor: pointer;
}

.favorite-article-item:hover {
  background: rgba(4, 255, 146, 0.05) !important;
  border-color: rgba(4, 255, 146, 0.3);
  transform: translateX(4px);
}
</style>