<template>
  <v-container class="catalogue-page">
    <div class="catalogue-header animate-fade-in mb-8">
      <Title :message="'Catalogue de détente'" />
      <p class="text-h6 text-info opacity-70">
        Trouvez l'article qui correspond à votre état d'esprit actuel
      </p>
    </div>

    <!-- Section Recherche et Filtres -->
    <div class="catalogue-controls animate-slide-up mb-12">
      <!-- Barre de recherche Premium -->
      <div class="glass-search-wrapper mb-6">
        <v-text-field
          v-model="searchQuery"
          placeholder="Rechercher un article, une technique..."
          prepend-inner-icon="mdi-magnify"
          variant="plain"
          color="primary"
          hide-details
          clearable
          class="premium-search-field"
        ></v-text-field>
      </div>

      <!-- Filtres par catégorie Glassmorphism -->
      <div class="glass-filters-wrapper">
        <v-chip-group
          v-model="selectedCategory"
          selected-class="active-category"
          mandatory
          class="premium-chip-group"
        >
          <v-chip
            v-for="category in categories"
            :key="category"
            :value="category"
            variant="tonal"
            class="premium-chip px-6"
          >
            {{ category }}
          </v-chip>
        </v-chip-group>
      </div>
    </div>

    <!-- Grille d'articles -->
    <div class="articles-grid animate-fade-in">
      <v-row>
        <v-col
          v-for="article in displayedArticles"
          :key="article.id"
          cols="12"
          sm="6"
          md="4"
          class="mb-6"
        >
          <ArticleCard :article="article" />
        </v-col>
      </v-row>
    </div>

    <!-- Message si aucun article -->
    <v-fade-transition>
      <div v-if="displayedArticles.length === 0" class="text-center py-16 empty-state animate-fade-in">
        <v-icon size="80" color="primary" class="mb-4 opacity-20">mdi-magnify-close</v-icon>
        <h3 class="text-h5 text-white mb-2">Aucun résultat</h3>
        <p class="text-info opacity-70">Essayez de modifier vos filtres ou votre recherche</p>
        <v-btn
          variant="text"
          color="primary"
          class="mt-4"
          @click="resetFilters"
        >
          Réinitialiser tout
        </v-btn>
      </div>
    </v-fade-transition>

    <!-- Bouton charger plus -->
    <div v-if="hasMore" class="text-center mt-12 mb-16">
      <v-btn
        color="primary"
        size="x-large"
        variant="elevated"
        rounded="xl"
        :loading="isLoading"
        @click="loadMore"
        class="load-more-btn"
      >
        <v-icon start>mdi-chevron-down</v-icon>
        DÉCOUVRIR PLUS D'ARTICLES
      </v-btn>
    </div>

    <!-- Indicateur de fin de catalogue -->
    <div v-else-if="displayedArticles.length > 0" class="text-center mt-12 mb-16">
      <v-divider class="mb-4 opacity-10"></v-divider>
      <p class="text-info opacity-50 text-uppercase letter-spacing-1 text-caption">
        Vous avez exploré tout le catalogue
      </p>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import Title from '@/components/Title.vue'
import ArticleCard from '@/components/ArticleCard.vue'

// Catégories
const categories = ['Tous', 'Méditation', 'Yoga', 'Respiration', 'Sommeil', 'Nutrition', 'Nature', 'Émotions', 'Sport', 'Maison', 'Social', 'Technologie', 'Psychologie']

// État
const allArticles = ref([])
const selectedCategory = ref('Tous')
const searchQuery = ref('')
const currentPage = ref(1)
const articlesPerPage = 6
const isLoading = ref(false)

// Chargement des articles depuis l'API
const fetchArticles = async () => {
  isLoading.value = true
  try {
    const response = await axios.get('http://localhost:3001/api/articles')
    // On mappe les champs pour correspondre à ce que le front attendait des mocks
    allArticles.value = response.data.map(a => ({
      ...a,
      image: a.media_url,
      description: a.summary,
      date: a.created_at ? a.created_at.split('T')[0] : ''
    }))
  } catch (error) {
    console.error('Erreur lors du chargement des articles:', error)
  } finally {
    isLoading.value = false
  }
}

// Articles filtrés par catégorie et recherche
const filteredArticles = computed(() => {
  let result = allArticles.value
  
  // Filtre par catégorie
  if (selectedCategory.value !== 'Tous') {
    result = result.filter(article => article.category === selectedCategory.value)
  }
  
  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(article => 
      article.title.toLowerCase().includes(query) ||
      (article.description && article.description.toLowerCase().includes(query)) ||
      article.category.toLowerCase().includes(query)
    )
  }
  
  return result
})

// Articles affichés (avec pagination)
const displayedArticles = computed(() => {
  return filteredArticles.value.slice(0, currentPage.value * articlesPerPage)
})

// Vérifie s'il y a plus d'articles à charger
const hasMore = computed(() => {
  return displayedArticles.value.length < filteredArticles.value.length
})

// Charger plus d'articles
const loadMore = () => {
  isLoading.value = true
  
  // Simulation d'un délai de chargement pour l'UX
  setTimeout(() => {
    currentPage.value++
    isLoading.value = false
  }, 300)
}

const resetFilters = () => {
  selectedCategory.value = 'Tous'
  searchQuery.value = ''
}

// Réinitialiser la pagination quand la catégorie ou la recherche change
watch([selectedCategory, searchQuery], () => {
  currentPage.value = 1
})

// Chargement initial
onMounted(fetchArticles)
</script>

<style scoped>
.catalogue-page {
  max-width: 1400px;
  margin: 0 auto;
  padding-top: 40px;
}

.catalogue-header {
  text-align: center;
}

/* Glassmorphism Controls */
.glass-search-wrapper {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 0 16px;
  transition: all 0.3s ease;
  max-width: 700px;
  margin: 0 auto;
  min-height: 52px;
  display: flex;
  align-items: center;
}

.glass-search-wrapper:focus-within {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(4, 255, 146, 0.4);
  box-shadow: 0 0 20px rgba(4, 255, 146, 0.1);
}

.premium-search-field :deep(.v-field__input) {
  color: #E2FBFF !important;
  font-size: 1.1rem;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  min-height: 52px !important;
}

.premium-search-field :deep(.v-field__prepend-inner) {
  padding-top: 0 !important;
  align-items: center !important;
}

.glass-filters-wrapper {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  padding: 10px;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
}

.glass-filters-wrapper::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

/* Chips Premium */
.premium-chip {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #E2FBFF !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.premium-chip:hover {
  background: rgba(4, 255, 146, 0.1) !important;
  border-color: rgba(4, 255, 146, 0.3) !important;
}

.active-category {
  background: #04FF92 !important;
  color: #1D1143 !important;
  font-weight: bold !important;
  box-shadow: 0 4px 15px rgba(4, 255, 146, 0.4) !important;
  transform: scale(1.05);
}

/* Load More Button */
.load-more-btn {
  letter-spacing: 2px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(4, 255, 146, 0.3) !important;
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-slide-up {
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.letter-spacing-1 {
  letter-spacing: 1px;
}

.opacity-20 { opacity: 0.2; }
.opacity-10 { opacity: 0.1; }
.opacity-70 { opacity: 0.7; }
.opacity-50 { opacity: 0.5; }

@media (max-width: 600px) {
  .catalogue-page {
    padding-top: 20px;
  }
}
</style>