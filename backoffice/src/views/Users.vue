<template>
  <v-card color="surface" class="border">
    <v-card-title class="pa-6 d-flex align-center">
      <h2 class="text-h5 font-weight-bold text-white">Gestion des Utilisateurs</h2>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Rechercher"
        variant="solo"
        hide-details
        density="compact"
        class="max-width-300"
      ></v-text-field>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="users"
      :search="search"
      :loading="loading"
      theme="dark"
      class="bg-surface"
    >
      <template #item.is_admin="{ item }">
        <v-chip :color="item.is_admin ? 'primary' : 'grey'" size="small">
          {{ item.is_admin ? 'Admin' : 'Utilisateur' }}
        </v-chip>
      </template>
      
      <template #item.actions="{ item }">
        <v-btn
          icon="mdi-pencil"
          variant="text"
          color="primary"
          size="small"
          @click="openEditDialog(item)"
        ></v-btn>
        <v-btn
          icon="mdi-lock"
          variant="text"
          color="warning"
          size="small"
          @click="openPasswordDialog(item)"
        ></v-btn>
        <v-btn
          icon="mdi-delete"
          variant="text"
          color="error"
          size="small"
          @click="confirmDelete(item)"
        ></v-btn>
      </template>
    </v-data-table>

    <!-- Dialog d'édition -->
    <v-dialog v-model="editDialog" max-width="500">
      <v-card class="pa-6">
        <v-card-title class="text-h5 font-weight-bold mb-4">Modifier l'utilisateur</v-card-title>
        <v-form @submit.prevent="handleUpdate">
          <v-text-field v-model="form.username" label="Nom d'utilisateur" variant="outlined"></v-text-field>
          <v-text-field v-model="form.email" label="Email" variant="outlined"></v-text-field>
          <v-switch v-model="form.is_admin" label="Administrateur" color="primary"></v-switch>
          <v-switch v-model="form.is_active" label="Compte actif" color="primary"></v-switch>
          
          <v-card-actions class="pa-0 mt-4">
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="editDialog = false">Annuler</v-btn>
            <v-btn color="primary" type="submit" :loading="saving">Enregistrer</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Dialog de changement de mot de passe -->
    <v-dialog v-model="passwordDialog" max-width="500">
      <v-card class="pa-6">
        <v-card-title class="text-h5 font-weight-bold mb-4">
          Réinitialiser le mot de passe
        </v-card-title>
        <v-card-text class="pa-0 mb-4">
          Nouveau mot de passe pour <strong>{{ selectedUser?.username }}</strong>
        </v-card-text>
        <v-form @submit.prevent="handlePasswordUpdate">
          <v-text-field
            v-model="passwordForm.password"
            label="Nouveau mot de passe"
            variant="outlined"
            type="password"
            :rules="[v => !!v || 'Mot de passe requis', v => v.length >= 8 || 'Minimum 8 caractères']"
          ></v-text-field>

          <v-card-actions class="pa-0 mt-4">
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="passwordDialog = false">Annuler</v-btn>
            <v-btn color="warning" type="submit" :loading="savingPassword">Enregistrer</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="pa-4">
        <v-card-title>Confirmer la suppression</v-card-title>
        <v-card-text>Voulez-vous vraiment supprimer l'utilisateur {{ selectedUser?.username }} ?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="error" @click="handleDelete">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../stores/auth'

const users = ref([])
const loading = ref(false)
const saving = ref(false)
const search = ref('')
const deleteDialog = ref(false)
const editDialog = ref(false)
const passwordDialog = ref(false)
const selectedUser = ref(null)

const form = ref({
  username: '',
  email: '',
  is_admin: false,
  is_active: true
})

const passwordForm = ref({
  password: ''
})
const savingPassword = ref(false)

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nom d\'utilisateur', key: 'username' },
  { title: 'Email', key: 'email' },
  { title: 'Rôle', key: 'is_admin' },
  { title: 'Date création', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await api.get('/api/admin/users')
    users.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const openEditDialog = (user) => {
  selectedUser.value = user
  form.value = {
    username: user.username,
    email: user.email,
    is_admin: !!user.is_admin,
    is_active: !!user.is_active
  }
  editDialog.value = true
}

const openPasswordDialog = (user) => {
  selectedUser.value = user
  passwordForm.value.password = ''
  passwordDialog.value = true
}

const handlePasswordUpdate = async () => {
  if (!passwordForm.value.password || passwordForm.value.password.length < 8) return
  savingPassword.value = true
  try {
    await api.put(`/api/admin/users/${selectedUser.value.id}/password`, {
      password: passwordForm.value.password
    })
    passwordDialog.value = false
  } catch (error) {
    console.error(error)
  } finally {
    savingPassword.value = false
  }
}

const handleUpdate = async () => {
  saving.value = true
  try {
    await api.put(`/api/admin/users/${selectedUser.value.id}`, form.value)
    await fetchUsers()
    editDialog.value = false
  } catch (error) {
    console.error(error)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (user) => {
  selectedUser.value = user
  deleteDialog.value = true
}

const handleDelete = async () => {
  try {
    await api.delete(`/api/admin/users/${selectedUser.value.id}`)
    await fetchUsers()
    deleteDialog.value = false
  } catch (error) {
    console.error(error)
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
.max-width-300 {
  max-width: 300px;
}
</style>
