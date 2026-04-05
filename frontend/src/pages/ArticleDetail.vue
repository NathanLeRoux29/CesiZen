<template>
  <v-container class="article-detail-page px-0 pt-0" fluid>
    <!-- Bouton retour flottant -->
    <v-btn
      icon="mdi-arrow-left"
      color="white"
      class="back-btn-float"
      elevation="4"
      @click="goBack"
    ></v-btn>

    <!-- Loading state -->
    <v-container v-if="!article" class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="auto" class="text-center">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <p class="mt-4 text-medium-emphasis">Chargement de l'article...</p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Contenu de l'article -->
    <div v-else class="animate-fade-in">
      <!-- Hero Section Immersive -->
      <section class="article-detail__hero-section">
        <v-img
          :src="article.image"
          height="60vh"
          cover
          class="article-detail__hero-image"
        >
          <div class="article-detail__hero-overlay fill-height d-flex flex-column justify-end">
            <v-container class="content-width">
              <v-chip
                color="primary"
                class="mb-4 font-weight-bold"
                size="large"
                variant="flat"
              >
                <v-icon start size="small">mdi-folder</v-icon>
                {{ article.category }}
              </v-chip>

                <div class="d-flex align-center justify-space-between mb-6">
                  <h1 class="article-detail__title text-h2 text-sm-h1 font-weight-bold text-white mb-0">
                    {{ article.title }}
                  </h1>
                  
                  <!-- Bouton Favori -->
                  <v-btn
                    v-if="userStore.isLoggedIn"
                    :icon="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
                    :color="isFavorite ? 'primary' : 'white'"
                    variant="tonal"
                    size="large"
                    class="ml-4 favorite-btn"
                    @click="toggleFavorite"
                    :loading="isFavoriteLoading"
                  ></v-btn>
                </div>

              <div class="article-detail__meta d-flex align-center flex-wrap gap-6 mb-12">
                <div class="d-flex align-center">
                  <v-avatar size="40" class="mr-3 author-avatar">
                    <span class="text-white font-weight-bold">{{ authorInitials }}</span>
                  </v-avatar>
                  <span class="text-h6 text-white">{{ article.author || 'Équipe CesiZen' }}</span>
                </div>
                <div class="d-flex align-center text-white-70">
                  <v-icon class="mr-2">mdi-calendar-range</v-icon>
                  <span class="text-body-1">{{ formattedDate }}</span>
                </div>
              </div>
            </v-container>
          </div>
        </v-img>
      </section>

      <!-- Corps de l'article avec effet glassmorphism -->
      <v-container class="content-width article-body-container pt-0">
        <v-card class="article-detail__glass-card pa-8 pa-md-12" rounded="xl">
          <div class="article-detail__text-content">
            <p class="text-h6 font-weight-regular line-height-relaxed text-info mb-10">
              {{ article.content }}
            </p>

            <!-- Citation / Description -->
            <v-card
              class="article-detail__highlight-box pa-8 mb-0"
              variant="text"
            >
              <div class="d-flex align-start quote-container">
                <v-icon size="48" color="primary" class="mr-4 mt-n2">mdi-format-quote-open</v-icon>
                <p class="text-h5 font-italic text-primary line-height-relaxed mb-0">
                  {{ article.description }}
                </p>
              </div>
            </v-card>
          </div>
        </v-card>

        <!-- Articles suggérés -->
        <section v-if="suggestedArticles.length > 0" class="mt-16 pb-16">
          <div class="d-flex align-center mb-8">
            <h2 class="text-h4 font-weight-bold text-white">Continuer la lecture</h2>
            <v-divider class="ml-6 border-opacity-25"></v-divider>
          </div>
          
          <v-row>
            <v-col
              v-for="suggested in suggestedArticles"
              :key="suggested.id"
              cols="12"
              sm="6"
              md="4"
            >
              <ArticleCard :article="suggested" />
            </v-col>
          </v-row>
        </section>
      </v-container>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import ArticleCard from '@/components/ArticleCard.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// État
const article = ref(null)
const suggestedArticles = ref([])
const isFavorite = ref(false)
const isFavoriteLoading = ref(false)

