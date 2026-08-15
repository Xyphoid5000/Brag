<template>
  <header class="landing-nav">
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
      <nav ref="navRef" class="landing-nav__links" aria-label="Primary navigation">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/services">Services</RouterLink>
        <RouterLink to="/why-us">Why us</RouterLink>
        <RouterLink to="/gallery">Gallery</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
        <div ref="underlineRef" class="underline"></div>
      </nav>
      <div class="landing-extras" style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
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
import { ref, nextTick, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import HamburgerButton from './HamburgerButton.vue'
import gsap from "gsap";

const uiStore = useUIStore();

const route = useRoute();

const navRef = ref<HTMLElement | null>(null);
const underlineRef = ref<HTMLDivElement | null>(null);

const moveUnderline = () => {
  if (!navRef.value || !underlineRef.value) return;

  const active = navRef.value.querySelector(
    ".router-link-active"
  ) as HTMLElement | null;

  if (!active) return;

  gsap.to(underlineRef.value, {
    x: active.offsetLeft,
    width: active.offsetWidth,
    duration: 0.35,
    ease: "power2.out",
  });
};

onMounted(async () => {
  await nextTick();
  moveUnderline();
});

watch(
  () => route.fullPath,
  async () => {
    await nextTick();
    moveUnderline();
  }
);

const menuOpen = ref(false);

function replayImpact() {
  uiStore.animationPlayed = false;
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

</script>
