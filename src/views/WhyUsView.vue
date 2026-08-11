<template>
  <div class="landing-page detail-page">
    <SiteHeader />
    <main class="detail-page__main">
      <section class="detail-hero detail-hero--why">
        <div><p class="eyebrow"><span></span> The Burning River difference</p><h1>Back on the road, safely and swiftly.</h1><p>We are rooted in North East Ohio and committed to personalized service, honest answers, and glass work that leaves your vehicle ready for the drive ahead.</p></div>
        <div class="detail-hero__stat"><strong>Local</strong><span>North East Ohio service</span></div>
      </section>
      <section class="detail-story">
        <p>At Burning River Auto Glass, we're not just fixing windshields - we're helping you stay safe on the road, all from the comfort of your location in North East Ohio! Our friendly team is here to take care of all your automotive glass needs, whether it's a cracked windshield, a shattered door glass, back glass or a stone chip. We value your time and convenience, which is why we come to you.</p>
        <p>Don't hesitate to reach out, as we're passionate about what we do and proud of our top-notch service! Remember, it's not just a repair; it's our commitment to keep you driving with confidence. Let us bring our services to your doorstep!</p>
      </section>
      <section class="why-grid">
        <article><span class="detail-card__number">01</span><h2>We come to you</h2><p>Your time matters. Our mobile team works at your home, workplace, lot, or roadside so your day can keep moving.</p></article>
        <article><span class="detail-card__number">02</span><h2>Family owned and operated</h2><p>You do not need to sound fancy with us. We explain what matters, answer the real question, and treat your vehicle like it matters because it does.</p></article>
        <article><span class="detail-card__number">03</span><h2>We stand behind the work</h2><p>Replacement work includes a limited-lifetime warranty against workmanship and material defects, giving you confidence after the glass is in.</p></article>
      </section>
      <section class="detail-callout detail-callout--why"><p class="eyebrow"><span></span> North East Ohio roots</p><h2>Your story matters.<br><em>So does your safety.</em></h2><p>From a single stone chip to a shattered door glass, we are here to make the next step feel straightforward.</p><RouterLink class="button button--orange" to="/contact">Meet us at your location <span>-></span></RouterLink></section>
    </main>
    <footer class="landing-footer"><span>Burning River Auto Glass</span><span>Serving Cleveland and Northeast Ohio</span></footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import SiteHeader from '../components/SiteHeader.vue'
</script>
