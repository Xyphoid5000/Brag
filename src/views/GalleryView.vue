<template>
  <div class="landing-page gallery-page">
    <SiteHeader />
    <main class="gallery-page__main">
      <section class="gallery-intro">
        <div>
          <p class="eyebrow"><span></span> In the field</p>
          <h1>Good work leaves a <em>clear</em> trace.</h1>
        </div>
        <p>From first look to clean finish, this is the kind of care we bring to every mobile glass job across Northeast Ohio.</p>
      </section>
      <section class="gallery-grid" aria-label="Burning River Auto Glass gallery">
        <figure class="gallery-card gallery-card--wide">
          <img src="https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1400&q=85" alt="Vehicle traveling on an open road" />
          <figcaption><span>01</span><strong>Back on the road</strong><small>Mobile service, wherever the day finds you.</small></figcaption>
        </figure>
        <figure class="gallery-card">
          <img src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=900&q=85" alt="Technician working on a vehicle" />
          <figcaption><span>02</span><strong>Precise by hand</strong><small>Clean work. Careful finish.</small></figcaption>
        </figure>
        <figure class="gallery-card gallery-card--tall">
          <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=85" alt="Close view of a polished vehicle" />
          <figcaption><span>03</span><strong>Made to fit</strong><small>Windshield, side, and rear glass.</small></figcaption>
        </figure>
        <figure class="gallery-card gallery-card--wide gallery-card--accent">
          <div class="gallery-card__statement"><p class="eyebrow"><span></span> The Burning River standard</p><h2>Clear glass.<br><em>Clear answers.</em></h2><RouterLink class="button button--orange" to="/contact">Start your quote <span>-></span></RouterLink></div>
          <figcaption><span>04</span><strong>Built for the drive ahead</strong><small>North East Ohio, at your location.</small></figcaption>
        </figure>
      </section>
    </main>
    <footer class="landing-footer"><span>Burning River Auto Glass</span><span>Serving Cleveland and Northeast Ohio</span></footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import SiteHeader from '../components/SiteHeader.vue'
</script>
