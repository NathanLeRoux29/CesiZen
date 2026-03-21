<template>
  <v-card
    class="article-card cursor-pointer"
    :class="{ 'article-card--large': large }"
    @click="goToArticle"
    elevation="0"
    rounded="md"
  >
    <v-img
      :src="article.image"
      :height="large ? 280 : 160"
      cover
      class="article-card__image"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>
      </template>
      
      <div class="article-card__overlay">
        <v-chip
          size="small"
          color="primary"
          class="article-card__category"
        >
          {{ article.category }}
        </v-chip>
      </div>
    </v-img>

    <v-card-text class="article-card__content pt-3">
      <h3 
        class="article-card__title text-h6 font-weight-bold mb-2" 
        :class="{ 'text-h5': large }"
      >
        {{ article.title }}
      </h3>
      <p class="article-card__description text-body-2 mb-0">
        {{ article.description }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  large: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const goToArticle = () => {
  router.push(`/article/${props.article.id}`)
}
</script>

<style scoped>
.article-card {
  background: #E2FBFF;
  border: 1px solid rgba(4, 255, 146, 0.2);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.article-card:hover {
  transform: translateY(-4px);
  border-color: rgba(4, 255, 146, 0.5);
  box-shadow: 0 8px 24px rgba(4, 255, 146, 0.2);
}

.article-card--large {
  border-color: rgba(4, 255, 146, 0.3);
}

.article-card__image {
  position: relative;
}

.article-card__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%);
}

.article-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.85);
  border-top: 1px solid rgba(4, 255, 146, 0.2);
}

.article-card__title {
  color: #1D1143;
  line-height: 1.3;
}

.article-card__description {
  color: #072392;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card--large .article-card__description {
  -webkit-line-clamp: 3;
}
</style>