// Computed properties
const authorInitials = computed(() => {
  const author = article.value?.author || 'Équipe CesiZen'
  return author.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const formattedDate = computed(() => {
  if (!article.value?.date) return ''
  const date = new Date(article.value.date)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Méthodes
const goBack = () => {
  router.push('/Catalogue')
}

const loadArticle = async () => {
  const articleId = route.params.id
  try {
    const response = await axios.get(`http://localhost:3001/api/articles/${articleId}`)
    const rawArticle = response.data
    
    article.value = {
      ...rawArticle,
      image: rawArticle.media_url,
      description: rawArticle.summary,
      date: rawArticle.created_at ? rawArticle.created_at.split('T')[0] : ''
    }
    
    // Charger aussi les suggestions depuis l'API
    const suggestionsResponse = await axios.get('http://localhost:3001/api/articles')
    suggestedArticles.value = suggestionsResponse.data
      .filter(a => a.id !== article.value.id)
      .slice(0, 3)
      .map(a => ({
        ...a,
        image: a.media_url,
        description: a.summary
      }))

    if (userStore.isLoggedIn) {
      checkFavoriteStatus()
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'article:', error)
  }
}

const checkFavoriteStatus = async () => {
  try {
    const response = await fetch(`http://localhost:3001/api/favorites/articles/check?userId=${userStore.user.id}&articleId=${article.value.id}`)
    const data = await response.json()
    isFavorite.value = data.isFavorite
  } catch (e) {
    console.error('Erreur check favorite:', e)
  }
}

const toggleFavorite = async () => {
  if (isFavoriteLoading.value) return
  isFavoriteLoading.value = true
  
  const method = isFavorite.value ? 'DELETE' : 'POST'
  const url = `http://localhost:3001/api/favorites/articles${method === 'DELETE' ? `?userId=${userStore.user.id}&articleId=${article.value.id}` : ''}`
  
  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: method === 'POST' ? JSON.stringify({ userId: userStore.user.id, articleId: article.value.id }) : null
    })
    
    if (response.ok) {
      isFavorite.value = !isFavorite.value
    }
  } catch (e) {
    console.error('Erreur toggle favorite:', e)
  } finally {
    isFavoriteLoading.value = false
  }
}

// Watchers
watch(() => route.params.id, () => {
  loadArticle()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// Lifecycle
onMounted(() => {
  loadArticle()
})
</script>

<style scoped>
.article-detail-page {
  background: #1D1143;
  min-height: 100vh;
}

.content-width {
  max-width: 1100px !important;
  margin: 0 auto;
}

/* Bouton retour flottant */
.back-btn-float {
  position: fixed;
  top: 80px;
  left: 20px;
  z-index: 100;
  background: #04FF92 !important;
  color: #1D1143 !important;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(4, 255, 146, 0.4) !important;
}

.back-btn-float:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(4, 255, 146, 0.6) !important;
}

/* Hero Section */
.article-detail__hero-image {
  position: relative;
}

.article-detail__hero-overlay {
  background: linear-gradient(to bottom, rgba(29, 17, 67, 0) 0%, rgba(29, 17, 67, 0.4) 40%, rgba(29, 17, 67, 1) 100%);
  padding-bottom: 80px;
}

.article-detail__title {
  text-shadow: 0 4px 12px rgba(0,0,0,0.5);
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.author-avatar {
  background: linear-gradient(135deg, #04FF92 0%, #00B8D4 100%);
  box-shadow: 0 4px 12px rgba(4, 255, 146, 0.3);
}

.favorite-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  transition: all 0.3s ease;
}

.favorite-btn:hover {
  transform: scale(1.1);
  background: rgba(4, 255, 146, 0.2) !important;
  border-color: #04FF92 !important;
}

.text-white-70 {
  color: rgba(255, 255, 255, 0.7);
}

/* Glassmorphism Card */
.article-body-container {
  margin-top: -60px;
  position: relative;
  z-index: 2;
}

.article-detail__glass-card {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.article-detail__text-content {
  color: #E2FBFF;
}

.line-height-relaxed {
  line-height: 1.8;
}

/* Highlight Box */
.article-detail__highlight-box {
  background: rgba(4, 255, 146, 0.05) !important;
  border-left: 4px solid #04FF92 !important;
  border-radius: 4px 16px 16px 4px !important;
}

.quote-container {
  opacity: 0.9;
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.gap-6 {
  gap: 24px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .article-detail__hero-overlay {
    padding-bottom: 40px;
  }
  
  .article-body-container {
    margin-top: -20px;
  }

  .back-btn-float {
    top: 70px;
    left: 10px;
  }
}
</style>