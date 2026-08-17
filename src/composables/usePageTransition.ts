import gsap from "gsap"
import { nextTick } from "vue"
import type PageTransition from "../components/PageTransition.vue"
import { useUIStore } from "../stores/uiStore.ts"

let instance: InstanceType<typeof PageTransition> | null = null

export function registerPageTransition(
  transition: InstanceType<typeof PageTransition>
) {
  instance = transition
}

export async function cover() {
  if (!instance) return

  instance.randomizeImage()
  await nextTick()

  const uiStore = useUIStore()

  if (uiStore.isMobile) {
    await new Promise<void>((resolve) => {
      gsap.to(instance!.overlay!, {
        xPercent: 100,
        duration: 0.45,
        ease: "power3.inOut",
        onComplete: resolve
      })
    })
    return
  } 

  const overlay = instance.overlay
  const car = instance.car
  const interior = instance.interior
  const frame = instance.frame
  const crack = instance.crack
  const glass = instance.glass

  if (!overlay || !car || !interior || !frame || !crack || !glass) return

  gsap.killTweensOf([
    overlay,
    car,
    interior,
    frame,
    crack,
    glass,
  ])

  // Reset state
  gsap.set(overlay, {
    opacity: 1,
  })

  gsap.set(car, {
    xPercent: -120,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    //transformOrigin: "50% 50%",
  })

  gsap.set(frame, {
    opacity: 1,
    scale: 1,
    rotation: 0,
  })

  gsap.set(interior, {
    opacity: 0,
  })

  gsap.set(glass, {
    opacity: .8,
    x: 0,
    y: -50,
    scale: 1.1,
    rotation: 0,
    //transformOrigin: "50% 50%",
  })

  gsap.set(crack, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    //transformOrigin: "50% 50%",
  })

  const tl = gsap.timeline()

  // Car slides in
  tl.to(car, {
    xPercent: 0,
    duration: 0.8,
    ease: "power3.out",
  })

  // Slight impact shake
  tl.to(
    car,
    {
      x: 5,
      y: -3,
      duration: 0.04,
      repeat: 5,
      yoyo: true,
      ease: "none",
    },
    "+=0.05"
  )

  // Let the user actually see the cracked windshield
  tl.to({}, { duration: 0.4 })

  // Frame flexes slightly
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

// Pull the cracked windshield out of the frame
tl.to(
  [glass, crack],
  {
    x: -80,
    y: -260,

    rotation: -6,
    rotationY: -12,
    rotationX: 8,

    scale: 1.35,

    filter: "blur(8px)",

    opacity: 0,

    duration: 0.9,
    ease: "power2.in",
  },
  "<"
)

  // Reveal the interior as soon as the windshield leaves
  tl.set(
    interior,
    {
      opacity: 1,
    },
    "<"
  )

  await new Promise<void>((resolve) => {
    tl.eventCallback("onComplete", () => resolve())
  })
}

export async function reveal() {
  if (!instance) return

  const uiStore = useUIStore()

  if (uiStore.isMobile) {
    await new Promise<void>((resolve) => {
      gsap.to(instance!.overlay!, {
        xPercent: 200,
        duration: 0.45,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(instance!.overlay!, {
            xPercent: -100
          })

          resolve()
        }
      })
    })
    return
  }

  const overlay = instance.overlay
  const car = instance.car
  const interior = instance.interior
  const frame = instance.frame
  const crack = instance.crack
  const glass = instance.glass

  if (!overlay || !car || !interior || !frame || !crack || !glass) return

  gsap.killTweensOf([
    overlay,
    car,
    interior,
    frame,
    crack,
    glass,
  ])

  // Start where cover() left off.
  gsap.set(car, {
    xPercent: 0,
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    transformOrigin: "50% 50%",
  })

  gsap.set(frame, {
    opacity: 1,
  })

  gsap.set(interior, {
    opacity: 0,
  })

  // Crack is gone.
  gsap.set(crack, {
    opacity: 0,
  })

  // Fresh windshield is already installed.
   gsap.set(glass, {
    opacity: 0.8,
    x: 0,
    y: -50,
    scale: 1.1,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    filter: "blur(0px)",
  }) 


  const tl = gsap.timeline()

  // Give the eye a moment to register the new windshield.
  tl.to({}, {
    duration: 0.15,
  })

  // Camera flies through the windshield.
  tl.to(
    car,
    {
      scale: 3.25,
      y: 80,
      duration: 1.4,
      ease: "power2.in",
      //transformOrigin: "50% 50%",
    },
    "<"
  )

  // Fade the overlay near the end so the new page is fully visible.
  tl.to(
    overlay,
    {
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
    },
    "-=0.4"
  )

  // Reset everything for the next navigation.
  tl.set(overlay, {
    opacity: 1,
  })

  tl.set(car, {
    xPercent: -120,
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    rotation: 0,
  })

  tl.set(interior, {
    opacity: 0,
  })

  tl.set(frame, {
    opacity: 1,
  })

  tl.set(glass, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    filter: "blur(0px)",
  })

  tl.set(crack, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    filter: "blur(0px)",
  })

  await new Promise<void>((resolve) => {
    tl.eventCallback("onComplete", () => resolve())
  })
}