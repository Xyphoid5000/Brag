<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref } from 'vue'
import GlassImpactBackground from './components/GlassImpactBackground.vue'
import SiteHeader from './components/SiteHeader.vue'

const showSite = ref<boolean>(false);
</script>

<template>
  <GlassImpactBackground @ready="showSite = true"/>
  <template v-if="showSite">
    <SiteHeader />
    <RouterView />  
  </template>
</template>
