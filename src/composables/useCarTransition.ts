import gsap from "gsap"

import { transitionState } from "./transitionState"
import {
  transitionTiming,
  carPreRouteHold,
} from "./transitionTiming"

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function requireElements() {
  const {
    overlay,
    desktopLayer,
    frame,
    glass,
    interior,
  } = transitionState.elements

  if (!overlay || !desktopLayer || !frame || !glass || !interior) {
    throw new Error("Desktop transition elements have not been registered.")
  }

  return {
    overlay,
    desktopLayer,
    frame,
    glass,
    interior,
  }
}

/*
|--------------------------------------------------------------------------
| Reset
|--------------------------------------------------------------------------
*/

function resetDesktopState() {
  const {
    overlay,
    desktopLayer,
    frame,
    glass,
    interior,
  } = requireElements()

  gsap.set(overlay, {
    autoAlpha: 1,
    opacity: 1,
  })

  gsap.set(desktopLayer, {
    autoAlpha: 1,
    xPercent: -120,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    transformOrigin: "50% 50%",
  })

  /*
   * Windshield starts attached to the frame.
   */
  gsap.set(glass, {
    autoAlpha: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    opacity: 1,
    transformOrigin: "50% 50%",
  })

  gsap.set(frame, {
    opacity: 1,
    rotation: 0,
    transformOrigin: "50% 50%",
  })

  gsap.set(interior, {
    opacity: 0,
  })
}

/*
|--------------------------------------------------------------------------
| DESKTOP PRE-ROUTE
|--------------------------------------------------------------------------
|
| The crack overlay is the shared/base transition.
|
| This timeline owns the entire desktop layer:
|
|   car enters
|   ↓
|   hold
|   ↓
|   windshield rips away
|   ↓
|   interior appears
|   ↓
|   router
|
| The crack timeline runs alongside this timeline from t=0.
|
*/

function buildPreTimeline() {
  resetDesktopState()

  const {
    desktopLayer,
    frame,
    glass,
    interior,
  } = requireElements()

  const {
    car,
  } = transitionTiming

  const tl = gsap.timeline()

  /*
  |--------------------------------------------------------------------------
  | Car enters
  |--------------------------------------------------------------------------
  */

  tl.addLabel("start")

  tl.to(desktopLayer, {
    xPercent: 0,
    duration: car.enter,
    ease: "power3.out",
  })

  /*
  |--------------------------------------------------------------------------
  | Impact / settle
  |--------------------------------------------------------------------------
  */

  tl.addLabel("impact")

  tl.to(
    desktopLayer,
    {
      x: 5,
      y: -3,
      duration: car.impactShake,
      repeat: car.impactRepeat,
      yoyo: true,
      ease: "none",
    },
    "<"
  )

  tl.to(
    frame,
    {
      rotation: -0.6,
      duration: 0.08,
      repeat: 1,
      yoyo: true,
      ease: "power1.inOut",
    },
    "<"
  )

  /*
  |--------------------------------------------------------------------------
  | Wait for the shared crack transition to reach the router point.
  |--------------------------------------------------------------------------
  */

  tl.to({}, {
    duration: carPreRouteHold,
  })

  /*
  |--------------------------------------------------------------------------
  | WINDSHIELD REMOVAL
  |--------------------------------------------------------------------------
  |
  | This belongs entirely to the car transition.
  |
  | The windshield is ripped away while the crack is still covering
  | the viewport.
  |--------------------------------------------------------------------------
  */

  tl.addLabel("windshieldRemoval")

  tl.to(glass, {
    x: -80,
    y: -260,

    rotation: -6,
    rotationX: 8,
    rotationY: -12,

    scale: 1.35,

    opacity: 0,

    filter: "blur(8px)",

    duration: car.windshieldRemoval,
    ease: "power2.in",
  })

  /*
  |--------------------------------------------------------------------------
  | Interior fades in as windshield leaves.
  |--------------------------------------------------------------------------
  */

  tl.to(
    interior,
    {
      opacity: 1,
      duration: car.interiorFadeIn,
      ease: "power2.out",
    },
    "<"
  )

  /*
  |--------------------------------------------------------------------------
  | Router synchronization
  |--------------------------------------------------------------------------
  */

  tl.addLabel("router")

  return tl
}

