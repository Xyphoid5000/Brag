<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  before: string
  after: string
  title: string
}>()

const showingAfter = ref(false)
</script>

<template>
  <figure class="before-after-card" :class="{ 'before-after-card--after': showingAfter }">
    <button class="before-after-card__image" type="button" :aria-label="`Show ${showingAfter ? 'before' : 'after'} image for ${title}`" @click="showingAfter = !showingAfter">
      <img :src="showingAfter ? after : before" :alt="`${title} ${showingAfter ? 'after' : 'before'} view`" />
      <span class="before-after-card__state">{{ showingAfter ? 'After' : 'Before' }}</span>
      <span class="before-after-card__toggle">{{ showingAfter ? 'View before' : 'View after' }} <b>-></b></span>
    </button>
    <figcaption><span>BEFORE / AFTER</span><strong>{{ title }}</strong><small>Tap the image to compare the work.</small></figcaption>
  </figure>
</template>
