<script setup lang="ts">
const links = [
  { label: 'Email', href: 'mailto:burningriverautoglass@gmail.com', icon: 'email' },
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61560531697293', icon: 'facebook' },
  { label: 'Yelp', href: 'https://www.yelp.com/biz/burning-river-auto-glass-garrettsville', icon: 'yelp' },
]
</script>

<template>
  <nav class="social-button-bar" aria-label="Social links">
    <a v-for="link in links" :key="link.label" class="social-button" :href="link.href" :target="link.icon === 'email' ? undefined : '_blank'" :rel="link.icon === 'email' ? undefined : 'noreferrer'" :aria-label="link.label">
      <svg v-if="link.icon === 'email'" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.5h18v13H3z" /><path d="m3 6 9 7 9-7" /></svg>
      <svg v-else-if="link.icon === 'facebook'" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 21v-8h2.8l.4-3H14V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a22 22 0 0 0-2.4-.1c-2.4 0-4 1.5-4 4.1V10H8.2v3H11v8h3Z" /></svg>
      <svg v-else viewBox="0 0 42 24" aria-hidden="true"><path d="M6 4h5l2.1 6.7L16 4h5l-5.2 15h-5L6 4Zm15.4 0h5l2.2 6.7L31 4h5l-5.1 15h-5l-4.5-15Zm14.1 0H42l-4.5 15h-5l3-10H35l.5-5Z" /></svg>
      <span>{{ link.label }}</span>
    </a>
  </nav>
</template>
