<template>
  <v-container class="user-page">
    <Title :message="'Mon Compte'" />

    <!-- Message si non connecté -->
    <v-alert
      v-if="!userStore.isLoggedIn"
      class="mt-4"
      type="warning"
      variant="tonal"
    >
      Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à votre compte.
      <template #append>
        <v-btn color="primary" to="/Login" variant="text">
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
              rounded="lg"
              variant="outlined"
              @click="openEditDialog"
            >
              <v-icon start>mdi-pencil</v-icon>
              Modifier
            </v-btn>
            <v-btn
              color="warning"
              rounded="lg"
              variant="outlined"
              @click="openPasswordDialog"
            >
              <v-icon start>mdi-lock</v-icon>
              Mot de passe
            </v-btn>
            <v-btn
              color="error"
              rounded="lg"
              variant="outlined"
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
              <v-icon class="mb-3" color="primary" size="48">mdi-eye</v-icon>
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
              <v-icon class="mb-3" color="primary" size="48">mdi-heart</v-icon>
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
              <v-icon class="mb-3" color="primary" size="48">mdi-meditation</v-icon>
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
                <v-icon class="mr-4" color="primary" size="40">mdi-stethoscope</v-icon>
                <div>
                  <h3 class="text-h6 font-weight-bold text-primary">
                    Accéder aux Diagnostics
                  </h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    Évaluez votre bien-être
                  </p>
                </div>
                <v-spacer />
                <v-icon color="primary">mdi-chevron-right</v-icon>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="action-card pa-6" elevation="0" rounded="lg" to="/Breathing">
              <div class="d-flex align-center">
                <v-icon class="mr-4" color="primary" size="40">mdi-weather-windy</v-icon>
                <div>
                  <h3 class="text-h6 font-weight-bold text-primary">
                    Exercices de Respiration
                  </h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    Configurer vos séances
                  </p>
                </div>
                <v-spacer />
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
              class="mt-4 mt-md-0"
              color="error"
              rounded="lg"
              variant="outlined"
              @click="deleteDialog = true"
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
            <v-icon class="mr-3" color="primary">mdi-account-edit</v-icon>
            Modifier mon profil
          </h2>
          <v-btn icon="mdi-close" variant="text" @click="editDialog = false" />
        </div>

        <v-divider class="mb-6 opacity-10" />

        <v-form v-model="editFormValid">
          <v-text-field
            v-model="editForm.name"
            class="mb-4"
            color="primary"
            label="Nom"
            prepend-inner-icon="mdi-account"
            :rules="[v => !!v || 'Le nom est requis']"
            variant="outlined"
          />

          <v-text-field
            v-model="editForm.email"
            class="mb-4"
            color="primary"
            label="Email"
            prepend-inner-icon="mdi-email"
            :rules="[
              v => !!v || 'L\'email est requis',
              v => /.+@.+\..+/.test(v) || 'L\'email doit être valide'
            ]"
            type="email"
            variant="outlined"
          />

          <v-text-field
            v-model="editForm.avatar"
            class="mb-6"
            color="primary"
            label="URL de l'avatar"
            prepend-inner-icon="mdi-image"
            variant="outlined"
          />

          <div class="d-flex justify-end">
            <v-btn
              class="mr-2"
              variant="text"
              @click="editDialog = false"
            >
              Annuler
            </v-btn>
            <v-btn
              color="primary"
              :disabled="!editFormValid"
              rounded="lg"
              variant="flat"
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
            <v-icon class="mr-3" color="primary">mdi-lock-reset</v-icon>
            Modifier mon mot de passe
          </h2>
          <v-btn icon="mdi-close" variant="text" @click="closePasswordDialog" />
        </div>

        <v-divider class="mb-6 opacity-10" />

        <v-form v-model="passwordFormValid">
          <v-text-field
            v-model="passwordForm.currentPassword"
            :append-inner-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
            class="mb-4"
            color="primary"
            label="Mot de passe actuel"
            prepend-inner-icon="mdi-lock"
            :rules="[v => !!v || 'Le mot de passe est requis']"
            :type="showCurrentPassword ? 'text' : 'password'"
            variant="outlined"
            @click:append-inner="showCurrentPassword = !showCurrentPassword"
          />

          <v-text-field
            v-model="passwordForm.newPassword"
            :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
            class="mb-4"
            color="primary"
            label="Nouveau mot de passe"
            prepend-inner-icon="mdi-lock-plus"
            :rules="[
              v => !!v || 'Le nouveau mot de passe est requis',
              v => v.length >= 8 || 'Minimum 8 caractères'
            ]"
            :type="showNewPassword ? 'text' : 'password'"
            variant="outlined"
            @click:append-inner="showNewPassword = !showNewPassword"
          />

          <v-text-field
            v-model="passwordForm.confirmPassword"
            :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
            class="mb-6"
            color="primary"
            label="Confirmer le nouveau mot de passe"
            prepend-inner-icon="mdi-lock-check"
            :rules="[
              v => !!v || 'La confirmation est requise',
              v => v === passwordForm.newPassword || 'Les mots de passe ne correspondent pas'
            ]"
            :type="showConfirmPassword ? 'text' : 'password'"
            variant="outlined"
            @click:append-inner="showConfirmPassword = !showConfirmPassword"
          />

          <v-alert
            v-if="passwordError"
            class="mb-4"
            type="error"
            variant="tonal"
          >
            {{ passwordError }}
          </v-alert>

          <v-alert
            v-if="passwordSuccess"
            class="mb-4"
            type="success"
            variant="tonal"
          >
            {{ passwordSuccess }}
          </v-alert>

          <div class="d-flex justify-end">
            <v-btn
              class="mr-2"
              variant="text"
              @click="closePasswordDialog"
            >
              Annuler
            </v-btn>
            <v-btn
              color="primary"
              :disabled="!passwordFormValid || savingPassword"
              :loading="savingPassword"
              rounded="lg"
              variant="flat"
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
            <v-icon class="mr-3" color="error">mdi-alert-circle</v-icon>
            Confirmer la suppression
          </h2>
          <v-btn icon="mdi-close" variant="text" @click="deleteDialog = false" />
        </div>

        <v-divider class="mb-6 opacity-10" />
        <p class="text-body-1 mb-6 text-white">
          Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
        </p>
        <div class="d-flex justify-end">
          <v-btn
            class="mr-2"
            variant="text"
            @click="deleteDialog = false"
          >
            Annuler
          </v-btn>
          <v-btn
            color="error"
            rounded="lg"
            variant="outlined"
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
            <v-icon class="mr-3" color="primary">mdi-heart</v-icon>
            Mes Articles Favoris
          </h2>
          <v-btn icon="mdi-close" variant="text" @click="favoritesDialog = false" />
        </div>

        <v-divider class="mb-6 opacity-10" />

        <v-card-text class="pa-0">
          <div v-if="loadingFavorites" class="text-center py-12">
            <v-progress-circular color="primary" indeterminate />
          </div>
          <div v-else-if="favoriteArticles.length === 0" class="text-center py-12 opacity-70">
            <v-icon class="mb-4" size="64">mdi-heart-outline</v-icon>
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
                  <v-icon class="mr-4" color="primary">mdi-file-document-outline</v-icon>
                  <div class="flex-grow-1">
                    <div class="d-flex align-center mb-1">
                      <span class="text-caption text-primary font-weight-bold text-uppercase mr-3">{{ art.category }}</span>
                    </div>
                    <h4 class="text-subtitle-1 font-weight-bold text-white mb-0">{{ art.title }}</h4>
                  </div>
                  <v-btn color="primary" icon="mdi-arrow-right" size="small" variant="text" />
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
  import { onMounted, reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import ArticleCard from '@/components/ArticleCard.vue'
  import Title from '@/components/Title.vue'
  import { useUserStore } from '@/stores/user'

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
    confirmPassword: '',
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
    avatar: '',
  })

  // Ouvrir le dialog d'édition avec les données pré-remplies
  function openEditDialog () {
    editForm.name = userStore.user.name
    editForm.email = userStore.user.email
    editDialog.value = true
  }

  // Password dialog
  function openPasswordDialog () {
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    passwordError.value = ''
    passwordSuccess.value = ''
    passwordDialog.value = true
  }

  function closePasswordDialog () {
    passwordDialog.value = false
    passwordError.value = ''
    passwordSuccess.value = ''
  }

  async function savePassword () {
    if (!passwordFormValid.value) return

    savingPassword.value = true
    passwordError.value = ''
    passwordSuccess.value = ''

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userStore.token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
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
    } catch {
      passwordError.value = 'Erreur de connexion au serveur'
    } finally {
      savingPassword.value = false
    }
  }

  // Gestion de la déconnexion
  function handleLogout () {
    userStore.logout()
    router.push('/')
  }

  // Sauvegarder le profil
  async function saveProfile () {
    if (!editFormValid.value) return

    try {
      await userStore.updateUser({
        name: editForm.name,
        email: editForm.email,
      })
      editDialog.value = false
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  // Confirmer la suppression du compte
  function confirmDelete () {
    userStore.deleteAccount()
    deleteDialog.value = false
    router.push('/')
  }

  // Favoris
  function openFavoritesDialog () {
    favoritesDialog.value = true
    fetchFavorites()
  }

  function goToArticle (id) {
    favoritesDialog.value = false
    router.push(`/article/${id}`)
  }

  async function fetchFavorites () {
    if (!userStore.isLoggedIn) return
    loadingFavorites.value = true
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites/articles/user/${userStore.user.id}`, {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      })
      const data = await response.json()
      favoriteArticles.value = data
      userStore.user.stats.favoritesCount = data.length
    } catch (error) {
      console.error('Erreur fetch favorites:', error)
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
