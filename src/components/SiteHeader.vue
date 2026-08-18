<template>
  <header class="landing-nav" style="justify-content: space-around;" :style="{flexWrap: uiStore.isMobile ? undefined : 'wrap'}">
    <RouterLink class="landing-brand" to="/" aria-label="Burning River Auto Glass home" @click="menuOpen = false">
      <span class="landing-brand__mark"><BurningRiverFadedEmblem /></span>
      <span class="landing-brand__text"><BurningRiverAutoGlassWordmark /></span>
    </RouterLink>
    <template v-if="uiStore.isMobile">
      <HamburgerButton v-model="menuOpen"/>
      <nav class="landing-nav__mobile" v-if="menuOpen" :class="{ 'landing-nav__menu--open': menuOpen }" aria-label="Mobile navigation">
        <RouterLink to="/" @click="menuOpen = false">Home</RouterLink>
        <RouterLink to="/services" @click="menuOpen = false">Services</RouterLink>
        <RouterLink to="/why-us" @click="menuOpen = false">Why us</RouterLink>
        <RouterLink to="/gallery" @click="menuOpen = false">Gallery</RouterLink>
        <RouterLink to="/contact" @click="menuOpen = false">Contact</RouterLink>
      </nav>
    </template>
    <template v-else>
      <nav ref="navRef" class="landing-nav__links" style="white-space: nowrap;" aria-label="Primary navigation">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/services">Services</RouterLink>
        <RouterLink to="/why-us">Why us</RouterLink>
        <RouterLink to="/gallery">Gallery</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
      </nav>
      <div v-if="uiStore.isDesktop" class="landing-extras" style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
        <a class="landing-nav__phone" href="tel:3303481455"><span>24/7</span> (330) 348-1455</a>
        <button style="height: 2rem;" class="replay-button" type="button" @click="replayImpact">Replay impact</button>
      </div>
    </template>  
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUIStore } from '../stores/uiStore'
import BurningRiverFadedEmblem from './BurningRiverFadedEmblem.vue'
import BurningRiverAutoGlassWordmark from './BurningRiverAutoGlassWordmark.vue'
import { ref } from "vue";
import HamburgerButton from './HamburgerButton.vue'

const uiStore = useUIStore();
const menuOpen = ref(false);

function replayImpact() {
  uiStore.animationPlayed = false;
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

</script>
