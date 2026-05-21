<template>
  <v-card color="surface" class="border">
    <v-card-title class="pa-6 d-flex align-center flex-wrap gap-3">
      <h2 class="text-h5 font-weight-bold text-white">Signalements</h2>
      <v-spacer></v-spacer>

      <v-btn-toggle v-model="filterStatus" density="compact" variant="outlined" color="primary">
        <v-btn value="">Tous</v-btn>
        <v-btn value="nouveau">Nouveau</v-btn>
        <v-btn value="en_cours">En cours</v-btn>
        <v-btn value="resolu">Résolu</v-btn>
      </v-btn-toggle>

      <v-select
        v-model="filterCategory"
        :items="categoryItems"
        label="Catégorie"
        variant="outlined"
        density="compact"
        clearable
        style="max-width: 160px"
      ></v-select>
    </v-card-title>

    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="reports"
      :items-length="totalItems"
      :loading="loading"
      :items-per-page-options="[10, 25, 50]"
      theme="dark"
      class="bg-surface"
      @update:options="loadItems"
    >
      <template #item.description="{ item }">
        <span :title="item.description">{{ item.description.slice(0, 80) }}{{ item.description.length > 80 ? '…' : '' }}</span>
      </template>

      <template #item.status="{ item }">
        <v-select
          :model-value="item.status"
          :items="statusItems"
          density="compact"
          variant="plain"
          hide-details
          style="min-width: 130px"
          @update:model-value="val => changeStatus(item.id, val)"
        >
          <template #selection="{ item: selected }">
            <v-chip :color="statusColor(selected.value)" size="small" label>
              {{ selected.title }}
            </v-chip>
          </template>
        </v-select>
      </template>

      <template #item.actions="{ item }">
        <v-btn
          icon="mdi-delete"
          variant="text"
          color="error"
          size="small"
          @click="confirmDelete(item)"
        ></v-btn>
      </template>
    </v-data-table-server>
  </v-card>

  <!-- Dialog confirmation suppression -->
  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card class="pa-4">
      <v-card-title class="text-h6">Supprimer ce signalement ?</v-card-title>
      <v-card-text>Cette action est irréversible.</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="deleteDialog = false">Annuler</v-btn>
        <v-btn color="error" :loading="deleting" @click="handleDelete">Supprimer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
    {{ snackbar.text }}
  </v-snackbar>
</template>

<script setup>
import { ref, watch } from 'vue'
import { api } from '../stores/auth'

const reports = ref([])
const totalItems = ref(0)
const itemsPerPage = ref(10)
const loading = ref(false)
const filterStatus = ref('')
const filterCategory = ref(null)
const deleteDialog = ref(false)
const deleting = ref(false)
const toDeleteId = ref(null)
const snackbar = ref({ show: false, text: '', color: 'success' })

let lastOptions = { page: 1, itemsPerPage: 10 }

const headers = [
  { title: 'Date', key: 'created_at', sortable: false },
  { title: 'Catégorie', key: 'category', sortable: false },
  { title: 'Description', key: 'description', sortable: false },
  { title: 'Email', key: 'email', sortable: false },
  { title: 'Page', key: 'page_url', sortable: false },
  { title: 'Statut', key: 'status', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false },
]

const categoryItems = [
  { title: 'Bug', value: 'bug' },
  { title: 'Suggestion', value: 'suggestion' },
  { title: 'Autre', value: 'autre' },
]

const statusItems = [
  { title: 'Nouveau', value: 'nouveau' },
  { title: 'En cours', value: 'en_cours' },
  { title: 'Résolu', value: 'resolu' },
]

const statusColor = (status) => ({
  nouveau: 'error',
  en_cours: 'warning',
  resolu: 'success',
}[status] || 'default')

const loadItems = async (options = lastOptions) => {
  lastOptions = options
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: options.page || 1,
      limit: options.itemsPerPage || itemsPerPage.value,
    })
    if (filterStatus.value) params.set('status', filterStatus.value)
    if (filterCategory.value) params.set('category', filterCategory.value)

    const { data } = await api.get(`/api/reports?${params}`)
    reports.value = data.data
    totalItems.value = data.total
  } catch (error) {
    console.error(error)
    snackbar.value = { show: true, text: 'Erreur lors du chargement', color: 'error' }
  } finally {
    loading.value = false
  }
}

const changeStatus = async (id, status) => {
  try {
    await api.patch(`/api/reports/${id}`, { status })
    const report = reports.value.find(r => r.id === id)
    if (report) report.status = status
  } catch {
    snackbar.value = { show: true, text: 'Erreur lors de la mise à jour', color: 'error' }
  }
}

const confirmDelete = (item) => {
  toDeleteId.value = item.id
  deleteDialog.value = true
}

const handleDelete = async () => {
  deleting.value = true
  try {
    await api.delete(`/api/reports/${toDeleteId.value}`)
    deleteDialog.value = false
    snackbar.value = { show: true, text: 'Signalement supprimé', color: 'success' }
    loadItems()
  } catch {
    snackbar.value = { show: true, text: 'Erreur lors de la suppression', color: 'error' }
  } finally {
    deleting.value = false
    toDeleteId.value = null
  }
}

watch([filterStatus, filterCategory], () => {
  loadItems({ ...lastOptions, page: 1 })
})
</script>
