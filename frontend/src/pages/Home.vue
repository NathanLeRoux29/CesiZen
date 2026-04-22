<template>
  <v-container class="home-page">
    <!-- Section Article du Jour -->
    <section class="mb-12">
      <Title :message="'Article du jour'" />
      <v-row class="mt-4">
        <v-col cols="12">
          <ArticleCard 
            v-if="articleOfTheDay"
            :article="articleOfTheDay" 
            :large="true"
          />
          <v-skeleton-loader v-else type="card" />
        </v-col>
      </v-row>
    </section>

    <!-- Section Articles Suggérés -->
    <section class="mb-12">
      <div class="d-flex align-center justify-space-between mb-4">
        <Title :message="'Pourrait vous intéresser'" />
      </div>
      <v-row>
        <v-col 
          v-for="article in suggestedArticles" 
          :key="article.id"
          cols="12"
          md="4"
        >
          <ArticleCard :article="article" />
        </v-col>
      </v-row>
    </section>

    <!-- Bouton vers le Catalogue -->
    <section class="text-center py-8">
      <v-btn
        color="primary"
        size="x-large"
        rounded="xl"
        to="/Catalogue"
        class="catalogue-btn"
      >
        <v-icon start>mdi-book-open-page-variant</v-icon>
        Découvrir le catalogue
      </v-btn>
    </section>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Title from '@/components/Title.vue'
import ArticleCard from '@/components/ArticleCard.vue'

// État
const articleOfTheDay = ref(null)
const suggestedArticles = ref([])
const isLoading = ref(true)

// Chargement des articles depuis l'API
const fetchHomeContent = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/articles`)
    const allArticles = response.data.map(a => ({
      ...a,
      image: a.media_url,
      description: a.summary
    }))
    
    if (allArticles.length > 0) {
      // Pour l'exercice: on prend le premier comme article du jour
      articleOfTheDay.value = allArticles[0]
      // Et les 3 suivants comme suggestions
      suggestedArticles.value = allArticles.slice(1, 4)
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'accueil:', error)
  } finally {
    isLoading.value = false
  }
}

// Mise à jour au montage
onMounted(fetchHomeContent)
</script>

<style scoped>
.home-page {
  max-width: 1400px;
  margin: 0 auto;
}

.catalogue-btn {
  font-weight: bold;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.catalogue-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(4, 255, 146, 0.3);
}
</style>