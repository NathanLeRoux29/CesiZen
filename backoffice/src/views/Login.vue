<template>
  <v-container fluid class="fill-height login-bg">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="glass-card pa-8" elevation="12">
          <div class="text-center mb-8">
            <h1 class="text-h3 font-weight-bold text-primary mb-2">CesiZen</h1>
            <p class="text-subtitle-1 text-white opacity-70">Administration</p>
          </div>

          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="Email"
              prepend-inner-icon="mdi-email"
              variant="outlined"
              color="primary"
              class="mb-4"
              required
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Mot de passe"
              prepend-inner-icon="mdi-lock"
              type="password"
              variant="outlined"
              color="primary"
              class="mb-6"
              required
            ></v-text-field>

            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              :loading="loading"
              class="font-weight-bold"
            >
              Se connecter
            </v-btn>

            <v-alert
              v-if="error"
              type="error"
              variant="tonal"
              class="mt-4"
              closable
            >
              {{ error }}
            </v-alert>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('admin@cesizen.fr')
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  loading.ref = true
  error.value = ''
  try {
    await authStore.login(email.value, password.value)
    router.push('/admin/dashboard')
  } catch (err) {
    error.value = err.response?.data?.error || err.message || "Erreur de connexion"
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-bg {
  background: radial-gradient(circle at top right, #072392, #1D1143);
}
.glass-card {
  background: rgba(45, 27, 105, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
}
</style>
