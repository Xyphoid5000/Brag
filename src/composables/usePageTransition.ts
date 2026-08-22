// src/composables/usePageTransition.ts

import gsap from "gsap"
import { nextTick } from "vue"

import { useUIStore } from "../stores/uiStore.ts"

import {
  transitionState,
  killTimelines,
} from "./transitionState"

import { useGlassTransition } from "./useGlassTransition"
import { useCarTransition } from "./useCarTransition"

const glassTransition = useGlassTransition()
const carTransition = useCarTransition()

/*
|--------------------------------------------------------------------------
| Wait for GSAP
|--------------------------------------------------------------------------
*/

function waitForTimeline(tl: gsap.core.Timeline) {
  return new Promise<void>((resolve) => {
    tl.eventCallback("onComplete", resolve)
  })
}

/*
|--------------------------------------------------------------------------
| Build master timeline
|--------------------------------------------------------------------------
|
| Glass is ALWAYS the base transition.
|
| Desktop adds the car timeline at exactly the same starting point.
|
*/

function buildMasterTimeline(
  glassTimeline: gsap.core.Timeline,
  carTimeline?: gsap.core.Timeline,
) {
  const master = gsap.timeline({
    paused: true,
  })

  master.add(glassTimeline, 0)

  if (carTimeline) {
    master.add(carTimeline, 0)
  }

  return master
}

/*
|--------------------------------------------------------------------------
| Play timeline
|--------------------------------------------------------------------------
*/

async function playTimeline(tl: gsap.core.Timeline) {
  transitionState.masterTimeline = tl

  tl.play(0)

  await waitForTimeline(tl)

  /*
   * Only clear references here.
   *
   * DO NOT call killTimelines().
   * The timeline has already completed.
   */
  transitionState.masterTimeline = null
  transitionState.glassTimeline = null
  transitionState.carTimeline = null
}

/*
|--------------------------------------------------------------------------
| COVER
|--------------------------------------------------------------------------
|
| Runs before the router changes routes.
|
| Mobile:
|   crack slides in
|   holds for 1.5s
|
| Desktop:
|   crack slides in
|   car enters underneath it
|   windshield is removed
|   interior appears
|
| The router is allowed to continue only when the master
| timeline reaches its completion point.
|
*/

export async function cover() {
  const store = useUIStore()

  /*
   * Preserve the existing initial-load behavior.
   */
  if (!store.animationPlayed) {
    return
  }

  /*
   * Kill anything left over from a previous transition BEFORE
   * creating the new timelines.
   */
  killTimelines()

  transitionState.isMobile = store.isMobile
  transitionState.isTransitioning = true

  /*
   * Pick a new crack image.
   */
  transitionState.randomizeCrack?.()

  /*
   * Wait for Vue to render the new crack image.
   */
  await nextTick()

  /*
   * Base transition.
   */
  const glassTimeline =
    glassTransition.buildPreTimeline()

  transitionState.glassTimeline = glassTimeline

  /*
   * Desktop enhancement.
   */
  let carTimeline: gsap.core.Timeline | undefined

  if (!store.isMobile) {
    carTimeline =
      carTransition.buildPreTimeline()

    transitionState.carTimeline = carTimeline
  }

  /*
   * Run both from exactly t=0.
   */
  const master = buildMasterTimeline(
    glassTimeline,
    carTimeline,
  )

  await playTimeline(master)
}

/*
|--------------------------------------------------------------------------
| REVEAL
|--------------------------------------------------------------------------
|
| Runs after Vue Router has completed the navigation.
|
| Mobile:
|   crack slides off to the right
|
| Desktop:
|   fresh windshield comes in
|   camera pushes through windshield
|   interior fades
|   transition completes
|
*/

export async function reveal() {
  const store = useUIStore()

  /*
   * Match cover() behavior for the initial page load.
   */
  if (!store.animationPlayed) {
    return
  }

  killTimelines()

  transitionState.isMobile = store.isMobile
  transitionState.isTransitioning = true

  /*
   * Base transition.
   */
  const glassTimeline =
    glassTransition.buildPostTimeline()

  transitionState.glassTimeline = glassTimeline

  /*
   * Desktop enhancement.
   */
  let carTimeline: gsap.core.Timeline | undefined

  if (!store.isMobile) {
    carTimeline =
      carTransition.buildPostTimeline()

    transitionState.carTimeline = carTimeline
  }

  /*
   * Run both simultaneously.
   */
  const master = buildMasterTimeline(
    glassTimeline,
    carTimeline,
  )

  await playTimeline(master)

  transitionState.isTransitioning = false
}

/*
|--------------------------------------------------------------------------
| Manual cleanup
|--------------------------------------------------------------------------
*/

export function killPageTransition() {
  killTimelines()

  transitionState.isTransitioning = false
}