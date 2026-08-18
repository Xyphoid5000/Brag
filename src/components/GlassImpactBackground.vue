<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, onMounted, watch } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BurningRiverAutoGlassWordmark from './BurningRiverAutoGlassWordmark.vue'
import BurningRiverEmblem from './BurningRiverEmblem.vue'
import { useUIStore } from '../stores/uiStore'
import { useRoute } from 'vue-router'

const uiStore = useUIStore();
const route = useRoute();

const emit = defineEmits<{
  ready: []
}>()

const scene = ref<HTMLElement | null>(null)
type Shard = { points: string; x: number; y: number; rotation: number; delay: number }

const shards = ref<Shard[]>([])
const smallShards = ref<Shard[]>([])
const impactComplete = ref(false)

let restoreTrigger: ScrollTrigger | null = null
let introTimeline: gsap.core.Timeline | null = null

const IMPACT_X = 50
const IMPACT_Y = 44

function edgeRadius(angle: number) {
  const dx = Math.cos(angle)
  const dy = Math.sin(angle)
  const horizontal = Math.abs(dx)
  const vertical = Math.abs(dy)

  const distanceToVerticalEdge = horizontal > 0.0001 ? 50 / horizontal : Infinity
  const distanceToHorizontalEdge = vertical > 0.0001
    ? (dy < 0 ? IMPACT_Y : 100 - IMPACT_Y) / vertical
    : Infinity

  return Math.min(distanceToVerticalEdge, distanceToHorizontalEdge)
}

