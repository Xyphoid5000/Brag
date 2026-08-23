<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue"

import vanGame from "../assets/breakroom/van_game.png"
import rockImage from "../assets/breakroom/rock.png"

import glass01 from "../assets/Glass01.png"
import glass02 from "../assets/Glass02.png"
import glass03 from "../assets/Glass03.png"
import glass04 from "../assets/glass04.png"
import glass05 from "../assets/glass05.png"

interface Rock {
  id: number

  x: number
  y: number

  startX: number
  startY: number

  targetX: number
  targetY: number

  depth: number
  speed: number

  maxSize: number

  rotation: number
  rotationSpeed: number
}

interface RoadStreak {
  depth: number
  offset: number
  width: number
  length: number
  speed: number
  opacity: number
}

/* -------------------------------------------------------
   GAME STATE
------------------------------------------------------- */

const canvas = ref<HTMLCanvasElement | null>(null)

const score = ref(0)

const highScore = ref(
  Number(
    localStorage.getItem(
      "burningRiverBreakroomHighScore"
    ) || 0
  )
)

const gameStarted = ref(false)
const gameOver = ref(false)
const damage = ref(0)

const crackSources = [
  glass01,
  glass02,
  glass03,
  glass04,
  glass05,
]

/* -------------------------------------------------------
   CANVAS
------------------------------------------------------- */

let ctx: CanvasRenderingContext2D | null = null

let animationFrame = 0
let lastTime = 0
let spawnTimer = 0
let rockId = 0

let canvasWidth = 0
let canvasHeight = 0

const rocks: Rock[] = []
const roadStreaks: RoadStreak[] = []

/* -------------------------------------------------------
   IMAGE ASSETS
------------------------------------------------------- */

const backgroundImage = new Image()
backgroundImage.src = vanGame

const rockAsset = new Image()
rockAsset.src = rockImage

const crackImages = crackSources.map(
  (source) => {
    const image = new Image()
    image.src = source
    return image
  }
)

/* -------------------------------------------------------
   RESIZE
------------------------------------------------------- */

const resizeCanvas = () => {
  if (!canvas.value) {
    return
  }

  const rect =
    canvas.value.getBoundingClientRect()

  const dpr = Math.min(
    window.devicePixelRatio || 1,
    2
  )

  canvasWidth = rect.width
  canvasHeight = rect.height

  canvas.value.width =
    Math.round(rect.width * dpr)

  canvas.value.height =
    Math.round(rect.height * dpr)

  ctx =
    canvas.value.getContext("2d")

  if (!ctx) {
    return
  }

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  )

  /*
   * Rebuild the road streaks when the canvas
   * changes size so the perspective stays clean.
   */
  createRoadStreaks()
}

/* -------------------------------------------------------
   WINDSHIELD GEOMETRY
------------------------------------------------------- */

/*
 * The windshield in van_game.png is approximately:
 *
 *              13%              87%
 *                ┌──────────────┐
 *               /                \
 *              /                  \
 *             /                    \
 *            /                      \
 *           └────────────────────────┘
 *          3%                        97%
 *
 * It becomes wider toward the bottom.
 */

const getWindshieldGeometry = () => {
  const top = canvasHeight * 0.13
  const bottom = canvasHeight * 0.61

  const topLeft = canvasWidth * 0.13
  const topRight = canvasWidth * 0.87

  const bottomLeft = canvasWidth * 0.03
  const bottomRight = canvasWidth * 0.97

  return {
    top,
    bottom,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
  }
}

const getWindshieldBoundsAtY = (
  y: number
) => {
  const geometry =
    getWindshieldGeometry()

  const progress =
    (
      y - geometry.top
    ) /
    (
      geometry.bottom -
      geometry.top
    )

  const t = Math.max(
    0,
    Math.min(1, progress)
  )

  const left =
    geometry.topLeft +
    (
      geometry.bottomLeft -
      geometry.topLeft
    ) *
      t

  const right =
    geometry.topRight +
    (
      geometry.bottomRight -
      geometry.topRight
    ) *
      t

  return {
    left,
    right,
  }
}

