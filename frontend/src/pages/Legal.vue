<template>
  <v-container class="legal-page">
    <Title :message="'Mentions Légales'" />

    <div class="legal-card mt-6 pa-6">
      <div class="legal-content">

        <h2 class="text-h5 font-weight-bold text-primary mb-4">1. Informations sur l'éditeur</h2>
        <v-divider class="mb-6 opacity-10"></v-divider>
        <p class="text-body-1 mb-6">
          <strong>Nom du site :</strong> CesiZen<br>
          <strong>Éditeur :</strong> CesiZen SAS<br>
          <strong>Siège social :</strong> 123 Rue de la Santé Mentale, 75001 Paris, France<br>
          <strong>Téléphone :</strong> +33 1 23 45 67 89<br>
          <strong>Email :</strong> contact@cesizen.fr<br>
          <strong>SIRET :</strong> 123 456 789 00012<br>
        </p>

        <h2 class="text-h5 font-weight-bold text-primary mb-4 mt-8">2. Directeur de publication</h2>
        <v-divider class="mb-6 opacity-10"></v-divider>
        <p class="text-body-1 mb-6">
          Le directeur de publication est M. Jean Dupont, Président de CesiZen SAS.
        </p>

        <h2 class="text-h5 font-weight-bold text-primary mb-4 mt-8">3. Hébergement</h2>
        <v-divider class="mb-6 opacity-10"></v-divider>
        <p class="text-body-1 mb-6">
          Le site CesiZen est hébergé par la société OVH SAS, située au 2 Rue Kellermann, 59100 Roubaix, France.
        </p>

        <h2 class="text-h5 font-weight-bold text-primary mb-4 mt-8">4. Propriété intellectuelle</h2>
        <v-divider class="mb-6 opacity-10"></v-divider>
        <p class="text-body-1 mb-6">
          L'ensemble des contenus présents sur le site CesiZen (textes, images, vidéos, logos) sont protégés par le droit d'auteur.
          Toute reproduction, même partielle, est interdite sans l'autorisation préalable de CesiZen SAS.
        </p>

        <h2 class="text-h5 font-weight-bold text-primary mb-4 mt-8">5. Protection des données personnelles</h2>
        <v-divider class="mb-6 opacity-10"></v-divider>
        <p class="text-body-1 mb-6">
          Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès,
          de rectification et de suppression de vos données personnelles.
        </p>
        <p class="text-body-1 mb-6">
          <strong>Données collectées :</strong> nom d'utilisateur, adresse email, mot de passe (hashé).<br>
          <strong>Finalité :</strong> fourniture du service CesiZen et amélioration de l'expérience utilisateur.
        </p>
        <p class="text-body-1 mb-6">
          <strong>Suppression de compte :</strong> Vous pouvez supprimer votre compte à tout moment depuis la page
          "Mon Compte". Lors de la suppression, l'ensemble de vos données personnelles (nom d'utilisateur, email, mot de passe)
          est définitivement supprimé de nos serveurs. Cette action est irréversible et immédiate.
        </p>

        <h2 class="text-h5 font-weight-bold text-primary mb-4 mt-8">6. Cookies</h2>
        <v-divider class="mb-6 opacity-10"></v-divider>
        <p class="text-body-1 mb-6">
          Le site CesiZen utilise des cookies uniquement pour le fonctionnement technique et l'authentification.
          Ces cookies ne nécessitent pas de consentement préalable car strictement nécessaires au service.
        </p>

        <h2 class="text-h5 font-weight-bold text-primary mb-4 mt-8">7. Limitation de responsabilité</h2>
        <v-divider class="mb-6 opacity-10"></v-divider>
        <p class="text-body-1 mb-6">
          Les informations présentes sur ce site sont fournis à titre indicatif. CesiZen ne saurait être tenue responsable
          des dommages résultant de l'utilisation du site.
        </p>

        <h2 class="text-h5 font-weight-bold text-primary mb-4 mt-8">8. Droit applicable</h2>
        <v-divider class="mb-6 opacity-10"></v-divider>
        <p class="text-body-1 mb-8">
          Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français
          seront seuls compétents.
        </p>

        <v-alert type="info" variant="tonal" class="mt-6">
          <strong>Dernière mise à jour :</strong> 23 avril 2026
        </v-alert>

      </div>
    </div>
  </v-container>
</template>

<script setup>
import Title from '@/components/Title.vue'
</script>

<style scoped>
.legal-page {
  max-width: 900px;
  margin: 0 auto;
}

.legal-card {
  border-radius: 8px;
}

.legal-content {
  color: #E2FBFF;
}

.legal-content h2 {
  color: #04FF92 !important;
}
</style>