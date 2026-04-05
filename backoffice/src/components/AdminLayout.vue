<template>
  <v-app-bar flat color="background" class="border-b">
    <v-app-bar-title class="font-weight-bold text-primary">
      CesiZen <span class="text-white">Back Office</span>
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="logout">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>

  <v-navigation-drawer permanent color="background" class="border-e">
    <v-list nav>
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Tableau de bord"
        to="/admin/dashboard"
        color="primary"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-group"
        title="Utilisateurs"
        to="/admin/users"
        color="primary"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-file-document-edit"
        title="Articles"
        to="/admin/articles"
        color="primary"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main class="bg-background">
    <v-container fluid>
      <router-view />
    </v-container>
  </v-main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