const clipWindshield = () => {
  if (!ctx) {
    return
  }

  const geometry =
    getWindshieldGeometry()

  ctx.beginPath()

  ctx.moveTo(
    geometry.topLeft,
    geometry.top
  )

  ctx.lineTo(
    geometry.topRight,
    geometry.top
  )

  ctx.lineTo(
    geometry.bottomRight,
    geometry.bottom
  )

  ctx.lineTo(
    geometry.bottomLeft,
    geometry.bottom
  )

  ctx.closePath()

  ctx.clip()
}

/* -------------------------------------------------------
   ROAD MOTION
------------------------------------------------------- */

/*
 * Vanishing point of the road.
 *
 * This should line up roughly with where the
 * road disappears into the distance in
 * van_game.png.
 */
const getRoadVanishingPoint = () => {
  return {
    x: canvasWidth * 0.5,
    y: canvasHeight * 0.315,
  }
}

/*
 * Create a collection of road streaks.
 *
 * These aren't literal road lines. They're subtle
 * perspective highlights that move toward the viewer.
 */
const createRoadStreaks = () => {
  roadStreaks.length = 0

  const count = 18

  for (let i = 0; i < count; i++) {
    roadStreaks.push({
      depth: Math.random(),

      offset:
        Math.random() * 2 - 1,

      width:
        1 +
        Math.random() * 2.5,

      length:
        0.015 +
        Math.random() * 0.035,

      speed:
        0.28 +
        Math.random() * 0.18,

      opacity:
        0.08 +
        Math.random() * 0.12,
    })
  }
}

/*
 * Convert a streak's depth into an actual road position.
 *
 * As depth increases, the point moves from the
 * vanishing point toward the bottom of the road.
 */
const getRoadPoint = (
  depth: number,
  offset: number
) => {
  const vanishing =
    getRoadVanishingPoint()

  /*
   * The road gets substantially wider as it
   * approaches the viewer.
   */
  const bottomY =
    canvasHeight * 0.72

  const y =
    vanishing.y +
    (
      bottomY -
      vanishing.y
    ) *
      depth

  /*
   * Width of the road at this depth.
   */
  const roadHalfWidth =
    canvasWidth *
    (
      0.025 +
      depth * 0.46
    )

  /*
   * Keep streaks mostly on the actual road.
   */
  const x =
    vanishing.x +
    offset *
      roadHalfWidth

  return {
    x,
    y,
  }
}

const updateRoadStreaks = (
  delta: number
) => {
  for (
    const streak of roadStreaks
  ) {
    /*
     * Motion gets faster toward the viewer.
     */
    const speedMultiplier =
      0.8 +
      streak.depth * 1.8

    streak.depth +=
      streak.speed *
      speedMultiplier *
      delta

    /*
     * Respawn at the horizon.
     */
    if (
      streak.depth >= 1
    ) {
      streak.depth = 0

      streak.offset =
        Math.random() * 2 - 1

      streak.width =
        1 +
        Math.random() * 2.5

      streak.length =
        0.015 +
        Math.random() * 0.035

      streak.speed =
        0.28 +
        Math.random() * 0.18

      streak.opacity =
        0.08 +
        Math.random() * 0.12
    }
  }
}