function buildShards() {
  // The pane now fills the entire 100 x 100 SVG, so the fracture field does too.
  const sectors = 16
  const rings = 6
  const angleStep = (Math.PI * 2) / sectors
  const ringFractions = [0, 0.14, 0.29, 0.48, 0.67, 0.84, 1]

  const vertices = Array.from({ length: (rings + 1) * sectors }, (_, index) => {
    const sector = index % sectors
    const ring = Math.floor(index / sectors)
    const angle = -Math.PI / 2 + sector * angleStep
    const radius = edgeRadius(angle)
    const ringJitter = ring === 0 || ring === rings ? 0 : ((index * 19) % 9 - 4) * 0.012
    const distance = radius * (ringFractions[ring] + ringJitter)

    return {
      x: IMPACT_X + Math.cos(angle) * distance,
      y: IMPACT_Y + Math.sin(angle) * distance,
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

    const angle = -Math.PI / 2 + (sector + 0.5) * angleStep
    const travel = 10 + ring * 3.8

    return {
      points,
      x: Math.cos(angle) * travel + (index % 2 ? 1.8 : -1.8),
      y: Math.sin(angle) * travel + (ring % 2 ? 1.5 : -1.5),
      rotation: (index % 2 ? 1 : -1) * (18 + ((index * 13) % 48)),
      delay: (index % 12) * 0.006,
    }
  })

 smallShards.value = Array.from({ length: 72 }, (_, index) => {
    const angle = -Math.PI / 2 + (index / 72) * Math.PI * 2 + ((index % 3) - 1) * 0.035
    const radius = edgeRadius(angle) * (0.72 + (index % 7) * 0.035)
    const size = 0.7 + (index % 4) * 0.24
    const x = IMPACT_X + Math.cos(angle) * radius
    const y = IMPACT_Y + Math.sin(angle) * radius
    const points = [
      `${x},${y}`,
      `${x + Math.cos(angle + 0.9) * size},${y + Math.sin(angle + 0.9) * size}`,
      `${x + Math.cos(angle - 0.65) * size * 1.25},${y + Math.sin(angle - 0.65) * size * 1.25}`,
    ].join(' ')

    return {
      points,
      x: Math.cos(angle) * (16 + (index % 8) * 2.8),
      y: Math.sin(angle) * (16 + (index % 8) * 2.8),
      rotation: (index % 2 ? 1 : -1) * (28 + ((index * 17) % 55)),
      delay: 0.04 + (index % 9) * 0.008,
    }
  }) 
}

function getHeaderTargets() {
  return {
    mark: document.querySelector<HTMLElement>('.landing-brand__mark'),
    text: document.querySelector<HTMLElement>('.landing-brand__text'),
    header: document.querySelector<HTMLElement>('.landing-nav'),
    shell: document.querySelector<HTMLElement>('.site-shell'),
  }
}

function runHeaderFlip() {
  if (!scene.value) return Promise.resolve()

  const { mark: headerMark, text: headerText, header, shell } = getHeaderTargets()
  const introMark = scene.value.querySelector<HTMLElement>('.burning-logo')
  const introText = scene.value.querySelector<HTMLElement>('.full-wordmark')

  if (!headerMark || !headerText || !header || !shell || !introMark || !introText) {
    return Promise.resolve()
  }

  // The header is mounted from the beginning, but it is visually hidden.
  // Put its two brand pieces exactly over the intro pieces, capture that state,
  // then clear the temporary transforms so Flip can animate them to their real layout.
  gsap.set([headerMark, headerText], { opacity: 1 })
  Flip.fit(headerMark, introMark, { scale: true })
  Flip.fit(headerText, introText, { scale: true })

  const state = Flip.getState([headerMark, headerText])

  gsap.set([headerMark, headerText], { clearProps: 'transform,width,height' })

  shell.classList.add('site-shell--flipping')
  gsap.set(shell, { opacity: 1 })
  gsap.set(header, { opacity: 1 })

  return new Promise<void>((resolve) => {
    Flip.from(state, {
      duration: 1.55,
      ease: 'power2.out',
      onleave: () => { gsap.fromTo([introMark, introText], {opacity: 1, scale: 1}, {opacity: 0, scale: 0, duration: 1.14, ease: 'power1.out'})},
      absolute: false,
      onComplete: () => {
        gsap.set([headerMark, headerText], { opacity: 1 })
        gsap.to([introMark, introText], { opacity: 0,  duration: 0.2 })
        gsap.to(header, {
          opacity: 1,
          duration: 0.38,
          ease: 'power2.out',
        })
        gsap.to(shell.querySelector('.site-main'), {
          opacity: 1,
          duration: 0.95,
          delay: 0.18,
          ease: 'power2.out',
          onComplete: () => {
            shell.classList.remove('site-shell--flipping')
            resolve()
          },
        })
      },
    })
  })
}

async function animateImpact() {
  if (!scene.value) return

  const glass = scene.value.querySelector<SVGRectElement>('.glass-pane')
  const logo = scene.value.querySelector<HTMLElement>('.burning-logo')
  const fullWordmark = scene.value.querySelector<HTMLElement>('.full-wordmark')
  const largeShardElements = scene.value.querySelectorAll<SVGPolygonElement>('.glass-shard:not(.glass-shard--small)')
  const smallShardElements = scene.value.querySelectorAll<SVGPolygonElement>('.glass-shard--small')
  const allShardElements = scene.value.querySelectorAll<SVGPolygonElement>('.glass-shard')
  const paneLighting = scene.value.querySelectorAll<HTMLElement>('.glass-scene__light-sweep, .glass-scene__reflection, .glass-scene__pane-sheen, .glass-scene__pane-edge')
  const { shell } = getHeaderTargets()

  if (!glass || !logo || !fullWordmark) return

  gsap.set(logo, { y: -1000, scale: 0.82, rotation: -4, opacity: 1 })
  gsap.set(allShardElements, { opacity: 0, strokeOpacity: 0 })
  gsap.set(fullWordmark, { y: -200, scale: 1, opacity: 0})
  gsap.set(paneLighting, { opacity: 0.78 })
  if (shell) gsap.set(shell, { opacity: 0 })

  introTimeline = gsap.timeline()
    // B falls into the exact center of the full-screen pane.
    .to(logo, {
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 1.5,
      ease: 'power2.in',
    })
    // The impact frame. Effects start here, not during the fall.
    .to(logo, {
      scale: 1.16,
      duration: 0.075,
      ease: 'power1.out',
    })
    .to(glass, {
      opacity: 0,
      scale: 1.035,
      duration: 0.1,
      ease: 'power2.out',
    }, '<')
    .to(paneLighting, {
      opacity: 0,
      scale: 1.04,
      duration: 0.1,
      ease: 'power2.out',
    }, '<')
    .to(allShardElements, {
      opacity: 1,
      strokeOpacity: 1,
      duration: 0.1,
      ease: 'power1.in',
    }, '<0.05')
    .to(logo, {
      scale: 1,
      duration: 0.25,
      ease: 'back.out(2.2)',
    })
    .to(largeShardElements, {
      x: (index) => shards.value[index].x,
      y: (index) => shards.value[index].y,
      rotation: (index) => shards.value[index].rotation,
      opacity: (index) => (index % 9 === 0 ? 0.28 : 0.8),
      duration: 2,
      ease: 'power2.out',
      stagger: { each: 0.006, from: 'center' },
    }, '<')
    .to(smallShardElements, {
      x: (index) => smallShards.value[index].x,
      y: (index) => smallShards.value[index].y,
      rotation: (index) => smallShards.value[index].rotation,
      opacity: 0.9,
      duration: 1.75,
      ease: 'power3.out',
      stagger: { amount: 0.009, from: 'center' },
    }, '<0.25') 
    .to(fullWordmark, {
      opacity: 1,
      y: 25,
      duration: 2,
      ease: 'elastic.out(1, 0.3)',
    }, '-=1')
    // Let the completed lockup breathe before it moves into the header.
    .to({}, { duration: 1.5 });

  await introTimeline
  await runHeaderFlip()

  uiStore.animationPlayed = true;
  impactComplete.value = true
  emit('ready')
  await nextTick()
  createRestoreTimeline()
}

function createRestoreTimeline() {
  if (!scene.value || restoreTrigger) return

  const glass = scene.value.querySelector<SVGRectElement>('.glass-pane')
  const shardElements = scene.value.querySelectorAll('.glass-shard')
  const lightSweep = scene.value.querySelector<HTMLElement>('.glass-scene__light-sweep')
  const paneLighting = scene.value.querySelectorAll<HTMLElement>('.glass-scene__reflection, .glass-scene__pane-sheen, .glass-scene__pane-edge')
  const introLogo = scene.value.querySelector<HTMLElement>('.faded-logo')
  const introWordmark = scene.value.querySelector<HTMLElement>('.full-wordmark')
  const restoreLogo = scene.value.querySelector<HTMLElement>('.restore-logo')

  if (!glass || !lightSweep || !restoreLogo) return

  const restore = gsap.timeline({ paused: true })

  gsap.set([restoreLogo, introLogo, introWordmark], { opacity: 0 })
  gsap.set(lightSweep, { opacity: 0, xPercent: -115 })
  gsap.set(paneLighting, { opacity: 0 })

  restore
    .to(shardElements, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 0.76,
      strokeOpacity: 0,
      duration: 1,
      ease: 'power2.inOut',
      stagger: { each: 0.012, from: 'edges' },
    })
    .to(shardElements, {
      opacity: 0,
      duration: 0.16,
      ease: 'power1.in',
    })
    .to(glass, {
      opacity: 1,
      scale: 1,
      duration: 0.16,
      ease: 'power1.out',
    }, '<')

  restoreTrigger = ScrollTrigger.create({
    trigger: document.documentElement,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.1,
    onUpdate: (self) => {
      const progress = self.progress
      restore.progress(Math.max(0, Math.min(1, progress * 1.18)))
      scene.value?.classList.toggle('glass-scene--restoring', progress > 0.02)

      gsap.set(lightSweep, {
        opacity: progress > 0.08 ? 0.42 : 0,
        xPercent: -115 + progress * 230,
      })

      const paneLightProgress = Math.max(0, Math.min(1, (progress - 0.82) * 5.56))
      gsap.set(paneLighting, {
        opacity: (index) => [0.65, 0.72, 0.78][index] * paneLightProgress,
      })

      const logoReveal = Math.max(0, Math.min(1, (progress - 0.88) / 0.12))
      gsap.set(restoreLogo, {
        opacity: logoReveal,
      })
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
  const logo = scene.value.querySelectorAll<HTMLElement>('.burning-logo, .impact-sparks, .impact-spash, .faded-logo, .end-wordmark, .full-wordmark')

  if (!glass || !lightSweep) return

  gsap.set(logo, { opacity: 0 })
  gsap.set(glass, { opacity: 0, scale: 1.035 })
  gsap.set(lightSweep, { opacity: 0, xPercent: -115 })
  gsap.set(paneLighting, { opacity: 0 })
  gsap.set(largeShardElements, {
    opacity: (index) => (index % 9 === 0 ? 0.28 : 0.8),
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

async function setup() {
  buildShards()
  await nextTick()
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))


  if (uiStore.animationPlayed || uiStore.isMobile) {
    createRestoreTimeline()
    showBrokenState()
    const { header, shell } = getHeaderTargets()
    if (shell) gsap.set(shell, { opacity: 1, pointerEvents: 'auto' })
    if (header) gsap.set(header, { opacity: 1 })
    const main = shell?.querySelector<HTMLElement>('.site-main')
    if (main) gsap.set(main, { opacity: 1 })
    impactComplete.value = true
    emit('ready')
    return
  }

  animateImpact()
}

watch(() => uiStore.animationPlayed, 
  async (played, hadPlayed) => {
    if (played === false && hadPlayed === true) {
      await setup();
    }
})

watch(
  () => route.fullPath,
  async () => {
    await nextTick();

    requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
    });
  }
);


onMounted(() => {
  setup()
})

onBeforeUnmount(() => {
  restoreTrigger?.kill()
  restoreTrigger = null
  introTimeline?.kill()
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
      <rect class="glass-pane" x="0" y="0" width="100" height="100" rx="0" />
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
    <div class="burning-logo"><BurningRiverEmblem /></div>
    <div class="full-wordmark"><BurningRiverAutoGlassWordmark /></div>
    <div class="restore-logo">
      <div class="restore-emblem"><BurningRiverEmblem /></div>
      <div class="restore-text"><BurningRiverAutoGlassWordmark /></div>
    </div>
    <p class="glass-scene__hint">Scroll to restore</p>
  </div>
</template>
