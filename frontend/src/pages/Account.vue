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
          <v-avatar size="100" class="mr-6 mb-4 mb-md-0">
            <v-img :src="userStore.user.avatar" cover></v-img>
          </v-avatar>
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
              @click="editDialog = true"
            >
              <v-icon start>mdi-pencil</v-icon>
              Modifier
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
            <v-card class="stat-card pa-6 text-center" elevation="0" rounded="lg">
              <v-icon color="primary" size="48" class="mb-3">mdi-heart</v-icon>
              <h3 class="text-h4 font-weight-bold text-primary">
                {{ userStore.user.stats.favoritesCount }}
              </h3>
              <p class="text-body-2 text-medium-emphasis">
                Favoris
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
      <v-card class="pa-6" elevation="0" rounded="lg">
        <h2 class="text-h5 font-weight-bold text-primary mb-6">
          Modifier mon profil
        </h2>
        
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

    <!-- Dialog de confirmation de suppression -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="pa-6" elevation="0" rounded="lg">
        <h2 class="text-h5 font-weight-bold text-error mb-4">
          Confirmer la suppression
        </h2>
        <p class="text-body-1 mb-6">
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
            variant="flat"
            rounded="lg"
            @click="confirmDelete"
          >
            Supprimer
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Title from '@/components/Title.vue'

const router = useRouter()
const userStore = useUserStore()

// Dialogs
const editDialog = ref(false)
const deleteDialog = ref(false)

// Formulaire de modification
const editFormValid = ref(false)
const editForm = reactive({
  name: '',
  email: '',
  avatar: ''
})

// Gestion de la déconnexion
const handleLogout = () => {
  userStore.logout()
  router.push('/')
}

// Sauvegarder le profil
const saveProfile = () => {
  if (!editFormValid.value) return
  
  userStore.updateUser({
    name: editForm.name,
    email: editForm.email,
    avatar: editForm.avatar
  })
  
  editDialog.value = false
}

// Confirmer la suppression du compte
const confirmDelete = () => {
  userStore.deleteAccount()
  deleteDialog.value = false
  router.push('/')
}
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
</style>