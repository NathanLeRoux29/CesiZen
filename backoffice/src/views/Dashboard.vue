<template>
  <v-row>
    <v-col cols="12">
      <h2 class="text-h4 font-weight-bold text-white mb-6">Tableau de bord</h2>
    </v-col>
    
    <v-col cols="12" md="4">
      <v-card color="surface" class="pa-6 border">
        <div class="d-flex align-center justify-space-between mb-4">
          <h3 class="text-subtitle-1 text-grey-lighten-1">Utilisateurs</h3>
          <v-icon color="primary" size="32">mdi-account-group</v-icon>
        </div>
        <div class="text-h3 font-weight-bold text-white">42</div>
        <div class="text-caption text-primary mt-2">+12% ce mois</div>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card color="surface" class="pa-6 border">
        <div class="d-flex align-center justify-space-between mb-4">
          <h3 class="text-subtitle-1 text-grey-lighten-1">Articles</h3>
          <v-icon color="primary" size="32">mdi-file-document</v-icon>
        </div>
        <div class="text-h3 font-weight-bold text-white">12</div>
        <div class="text-caption text-primary mt-2">Dernier ajouté hier</div>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card color="surface" class="pa-6 border">
        <div class="d-flex align-center justify-space-between mb-4">
          <h3 class="text-subtitle-1 text-grey-lighten-1">Séances Respiration</h3>
          <v-icon color="primary" size="32">mdi-meditation</v-icon>
        </div>
        <div class="text-h3 font-weight-bold text-white">156</div>
        <div class="text-caption text-primary mt-2">+24% d'activité</div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
</script>
