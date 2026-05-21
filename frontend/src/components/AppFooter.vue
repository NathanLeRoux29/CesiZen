<template>
  <v-footer class="app-footer py-4">
    <v-container>
      <v-row justify="space-between" align="center" no-gutters>
        <v-col cols="auto">
          <p class="text-body-2 text-medium-emphasis mb-0">
            © 2026 CesiZen - Pour votre bien être
          </p>
        </v-col>
        <v-col cols="auto">
          <v-btn
            variant="text"
            size="small"
            color="medium-emphasis"
            prepend-icon="mdi-alert-circle-outline"
            @click="dialog = true"
          >
            Signaler un problème
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="dialog" max-width="560">
      <v-card class="pa-2">
        <v-card-title class="text-h6 font-weight-bold pt-4 px-4">
          Signaler un problème
        </v-card-title>
        <v-card-subtitle class="px-4 pb-2">
          Votre retour nous aide à améliorer CesiZen.
        </v-card-subtitle>

        <v-card-text>
          <v-form ref="formRef" @submit.prevent="submit">
            <v-select
              v-model="form.category"
              :items="categories"
              label="Catégorie"
              variant="outlined"
              density="comfortable"
              class="mb-3"
              :rules="[v => !!v || 'Catégorie obligatoire']"
            ></v-select>

            <v-textarea
              v-model="form.description"
              label="Description du problème"
              variant="outlined"
              density="comfortable"
              rows="4"
              class="mb-3"
              :rules="[
                v => !!v || 'Description obligatoire',
                v => v.length >= 10 || 'Minimum 10 caractères'
              ]"
            ></v-textarea>

            <v-text-field
              v-model="form.email"
              label="Email (optionnel — pour être recontacté)"
              variant="outlined"
              density="comfortable"
              type="email"
              class="mb-3"
              :rules="[v => !v || /.+@.+\..+/.test(v) || 'Email invalide']"
            ></v-text-field>

            <v-text-field
              v-model="form.page_url"
              label="Page concernée"
              variant="outlined"
              density="comfortable"
              readonly
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions class="px-4 pb-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">Annuler</v-btn>
          <v-btn color="primary" :loading="loading" @click="submit">Envoyer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="4000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-footer>
</template>

<script setup>
import { ref, watch } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const dialog = ref(false)
const loading = ref(false)
const formRef = ref(null)
const snackbar = ref({ show: false, text: '', color: 'success' })

const categories = [
  { title: 'Bug', value: 'bug' },
  { title: 'Suggestion', value: 'suggestion' },
  { title: 'Autre', value: 'autre' },
]

const defaultForm = () => ({
  category: null,
  description: '',
  email: '',
  page_url: window.location.href,
})

const form = ref(defaultForm())

watch(dialog, (open) => {
  if (open) form.value.page_url = window.location.href
})

const submit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: form.value.category,
        description: form.value.description,
        email: form.value.email || null,
        page_url: form.value.page_url || null,
      }),
    })

    if (!res.ok) throw new Error()

    snackbar.value = { show: true, text: 'Signalement envoyé, merci !', color: 'success' }
    dialog.value = false
    formRef.value.reset()
    form.value = defaultForm()
  } catch {
    snackbar.value = { show: true, text: 'Une erreur est survenue, réessaie plus tard.', color: 'error' }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.app-footer {
  background: transparent !important;
  border-top: 1px solid rgba(4, 255, 146, 0.1);
}
</style>
