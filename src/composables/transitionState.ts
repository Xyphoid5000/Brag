export interface TransitionElements {
  overlay: HTMLDivElement | null
  desktopLayer: HTMLDivElement | null

  crack: HTMLImageElement | null
  frame: HTMLImageElement | null
  glass: HTMLImageElement | null
  interior: HTMLImageElement | null
}

export interface TransitionState {
  elements: TransitionElements

  /*
   * Component-provided helper for selecting a new
   * crack image before a transition begins.
   */
  randomizeCrack: (() => void) | null

  /*
   * Current device mode.
   */
  isMobile: boolean

  /*
   * True while either cover() or reveal() is running.
   */
  isTransitioning: boolean

  /*
   * Active GSAP timelines.
   */
  glassTimeline: gsap.core.Timeline | null
  carTimeline: gsap.core.Timeline | null
  masterTimeline: gsap.core.Timeline | null
}

export const transitionState: TransitionState = {
  elements: {
    overlay: null,
    desktopLayer: null,

    crack: null,
    frame: null,
    glass: null,
    interior: null,
  },

  randomizeCrack: null,

  isMobile: false,
  isTransitioning: false,

  glassTimeline: null,
  carTimeline: null,
  masterTimeline: null,
}

/*
|--------------------------------------------------------------------------
| Element registration
|--------------------------------------------------------------------------
*/

export function registerTransitionElements(
  elements: Partial<TransitionElements>,
) {
  Object.assign(
    transitionState.elements,
    elements,
  )
}

export function clearTransitionElements() {
  Object.assign(
    transitionState.elements,
    {
      overlay: null,
      desktopLayer: null,

      crack: null,
      frame: null,
      glass: null,
      interior: null,
    },
  )

  transitionState.randomizeCrack = null
}

/*
|--------------------------------------------------------------------------
| Crack randomizer registration
|--------------------------------------------------------------------------
*/

export function registerCrackRandomizer(
  randomizeCrack: () => void,
) {
  transitionState.randomizeCrack = randomizeCrack
}

/*
|--------------------------------------------------------------------------
| Timeline cleanup
|--------------------------------------------------------------------------
*/

export function killTimelines() {
  transitionState.masterTimeline?.kill()
  transitionState.glassTimeline?.kill()
  transitionState.carTimeline?.kill()

  transitionState.masterTimeline = null
  transitionState.glassTimeline = null
  transitionState.carTimeline = null
}