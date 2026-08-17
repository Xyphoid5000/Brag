<script setup lang="ts">
import { ref } from "vue"
import { useUIStore } from "../stores/uiStore"

import glass01 from "../assets/Glass01.png"
import glass02 from "../assets/Glass02.png"
import glass03 from "../assets/Glass03.png"
import glass04 from "../assets/glass04.png"
import glass05 from "../assets/glass05.png"

import transitionCar_Transparent from "../assets/transitionCar_transparent.png"
import transitionCar_Interior from "../assets/transitionCar_Interior.png"
import transitionCar_windshield from "../assets/transitionCar_windshield.png"

const uiStore = useUIStore();
const images = [glass01, glass02, glass03, glass04, glass05]

const currentImage = ref(images[0])

function randomizeImage() {
  let next = currentImage.value

  while (next === currentImage.value) {
    next = images[Math.floor(Math.random() * images.length)]
  }

  currentImage.value = next
}

const overlay = ref<HTMLDivElement | null>(null)
const car = ref<HTMLDivElement | null>(null)

const interior = ref<HTMLImageElement | null>(null)
const frame = ref<HTMLImageElement | null>(null)
const crack = ref<HTMLImageElement | null>(null)
const glass = ref<HTMLImageElement | null>(null)

defineExpose({
  overlay,
  car,
  interior,
  frame,
  crack,
  glass,
  randomizeImage,
})
</script>

<template>
  <div ref="overlay" class="transition-overlay">
    <div ref="car" class="transition-car">
      <img v-show="!uiStore.isMobile"
        ref="interior"
        :src="transitionCar_Interior"
        class="ovrlay cover ovrlay-interior"
        draggable="false"
      />

      <img v-show="!uiStore.isMobile"
        ref="frame"
        :src="transitionCar_Transparent"
        class="ovrlay cover ovrlay-window"
        draggable="false"
      />

      <imb v-show="!uiStore.isMobile"
        ref="glass"
        :src="transitionCar_windshield"
        class="ovrlay contain ovrlay-glass"
        draggable="false"
      />

      <img
        ref="crack"
        :src="currentImage"
        class="ovrlay contain ovrlay-crack"
        draggable="false"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.transition-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;

  overflow: hidden;
  pointer-events: none;
}

.transition-car {
  position: absolute;
  inset: 0;

  transform: translateX(-120%);
  transform-origin: center center;

  will-change: transform, opacity;
}

.ovrlay {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  pointer-events: none;
  user-select: none;

  backface-visibility: hidden;
  transform-origin: center center;
  will-change: transform, opacity;
}

.cover {
  object-fit: cover;
}

.contain {
  object-fit: contain;
}

/* Frame stays put */

.ovrlay-window {
  z-index: 4;
}

/* Visible only while windshield is removed */

.ovrlay-interior {
  z-index: 3;
  opacity: 0;
}

/* Clean windshield */

.ovrlay-glass {
  z-index: 2;
}

/* Crack sits ON the windshield */

.ovrlay-crack {
  z-index: 3;

  mix-blend-mode: normal;
}
</style>