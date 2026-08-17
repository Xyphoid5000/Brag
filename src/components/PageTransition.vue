<script setup lang="ts">
import { ref } from "vue"
import glass01 from "../assets/Glass01.png"
import glass02 from "../assets/Glass02.png"
import glass03 from "../assets/Glass03.png"
import glass04 from "../assets/glass04.png"
import glass05 from "../assets/glass05.png"
import transitionCar_Transparent from "../assets/transitionCar_Transparent.png"
import transitionCar_Interior from "../assets/transitionCar_Interior.png"
import transitionCar_windshield from "../assets/transitionCar_windshield.png"

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
    <img :src="transitionCar_Interior" class="ovrlay cover ovrlay-interior" />
    <img :src="transitionCar_Transparent" class="ovrlay cover ovrlay-window" />
    <img :src="currentImage" class="ovrlay contain ovrlay-crack" />
    <img :src="transitionCar_windshield" class="ovrlay contain ovrlay-glass" />
  </div>
</template>

<style scoped>
.transition-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;

  background-color: transparent;

  pointer-events: none;

  transform: translateX(-100%);
}

.ovrlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;

  .cover {
    object-fit: cover;
  }

  .contain {
    object-fit: contain;
  }
}

.ovrlay-window {
  z-index: 3;
}

.ovrlay-interior {
  z-index: 2;
  opacity: 0;
}

.ovrlay-crack {
  z-index: 1;
  backdrop-filter: blur(8px);
}

.ovrlay-glass {
  z-index: 4;
  opacity: 0;
}

</style>