export const transitionTiming = {
  glass: {
    slideIn: 0.45,
    hold: 1.5,
    slideOut: 0.45,
  },

  car: {
    enter: 0.8,
    impactShake: 0.04,
    impactRepeat: 5,
    windshieldRemoval: 0.8,
    interiorFadeIn: 0.45,
  },

  reveal: {
    windshieldInstall: 0.8,
    cameraZoom: 1.4,
    interiorFadeOut: 0.8,
    overlayFade: 0.25,
  },

  camera: {
    scale: 3.25,
    y: 80,
  },
} as const

export const preRouteRouterTime =
  transitionTiming.glass.slideIn +
  transitionTiming.glass.hold

export const carPreRouteHold =
  preRouteRouterTime -
  transitionTiming.car.enter