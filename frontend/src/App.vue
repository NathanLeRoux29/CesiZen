<template>
  <v-app>
    <app-bar></app-bar>
    <v-main class="py-0">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import AppBar from './components/AppBar.vue';
</script>