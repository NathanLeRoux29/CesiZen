<template>
  <v-dialog
    v-model="isOpen"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <v-card class="breathing-exercise-card">
      <!-- Barre d'outils -->
      <v-toolbar class="exercise-toolbar" elevation="0">
        <v-btn 
          icon 
          class="bg-primary" 
          @click="quitExercise"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        
        <v-toolbar-title class="text-center">
          {{ exerciseTitle }}
        </v-toolbar-title>
        
        <v-btn 
          icon 
          class="bg-primary" 
          @click="toggleSound"
        >
          <v-icon>{{ soundEnabled ? 'mdi-volume-high' : 'mdi-volume-off' }}</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Contenu principal de l'exercice -->
      <div class="exercise-content">
        <!-- Timer principal -->
        <div class="timer-display">
          <span class="time-remaining">{{ formatTime(timeRemaining) }}</span>
          <span class="time-label">secondes</span>
        </div>

        <!-- Cercle de respiration -->
        <div class="breathing-circle-container">
          <div 
            class="breathing-circle"
            :class="[currentPhase, { 'animating': isAnimating }]"
            :style="circleStyle"
          >
            <div class="circle-inner">
              <span class="phase-text">{{ currentInstruction }}</span>
            </div>
          </div>
        </div>

        <!-- Indicateur de cycle -->
        <div class="cycle-indicator">
          <span class="cycle-text">Cycle {{ currentCycle }} / {{ totalCycles }}</span>
        </div>

        <!-- Contrôles de l'exercice -->
        <div class="exercise-controls">
          <v-btn
            v-if="!isRunning"
            color="primary"
            size="x-large"
            rounded="xl"
            @click="startExercise"
          >
            <v-icon start>mdi-play</v-icon>
            Commencer
          </v-btn>
          
          <v-btn
            v-else
            :color="isPaused ? 'primary' : 'error'"
            size="x-large"
            rounded="xl"
            @click="pauseExercise"
          >
            <v-icon start>{{ isPaused ? 'mdi-play' : 'mdi-pause' }}</v-icon>
            {{ isPaused ? 'Reprendre' : 'Pause' }}
          </v-btn>
        </div>

        <!-- Barre de progression -->
        <div class="progress-container">
          <v-progress-linear
            :model-value="progressValue"
            color="primary"
            height="8"
            rounded
          ></v-progress-linear>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  config: {
    type: Object,
    required: true
  }
})

// Émissions
const emit = defineEmits(['update:modelValue', 'complete'])

// État local
const isOpen = ref(props.modelValue)
const isRunning = ref(false)
const isPaused = ref(false)
const timeRemaining = ref(0)
const currentCycle = ref(1)
const currentPhase = ref('inhale') // inhale, hold-in, exhale, hold-out
const currentInstruction = ref('Respirez')
const isAnimating = ref(false)
const soundEnabled = ref(true)
let timerInterval = null
let phaseInterval = null

// Techniques de respiration
const techniques = {
  '748': {
    name: 'Le 7-4-8',
    inhale: 7,
    holdIn: 4,
    exhale: 8,
    holdOut: 0,
    instructions: {
      inhale: 'Inspirez profondément',
      holdIn: 'Retenez votre souffle',
      exhale: 'Expirez lentement',
      holdOut: ''
    }
  },
  '55': {
    name: 'Le 5-5',
    inhale: 5,
    holdIn: 0,
    exhale: 5,
    holdOut: 0,
    instructions: {
      inhale: 'Inspirez',
      holdIn: '',
      exhale: 'Expirez',
      holdOut: ''
    }
  },
  '46': {
    name: 'Le 4-6',
    inhale: 4,
    holdIn: 0,
    exhale: 6,
    holdOut: 0,
    instructions: {
      inhale: 'Inspirez',
      holdIn: '',
      exhale: 'Expirez',
      holdOut: ''
    }
  },
  'custom': {
    name: 'Personnalisé',
    instructions: {
      inhale: 'Inspirez',
      holdIn: 'Retenez',
      exhale: 'Expirez',
      holdOut: 'Retenez'
    }
  }
}

// Computed
const technique = computed(() => {
  const base = techniques[props.config.technique] || techniques['748']
  if (props.config.technique === 'custom') {
    return {
      ...base,
      inhale: props.config.customIn || 4,
      holdIn: props.config.customHold || 0,
      exhale: props.config.customOut || 4,
      holdOut: 0
    }
  }
  return base
})
const totalCycles = computed(() => props.config.cycles || 4)
const totalDuration = computed(() => props.config.duration * 60) // en secondes

const exerciseTitle = computed(() => {
  return technique.value.name
})

const progressValue = computed(() => {
  const total = totalDuration.value
  const elapsed = total - timeRemaining.value
  return (elapsed / total) * 100
})

const circleStyle = computed(() => {
  const phaseDurations = {
    inhale: technique.value.inhale,
    holdIn: technique.value.holdIn,
    exhale: technique.value.exhale,
    holdOut: technique.value.holdOut
  }
  
  const currentDuration = phaseDurations[currentPhase.value] || 1
  const maxDuration = Math.max(technique.value.inhale, technique.value.holdIn, technique.value.exhale, technique.value.holdOut)
  
  // Calculer la taille du cercle en fonction de la phase
  let scale = 1
  if (currentPhase.value === 'inhale') {
    scale = 1.5
  } else if (currentPhase.value === 'exhale') {
    scale = 1
  }
  
  return {
    transform: `scale(${scale})`,
    transition: `transform ${currentDuration}s ease-in-out`
  }
})

