<script setup lang="ts">
import { ref } from "vue"
import glass01 from "../assets/Glass01.png"
import glass02 from "../assets/Glass02.png"
import glass03 from "../assets/Glass03.png"
import glass04 from "../assets/Glass04.png"
import glass05 from "../assets/Glass05.png"

const images = [glass01, glass02, glass03, glass04, glass05]

const currentImage = ref(images[0])

function randomizeImage() {
  let index

  do {
    index = Math.floor(Math.random() * images.length)
  } while (images[index] === currentImage.value)

  currentImage.value = images[index]
}

const overlay = ref<HTMLDivElement>()

defineExpose({
  overlay, 
  randomizeImage
});
</script>

<template>
  <div ref="overlay" class="transition-overlay">
    <img :src="currentImage" class="glass" />
  </div>
</template>

<style scoped>
.transition-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;

  background-color: transparent;

  pointer-events: none;

  transform: translateX(-100%);
}

.glass {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>