/*
|--------------------------------------------------------------------------
| DESKTOP POST-ROUTE
|--------------------------------------------------------------------------
|
| At this point:
|
|   - new route is rendered
|   - crack still covers viewport
|   - windshield is gone
|   - interior is visible
|
| We now:
|
|   1. bring a fresh windshield into position
|   2. let it settle
|   3. push the camera through it
|   4. fade the interior
|   5. finish/reset
|
*/

function buildPostTimeline() {
  const {
    overlay,
    desktopLayer,
    glass,
    interior,
  } = requireElements()

  const {
    reveal,
    camera,
  } = transitionTiming

  /*
  |--------------------------------------------------------------------------
  | Starting state
  |--------------------------------------------------------------------------
  */

  gsap.set(overlay, {
    autoAlpha: 1,
    opacity: 1,
  })

  gsap.set(desktopLayer, {
    autoAlpha: 1,
    xPercent: 0,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    opacity: 1,
    transformOrigin: "50% 50%",
  })

  gsap.set(interior, {
    opacity: 1,
  })

  /*
   * Fresh windshield starts in its removed position.
   */
  gsap.set(glass, {
    autoAlpha: 1,

    x: -80,
    y: -260,

    rotation: -6,
    rotationX: 8,
    rotationY: -12,

    scale: 1.35,

    opacity: 0,

    filter: "blur(8px)",

    transformOrigin: "50% 50%",
  })

  const tl = gsap.timeline()

  tl.addLabel("start")

  /*
  |--------------------------------------------------------------------------
  | Fresh windshield flies back into place.
  |--------------------------------------------------------------------------
  */

  tl.addLabel("windshieldInstall")

  tl.to(glass, {
    x: 0,
    y: 0,

    rotation: 0,
    rotationX: 0,
    rotationY: 0,

    scale: 1,

    opacity: 1,

    filter: "blur(0px)",

    duration: reveal.windshieldInstall,
    ease: "power2.out",
  })

  /*
  |--------------------------------------------------------------------------
  | Camera starts moving through windshield.
  |--------------------------------------------------------------------------
  */

  tl.addLabel("zoom")

  tl.to(desktopLayer, {
    scale: camera.scale,
    y: camera.y,
    duration: reveal.cameraZoom,
    ease: "power2.in",
    transformOrigin: "50% 50%",
  })

  /*
  |--------------------------------------------------------------------------
  | Interior fades as we pass through the windshield.
  |--------------------------------------------------------------------------
  */

  tl.to(
    interior,
    {
      opacity: 0,
      duration: reveal.interiorFadeOut,
      ease: "power2.out",
    },
    "<"
  )

  /*
  |--------------------------------------------------------------------------
  | Finish
  |--------------------------------------------------------------------------
  */

  tl.to(
    overlay,
    {
      opacity: 0,
      duration: reveal.overlayFade,
      ease: "power2.out",
    },
    "-=0.35"
  )

  /*
  |--------------------------------------------------------------------------
  | Reset everything for the next navigation.
  |--------------------------------------------------------------------------
  */

  tl.set(overlay, {
    autoAlpha: 1,
    opacity: 1,
  })

  tl.set(desktopLayer, {
    xPercent: -120,
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    rotation: 0,
  })

  tl.set(glass, {
    autoAlpha: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    opacity: 1,
    filter: "blur(0px)",
  })

  tl.set(interior, {
    opacity: 0,
  })

  tl.addLabel("complete")

  return tl
}

/*
|--------------------------------------------------------------------------
| PUBLIC API
|--------------------------------------------------------------------------
*/

export function useCarTransition() {
  return {
    buildPreTimeline,
    buildPostTimeline,
  }
}