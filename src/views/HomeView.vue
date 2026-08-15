<template>
  <div class="landing-page home-page">
    
    <main id="top">
      <section class="hero-panel">
        <div class="hero-panel__copy">
          <p class="eyebrow"><span></span> Cleveland's glass specialists</p>
          <h1>Clear view.<br><em>Solid</em> protection.</h1>
          <p class="hero-panel__lead">Windshield repair and auto glass replacement with the precision your drive deserves.</p>
          <div class="hero-panel__actions">
            <RouterLink class="button button--orange" to="/contact">Get a free quote <span>-></span></RouterLink>
            <a class="button button--quiet" href="#services">Explore services <span>↓</span></a>
          </div>
        </div>
        <div class="hero-panel__signal"><span class="signal-dot"></span><span>Ready when the road calls</span></div>
      </section>

      <section id="services" class="content-band">
        <div class="section-heading"><p class="eyebrow"><span></span> What we do</p><h2>Glass work that holds up.</h2></div>
        <div class="service-grid">
          <article><span class="service-number">01</span><h3>Windshield repair</h3><p>Small chips and cracks stopped before they spread.</p></article>
          <article><span class="service-number">02</span><h3>Auto glass replacement</h3><p>Precision-fit glass installed with care and confidence.</p></article>
          <article><span class="service-number">03</span><h3>Mobile service</h3><p>We come to your driveway, lot, or roadside.</p></article>
        </div>
      </section>

      <section id="why-us" class="proof-band">
        <p class="eyebrow"><span></span> Built around your day</p>
        <div><h2>Good glass work should disappear.</h2><p>Except for the peace of mind it leaves behind. Local hands, honest answers, and a clean finish every time.</p></div>
        <div class="proof-band__stat"><strong>Local</strong><span>service that comes to you</span></div>
      </section>

      <section id="contact" class="contact-band contact-band--home">
        <div class="contact-band__intro"><p class="eyebrow"><span></span> Let's get you moving</p><h2>Bring us the damage.<br>We'll bring the fix.</h2><p class="contact-band__copy">Ready for a clearer view? Tell us what happened and we'll help with the next step.</p></div>
        <div class="home-contact__actions"><RouterLink class="button button--orange" to="/contact">Get a free quote <span>-></span></RouterLink><SocialLinks /></div>
      </section>
    </main>
    <footer class="landing-footer"><span>Burning River Auto Glass</span><span>Serving Cleveland and Northeast Ohio</span></footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import SocialLinks from '../components/SocialLinks.vue'

</script>
