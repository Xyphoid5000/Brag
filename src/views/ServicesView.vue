<template>
  <div class="landing-page detail-page">
    <main class="detail-page__main">
      <section class="detail-hero">
        <div><p class="eyebrow"><span></span> Mobile glass service</p><h1>Your small-town glass experts.</h1><p>Quality service should come to you. Burning River Auto Glass handles repairs and replacements at your location across North East Ohio.</p></div>
        <RouterLink class="button button--orange" to="/contact">Get a free quote <span>-></span></RouterLink>
      </section>
      <section class="detail-grid detail-grid--services">
        <article class="detail-card"><span class="detail-card__number">01 / $75 PER CHIP</span><h2>Chip repairs</h2><p>Our quick, reliable chip repair service is built for damage that has not spread. We come to your location and help stop a small problem from becoming a full replacement.</p><strong>Up to 3 chips per windshield</strong></article>
        <article class="detail-card"><span class="detail-card__number">02 / STARTING AT $125</span><h2>Glass replacements</h2><p>We replace windshields, side glass, and rear glass directly at your location, minimizing disruption to your day. Cleanup is included when the work is finished.</p><strong>Limited-lifetime workmanship and materials warranty</strong></article>
        <article class="detail-card detail-card--wide"><span class="detail-card__number">03 / VARIABLE PRICING</span><h2>Heavy-equipment glass</h2><p>For construction, agriculture, and other heavy-duty applications, we measure and cut durable, safety-rated laminated glass on-site. Less downtime, a precise fit, and better visibility for operators.</p><strong>Measured and cut at your location</strong></article>
      </section>
      <section class="detail-callout"><p class="eyebrow"><span></span> Built for your day</p><h2>Mobile by design.<br><em>Careful by choice.</em></h2><p>Whether you have a stone chip, shattered door glass, or a damaged back glass, our friendly team brings the work to your doorstep.</p><RouterLink class="button button--quiet" to="/contact">Talk through your glass needs <span>-></span></RouterLink></section>
    </main>
    <footer class="landing-footer"><span>Burning River Auto Glass</span><span>Serving Cleveland and Northeast Ohio</span></footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
