import gsap from "gsap"
import { nextTick } from "vue"
import type PageTransition from "../components/PageTransition.vue"
import { useUIStore } from "../stores/uiStore.ts"

type ITransitionElements = {
  overlay: HTMLDivElement | null;
  mobileLayer: HTMLDivElement | null;
  desktopLayer: HTMLDivElement | null;
  crack: HTMLImageElement | null;
  frame: HTMLImageElement | null;
  glass: HTMLImageElement | null;
  interior: HTMLImageElement | null;
  isMobile: boolean;
}

let instance: InstanceType<typeof PageTransition> | null = null;

export function registerPageTransition(transition: InstanceType<typeof PageTransition>) {
  instance = transition;
};

async function elements(isEnter: boolean): Promise<ITransitionElements | null> {
  const store = useUIStore();

  if (!instance || (!store.animationPlayed  && !store.isMobile)) return null

  if (isEnter) {
    instance.randomizeImage();
    await nextTick();
  }

  const elements: ITransitionElements = {
    overlay: instance.overlay,
    mobileLayer: instance.mobileLayer,
    desktopLayer: instance.desktopLayer,
    crack: instance.crack,
    frame: instance.frame,
    glass: instance.glass,
    interior: instance.interior,
    isMobile: store.isMobile,
  }

  return elements;
}

function waitForTimeline(tl: gsap.core.Timeline) {
  return new Promise<void>((resolve) => {
    tl.eventCallback("onComplete", resolve)
  });
}

async function mobileTransitionEnter(el: ITransitionElements) {
  gsap.set(el.desktopLayer,{
    autoAlpha:0
  });

  gsap.set(el.mobileLayer,{
    autoAlpha:1
  });

 const tl=gsap.timeline()

  tl.set(el.crack,{
      opacity:0,
      scale:.92,
      xPercent:0
  });

  tl.to(el.crack,{
      opacity:1,
      scale:1,
      duration:.15
  });

  tl.to({},{
      duration:.3
  });

  await waitForTimeline(tl);
};

async function transitionEnter(el: ITransitionElements) {

  gsap.set(el.desktopLayer,{
      autoAlpha:1
  });

  gsap.set(el.mobileLayer,{
      autoAlpha:0
  });

  if (!el.overlay || !el.desktopLayer || !el.interior || !el.frame || !el.crack || !el.glass) return;

  gsap.killTweensOf([
    el.overlay,
    el.desktopLayer,
    el.interior,
    el.frame,
    el.crack,
    el.glass,
  ]);

  // Reset state
  gsap.set(el.overlay, {
    autoAlpha: 1,
  });

  gsap.set(el.desktopLayer, {
    xPercent: -120,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    transformOrigin: "50% 50%",
  });

  gsap.set(el.frame, {
    opacity: 1,
    scale: 1,
    rotation: 0,
  });

  gsap.set(el.interior, {
    opacity: 0,
  });

  gsap.set(el.glass, {
    opacity: .8,
    x: 0,
    y: -50,
    scale: 1.1,
    rotation: 0,
    transformOrigin: "center center",
  });

  gsap.set(el.crack, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    transformOrigin: "50% 50%",
  });

  const tl = gsap.timeline();

  // Car slides in
  tl.to(el.desktopLayer, {
    xPercent: 0,
    duration: 0.8,
    ease: "power3.out",
  });

  // Slight impact shake
  tl.to(
    el.desktopLayer,
    {
      x: 5,
      y: -3,
      duration: 0.04,
      repeat: 5,
      yoyo: true,
      ease: "none",
    },
    "+=0.05"
  );

  // Let the user actually see the cracked windshield
  tl.to({}, { duration: 0.5 });

  // Frame flexes slightly
  tl.to(
    el.frame,
    {
      rotation: -0.6,
      duration: 0.08,
      repeat: 1,
      yoyo: true,
      ease: "power1.inOut",
    },
    "<"
  );

  // Pull the cracked windshield out of the frame
  tl.to(
    [el.glass, el.crack],
    {
      x: -80,
      y: -260,

      rotation: -6,
      rotationY: -12,
      rotationX: 8,

      scale: 1.35,

      filter: "blur(8px)",

      opacity: 0,

      duration: 1,
      ease: "power2.in",
    }, 
    "<"
  );

  // Reveal the interior as soon as the windshield leaves
  tl.set(
    el.interior,
    {
      opacity: 1,
    },
    "<"
  );

  await waitForTimeline(tl);
}

async function mobileTransitionExit(el: ITransitionElements) {
  const tl=gsap.timeline();

  tl.to(el.crack,{
      xPercent:120,
      opacity:0,
      duration:.35,
      ease:"power2.in"
  })

  tl.set(el.mobileLayer,{
      autoAlpha:0
  })

  await waitForTimeline(tl);
};

async function transitionExit(el: ITransitionElements) {
  if (!el.overlay || !el.desktopLayer || !el.interior || !el.frame || !el.crack || !el.glass) return;

  gsap.killTweensOf([
    el.overlay,
    el.desktopLayer,
    el.interior,
    el.frame,
    el.crack,
    el.glass,
  ]);

  // Start where cover() left off.
  gsap.set(el.desktopLayer, {
    xPercent: 0,
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    transformOrigin: "50% 50%",
  });

  gsap.set(el.frame, {
    opacity: 1,
  });

  gsap.set(el.interior, {
    opacity: 1,
  });

  // Crack is gone.
  gsap.set(el.crack, {
    opacity: 0,
  });

  const tl = gsap.timeline();

    tl.fromTo(el.glass, {
      x: -80,
      y: -260,

      rotation: -6,
      rotationY: -12,
      rotationX: 8,

      scale: 1.35,

      filter: "blur(8px)",

      opacity: 0.5,
    },
    {
    opacity: 0.8,
    x: 0,
    y: -50,
    scale: 1.1,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    filter: "blur(0px)",
    duration: 1,
    ease: "power1.in"
  });

  tl.to(el.interior, {
    opacity: 0,
    duration: 1,
    ease: "power2.out"
  }, "<");

  // Give the eye a moment to register the new windshield.
  tl.to({}, {
    duration: 0.5,
  });

  // Camera flies through the windshield.
  tl.to(
    el.desktopLayer,
    {
      scale: 3.25,
      y: 80,
      duration: 1.4,
      ease: "power2.in",
      transformOrigin: "50% 50%",
    },
    "<"
  );

  // Fade the overlay near the end so the new page is fully visible.
  tl.to(
    el.overlay,
    {
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
    },
    "-=0.4"
  );

  // Reset everything for the next navigation.
  tl.set(el.overlay, {
    opacity: 1,
  });

  tl.set(el.desktopLayer, {
    xPercent: -120,
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    rotation: 0,
  });

  tl.set(el.interior, {
    opacity: 0,
  });

  tl.set(el.frame, {
    opacity: 1,
  });

  tl.set(el.glass, {
    opacity: 0,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    filter: "blur(0px)",
  });

  tl.set(el.crack, {
    opacity: 0,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    filter: "blur(0px)",
  });

  await waitForTimeline(tl);
};

export async function cover() {
  const el = await elements(true);
  if (!el) return;

  if (el.isMobile) {
    return await mobileTransitionEnter(el);
  } 

  return await transitionEnter(el);
};

export async function reveal() {
  const el = await elements(false);
  if (!el) return;

  if (el.isMobile) {
    return await mobileTransitionExit(el);
  } 

  return await transitionExit(el);
};