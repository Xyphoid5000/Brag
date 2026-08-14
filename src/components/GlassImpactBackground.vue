<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
//import { Flip } from 'gsap/Flip'
import BurningRiverAutoGlassWordmark from './BurningRiverAutoGlassWordmark.vue'
import BurningRiverEmblem from './BurningRiverEmblem.vue'
import Flames from './Flames.vue'
import Splash from './Splash.vue'
import BurningRiverFadedEmblem from './BurningRiverFadedEmblem.vue'


gsap.registerPlugin(ScrollTrigger)

const emit = defineEmits<{
  ready: []
}>()

const scene = ref<HTMLElement | null>(null)
type Shard = { points: string; x: number; y: number; rotation: number; delay: number }

const shards = ref<Shard[]>([])
const smallShards = ref<Shard[]>([])
const impactComplete = ref(false)

function buildShards() {
  const sectors = 14
  const rings = 5
  const center = { x: 50, y: 45 }
  const halfWidth = 38
  const halfHeight = 30
  const angleStep = (Math.PI * 2) / sectors
  const ringFractions = [0, 0.18, 0.4, 0.64, 0.83, 1]

  const edgeRadius = (angle: number) => {
    const horizontal = Math.abs(Math.cos(angle))
    const vertical = Math.abs(Math.sin(angle))
    return Math.min(halfWidth / horizontal || Infinity, halfHeight / vertical || Infinity)
  }

  const vertices = Array.from({ length: (rings + 1) * sectors }, (_, index) => {
    const sector = index % sectors
    const ring = Math.floor(index / sectors)
    const angle = -Math.PI / 2 + sector * angleStep
    const radius = edgeRadius(angle)
    const ringJitter = ring === 0 || ring === rings ? 0 : ((index * 19) % 9 - 4) * 0.012
    const distance = radius * (ringFractions[ring] + ringJitter)

    return {
      x: center.x + Math.cos(angle) * distance,
      y: center.y + Math.sin(angle) * distance,
    }
  })

  shards.value = Array.from({ length: sectors * rings }, (_, index) => {
    const sector = index % sectors
    const ring = Math.floor(index / sectors)
    const current = vertices[ring * sectors + sector]
    const next = vertices[ring * sectors + (sector + 1) % sectors]
    const nextOuter = vertices[(ring + 1) * sectors + (sector + 1) % sectors]
    const currentOuter = vertices[(ring + 1) * sectors + sector]
    const points = [
      `${current.x},${current.y}`,
      `${next.x},${next.y}`,
      `${nextOuter.x},${nextOuter.y}`,
      `${currentOuter.x},${currentOuter.y}`,
    ].join(' ')

    return {
      points,
      x: (Math.cos(-Math.PI / 2 + (sector + 0.5) * angleStep) * (12 + (ring * 3))) + (index % 2 ? 8 : -8),
      y: (Math.sin(-Math.PI / 2 + (sector + 0.5) * angleStep) * (12 + (ring * 3))) + (ring % 2 ? 7 : -7),
      rotation: (index % 2 ? 1 : -1) * (18 + ((index * 13) % 48)),
      delay: (index % 10) * 0.006,
    }
  })

  smallShards.value = Array.from({ length: 42 }, (_, index) => {
    const angle = -Math.PI / 2 + (index / 42) * Math.PI * 2 + ((index % 3) - 1) * 0.04
    const radius = edgeRadius(angle) * (0.72 + (index % 6) * 0.035)
    const size = 0.9 + (index % 4) * 0.28
    const x = center.x + Math.cos(angle) * radius
    const y = center.y + Math.sin(angle) * radius
    const points = [
      `${x},${y}`,
      `${x + Math.cos(angle + 0.9) * size},${y + Math.sin(angle + 0.9) * size}`,
      `${x + Math.cos(angle - 0.65) * size * 1.25},${y + Math.sin(angle - 0.65) * size * 1.25}`,
    ].join(' ')

    return {
      points,
      x: Math.cos(angle) * (18 + (index % 7) * 3),
      y: Math.sin(angle) * (18 + (index % 7) * 3),
      rotation: (index % 2 ? 1 : -1) * (28 + ((index * 17) % 55)),
      delay: 0.04 + (index % 9) * 0.01,
    }
  })
}

