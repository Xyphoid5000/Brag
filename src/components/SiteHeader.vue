<template>
  <header class="landing-nav">
    <RouterLink class="landing-brand" to="/" aria-label="Burning River Auto Glass home">
      <span class="landing-brand__mark">BR</span>
      <span><strong>Burning River</strong><small>Auto Glass</small></span>
    </RouterLink>
    <nav class="landing-nav__links" aria-label="Primary navigation">
      <RouterLink to="/services">Services</RouterLink>
      <RouterLink to="/why-us">Why us</RouterLink>
      <RouterLink to="/gallery">Gallery</RouterLink>
      <RouterLink to="/contact">Contact</RouterLink>
    </nav>
    <a class="landing-nav__phone" href="tel:3303481455"><span>24/7</span> (330) 348-1455</a>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
