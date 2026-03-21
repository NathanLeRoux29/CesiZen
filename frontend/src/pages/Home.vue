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
import Title from '@/components/Title.vue'
import ArticleCard from '@/components/ArticleCard.vue'
import { getArticleOfTheDay, getSuggestedArticles, articles } from '@/data/articles.js'

// Données - initialisées directement pour éviter null
const articleOfTheDay = ref(articles[0])
const suggestedArticles = ref(getSuggestedArticles(articles[0]?.id))

// Mise à jour au montage (pour avoir l'article du jour)
onMounted(() => {
  articleOfTheDay.value = getArticleOfTheDay()
  suggestedArticles.value = getSuggestedArticles(articleOfTheDay.value?.id)
})
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