function animateImpact() {
  if (!scene.value) return

  const glass = scene.value.querySelector<SVGRectElement>('.glass-pane')
  const logo = scene.value.querySelector<HTMLElement>('.impact-logo')
  const largeShardElements = scene.value.querySelectorAll<SVGPolygonElement>('.glass-shard:not(.glass-shard--small)')
  const smallShardElements = scene.value.querySelectorAll<SVGPolygonElement>('.glass-shard--small')
  const allShardElements = scene.value.querySelectorAll<SVGPolygonElement>('.glass-shard')
  const logoImpactElements = scene.value.querySelectorAll<HTMLElement>('.impact-sparks, .impact-spash')
  const paneLighting = scene.value.querySelectorAll<HTMLElement>('.glass-scene__light-sweep, .glass-scene__reflection, .glass-scene__pane-sheen, .glass-scene__pane-edge')

  const impact = gsap.timeline({
    onComplete: async () => {
      sessionStorage.setItem('brag-glass-impact-played', 'true')
      impactComplete.value = true
      emit('ready')
      await nextTick()
      createRestoreTimeline()
    },
  })

  gsap.set(logo, { y: -240, scale: 0.82, rotation: -4, opacity: 1 })
  gsap.set(allShardElements, { opacity: 0, strokeOpacity: 0 })
  gsap.set(logoImpactElements, { y: 0, scale: 0.3, opacity: 0 })
  impact
    .to(logo, { y: 0, rotation: 0, scale: 1, duration: 1.0, ease: 'power3.in' })
    .to(logoImpactElements, {scale: 1.1, opacity: 1, duration: 0.5, ease: 'power2.in'}, '<')
    .to(logo, { scale: 1.16, duration: 0.08, ease: 'power1.out' })
    .to(glass, { opacity: 0, scale: 1.05, duration: 0.12, ease: 'power2.out' }, '<')
    .to(allShardElements, { opacity: 1, strokeOpacity: 1, duration: 0.12, ease: 'power1.in' })
    .to(logo, { scale: 1, duration: 0.24, ease: 'back.out(2)' })
    .to(logoImpactElements, {opacity: 0, duration: 1.0, ease: 'power2.out'}, '<0.3')
    .to(paneLighting, {opacity: 0, scale: 1.05, duration: 0.5, ease: 'power2.out'})
    .to(largeShardElements, {
      x: (index) => shards.value[index].x,
      y: (index) => shards.value[index].y,
      rotation: (index) => shards.value[index].rotation,
      opacity: (index) => (index % 7 === 0 ? 0.28 : 0.8),
      duration: 1.15,
      ease: 'power3.out',
      stagger: { each: 0.008, from: 'center' },
    }, '<')
    .to(smallShardElements, {
      x: (index) => smallShards.value[index].x,
      y: (index) => smallShards.value[index].y,
      rotation: (index) => smallShards.value[index].rotation,
      opacity: 0.9,
      duration: 0.82,
      ease: 'power3.out',
      stagger: { each: 0.012, from: 'center' },
    }, '<0.1')
}

function createRestoreTimeline() {
  if (!scene.value) return

  const glass = scene.value.querySelector<SVGRectElement>('.glass-pane')
  const shardElements = scene.value.querySelectorAll('.glass-shard')
  const lightSweep = scene.value.querySelector<HTMLElement>('.glass-scene__light-sweep')
  const paneLighting = scene.value.querySelectorAll<HTMLElement>('.glass-scene__reflection, .glass-scene__pane-sheen, .glass-scene__pane-edge')
  const restore = gsap.timeline({ paused: true })
  const logos = scene.value.querySelectorAll<HTMLElement>('.impact-logo, .faded-logo, .full-wordmark')

  gsap.set(logos, { opacity: 0 })
  gsap.set(lightSweep, { opacity: 0, xPercent: -115 })
  gsap.set(paneLighting, { opacity: 0 })
  restore.to(shardElements, {
    x: 0,
    y: 0,
    rotation: 0,
    opacity: 0.76,
    strokeOpacity: 0,
    duration: 1,
    ease: 'power2.inOut',
    stagger: { each: 0.012, from: 'edges' },
  })
  restore.to(shardElements, { opacity: 0, duration: 0.16, ease: 'power1.in' })
  restore.to(glass, { opacity: 1, scale: 1, duration: 0.16, ease: 'power1.out' }, '<')

  ScrollTrigger.create({
    trigger: document.documentElement,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.1,
    onUpdate: (self) => {
      restore.progress(Math.max(0, Math.min(1, self.progress * 1.18)))
      scene.value?.classList.toggle('glass-scene--restoring', self.progress > 0.02)
      gsap.set(lightSweep, { opacity: self.progress > 0.08 ? 0.42 : 0, xPercent: -115 + self.progress * 230 })
      const paneLightProgress = Math.max(0, Math.min(1, (self.progress - 0.82) * 5.56))
      gsap.set(paneLighting, { opacity: (index) => [0.65, 0.72, 0.78][index] * paneLightProgress })
    },
  })
}

