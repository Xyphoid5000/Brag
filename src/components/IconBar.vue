<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";

interface Props {
  size?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
});

const icons = computed(() => [
  {
    icon: "lucide:mail",
    href: "mailto:burningriverautoglass@gmail.com",
    label: "Email",
    color: "#f2efed",
  },
  {
    icon: "lucide:phone",
    href: "tel:+13303481455",
    label: "Phone",
    color: "#586128"
  },
  {
    icon: "simple-icons:facebook",
    href: "https://www.facebook.com/profile.php?id=61560531697293",
    label: "Facebook",
    color: "#1877F2",
  },
  {
    icon: "simple-icons:yelp",
    href: "https://www.yelp.com/biz/burning-river-auto-glass-garrettsville",
    label: "Yelp",
    color: "#D32323",
  },
  {
    icon: "simple-icons:youtube",
    href: "https://www.youtube.com/@burningriverautoglass",
    label: "YouTube",
    color: "#FF0000"
  },
].filter(icon => icon.href));
</script>

<template>
  <nav class="icon-bar">
    <a
      v-for="icon in icons"
      :key="icon.label"
      :href="icon.href"
      :aria-label="icon.label"
      :target="icon.href?.startsWith('http') ? '_blank' : undefined"
      :rel="icon.href?.startsWith('http') ? 'noopener noreferrer' : undefined"
      class="icon"
    >
      <Icon
        :icon="icon.icon"
        :width="props.size"
        :height="props.size"
        :style="{ color: icon.color }"
      />
    </a>
  </nav>
</template>

<style scoped>
.icon-bar {
  display: flex;
  align-items: center;
  padding: .5rem;
  background: rgba(8, 18, 31, 0.44);
  border-radius: 2rem;
  gap: 1rem;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}

.icon:hover {
  transform: scale(1.15);
  opacity: 0.8;
}
</style>