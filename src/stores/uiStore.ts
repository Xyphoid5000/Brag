import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('uiStore', () => {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)
  const animationPlayed = ref(false);

  function updateDimensions() {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  const isMobile = computed(() => width.value <= 700)
  const isTablet = computed(() => width.value > 700 && width.value < 1024)
  const isDesktop = computed(() => width.value >= 1024)


  function init() {
    updateDimensions();
    window.addEventListener('resize', updateDimensions)
  }

  return { width, height, init, isMobile, isTablet, isDesktop, animationPlayed }
})
