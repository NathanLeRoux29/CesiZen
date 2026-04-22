<template>
  <v-card color="surface" class="border">
    <v-card-title class="pa-6 d-flex align-center">
      <h2 class="text-h5 font-weight-bold text-white">Gestion des Articles</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">
        Ajouter un article
      </v-btn>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="articles"
      :loading="loading"
      theme="dark"
      class="bg-surface"
    >
      <template #item.media_url="{ item }">
        <v-img :src="item.media_url" width="50" height="50" cover class="rounded"></v-img>
      </template>

      <template #item.actions="{ item }">
        <v-btn icon="mdi-pencil" variant="text" color="primary" size="small" @click="openDialog(item)"></v-btn>
        <v-btn icon="mdi-delete" variant="text" color="error" size="small" @click="handleDelete(item.id)"></v-btn>
      </template>
    </v-data-table>

    <!-- Dialog de création/édition -->
    <v-dialog v-model="dialog" max-width="800">
      <v-card class="pa-6">
        <v-card-title class="text-h5 font-weight-bold mb-4">
          {{ editedId ? 'Modifier l\'article' : 'Nouvel article' }}
        </v-card-title>
        
        <v-form @submit.prevent="saveArticle">
          <v-row>
            <v-col cols="12" md="8">
              <v-text-field v-model="form.title" label="Titre" variant="outlined" required></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="form.id_category"
                :items="categories"
                item-title="name"
                item-value="id"
                label="Catégorie"
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="form.summary" label="Résumé" variant="outlined" rows="2"></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="form.content" label="Contenu de l'article" variant="outlined" rows="8"></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="form.media_url" label="URL de l'image" variant="outlined" prepend-inner-icon="mdi-image"></v-text-field>
            </v-col>
          </v-row>

          <v-card-actions class="mt-6 pa-0">
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="dialog = false">Annuler</v-btn>
            <v-btn color="primary" type="submit" :loading="saving">Enregistrer</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../stores/auth'

const articles = ref([])
const categories = [
  { id: 1, name: 'Méditation' },
  { id: 2, name: 'Yoga' },
  { id: 3, name: 'Respiration' },
  { id: 4, name: 'Sommeil' },
]
const loading = ref(false)
const dialog = ref(false)
const saving = ref(false)
const editedId = ref(null)

const form = ref({
  title: '',
  summary: '',
  content: '',
  media_url: '',
  id_category: 1,
  author: 'Équipe CesiZen'
})

const headers = [
  { title: 'Image', key: 'media_url', sortable: false },
  { title: 'Titre', key: 'title' },
  { title: 'Auteur', key: 'author' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const fetchArticles = async () => {
  loading.value = true
  try {
    const response = await api.get('/api/articles')
    articles.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const openDialog = (item = null) => {
  if (item) {
    editedId.value = item.id
    form.value = { ...item }
  } else {
    editedId.value = null
    form.value = {
      title: '',
      summary: '',
      content: '',
      media_url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800',
      id_category: 1,
      author: 'Équipe CesiZen'
    }
  }
  dialog.value = true
}

const saveArticle = async () => {
  saving.value = true
  try {
    if (editedId.value) {
      await api.put(`/api/admin/articles/${editedId.value}`, form.value)
    } else {
      await api.post('/api/admin/articles', form.value)
    }
    await fetchArticles()
    dialog.value = false
  } catch (error) {
    console.error(error)
  } finally {
    saving.value = false
  }
}

const handleDelete = async (id) => {
  if (confirm('Supprimer cet article ?')) {
    try {
      await api.delete(`/api/admin/articles/${id}`)
      await fetchArticles()
    } catch (error) {
      console.error(error)
    }
  }
}

onMounted(fetchArticles)
</script>