function showBrokenState() {
  if (!scene.value) return

  const glass = scene.value.querySelector<SVGRectElement>('.glass-pane')
  const largeShardElements = scene.value.querySelectorAll<SVGPolygonElement>('.glass-shard:not(.glass-shard--small)')
  const smallShardElements = scene.value.querySelectorAll<SVGPolygonElement>('.glass-shard--small')
  const lightSweep = scene.value.querySelector<HTMLElement>('.glass-scene__light-sweep')
  const paneLighting = scene.value.querySelectorAll<HTMLElement>('.glass-scene__reflection, .glass-scene__pane-sheen, .glass-scene__pane-edge')
  const logo = scene.value.querySelectorAll<HTMLElement>('.impact-logo, .impact-sparks, .impact-spash, .faded-logo, .full-wordmark');

  gsap.set(logo, { opacity: 0 })
  gsap.set(glass, { opacity: 0, scale: 1.05 })
  gsap.set(lightSweep, { opacity: 0, xPercent: -115 })
  gsap.set(paneLighting, { opacity: 0 })
  gsap.set(largeShardElements, {
    opacity: (index) => (index % 7 === 0 ? 0.28 : 0.8),
    x: (index) => shards.value[index].x,
    y: (index) => shards.value[index].y,
    rotation: (index) => shards.value[index].rotation,
  })
  gsap.set(smallShardElements, {
    opacity: 0.9,
    x: (index) => smallShards.value[index].x,
    y: (index) => smallShards.value[index].y,
    rotation: (index) => smallShards.value[index].rotation,
  })
  impactComplete.value = true
}

onMounted(async () => {
  buildShards()
  await nextTick()
  if (sessionStorage.getItem('brag-glass-impact-played') === 'true') {
    createRestoreTimeline()
    showBrokenState()
    return
  }

  animateImpact()
})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  gsap.killTweensOf(scene.value)
})
</script>

<template>
  <div ref="scene" class="glass-scene" :class="{ 'glass-scene--ready': impactComplete }" aria-hidden="true">
    <div class="glass-scene__wash"></div>
    <div class="glass-scene__overlay"></div>
    <div class="glass-scene__light-sweep"></div>
    <div class="glass-scene__reflection"></div>
    <div class="glass-scene__pane-sheen"></div>
    <div class="glass-scene__pane-edge"></div>
    <svg class="glass-scene__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <rect class="glass-pane" x="12" y="15" width="76" height="60" rx="1.5" />
      <polygon
        v-for="(shard, index) in shards"
        :key="index"
        class="glass-shard"
        :points="shard.points"
        :style="{ '--shard-delay': `${shard.delay}s` }"
      />
      <polygon
        v-for="(shard, index) in smallShards"
        :key="`small-${index}`"
        class="glass-shard glass-shard--small"
        :points="shard.points"
        :style="{ '--shard-delay': `${shard.delay}s` }"
      />
    </svg>
    <div class="impact-logo"><BurningRiverEmblem /></div>
    <!--<div class="faded-logo"><BurningRiverFadedEmblem /></div>-->
    <div class="impact-sparks"><Flames /></div>
    <div class="impact-spash"><Splash /></div>
    <div class="full-wordmark"><BurningRiverAutoGlassWordmark /></div>
    <p class="glass-scene__hint">Scroll to restore</p>
  </div>
</template>