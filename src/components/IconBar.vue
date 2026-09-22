<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import facebookIcon from "@iconify-icons/simple-icons/facebook";
import yelpIcon from "@iconify-icons/simple-icons/yelp";
import youtubeIcon from "@iconify-icons/simple-icons/youtube";

interface Props {
  size?: number;
  withBackground?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  withBackground: false,
});

const icons = computed(() => [
  {
    icon: facebookIcon,
    href: "https://www.facebook.com/profile.php?id=61560531697293",
    label: "Facebook",
    color: "#1877F2",
  },
  {
    icon: yelpIcon,
    href: "https://www.yelp.com/biz/burning-river-auto-glass-garrettsville",
    label: "Yelp",
    color: "#D32323",
  },
  {
    icon: youtubeIcon,
    href: "https://www.youtube.com/@burningriverautoglass",
    label: "YouTube",
    color: "#FF0000"
  },
].filter(icon => icon.href));
</script>

<template>
  <nav class="icon-bar" :class="{ 'background': props.withBackground }">
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

<style lang="scss" scoped>
.icon-bar {
  display: flex;
  align-items: center;
  gap: 3rem;

  &.background {
    background: rgba(8, 18, 31, 0.44);
    padding: 2rem;
    border-radius: 2rem;
  }
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