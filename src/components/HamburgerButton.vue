<template>
  <button
    class="hamburger"
    :class="{ open: modelValue }"
    type="button"
    :aria-expanded="modelValue"
    aria-label="Toggle navigation menu"
    @click="toggle"
  >
    <span></span>
    <span></span>
    <span></span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()

function toggle() {
  emit("update:modelValue", !props.modelValue)
}
</script>

<style scoped>
.hamburger {
  --color: #a54819;

  width: 52px;
  height: 52px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 7px;

  background: transparent;
  border: none;
  cursor: pointer;

  padding: 0;
  transition: transform 0.25s ease;
}

.hamburger:hover {
  transform: scale(1.12);
}

.hamburger span {
  display: block;
  width: 30px;
  height: 3px;

  background: var(--color);
  border-radius: 999px;

  transition:
    transform 0.35s cubic-bezier(.65,0,.35,1),
    opacity 0.25s ease,
    width 0.25s ease;
}

/* Open state */

.hamburger.open span:nth-child(1) {
  transform: translateY(10px) rotate(45deg);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger.open span:nth-child(3) {
  transform: translateY(-10px) rotate(-45deg);
}
</style>