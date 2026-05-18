<template>
  <v-container class="faq-page">
    <Title :message="'Questions Fréquentes'" />

    <v-expansion-panels class="mt-6" variant="accordion" color="primary">
      <v-expansion-panel
        v-for="(faq, index) in faqs"
        :key="index"
        bg-color="transparent"
        class="faq-panel"
      >
        <v-expansion-panel-title class="faq-question">
          {{ faq.question }}
        </v-expansion-panel-title>
        <v-expansion-panel-text class="faq-answer">
          {{ faq.answer }}
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card class="mt-12 pa-6" color="transparent" elevation="0">
      <div class="text-center">
        <h3 class="text-h6 text-primary mb-4">Vous n'avez pas trouvé votre réponse ?</h3>
        <p class="text-body-2 mb-6 opacity-70">
          Notre équipe est disponible pour vous aider.
        </p>
        <v-btn
          color="primary"
          variant="outlined"
          to="/Account"
        >
          Contacter le support
        </v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import Title from '@/components/Title.vue'

const faqs = [
  {
    question: 'Comment créer un compte CesiZen ?',
    answer: 'Cliquez sur "Connexion" dans le menu, puis sur "S\'inscrire". Remplissez votre nom d\'utilisateur, votre adresse email et votre mot de passe. Votre compte sera créé instantanément.'
  },
  {
    question: 'Comment réinitialiser mon mot de passe ?',
    answer: 'Pour des raisons de sécurité, la réinitialisation de mot de passe sera bientôt disponible directement depuis l\'application. Contactez-nous à contact@cesizen.fr pour toute assistance.'
  },
  {
    question: 'Comment supprimer mon compte ?',
    answer: 'Connectez-vous à votre compte, rendez-vous dans "Mon Compte" et cliquez sur "Supprimer mon compte". Cette action est irréversible et supprimera définitivement toutes vos données personnelles.'
  },
  {
    question: 'Quelles données sont collectées par CesiZen ?',
    answer: 'Nous collectons uniquement les données nécessaires au fonctionnement du service : votre nom d\'utilisateur, votre adresse email et votre mot de passe (hashé). Aucune donnée de navigation ou cookies de tracking ne sont utilisés.'
  },
  {
    question: 'Mes données sont-elles sécuriséés ?',
    answer: 'Oui. Votre mot de passe est stocké de manière sécurisée avec un hash bcrypt. Toutes les communications avec nos serveurs sont chiffrées. Vos données ne sont jamais vendues à des tiers.'
  },
  {
    question: 'Comment fonctionne le catalogue d\'articles ?',
    answer: 'Le catalogue CesiZen propose des articles et exercices de bien-être mental. Vous pouvez parcourir les catégories, consulter les articles et les ajouter à vos favoris pour un accès rapide.'
  },
  {
    question: 'Qu\'est-ce que les exercises de respiration ?',
    answer: 'Les exercises de respiration sont des techniques guidées pour vous aider à vous détendre et gérer le stress. Vous pouvez les pratiquer à tout moment et les ajouter à vos favoris.'
  },
  {
    question: 'Comment utiliser le diagnostic émotionnel ?',
    answer: 'Le diagnostic émotionnel vous permet d\'identifier vos émotions actuelles et d\'obtenir des recommandations personnalisées. Répondez aux questions du formulaire pour recevoir des conseils adaptés.'
  },
  {
    question: 'CesiZen est-il gratuit ?',
    answer: 'Oui, CesiZen est actuellement en version beta et accessible gratuitement. Les fonctionnalités de base包括 la consultation d\'articles, les exercises de respiration et le suivi émotionnel.'
  },
  {
    question: 'Comment contacter le support ?',
    answer: 'Vous pouvez nous contacter à tout moment via la page "Mon Compte" ou par email à contact@cesizen.fr. Nous répondons généralement sous 24 à 48 heures.'
  }
]
</script>

<style scoped>
.faq-page {
  max-width: 900px;
  margin: 0 auto;
}

.faq-panel {
  margin-bottom: 8px;
  border-radius: 8px !important;
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(4, 255, 146, 0.2);
}

.faq-panel:hover {
  border-color: rgba(4, 255, 146, 0.5);
}

.faq-question {
  color: #E2FBFF !important;
  font-weight: 600;
  background: transparent !important;
}

.faq-question:hover {
  background: rgba(4, 255, 146, 0.05) !important;
}

.faq-question :deep(.v-expansion-panel-title__overlay) {
  background: transparent !important;
}

.faq-answer {
  color: #E2FBFF !important;
  opacity: 0.85;
  padding-top: 16px;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0 16px 16px 16px;
}
</style>