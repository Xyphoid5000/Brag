<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import GlassImpactBackground from './components/GlassImpactBackground.vue'
import SiteHeader from './components/SiteHeader.vue'

const showSite = ref(false)
</script>

<template>
  <GlassImpactBackground @ready="showSite = true" />

  <!-- Keep the site mounted so GSAP/Flip can measure the real header destination. -->
  <div class="site-shell" :class="{ 'site-shell--hidden': !showSite }">
    <SiteHeader />
    <main class="site-main">
      <RouterView />
    </main>
  </div>
</template>
