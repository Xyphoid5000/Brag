<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import GlassImpactBackground from './components/GlassImpactBackground.vue'
import SiteHeader from './components/SiteHeader.vue'
import { useUIStore } from './stores/uiStore'

const uiStore = useUIStore()
const showSite = ref(false)

onMounted(() => uiStore.init())

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