const drawRoadMotion = () => {
  if (!ctx) {
    return
  }

  const vanishing =
    getRoadVanishingPoint()

  /*
   * The road itself is already present in the
   * background image. We're only adding motion
   * highlights.
   */
  for (
    const streak of roadStreaks
  ) {
    const point =
      getRoadPoint(
        streak.depth,
        streak.offset
      )

    /*
     * Don't show much motion at the horizon.
     */
    const visibility =
      Math.min(
        1,
        streak.depth * 3
      )

    /*
     * Streaks become longer as they approach
     * the viewer.
     */
    const length =
      streak.length *
      canvasHeight *
      (
        0.4 +
        streak.depth * 2.8
      )

    /*
     * Direction follows the perspective lines
     * back toward the vanishing point.
     */
    const dx =
      point.x -
      vanishing.x

    const dy =
      point.y -
      vanishing.y

    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      ) || 1

    const directionX =
      dx / distance

    const directionY =
      dy / distance

    /*
     * Start slightly behind the current position
     * and extend toward the viewer.
     */
    const startX =
      point.x -
      directionX * length

    const startY =
      point.y -
      directionY * length

    /*
     * Road motion should fade at the very beginning
     * and end of the streak.
     */
    const alpha =
      streak.opacity *
      visibility *
      Math.min(
        1,
        streak.depth * 2
      )

    ctx.save()

    ctx.globalAlpha =
      alpha

    ctx.lineWidth =
      streak.width *
      (
        0.5 +
        streak.depth * 1.5
      )

    /*
     * A soft neutral highlight rather than
     * a bright white arcade-game streak.
     */
    ctx.strokeStyle =
      "rgba(220, 214, 190, 0.75)"

    ctx.lineCap = "round"

    ctx.beginPath()

    ctx.moveTo(
      startX,
      startY
    )

    ctx.lineTo(
      point.x,
      point.y
    )

    ctx.stroke()

    ctx.restore()
  }
}

/* -------------------------------------------------------
   GAME STATE
------------------------------------------------------- */

const resetGame = () => {
  score.value = 0
  damage.value = 0
  gameOver.value = false

  rocks.length = 0

  spawnTimer = 0
  lastTime = performance.now()

  createRoadStreaks()

  gameStarted.value = true

  cancelAnimationFrame(
    animationFrame
  )

  animationFrame =
    requestAnimationFrame(
      gameLoop
    )
}

const startGame = () => {
  resetGame()
}

const endGame = () => {
  gameOver.value = true
  gameStarted.value = false

  if (
    score.value >
    highScore.value
  ) {
    highScore.value =
      score.value

    localStorage.setItem(
      "burningRiverBreakroomHighScore",
      String(score.value)
    )
  }
}

/* -------------------------------------------------------
   ROCK SPAWNING
------------------------------------------------------- */

const spawnRock = () => {
  const geometry =
    getWindshieldGeometry()

  /*
   * Rocks begin near the road/horizon.
   */
  const startY =
    canvasHeight * 0.28

  const startBounds =
    getWindshieldBoundsAtY(
      startY
    )

  const startPadding =
    (
      startBounds.right -
      startBounds.left
    ) * 0.12

  const startX =
    startBounds.left +
    startPadding +
    Math.random() *
      (
        startBounds.right -
        startBounds.left -
        startPadding * 2
      )

  /*
   * Impact can happen anywhere on the
   * windshield glass.
   */
  const targetY =
    geometry.top +
    (
      geometry.bottom -
      geometry.top
    ) *
      (
        0.35 +
        Math.random() * 0.55
      )

  const targetBounds =
    getWindshieldBoundsAtY(
      targetY
    )

  const targetPadding =
    (
      targetBounds.right -
      targetBounds.left
    ) * 0.08

  const targetX =
    targetBounds.left +
    targetPadding +
    Math.random() *
      (
        targetBounds.right -
        targetBounds.left -
        targetPadding * 2
      )

  rocks.push({
    id: rockId++,

    x: startX,
    y: startY,

    startX,
    startY,

    targetX,
    targetY,

    depth: 0,

    speed:
      0.18 +
      Math.random() * 0.08 +
      Math.min(
        score.value / 15000,
        0.08
      ),

    maxSize:
      100 +
      Math.random() * 70,

    rotation:
      Math.random() *
      Math.PI *
      2,

    rotationSpeed:
      (
        Math.random() -
        0.5
      ) * 3,
  })
}

/* -------------------------------------------------------
   UPDATE ROCKS
------------------------------------------------------- */

