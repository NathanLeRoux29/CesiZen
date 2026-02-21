<template>
  <v-container>
    <Title :message=pageTitle />
    <SubTitle :message="pageSubtitle"/>
  </v-container>
</template>

<script setup>
  
  const pageTitle = "Blip";
  const pageSubtitle = "Bloup";

</script>
