// src/composables/useGlassTransition.ts

import gsap from "gsap"

import { transitionState } from "./transitionState"
import { transitionTiming } from "./transitionTiming"

function requireCrack() {
  const crack = transitionState.elements.crack

  if (!crack) {
    throw new Error(
      "Transition crack element has not been registered."
    )
  }

  return crack
}

/*
|--------------------------------------------------------------------------
| PRE ROUTE
|--------------------------------------------------------------------------
|
| This is the BASE transition.
|
| Mobile:
|   crack slides onto the screen
|   holds for 1.5s
|
| Desktop:
|   exactly the same crack animation.
|   The car transition runs underneath it.
|
*/

function buildPreTimeline() {
  const crack = requireCrack()
  const { glass } = transitionTiming

  /*
   * Establish the starting position explicitly.
   *
   * The crack is completely off the left side of the viewport.
   */
  gsap.set(crack, {
    autoAlpha: 1,
    xPercent: -120,
    y: 0,
    scale: 1,
    rotation: 0,
    transformOrigin: "50% 50%",
  })

  const tl = gsap.timeline()

  /*
   * Slide onto the screen.
   */
  tl.to(crack, {
    xPercent: 0,
    duration: glass.slideIn,
    ease: "power3.out",
  })

  /*
   * This is the shared router hold.
   */
  tl.to({}, {
    duration: glass.hold,
  })

  tl.addLabel("router")

  return tl
}

/*
|--------------------------------------------------------------------------
| POST ROUTE
|--------------------------------------------------------------------------
|
| The new route is now underneath the crack.
|
| Slide the crack off the right side.
|
*/

function buildPostTimeline() {
  const crack = requireCrack()
  const { glass } = transitionTiming

  /*
   * The crack should still be covering the screen when this starts.
   */
  gsap.set(crack, {
    autoAlpha: 1,
    xPercent: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    transformOrigin: "50% 50%",
  })

  const tl = gsap.timeline()

  tl.to(crack, {
    xPercent: 120,
    duration: glass.slideOut,
    ease: "power3.in",
  })

  tl.set(crack, {
    autoAlpha: 0,
  })

  tl.addLabel("complete")

  return tl
}

export function useGlassTransition() {
  return {
    buildPreTimeline,
    buildPostTimeline,
  }
}