const updateRocks = (
  delta: number
) => {
  for (
    let i = rocks.length - 1;
    i >= 0;
    i--
  ) {
    const rock = rocks[i]

    rock.depth +=
      rock.speed * delta

    const progress =
      Math.min(
        rock.depth,
        1
      )

    const easedProgress =
      progress * progress

    rock.x =
      rock.startX +
      (
        rock.targetX -
        rock.startX
      ) *
        easedProgress

    rock.y =
      rock.startY +
      (
        rock.targetY -
        rock.startY
      ) *
        easedProgress

    rock.rotation +=
      rock.rotationSpeed *
      delta

    if (
      rock.depth >= 1
    ) {
      rocks.splice(i, 1)

      damage.value++

      if (
        damage.value >=
        crackSources.length
      ) {
        endGame()
        return
      }
    }
  }
}

/* -------------------------------------------------------
   BACKGROUND
------------------------------------------------------- */

const drawBackground = () => {
  if (!ctx) {
    return
  }

  if (
    backgroundImage.complete &&
    backgroundImage.naturalWidth > 0
  ) {
    ctx.drawImage(
      backgroundImage,
      0,
      0,
      canvasWidth,
      canvasHeight
    )
  } else {
    ctx.fillStyle =
      "#111814"

    ctx.fillRect(
      0,
      0,
      canvasWidth,
      canvasHeight
    )
  }
}

/* -------------------------------------------------------
   ROCK DRAWING
------------------------------------------------------- */

const drawRock = (
  rock: Rock
) => {
  if (!ctx) {
    return
  }

  if (
    !rockAsset.complete ||
    rockAsset.naturalWidth <= 0
  ) {
    return
  }

  const scale =
    0.08 +
    rock.depth * 0.92

  const size =
    rock.maxSize *
    scale

  const opacity =
    Math.min(
      1,
      0.35 +
        rock.depth * 0.9
    )

  ctx.save()

  ctx.translate(
    rock.x,
    rock.y
  )

  ctx.rotate(
    rock.rotation
  )

  ctx.globalAlpha =
    opacity

  ctx.drawImage(
    rockAsset,
    -size / 2,
    -size / 2,
    size,
    size
  )

  ctx.restore()
}

/* -------------------------------------------------------
   CRACK DRAWING
------------------------------------------------------- */

const drawCracks = () => {
  if (!ctx) {
    return
  }

  if (
    damage.value <= 0
  ) {
    return
  }

  const index =
    Math.min(
      damage.value - 1,
      crackImages.length - 1
    )

  const crack =
    crackImages[index]

  if (
    !crack.complete ||
    crack.naturalWidth <= 0
  ) {
    return
  }

  ctx.save()

  ctx.globalAlpha = 0.95

  ctx.drawImage(
    crack,
    0,
    0,
    canvasWidth,
    canvasHeight
  )

  ctx.restore()
}

/* -------------------------------------------------------
   DRAW
------------------------------------------------------- */

const draw = () => {
  if (!ctx) {
    return
  }

  ctx.clearRect(
    0,
    0,
    canvasWidth,
    canvasHeight
  )

  /*
   * 1. Complete van interior.
   */
  drawBackground()

  /*
   * 2. Everything below is restricted
   *    to the windshield.
   */
  ctx.save()

  clipWindshield()

  /*
   * 3. Road movement.
   *
   * This is deliberately BEFORE the rocks,
   * so the rocks appear to be coming toward
   * the moving vehicle.
   */
  drawRoadMotion()

  /*
   * 4. Rocks.
   */
  rocks.forEach(
    drawRock
  )

  /*
   * 5. Windshield damage.
   */
  drawCracks()

  /*
   * 6. Restore the canvas.
   */
  ctx.restore()
}

/* -------------------------------------------------------
   POINTER / TOUCH
------------------------------------------------------- */

