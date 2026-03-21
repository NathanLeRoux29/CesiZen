<template>
  <v-container class="breathing-page">
    <Title :message="'Exercices de Respiration'" />
    <SubTitle :message="'Configurez vos séances de respiration pour votre bien-être'" />

    <!-- Section Configuration -->
    <v-row class="mt-8">
      <v-col cols="12" md="6">
        <v-card class="config-card pa-6" elevation="0" rounded="xl">
          <h3 class="text-h6 font-weight-bold text-primary mb-6">
            <v-icon start color="primary">mdi-timer-outline</v-icon>
            Durée de l'exercice
          </h3>
          
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
            >
              <template v-slot:append>
                <span class="text-primary font-weight-bold">min</span>
              </template>
            </v-slider>
          </div>

          <div>
            <p class="text-body-2 text-medium-emphasis mb-2">
              Cycles de respiration: {{ config.cycles }}
            </p>
            <v-slider
              v-model="config.cycles"
              :min="1"
              :max="20"
              :step="1"
              color="primary"
              track-color="rgba(4, 255, 146, 0.2)"
              thumb-label
            >
              <template v-slot:append>
                <span class="text-primary font-weight-bold">cycles</span>
              </template>
            </v-slider>
          </div>
        </v-card>
      </v-col>

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
                  <span class="text-body-1">{{ technique.name }}</span>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    {{ technique.description }}
                  </p>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
        </v-card>
      </v-col>
    </v-row>

    <!-- Section Type d'exercice -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="config-card pa-6" elevation="0" rounded="xl">
          <h3 class="text-h6 font-weight-bold text-primary mb-6">
            <v-icon start color="primary">mdi-format-list-bulleted</v-icon>
            Type d'exercice
          </h3>
          
          <v-chip-group
            v-model="config.exerciseType"
            selected-class="bg-primary"
            mandatory
          >
            <v-chip
              v-for="type in exerciseTypes"
              :key="type.id"
              :value="type.id"
              variant="outlined"
              size="large"
            >
              <v-icon start>{{ type.icon }}</v-icon>
              {{ type.name }}
            </v-chip>
          </v-chip-group>
        </v-card>
      </v-col>
    </v-row>

    <!-- Section Sons et vibrations -->
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card class="config-card pa-6" elevation="0" rounded="xl">
          <h3 class="text-h6 font-weight-bold text-primary mb-6">
            <v-icon start color="primary">mdi-volume-high</v-icon>
            Sons ambient
          </h3>
          
          <v-switch
            v-model="config.soundEnabled"
            label="Activer les sons"
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
          ></v-select>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="config-card pa-6" elevation="0" rounded="xl">
          <h3 class="text-h6 font-weight-bold text-primary mb-6">
            <v-icon start color="primary">mdi-vibrate</v-icon>
            Vibrations
          </h3>
          
          <v-switch
            v-model="config.vibrationEnabled"
            label="Activer les vibrations"
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
          ></v-select>
        </v-card>
      </v-col>
    </v-row>

    <!-- Boutons d'action -->
    <div class="text-center mt-8 mb-8 d-flex justify-center ga-4 flex-wrap">
      <v-btn
        color="primary"
        size="x-large"
        rounded="xl"
        @click="saveConfig"
        :loading="isSaving"
      >
        <v-icon start>mdi-content-save</v-icon>
        Sauvegarder
      </v-btn>
      
      <v-btn
        color="primary"
        size="x-large"
        rounded="xl"
        @click="startExercise"
      >
        <v-icon start>mdi-play</v-icon>
        Commencer l'exercice
      </v-btn>
    </div>

    <!-- Snackbar de confirmation -->
    <v-snackbar v-model="showSnackbar" color="primary" :timeout="3000">
      Configuration sauvegardée avec succès !
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
  cycles: 4,
  technique: 'box',
  exerciseType: 'relaxation',
  soundEnabled: true,
  soundType: 'nature',
  vibrationEnabled: true,
  vibrationIntensity: 'medium'
})

// Options disponibles
const techniques = [
  { id: 'box', name: 'Respiration Carrée', description: 'Inspirez, retenez, expirez, retenez - 4 temps égaux' },
  { id: '478', name: 'Méthode 4-7-8', description: 'Inspirez 4s, retenez 7s, expirez 8s' },
  { id: 'diaphragm', name: 'Respiration Diaphragmatique', description: 'Respiration profonde du ventre' },
  { id: 'coherent', name: 'Respiration Cohérente', description: '6 cycles par minute, inspiration = expiration' }
]

const exerciseTypes = [
  { id: 'relaxation', name: 'Relaxation', icon: 'mdi-spa' },
  { id: 'energy', name: 'Énergie', icon: 'mdi-lightning-bolt' },
  { id: 'sleep', name: 'Sommeil', icon: 'mdi-sleep' },
  { id: 'focus', name: 'Concentration', icon: 'mdi-brain' }
]

const soundOptions = [
  'Nature',
  'Océan',
  'Forêt',
  'Pluie',
  'Silencieux'
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
      console.error('Erreur lors du chargement de la configuration:', e)
    }
  }
})

// Sauvegarder la configuration
const saveConfig = async () => {
  isSaving.value = true
  
  // Simulation d'un appel API
  setTimeout(() => {
    // Sauvegarde dans le localStorage
    localStorage.setItem('breathingConfig', JSON.stringify(config))
    
    isSaving.value = false
    showSnackbar.value = true
  }, 1000)
}

// Démarrer l'exercice
const startExercise = () => {
  showExercise.value = true
}

// Callback quand l'exercice est terminé
const onExerciseComplete = () => {
  showSnackbar.value = true
}
</script>

<style scoped>
.breathing-page {
  max-width: 1400px;
  margin: 0 auto;
}

.config-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(4, 255, 146, 0.1);
  height: 100%;
}

.config-card :deep(.v-radio) {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(4, 255, 146, 0.1);
  margin-bottom: 8px;
}

.config-card :deep(.v-radio--checked) {
  border-color: #04FF92;
  background: rgba(4, 255, 146, 0.1);
}

.config-card :deep(.v-chip) {
  border-color: rgba(4, 255, 146, 0.3);
}

.config-card :deep(.v-chip--selected) {
  background: rgba(4, 255, 146, 0.2) !important;
  border-color: #04FF92;
}
</style>