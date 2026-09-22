<script setup lang="ts">
import { onMounted, ref } from "vue"

import glass01 from "../assets/Glass01.webp"
import glass02 from "../assets/Glass02.webp"
import glass03 from "../assets/Glass03.webp"
import glass04 from "../assets/glass04.webp"
import glass05 from "../assets/glass05.webp"

import transitionCar from "../assets/transitionCar_transparent.webp"
import transitionInterior from "../assets/transitionCar_Interior.webp"
import transitionGlass from "../assets/transitionCar_windshieldAligned.webp"

import {
  registerTransitionElements,
  registerCrackRandomizer
} from "../composables/transitionState"

const images = [
  glass01,
  glass02,
  glass03,
  glass04,
  glass05,
]

const currentImage = ref(images[0])

function randomizeImage() {
  let next = currentImage.value

  while (next === currentImage.value) {
    next = images[Math.floor(Math.random() * images.length)]
  }

  currentImage.value = next
}

const overlay = ref<HTMLDivElement | null>(null)
const desktopLayer = ref<HTMLDivElement | null>(null)

const crack = ref<HTMLImageElement | null>(null)
const frame = ref<HTMLImageElement | null>(null)
const glass = ref<HTMLImageElement | null>(null)
const interior = ref<HTMLImageElement | null>(null)

onMounted(() => {
    registerTransitionElements({
    overlay: overlay.value,
    desktopLayer: desktopLayer.value,
    crack: crack.value,
    frame: frame.value,
    glass: glass.value,
    interior: interior.value,
  })

  registerCrackRandomizer(randomizeImage)
})

defineExpose({
  randomizeImage,
  overlay,
  desktopLayer,
  crack,
  frame,
  glass,
  interior,
})
</script>

<template>
  <div
    ref="overlay"
    class="transition-overlay"
  >
    <img
      decoding="async"
      ref="crack"
      :src="currentImage"
      class="transition-crack cover"
      draggable="false"
    />

    <div
      ref="desktopLayer"
      class="transition-car"
    >
      <img
        decoding="async"
        ref="interior"
        :src="transitionInterior"
        class="transition-interior cover"
        draggable="false"
      />

      <img
        decoding="async"
        ref="frame"
        :src="transitionCar"
        class="transition-frame cover"
        draggable="false"
      />

      <img
        decoding="async"
        ref="glass"
        :src="transitionGlass"
        class="transition-glass cover"
        draggable="false"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.transition-overlay {
  position: fixed;
  inset: 0;

  width: 100vw;
  height: 100vh;

  overflow: hidden;
  pointer-events: none;

  z-index: 9999;
}

.transition-car {
  position: absolute;
  inset: 0;

  visibility: hidden;

  z-index: 10;
}

.transition-frame,
.transition-interior,
.transition-glass {
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

.transition-crack {
  position: absolute;

  left: 0;
  top: 0;

  width: 100vw;
  height: 100vh;

  object-fit: cover;

  pointer-events: none;
  user-select: none;
}

.cover {
  object-fit: cover;
}

.transition-frame {
  z-index: 3;
}

.transition-interior {
  z-index: 2;
  opacity: 0;
}

.transition-glass {
  z-index: 4;
}

.transition-crack {
  z-index: 1;
  opacity: 0;

  object-position: center;
}
</style>