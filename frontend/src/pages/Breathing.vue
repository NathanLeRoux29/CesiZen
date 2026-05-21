<template>
  <v-container class="breathing-page">
    <Title :message="'Exercices de Respiration'" />
    <SubTitle :message="'Choisissez une technique ou personnalisez votre séance'" />

    <!-- Section Favoris (uniquement si connecté) -->
    <v-row v-if="userStore.isLoggedIn" class="mt-4 animate-fade-in">
      <v-col cols="12">
        <v-card class="config-card pa-6" elevation="0" rounded="xl">
          <h3 class="text-h6 font-weight-bold text-primary mb-6">
            <v-icon color="primary" start>mdi-star-outline</v-icon>
            Mes séances enregistrées
          </h3>
          <v-row align="center">
            <v-col cols="12" md="8">
              <v-select
                v-model="selectedFavorite"
                color="primary"
                hide-details
                :disabled="!userStore.isLoggedIn"
                item-title="name"
                item-value="id"
                :items="favorites"
                :label="userStore.isLoggedIn ? 'Choisir un favori' : 'Connectez-vous pour voir vos favoris'"
                placeholder="Sélectionnez une configuration sauvegardée"
                return-object
                variant="outlined"
                @update:model-value="applyFavorite"
              >
                <template #no-data>
                  <div class="pa-4 text-center text-medium-emphasis">
                    Aucun favori enregistré pour le moment.
                  </div>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn
                v-if="selectedFavorite"
                color="error"
                prepend-icon="mdi-delete"
                variant="text"
                @click="deleteFavorite(selectedFavorite.id)"
              >
                Supprimer
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Section Configuration -->
    <v-row class="mt-8">
      <!-- Choix de la technique -->
      <v-col cols="12" md="6">
        <v-card class="config-card pa-6" elevation="0" rounded="xl">
          <h3 class="text-h6 font-weight-bold text-primary mb-6">
            <v-icon color="primary" start>mdi-weather-windy</v-icon>
            Technique de respiration
          </h3>

          <v-radio-group v-model="config.technique">
            <v-radio
              v-for="technique in techniques"
              :key="technique.id"
              class="mb-2"
              color="primary"
              :label="technique.name"
              :value="technique.id"
            >
              <template #label>
                <div>
                  <span class="text-body-1 font-weight-bold">{{ technique.name }}</span>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    {{ technique.description }}
                  </p>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
        </v-card>
      </v-col>

      <!-- Paramètres temporels -->
      <v-col cols="12" md="6">
        <v-card class="config-card pa-6" elevation="0" rounded="xl">
          <h3 class="text-h6 font-weight-bold text-primary mb-6">
            <v-icon color="primary" start>mdi-timer-outline</v-icon>
            Paramètres de la séance
          </h3>

          <!-- Durée totale -->
          <div class="mb-6">
            <p class="text-body-2 text-medium-emphasis mb-2">
              Durée totale: {{ config.duration }} minutes
            </p>
            <v-slider
              v-model="config.duration"
              color="primary"
              :max="30"
              :min="1"
              :step="1"
              thumb-label
              track-color="rgba(4, 255, 146, 0.2)"
            />
          </div>

          <!-- Configuration des temps (si personnalisé) -->
          <div v-if="config.technique === 'custom'" class="animate-fade-in">
            <v-divider class="mb-6" />

            <div class="mb-4">
              <p class="text-body-2 text-medium-emphasis mb-1">Inspiration: {{ config.customIn }}s</p>
              <v-slider
                v-model="config.customIn"
                color="primary"
                density="compact"
                hide-details
                :max="15"
                :min="1"
                :step="1"
              />
            </div>

            <div class="mb-4">
              <p class="text-body-2 text-medium-emphasis mb-1">Apnée (Rétention): {{ config.customHold }}s</p>
              <v-slider
                v-model="config.customHold"
                color="primary"
                density="compact"
                hide-details
                :max="15"
                :min="0"
                :step="1"
              />
            </div>

            <div class="mb-4">
              <p class="text-body-2 text-medium-emphasis mb-1">Expiration: {{ config.customOut }}s</p>
              <v-slider
                v-model="config.customOut"
                color="primary"
                density="compact"
                hide-details
                :max="15"
                :min="1"
                :step="1"
              />
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Section Ambiance -->
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card class="config-card pa-6" elevation="0" rounded="xl">
          <h3 class="text-h6 font-weight-bold text-primary mb-6">
            <v-icon color="primary" start>mdi-volume-high</v-icon>
            Ambiance sonore
          </h3>

          <v-switch
            v-model="config.soundEnabled"
            class="mb-4"
            color="primary"
            hide-details
            label="Activer les sons relaxants"
          />

          <v-select
            v-if="config.soundEnabled"
            v-model="config.soundType"
            color="primary"
            hide-details
            :items="soundOptions"
            label="Type de son"
            variant="outlined"
          />
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="config-card pa-6" elevation="0" rounded="xl">
          <h3 class="text-h6 font-weight-bold text-primary mb-6">
            <v-icon color="primary" start>mdi-vibrate</v-icon>
            Retour haptique
          </h3>

          <v-switch
            v-model="config.vibrationEnabled"
            class="mb-4"
            color="primary"
            hide-details
            label="Vibrations au changement de phase"
          />

          <v-select
            v-if="config.vibrationEnabled"
            v-model="config.vibrationIntensity"
            color="primary"
            hide-details
            :items="vibrationOptions"
            label="Intensité"
            variant="outlined"
          />
        </v-card>
      </v-col>
    </v-row>

    <!-- Boutons d'action -->
    <div class="text-center mt-12 mb-12 d-flex justify-center ga-6 flex-wrap align-center">
      <v-btn
        color="primary"
        :disabled="!userStore.isLoggedIn"
        height="56"
        rounded="xl"
        size="x-large"
        variant="outlined"
        @click="showSaveDialog = true"
      >
        <v-icon start>{{ selectedFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        {{ selectedFavorite ? 'Modifier le favori' : 'Ajouter aux favoris' }}
      </v-btn>

      <v-btn
        color="primary"
        elevation="8"
        height="56"
        rounded="xl"
        size="x-large"
        width="250"
        @click="startExercise"
      >
        <v-icon start>mdi-play</v-icon>
        Commencer
      </v-btn>
    </div>

    <!-- Message si non connecté -->
    <div v-if="!userStore.isLoggedIn" class="text-center mt-4">
      <p class="text-caption text-medium-emphasis">
        <v-icon size="small" start>mdi-information-outline</v-icon>
        Connectez-vous pour sauvegarder vos configurations personnalisées.
      </p>
    </div>

    <!-- Snackbar de confirmation -->
    <v-snackbar v-model="showSnackbar" color="primary" elevation="12" rounded="pill">
      <v-icon start>mdi-check-circle</v-icon>
      Configuration enregistrée
    </v-snackbar>

    <!-- Modal de Sauvegarde -->
    <v-dialog v-model="showSaveDialog" max-width="500" no-click-animation persistent>
      <v-card class="save-modal-card pa-8" rounded="xl">
        <v-card-title class="text-h5 font-weight-bold text-primary px-0 mb-2">
          <v-icon class="mr-2" color="primary" start>{{ selectedFavorite ? 'mdi-heart' : 'mdi-heart-plus' }}</v-icon>
          {{ selectedFavorite ? 'Modifier votre favori' : 'Enregistrer en favori' }}
        </v-card-title>

        <v-card-text class="px-0 pt-4">
          <p class="text-body-1 text-info opacity-70 mb-6">
            {{ selectedFavorite ? 'Mettez à jour le nom ou les réglages de votre configuration.' : 'Donnez un nom unique à votre configuration pour la retrouver plus tard.' }}
          </p>

          <div class="glass-search-wrapper mb-2">
            <v-text-field
              v-model="favoriteName"
              autofocus
              class="premium-search-field"
              color="primary"
              hide-details
              placeholder="Ex: Zen Matin, Énergie..."
              variant="plain"
              @keyup.enter="saveConfig"
            />
          </div>

          <p v-if="nameError" class="text-caption text-error mt-2 ml-2">
            <v-icon size="x-small" start>mdi-alert-circle</v-icon>
            {{ nameError }}
          </p>
        </v-card-text>

        <v-card-actions class="px-0 pt-8">
          <v-spacer />
          <v-btn
            class="opacity-70"
            color="info"
            :disabled="isSaving"
            rounded="xl"
            variant="text"
            @click="showSaveDialog = false"
          >
            Annuler
          </v-btn>
          <v-btn
            class="px-8 font-weight-bold"
            color="primary"
            :disabled="!favoriteName || !!nameError"
            elevation="8"
            :loading="isSaving"
            rounded="xl"
            size="large"
            @click="saveConfig"
          >
            {{ selectedFavorite ? 'Mettre à jour' : 'Sauvegarder' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Composant d'exercice de respiration -->
    <BreathingExercise
      v-model="showExercise"
      :config="config"
      @complete="onExerciseComplete"
    />
  </v-container>
</template>

<script setup>
  import { computed, onMounted, reactive, ref, watch } from 'vue'
  import BreathingExercise from '@/components/BreathingExercise.vue'
  import SubTitle from '@/components/SubTitle.vue'
  import Title from '@/components/Title.vue'
  import { useUserStore } from '@/stores/user'

  const userStore = useUserStore()
  const currentUserId = computed(() => userStore.user.id)

  // État
  const isSaving = ref(false)
  const showSnackbar = ref(false)
  const showExercise = ref(false)
  const showSaveDialog = ref(false)
  const favoriteName = ref('')
  const favorites = ref([])
  const selectedFavorite = ref(null)
  const nameError = ref('')

  // Configuration par défaut
  const config = reactive({
    duration: 5,
    technique: '748',
    customIn: 4,
    customHold: 4,
    customOut: 4,
    soundEnabled: true,
    soundType: 'Nature',
    vibrationEnabled: true,
    vibrationIntensity: 'medium',
  })

  // Options disponibles (basées sur l'énoncé)
  const techniques = [
    { id: '748', name: 'Le 7-4-8', description: 'Inspi: 7s | Apnée: 4s | Expi: 8s (Relaxation profonde)' },
    { id: '55', name: 'Le 5-5', description: 'Inspi: 5s | Apnée: 0s | Expi: 5s (Cohérence Cardiaque)' },
    { id: '46', name: 'Le 4-6', description: 'Inspi: 4s | Apnée: 0s | Expi: 6s (Apaisement rapide)' },
    { id: 'custom', name: 'Personnalisé', description: 'Configurez vos propres durées de respiration' },
  ]

  const soundOptions = [
    'Nature',
    'Océan',
    'Forêt',
    'Pluie',
    'Bruit Blanc',
  ]

  const vibrationOptions = [
    { title: 'Faible', value: 'low' },
    { title: 'Moyenne', value: 'medium' },
    { title: 'Forte', value: 'high' },
  ]

  // Charger la configuration et les favoris au montage
  onMounted(async () => {
    // Charger les favoris via l'API
    await fetchFavorites()

    const savedConfig = localStorage.getItem('breathingConfig')
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        Object.assign(config, parsed)
      } catch (error) {
        console.error('Erreur chargement local:', error)
      }
    }
  })

  async function fetchFavorites () {
    if (!userStore.isLoggedIn || !currentUserId.value) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/breathing/favorites/${currentUserId.value}`, {
        headers: { Authorization: `Bearer ${userStore.token}` },
      })
      if (response.ok) {
        favorites.value = await response.json()
      }
    } catch (error) {
      console.error('Erreur fetch favorites:', error)
    }
  }

  // Vérification de l'unicité du nom
  watch(favoriteName, newName => {
    if (!newName) {
      nameError.value = ''
      return
    }

    const exists = favorites.value.some(f =>
      f.name.toLowerCase() === newName.toLowerCase()
      && (!selectedFavorite.value || f.id !== selectedFavorite.value.id),
    )

    nameError.value = exists ? 'Un favori avec ce nom existe déjà.' : ''
  })

  function applyFavorite (favorite) {
    if (!favorite) {
      favoriteName.value = ''
      return
    }

    config.duration = favorite.duration
    config.technique = 'custom'
    config.customIn = favorite.breath_in
    config.customHold = favorite.breath_hold
    config.customOut = favorite.breath_out
    config.soundType = favorite.sound_type
    config.vibrationIntensity = favorite.vibration_intensity

    favoriteName.value = favorite.name
  }

  async function saveConfig () {
    if (!favoriteName.value || nameError.value || !userStore.isLoggedIn) return

    isSaving.value = true
    try {
      const isUpdate = !!selectedFavorite.value
      const url = isUpdate
        ? `${import.meta.env.VITE_API_URL}/api/breathing/favorites/${selectedFavorite.value.id}`
        : `${import.meta.env.VITE_API_URL}/api/breathing/favorites`

      const payload = {
        user_id: currentUserId.value,
        name: favoriteName.value,
        breath_in: config.technique === 'custom' ? config.customIn : getTechniqueTimes(config.technique).in,
        breath_hold: config.technique === 'custom' ? config.customHold : getTechniqueTimes(config.technique).hold,
        breath_out: config.technique === 'custom' ? config.customOut : getTechniqueTimes(config.technique).out,
        duration: config.duration,
        sound_type: config.soundType,
        vibration_intensity: config.vibrationIntensity,
      }

      const response = await fetch(url, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userStore.token}`,
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        await fetchFavorites()
        showSaveDialog.value = false
        showSnackbar.value = true
        localStorage.setItem('breathingConfig', JSON.stringify(config))

        // Si c'était une création, on peut sélectionner le nouveau favori
        if (!isUpdate) {
          const newFav = favorites.value.find(f => f.name === favoriteName.value)
          if (newFav) selectedFavorite.value = newFav
        }
      } else {
        const errorData = await response.json()
        nameError.value = errorData.error || 'Erreur lors de la sauvegarde'
      }
    } catch (error) {
      console.error('Erreur saving favorite:', error)
    } finally {
      isSaving.value = false
    }
  }

  async function deleteFavorite (id) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/breathing/favorites/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userStore.token}` },
      })
      if (response.ok) {
        await fetchFavorites()
        selectedFavorite.value = null
        favoriteName.value = ''
      }
    } catch (error) {
      console.error('Erreur delete favorite:', error)
    }
  }

  function getTechniqueTimes (id) {
    switch (id) {
      case '748': { return { in: 7, hold: 4, out: 8 }
      }
      case '55': { return { in: 5, hold: 0, out: 5 }
      }
      case '46': { return { in: 4, hold: 0, out: 6 }
      }
      default: { return { in: 4, hold: 4, out: 4 }
      }
    }
  }

  function startExercise () {
    showExercise.value = true
  }

  function onExerciseComplete () {
    showSnackbar.value = true
  }
</script>

<style scoped>
.breathing-page {
  max-width: 1200px;
  margin: 0 auto;
}

.config-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(4, 255, 146, 0.1);
  height: 100%;
  transition: transform 0.3s ease;
}

.config-card:hover {
  border-color: rgba(4, 255, 146, 0.3);
}

.config-card :deep(.v-radio) {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 12px;
  transition: all 0.2s ease;
}

.config-card :deep(.v-radio--checked) {
  border-color: #04FF92;
  background: rgba(4, 255, 146, 0.05);
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Glassmorphism Styles (Search Style) */
.glass-search-wrapper {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 0 16px;
  transition: all 0.3s ease;
  min-height: 52px;
  display: flex;
  align-items: center;
}

.glass-search-wrapper:focus-within {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(4, 255, 146, 0.4);
  box-shadow: 0 0 20px rgba(4, 255, 146, 0.1);
}

.premium-search-field :deep(.v-field__input) {
  color: #E2FBFF !important;
  font-size: 1.1rem;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  min-height: 52px !important;
}

/* Modal Styling */
.save-modal-card {
  background: rgba(36, 24, 72);
  border: 1px solid rgba(4, 255, 146, 0.3);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6) !important;
}

.opacity-70 { opacity: 0.7; }
</style>