const handlePointer = (
  event: PointerEvent
) => {
  if (
    !gameStarted.value ||
    gameOver.value
  ) {
    return
  }

  const rect =
    canvas.value?.getBoundingClientRect()

  if (!rect) {
    return
  }

  const pointerX =
    event.clientX -
    rect.left

  const pointerY =
    event.clientY -
    rect.top

  const geometry =
    getWindshieldGeometry()

  if (
    pointerY <
      geometry.top ||
    pointerY >
      geometry.bottom
  ) {
    return
  }

  const bounds =
    getWindshieldBoundsAtY(
      pointerY
    )

  if (
    pointerX <
      bounds.left ||
    pointerX >
      bounds.right
  ) {
    return
  }

  /*
   * Check the closest/front-most rock first.
   */
  for (
    let i = rocks.length - 1;
    i >= 0;
    i--
  ) {
    const rock = rocks[i]

    const scale =
      0.08 +
      rock.depth * 0.92

    const size =
      rock.maxSize *
      scale

    const dx =
      rock.x -
      pointerX

    const dy =
      rock.y -
      pointerY

    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      )

    if (
      distance <=
      size * 0.55
    ) {
      rocks.splice(i, 1)

      const points =
        Math.round(
          10 +
            rock.depth *
              20
        )

      score.value +=
        points

      return
    }
  }
}

/* -------------------------------------------------------
   GAME LOOP
------------------------------------------------------- */

const gameLoop = (
  time: number
) => {
  if (
    !gameStarted.value
  ) {
    return
  }

  const delta =
    Math.min(
      (time - lastTime) /
        1000,
      0.05
    )

  lastTime = time

  /*
   * Road movement runs continuously.
   */
  updateRoadStreaks(
    delta
  )

  spawnTimer +=
    delta

  /*
   * Rocks spawn progressively faster.
   */
  const spawnRate =
    Math.max(
      0.3,
      0.9 -
        score.value /
          1800
    )

  if (
    spawnTimer >=
    spawnRate
  ) {
    spawnTimer = 0

    spawnRock()
  }

  updateRocks(
    delta
  )

  draw()

  if (
    gameStarted.value
  ) {
    animationFrame =
      requestAnimationFrame(
        gameLoop
      )
  }
}

/* -------------------------------------------------------
   LIFECYCLE
------------------------------------------------------- */

onMounted(() => {
  resizeCanvas()

  window.addEventListener(
    "resize",
    resizeCanvas
  )

  draw()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(
    animationFrame
  )

  window.removeEventListener(
    "resize",
    resizeCanvas
  )
})
</script>

<template>
  <section class="windshield-game">
    <div class="game-header">
      <div>
        <span class="eyebrow">
          BURNING RIVER
        </span>

        <h1>
          Windshield Rescue
        </h1>
      </div>

      <div class="score">
        <span>
          Score
        </span>

        <strong>
          {{ score }}
        </strong>
      </div>
    </div>

    <div class="game-shell">
      <div class="windshield">
        <canvas
          ref="canvas"
          @pointerdown="handlePointer"
        />

        <!-- Start screen -->
        <div
          v-if="
            !gameStarted &&
            !gameOver
          "
          class="game-screen"
        >
          <div class="game-card">
            <span class="eyebrow">
              WINDSHIELD DEFENSE
            </span>

            <h2>
              Protect the glass.
            </h2>

            <p>
              Rocks are coming. Tap or click
              them before they hit the windshield.
            </p>

            <button
              class="start-button"
              @click="startGame"
            >
              Start Driving
            </button>

            <span class="high-score">
              High score:
              {{ highScore }}
            </span>
          </div>
        </div>

        <!-- Game over -->
        <div
          v-if="gameOver"
          class="game-screen"
        >
          <div class="game-card">
            <span class="eyebrow">
              WINDSHIELD FAILURE
            </span>

            <h2>
              That one got through.
            </h2>

            <p class="final-score">
              {{ score }}
            </p>

            <p>
              Your windshield took a beating.
            </p>

            <button
              class="start-button"
              @click="startGame"
            >
              Try Again
            </button>

            <RouterLink
              class="quote-button"
              to="/contact"
            >
              Get a free quote
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div class="game-footer">
      <span>
        High score: {{ highScore }}
      </span>

      <span>
        Click the rocks before they hit.
      </span>
    </div>
  </section>
</template>

