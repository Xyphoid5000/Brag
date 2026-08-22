<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import GlassImpactBackground from './components/GlassImpactBackground.vue'
import Layout from './components/Layout.vue'
import PageTransition from "./components/PageTransition.vue"

const showSite = ref(false)
</script>

<template>
  <GlassImpactBackground @ready="showSite = true" />

  <!-- Keep the site mounted so GSAP/Flip can measure the real header destination. -->
  <Layout class="site-shell" :class="{ 'site-shell--hidden': !showSite }">
      <RouterView />
  </Layout>

  <Teleport to="body">
    <PageTransition ref="transition" />
  </Teleport>
</template>
