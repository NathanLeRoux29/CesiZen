<template>
  <v-app-bar flat class="app-bar">
    <v-container class="d-flex align-center justify-space-between" style="max-width: 1400px;">
      <!-- Logo -->
      <div class="cursor-pointer" @click="$router.push('/')">
        <v-img 
          src="@/assets/logo.png" 
          width="120"  
          contain
        ></v-img>
      </div>

      <!-- Menu desktop -->
      <div class="d-none d-md-flex align-center">
        <v-btn
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          variant="text"
          size="small"
          class="mx-1"
          exact
        >
          {{ item.title }}
        </v-btn>
      </div>

      <!-- Connexion / Menu mobile -->
      <div class="d-flex align-center">
        <!-- Desktop Auth Button -->
        <v-btn
          v-if="$vuetify.display.mdAndUp"
          variant="text"
          @click="handleAuthClick"
          class="text-primary font-weight-bold"
          size="large"
        >
          <v-icon color="primary" size="28" class="mr-2">mdi-account-circle</v-icon>
          {{ authText }}
        </v-btn>

        <!-- Mobile Auth Icon (Explicitly visible next to menu) -->
        <v-btn
          v-if="!$vuetify.display.mdAndUp"
          icon="mdi-account-circle"
          variant="text"
          color="primary"
          @click="handleAuthClick"
        ></v-btn>

        <!-- Menu mobile -->
        <v-menu v-if="!$vuetify.display.mdAndUp">
          <template v-slot:activator="{ props }">
            <v-btn
              icon="mdi-menu"
              variant="text"
              color="primary"
              v-bind="props"
            ></v-btn>
          </template>
          <v-list>
            <v-list-item @click="handleAuthClick">
              <v-list-item-title>
                <v-icon size="20" class="mr-2">mdi-account-circle</v-icon>
                {{ authText }}
              </v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item
              v-for="item in menuItems"
              :key="item.title"
              :to="item.to"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-container>


  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// Gestion de l'authentification
const authText = computed(() => {
  return userStore.isLoggedIn ? userStore.user.name : 'Connexion'
})

const handleAuthClick = () => {
  if (userStore.isLoggedIn) {
    router.push('/Account')
  } else {
    router.push('/Login')
  }
}

const menuItems = [
  { title: 'Accueil', to: '/' },
  { title: 'Catalogue', to: '/Catalogue' },
  { title: 'Diagnostics', to: '/diagnostics' },
  { title: 'Activités', to: '/activites' },
  { title: 'Respiration', to: '/Breathing' },
  { title: 'Ressources', to: '/ressources' },
  { title: 'Émotions', to: '/emotions' },
  { title: 'FAQ', to: '/faq' },
]
</script>

<style scoped>
.app-bar {
  background: #1D1143 !important;
  border-bottom: 1px solid rgba(4, 255, 146, 0.3) !important;
}

.app-bar :deep(.v-btn) {
  color: #E2FBFF;
  text-transform: none;
  letter-spacing: 0;
}

.app-bar :deep(.v-btn:hover) {
  background: rgba(4, 255, 146, 0.1);
}

.app-bar :deep(.v-btn--active) {
  color: #04FF92;
}

.app-bar :deep(.v-divider) {
  border-color: rgba(4, 255, 146, 0.3) !important;
}
</style>