<style scoped>
.windshield-game {
  min-height: 100vh;

  padding:
    3rem
    clamp(1rem, 4vw, 4rem);

  background: #111814;
  color: #f4f2eb;

  display: flex;
  flex-direction: column;
}

.game-header {
  width: min(
    1100px,
    100%
  );

  margin:
    0 auto
    1.5rem;

  display: flex;

  align-items: end;
  justify-content: space-between;

  gap: 2rem;
}

.eyebrow {
  display: block;

  margin-bottom: 0.5rem;

  color: #718d78;

  font-size: 0.7rem;
  font-weight: 800;

  letter-spacing: 0.18em;
}

h1 {
  margin: 0;

  font-size: clamp(
    2rem,
    5vw,
    4rem
  );

  line-height: 0.95;
}

.score {
  text-align: right;
}

.score span,
.high-score {
  display: block;

  color:
    rgba(
      244,
      242,
      235,
      0.55
    );

  font-size: 0.75rem;

  letter-spacing: 0.08em;

  text-transform: uppercase;
}

.score strong {
  font-size: 2rem;
}

.game-shell {
  width: min(
    1100px,
    100%
  );

  margin: 0 auto;

  flex: 1;

  display: flex;

  align-items: center;
  justify-content: center;
}

.windshield {
  position: relative;

  width: 100%;

  aspect-ratio: 16 / 9;

  overflow: hidden;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.15
    );

  border-radius: 18px;

  background: #111814;

  box-shadow:
    0 30px 80px
      rgba(0, 0, 0, 0.4),
    inset 0 0 80px
      rgba(255, 255, 255, 0.03);
}

canvas {
  position: absolute;

  inset: 0;

  width: 100%;
  height: 100%;

  cursor: crosshair;

  touch-action: none;
}

.game-screen {
  position: absolute;

  inset: 0;

  display: grid;

  place-items: center;

  padding: 1.5rem;

  background:
    rgba(
      10,
      15,
      12,
      0.45
    );

  backdrop-filter:
    blur(4px);
}

.game-card {
  width: min(
    430px,
    100%
  );

  padding:
    clamp(
      1.5rem,
      4vw,
      3rem
    );

  text-align: center;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.12
    );

  border-radius: 16px;

  background:
    rgba(
      17,
      24,
      20,
      0.88
    );

  box-shadow:
    0 25px 70px
      rgba(0, 0, 0, 0.35);
}

.game-card h2 {
  margin:
    0 0 1rem;

  font-size: clamp(
    1.7rem,
    4vw,
    2.5rem
  );
}

.game-card p {
  margin:
    0 auto
    1.5rem;

  max-width: 32rem;

  color:
    rgba(
      244,
      242,
      235,
      0.68
    );

  line-height: 1.6;
}

.start-button,
.quote-button {
  display: block;

  width: 100%;

  padding:
    0.9rem
    1.25rem;

  border-radius: 6px;

  font: inherit;
  font-weight: 700;

  text-decoration: none;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.start-button {
  border: 0;

  background: #718d78;

  color: #111814;
}

.quote-button {
  margin-top: 0.75rem;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.2
    );

  color: #f4f2eb;
}

.start-button:hover,
.quote-button:hover {
  transform:
    translateY(-2px);
}

.high-score {
  margin-top: 1rem;
}

.final-score {
  font-size: 3rem;

  font-weight: 800;

  color:
    #718d78 !important;
}

.game-footer {
  width: min(
    1100px,
    100%
  );

  margin:
    1rem auto 0;

  display: flex;

  justify-content:
    space-between;

  gap: 1rem;

  color:
    rgba(
      244,
      242,
      235,
      0.45
    );

  font-size: 0.75rem;

  text-transform: uppercase;

  letter-spacing: 0.06em;
}

@media (max-width: 700px) {
  .windshield-game {
    padding:
      1.5rem 1rem;
  }

  .game-header {
    align-items: center;
  }

  .score strong {
    font-size: 1.5rem;
  }

  .windshield {
    aspect-ratio: 16 / 9;
  }

  .game-footer {
    flex-direction: column;

    text-align: center;
  }
}
</style>