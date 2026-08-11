<template>
  <header class="landing-nav">
    <RouterLink class="landing-brand" to="/" aria-label="Burning River Auto Glass home">
      <span class="landing-brand__mark"><BurningRiverEmblem /></span>
      <span><strong>Burning River</strong><small>Auto Glass</small></span>
    </RouterLink>
    <nav class="landing-nav__links" aria-label="Primary navigation">
      <RouterLink to="/services">Services</RouterLink>
      <RouterLink to="/why-us">Why us</RouterLink>
      <RouterLink to="/gallery">Gallery</RouterLink>
      <RouterLink to="/contact">Contact</RouterLink>
    </nav>
    <button class="landing-nav__menu-toggle" type="button" aria-label="Toggle menu" @click="menuOpen = !menuOpen">
      <span class="landing-nav__menu-toggle-bar"></span>
      <span class="landing-nav__menu-toggle-bar"></span>
      <span class="landing-nav__menu-toggle-bar"></span>
    </button>
    <nav class="landing-nav__menu" :class="{ 'landing-nav__menu--open': menuOpen }" aria-label="Mobile navigation">
      <RouterLink to="/" @click="menuOpen = false">Home</RouterLink>
      <RouterLink to="/services" @click="menuOpen = false">Services</RouterLink>
      <RouterLink to="/why-us" @click="menuOpen = false">Why us</RouterLink>
      <RouterLink to="/gallery" @click="menuOpen = false">Gallery</RouterLink>
      <RouterLink to="/contact" @click="menuOpen = false">Contact</RouterLink>
    </nav>
    <a class="landing-nav__phone" href="tel:3303481455"><span>24/7</span> (330) 348-1455</a>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import BurningRiverEmblem from './BurningRiverEmblem.vue'

const menuOpen = ref(false);
</script>
