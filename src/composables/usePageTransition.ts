import gsap from "gsap"
import { nextTick } from "vue"
import type PageTransition from "../components/PageTransition.vue"

let instance: InstanceType<typeof PageTransition> | null = null

const window = document.querySelector<HTMLElement>('.ovrlay-window');
const glass = document.querySelector<HTMLElement>('.ovrlay-glass');
const interior = document.querySelector<HTMLElement>('.ovrlay-interior');
const crack = document.querySelector<HTMLElement>('.ovrlay-crack');

export function registerPageTransition(
  transition: InstanceType<typeof PageTransition>
) {
  instance = transition
}

export async function cover() {
  if (!instance) return

  instance.randomizeImage();
  await nextTick()

  await new Promise<void>((resolve) => {
    gsap.to(instance!.overlay!, {
      xPercent: 100,
      duration: 0.45,
      ease: "power3.inOut",
    })
    
  })
}

export async function reveal() {
  if (!instance) return

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
}