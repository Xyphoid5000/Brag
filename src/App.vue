<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import GlassImpactBackground from './components/GlassImpactBackground.vue'
import SiteHeader from './components/SiteHeader.vue'
import { useUIStore } from './stores/uiStore'
import PageTransition from "./components/PageTransition.vue"
import { registerPageTransition } from "./composables/usePageTransition"

const transition = ref<InstanceType<typeof PageTransition>>()
const uiStore = useUIStore()
const showSite = ref(false)

onMounted(() => {
uiStore.init();
 if (transition.value) {
    registerPageTransition(transition.value)
  }
})

</script>

<template>
  <GlassImpactBackground @ready="showSite = true" />

  <!-- Keep the site mounted so GSAP/Flip can measure the real header destination. -->
  <div class="site-shell" :class="{ 'site-shell--hidden': !showSite }">
    <SiteHeader v-model="showSite" />
    <PageTransition ref="transition" />
    <main class="site-main">
      <RouterView />
    </main>
  </div>
</template>
