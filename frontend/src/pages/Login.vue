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
                {{ isRegisterMode ? 'Créez votre compte CesiZen' : 'Connectez-vous à votre espace bien-être' }}
              </p>
            </div>

            <!-- Formulaire de connexion -->
            <v-form ref="form" v-model="isFormValid" @submit.prevent="handleSubmit">
              <v-text-field
                v-if="isRegisterMode"
                v-model="username"
                label="Nom d'utilisateur"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                color="primary"
                :rules="usernameRules"
                class="mb-4 premium-input animate-fade-in"
                bg-color="rgba(255,255,255,0.03)"
                flat
              ></v-text-field>

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

              <div v-if="!isRegisterMode" class="d-flex justify-end mb-8">
                <a href="#" class="text-primary text-body-2 forgot-link" @click.prevent="errorMessage = 'Bientôt disponible'">
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
                {{ isRegisterMode ? 'Créer mon compte' : 'Se connecter' }}
              </v-btn>

              <div class="text-center mt-4">
                <p class="text-body-2 text-info opacity-70">
                  {{ isRegisterMode ? 'Déjà un compte ?' : 'Pas encore de compte ?' }}
                  <a href="#" class="text-primary font-weight-bold ml-1 active-link" @click.prevent="toggleMode">
                    {{ isRegisterMode ? 'Se connecter' : 'S\'inscrire' }}
                  </a>
                </p>
              </div>
            </v-form>

            <!-- Message d'erreur -->
            <v-fade-transition>
              <v-alert
                v-if="errorMessage"
                :type="errorMessage.includes('créé') ? 'success' : 'error'"
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
const isRegisterMode = ref(false)
const email = ref('')
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')

// Règles de validation
const emailRules = [
  v => !!v || 'L\'email est requis',
  v => /.+@.+\..+/.test(v) || 'L\'email doit être valide'
]

const usernameRules = [
  v => !!v || 'Le nom d\'utilisateur est requis',
  v => v.length >= 3 || 'Le nom doit contenir au moins 3 caractères'
]

const passwordRules = [
  v => !!v || 'Le mot de passe est requis',
  v => v.length >= 6 || 'Le mot de passe doit contenir au moins 6 caractères'
]

// Basculer entre login et register
const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value
  errorMessage.value = ''
}

// Gestion de la connexion / inscription
const handleSubmit = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  errorMessage.value = ''

  const url = isRegisterMode.value 
    ? 'http://localhost:3001/api/users/register' 
    : 'http://localhost:3001/api/users/login'
    
  const payload = isRegisterMode.value 
    ? { email: email.value, username: username.value, password: password.value }
    : { email: email.value, password: password.value }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (response.ok) {
      if (isRegisterMode.value) {
        // Après inscription, on bascule en login ou on connecte directement
        isRegisterMode.value = false
        errorMessage.value = 'Compte créé ! Vous pouvez vous connecter.'
      } else {
        // Connexion réussie
        userStore.login({
          id: data.user.id,
          name: data.user.username, // On mappe username sur name pour le store
          email: data.user.email,
          avatar: data.user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
          stats: data.user.stats || {
            articlesViewed: 0,
            favoritesCount: 0,
            breathingExercises: 0
          }
        })
        router.push('/')
      }
    } else {
      errorMessage.value = data.error || 'Une erreur est survenue'
    }
  } catch (error) {
    console.error('Erreur authentification:', error)
    errorMessage.value = 'Impossible de contacter le serveur'
  } finally {
    isLoading.value = false
  }
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