// Méthodes
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const startExercise = () => {
  isRunning.value = true
  isPaused.value = false
  timeRemaining.value = totalDuration.value
  currentCycle.value = 1
  
  startBreathingCycle()
  startTimer()
}

const pauseExercise = () => {
  isPaused.value = !isPaused.value
  if (isPaused.value) {
    clearInterval(timerInterval)
    clearTimeout(phaseInterval)
    isAnimating.value = false
  } else {
    startTimer()
    resumeBreathingCycle()
  }
}

const startTimer = () => {
  timerInterval = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      completeExercise()
    }
  }, 1000)
}

const startBreathingCycle = () => {
  runPhase('inhale')
}

const resumeBreathingCycle = () => {
  runPhase(currentPhase.value)
}

const runPhase = (phase) => {
  const phaseConfig = technique.value
  const duration = phaseConfig[phase === 'holdIn' ? 'holdIn' : phase === 'holdOut' ? 'holdOut' : phase]
  
  if (duration === 0) {
    // Passer à la phase suivante si celle-ci n'a pas de durée
    const phases = ['inhale', 'holdIn', 'exhale', 'holdOut']
    const currentIndex = phases.indexOf(phase)
    const nextPhase = phases[(currentIndex + 1) % 4]
    
    // Vérifier si on a terminé un cycle
    if (nextPhase === 'inhale') {
      if (currentCycle.value < totalCycles.value) {
        currentCycle.value++
      } else {
        completeExercise()
        return
      }
    }
    
    runPhase(nextPhase)
    return
  }
  
  currentPhase.value = phase
  currentInstruction.value = phaseConfig.instructions[phase]
  isAnimating.value = true
  
  // Jouer un son si activé
  if (soundEnabled.value) {
    playPhaseSound(phase)
  }
  
  // Vibrer si activé
  if (props.config.vibrationEnabled) {
    vibrate(props.config.vibrationIntensity)
  }
  
  clearTimeout(phaseInterval)
  phaseInterval = setTimeout(() => {
    isAnimating.value = false
    
    // Passer à la phase suivante
    const phases = ['inhale', 'holdIn', 'exhale', 'holdOut']
    const currentIndex = phases.indexOf(phase)
    const nextPhase = phases[(currentIndex + 1) % 4]
    
    // Vérifier si on a terminé un cycle
    if (nextPhase === 'inhale') {
      if (currentCycle.value < totalCycles.value) {
        currentCycle.value++
      } else {
        completeExercise()
        return
      }
    }
    
    if (isRunning.value && !isPaused.value) {
      runPhase(nextPhase)
    }
  }, duration * 1000)
}

const playPhaseSound = (phase) => {
  // Ici vous pouvez implémenter la lecture de sons
  // Pour l'instant, c'est une implémentation vide
}

const vibrate = (intensity) => {
  if ('vibrate' in navigator) {
    const durations = {
      low: 100,
      medium: 200,
      high: 400
    }
    navigator.vibrate(durations[intensity] || 200)
  }
}

const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value
}

const quitExercise = () => {
  isRunning.value = false
  isPaused.value = false
  clearInterval(timerInterval)
  clearInterval(phaseInterval)
  emit('update:modelValue', false)
}

const completeExercise = () => {
  isRunning.value = false
  clearInterval(timerInterval)
  clearInterval(phaseInterval)
  emit('complete')
  emit('update:modelValue', false)
}

// Watchers
watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal
  if (!newVal) {
    quitExercise()
  }
})

watch(isOpen, (newVal) => {
  if (!newVal) {
    emit('update:modelValue', false)
  }
})

// Lifecycle
onUnmounted(() => {
  clearInterval(timerInterval)
  clearInterval(phaseInterval)
})
</script>

<style scoped>
.breathing-exercise-card {
  background: #1D1143;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.exercise-toolbar {
  background: transparent !important;
}

.exercise-toolbar .v-btn {
  background-color: #04FF92 !important;
  color: #1D1143 !important;
}

.exercise-toolbar .v-btn:hover {
  background-color: #04FF92 !important;
  opacity: 0.9;
}

.exercise-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.timer-display {
  text-align: center;
  margin-bottom: 40px;
}

.time-remaining {
  display: block;
  font-size: 4rem;
  font-weight: bold;
  color: #04FF92;
}

.time-label {
  display: block;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.breathing-circle-container {
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
}

.breathing-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 4px solid #04FF92;
  background: rgba(4, 255, 146, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.5s ease-in-out;
  box-shadow: 0 0 30px rgba(4, 255, 146, 0.3);
}

.breathing-circle.inhale {
  border-color: #04FF92;
  box-shadow: 0 0 50px rgba(4, 255, 146, 0.5);
}

.breathing-circle.hold-in {
  border-color: #FFD700;
  box-shadow: 0 0 50px rgba(255, 215, 0, 0.5);
}

.breathing-circle.exhale {
  border-color: #FF6B6B;
  box-shadow: 0 0 50px rgba(255, 107, 107, 0.5);
}

.breathing-circle.hold-out {
  border-color: #4ECDC4;
  box-shadow: 0 0 50px rgba(78, 205, 196, 0.5);
}

.circle-inner {
  text-align: center;
}

.phase-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.cycle-indicator {
  margin: 20px 0;
}

.cycle-text {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
}

.exercise-controls {
  margin: 30px 0;
}

.progress-container {
  width: 100%;
  max-width: 500px;
  margin-top: 20px;
}
</style>