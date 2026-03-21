<template>
  <v-container class="login-page fill-height" fluid>
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <div class="animate-scale-in">
          <v-card class="login-card pa-8 pa-md-12" elevation="0" rounded="xl">
            <!-- Logo/Titre -->
            <div class="text-center mb-10">
              <v-img
                src="@/assets/logo.png"
                width="180"
                class="mx-auto mb-6 logo-glow"
                contain
              ></v-img>
              <p class="text-h6 text-info opacity-70 font-weight-regular">
                Connectez-vous à votre espace bien-être
              </p>
            </div>

            <!-- Formulaire de connexion -->
            <v-form ref="form" v-model="isFormValid" @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="Adresse Email"
                type="email"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                color="primary"
                :rules="emailRules"
                class="mb-4 premium-input"
                bg-color="rgba(255,255,255,0.03)"
                flat
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Mot de passe"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                color="primary"
                :rules="passwordRules"
                class="mb-2 premium-input"
                bg-color="rgba(255,255,255,0.03)"
                flat
              ></v-text-field>

              <div class="d-flex justify-end mb-8">
                <a href="#" class="text-primary text-body-2 forgot-link" @click.prevent="forgotPassword">
                  Mot de passe oublié ?
                </a>
              </div>

              <v-btn
                type="submit"
                color="primary"
                size="x-large"
                block
                rounded="lg"
                :loading="isLoading"
                :disabled="!isFormValid"
                class="mb-6 login-btn"
                elevation="8"
              >
                Se connecter
              </v-btn>

              <div class="d-flex align-center mb-6">
                <v-divider class="opacity-10"></v-divider>
                <span class="mx-4 text-caption text-info opacity-30 text-uppercase">OU</span>
                <v-divider class="opacity-10"></v-divider>
              </div>

              <v-btn
                variant="outlined"
                color="primary"
                size="large"
                block
                rounded="lg"
                @click="handleRegister"
                class="register-btn"
              >
                Créer un compte
              </v-btn>
            </v-form>

            <!-- Message d'erreur -->
            <v-fade-transition>
              <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                class="mt-6 glass-alert"
                closable
                @click:close="errorMessage = ''"
              >
                {{ errorMessage }}
              </v-alert>
            </v-fade-transition>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// État du formulaire
const form = ref(null)
const isFormValid = ref(false)
const isLoading = ref(false)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')

// Règles de validation
const emailRules = [
  v => !!v || 'L\'email est requis',
  v => /.+@.+\..+/.test(v) || 'L\'email doit être valide'
]

const passwordRules = [
  v => !!v || 'Le mot de passe est requis',
  v => v.length >= 6 || 'Le mot de passe doit contenir au moins 6 caractères'
]

// Gestion de la connexion
const handleLogin = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  errorMessage.value = ''

  // Simulation d'un appel API
  setTimeout(() => {
    // Mock: connexion réussie avec des données utilisateur
    userStore.login({
      id: 1,
      name: 'Stéphane',
      email: email.value,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      stats: {
        articlesViewed: 12,
        favoritesCount: 5,
        breathingExercises: 8
      }
    })

    isLoading.value = false
    router.push('/')
  }, 1000)
}

// Gestion du mot de passe oublié
const forgotPassword = () => {
  errorMessage.value = 'Fonctionnalité à venir'
}

// Gestion de l'inscription
const handleRegister = () => {
  errorMessage.value = 'Fonctionnalité à venir'
}
</script>

<style scoped>
.login-page {
  background: #1D1143 !important;
  min-height: 100vh;
}

.login-card {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(25px) saturate(180%);
  border: 1px solid rgba(4, 255, 146, 0.1) !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
}

.logo-glow {
  filter: drop-shadow(0 0 15px rgba(4, 255, 146, 0.2));
}

.premium-input :deep(.v-field) {
  border-radius: 12px !important;
  background: rgba(255, 255, 255, 0.05) !important;
  transition: all 0.3s ease;
}

.premium-input :deep(.v-field__outline) {
  --v-field-border-opacity: 0.1;
}

.premium-input :deep(.v-field--focused) {
  background: rgba(255, 255, 255, 0.08) !important;
}

.forgot-link {
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.forgot-link:hover {
  opacity: 1;
}

.login-btn {
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(4, 255, 146, 0.3) !important;
}

.register-btn {
  border-width: 2px !important;
  font-weight: bold;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.register-btn:hover {
  opacity: 1;
  background: rgba(4, 255, 146, 0.05) !important;
}

.glass-alert {
  background: rgba(255, 82, 82, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 82, 82, 0.2);
}

/* Animations */
.animate-scale-in {
  animation: scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.opacity-70 { opacity: 0.7; }
.opacity-30 { opacity: 0.3; }
.opacity-10 { opacity: 0.1; }
</style>