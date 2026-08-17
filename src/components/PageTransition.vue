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
import transitionCar_windshield from "../assets/transitionCar_windshieldAlt.png"

const images = [glass01, glass02, glass03, glass04, glass05]

const store = useUIStore();

const currentImage = ref(images[0])

function randomizeImage() {
  let next = currentImage.value

  while (next === currentImage.value) {
    next = images[Math.floor(Math.random() * images.length)]
  }

  currentImage.value = next
}

const overlay = ref<HTMLDivElement | null>(null)
const mobileLayer = ref<HTMLDivElement | null>(null)
const desktopLayer = ref<HTMLDivElement | null>(null)

const crack = ref<HTMLImageElement | null>(null)
const interior = ref<HTMLImageElement | null>(null)
const frame = ref<HTMLImageElement | null>(null)
const glass = ref<HTMLImageElement | null>(null)

defineExpose({
    overlay,
    mobileLayer,
    desktopLayer,
    crack,
    interior,
    frame,
    glass,
    randomizeImage,
})
</script>

<template>
  <div ref="overlay" class="transition-overlay">

    <div v-if="store.isMobile" ref="mobileLayer" class="transition-mobile">
      <img
        ref="crack"
        :src="currentImage"
        class="ovrlay cover ovrlay-crack"
      />
    </div>

    <div v-else ref="desktopLayer" class="transition-car">
      <img 
        ref="interior"
        :src="transitionCar_Interior"
        class="ovrlay cover ovrlay-interior"
        draggable="false"
      />

      <img
        ref="frame"
        :src="transitionCar_Transparent"
        class="ovrlay cover ovrlay-frame"
        draggable="false"
      />

      <img 
        ref="glass"
        :src="transitionCar_windshield"
        class="ovrlay contain ovrlay-windshield"
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

    width:100vw;
    height:100vh;

    overflow:hidden;
    pointer-events:none;
    z-index:9999;
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

.transition-mobile {
  position: absolute;
  inset: 0;
  z-index: 20;
  visibility: hidden;
}

.transition-car {
  position: absolute;
  inset: 0;
  z-index: 10;
  visibility: hidden;
}

.cover {
  object-fit: cover;
}

.contain {
  object-fit: contain;
}

/* Frame stays put */

.ovrlay-frame {
  z-index: 3;
}

/* Visible only while windshield is removed */

.ovrlay-interior {
  z-index: 2;
  opacity: 0;
}

/* Clean windshield */

.ovrlay-windshield {
  z-index: 4;
}

.ovrlay-crack {
  z-index: 1;
  opacity: 0;
  object-position: center;
  mix-blend-mode: normal;
}
</style>