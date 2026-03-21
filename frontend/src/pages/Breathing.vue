<template>
  <v-container class="breathing-page">
    <Title :message="'Exercices de Respiration'" />
    <SubTitle :message="'Choisissez une technique ou personnalisez votre séance'" />

    <!-- Section Configuration -->
    <v-row class="mt-8">
      <!-- Choix de la technique -->
      <v-col cols="12" md="6">
        <v-card class="config-card pa-6" elevation="0" rounded="xl">
          <h3 class="text-h6 font-weight-bold text-primary mb-6">
            <v-icon start color="primary">mdi-weather-windy</v-icon>
            Technique de respiration
          </h3>
          
          <v-radio-group v-model="config.technique">
            <v-radio
              v-for="technique in techniques"
              :key="technique.id"
              :label="technique.name"
              :value="technique.id"
              color="primary"
              class="mb-2"
            >
              <template v-slot:label>
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
            <v-icon start color="primary">mdi-timer-outline</v-icon>
            Paramètres de la séance
          </h3>
          
          <!-- Durée totale -->
          <div class="mb-6">
            <p class="text-body-2 text-medium-emphasis mb-2">
              Durée totale: {{ config.duration }} minutes
            </p>
            <v-slider
              v-model="config.duration"
              :min="1"
              :max="30"
              :step="1"
              color="primary"
              track-color="rgba(4, 255, 146, 0.2)"
              thumb-label
            ></v-slider>
          </div>

          <!-- Configuration des temps (si personnalisé) -->
          <div v-if="config.technique === 'custom'" class="animate-fade-in">
            <v-divider class="mb-6"></v-divider>
            
            <div class="mb-4">
              <p class="text-body-2 text-medium-emphasis mb-1">Inspiration: {{ config.customIn }}s</p>
              <v-slider v-model="config.customIn" :min="1" :max="15" :step="1" color="primary" density="compact" hide-details></v-slider>
            </div>

            <div class="mb-4">
              <p class="text-body-2 text-medium-emphasis mb-1">Apnée (Rétention): {{ config.customHold }}s</p>
              <v-slider v-model="config.customHold" :min="0" :max="15" :step="1" color="amber" density="compact" hide-details></v-slider>
            </div>

            <div class="mb-4">
              <p class="text-body-2 text-medium-emphasis mb-1">Expiration: {{ config.customOut }}s</p>
              <v-slider v-model="config.customOut" :min="1" :max="15" :step="1" color="error" density="compact" hide-details></v-slider>
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
            <v-icon start color="primary">mdi-volume-high</v-icon>
            Ambiance sonore
          </h3>
          
          <v-switch
            v-model="config.soundEnabled"
            label="Activer les sons relaxants"
            color="primary"
            hide-details
            class="mb-4"
          ></v-switch>

          <v-select
            v-if="config.soundEnabled"
            v-model="config.soundType"
            :items="soundOptions"
            label="Type de son"
            variant="outlined"
            color="primary"
            hide-details
          ></v-select>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="config-card pa-6" elevation="0" rounded="xl">
          <h3 class="text-h6 font-weight-bold text-primary mb-6">
            <v-icon start color="primary">mdi-vibrate</v-icon>
            Retour haptique
          </h3>
          
          <v-switch
            v-model="config.vibrationEnabled"
            label="Vibrations au changement de phase"
            color="primary"
            hide-details
            class="mb-4"
          ></v-switch>

          <v-select
            v-if="config.vibrationEnabled"
            v-model="config.vibrationIntensity"
            :items="vibrationOptions"
            label="Intensité"
            variant="outlined"
            color="primary"
            hide-details
          ></v-select>
        </v-card>
      </v-col>
    </v-row>

    <!-- Boutons d'action -->
    <div class="text-center mt-12 mb-12 d-flex justify-center ga-6 flex-wrap">
      <v-btn
        color="primary"
        size="x-large"
        rounded="xl"
        variant="outlined"
        @click="saveConfig"
        :loading="isSaving"
        width="200"
      >
        <v-icon start>mdi-content-save</v-icon>
        Sauvegarder
      </v-btn>
      
      <v-btn
        color="primary"
        size="x-large"
        rounded="xl"
        @click="startExercise"
        width="250"
        elevation="8"
      >
        <v-icon start>mdi-play</v-icon>
        Commencer
      </v-btn>
    </div>

    <!-- Snackbar de confirmation -->
    <v-snackbar v-model="showSnackbar" color="primary" rounded="pill" elevation="12">
      <v-icon start>mdi-check-circle</v-icon>
      Configuration enregistrée
    </v-snackbar>

    <!-- Composant d'exercice de respiration -->
    <BreathingExercise
      v-model="showExercise"
      :config="config"
      @complete="onExerciseComplete"
    />
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Title from '@/components/Title.vue'
import SubTitle from '@/components/SubTitle.vue'
import BreathingExercise from '@/components/BreathingExercise.vue'

// État
const isSaving = ref(false)
const showSnackbar = ref(false)
const showExercise = ref(false)

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
  vibrationIntensity: 'medium'
})

// Options disponibles (basées sur l'énoncé)
const techniques = [
  { id: '748', name: 'Le 7-4-8', description: 'Inspi: 7s | Apnée: 4s | Expi: 8s (Relaxation profonde)' },
  { id: '55', name: 'Le 5-5', description: 'Inspi: 5s | Apnée: 0s | Expi: 5s (Cohérence Cardiaque)' },
  { id: '46', name: 'Le 4-6', description: 'Inspi: 4s | Apnée: 0s | Expi: 6s (Apaisement rapide)' },
  { id: 'custom', name: 'Personnalisé', description: 'Configurez vos propres durées de respiration' }
]

const soundOptions = [
  'Nature',
  'Océan',
  'Forêt',
  'Pluie',
  'Bruit Blanc'
]

const vibrationOptions = [
  { title: 'Faible', value: 'low' },
  { title: 'Moyenne', value: 'medium' },
  { title: 'Forte', value: 'high' }
]

// Charger la configuration au montage
onMounted(() => {
  const savedConfig = localStorage.getItem('breathingConfig')
  if (savedConfig) {
    try {
      const parsed = JSON.parse(savedConfig)
      Object.assign(config, parsed)
    } catch (e) {
      console.error('Erreur chargement:', e)
    }
  }
})

const saveConfig = async () => {
  isSaving.value = true
  setTimeout(() => {
    localStorage.setItem('breathingConfig', JSON.stringify(config))
    isSaving.value = false
    showSnackbar.value = true
  }, 600)
}

const startExercise = () => {
  showExercise.value = true
}

const onExerciseComplete = () => {
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
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
