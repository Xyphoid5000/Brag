<template>
  <div class="landing-page gallery-page">
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
          <img src="../assets/on_the_road.png" alt="Burning River Auto Glass van on the road" />
          <figcaption><span>01</span><strong>Back on the road</strong><small>Mobile service, wherever the day finds you.</small></figcaption>
        </figure>
        <figure class="gallery-card">
          <img src="../assets/windshield_replacement.jfif" alt="Technician working on a vehicle" />
          <figcaption><span>02</span><strong>Precise by hand</strong><small>Clean work. Careful finish.</small></figcaption>
        </figure>
        <figure class="gallery-card gallery-card--tall">
          <img src="../assets/truck_windshield.jfif" alt="Replacement windshield going in a semi truck" />
          <figcaption><span>03</span><strong>Made to fit</strong><small>Windshield, side, and rear glass.</small></figcaption>
        </figure>
        <figure class="gallery-card gallery-card--wide gallery-card--accent">
          <div class="gallery-card__statement"><p class="eyebrow"><span></span> The Burning River standard</p><h2>Clear glass.<br><em>Clear answers.</em></h2><RouterLink class="button button--orange" to="/contact">Start your quote <span>-></span></RouterLink></div>
          <figcaption><span>04</span><strong>Built for the drive ahead</strong><small>North East Ohio, at your location.</small></figcaption>
        </figure>
        <BeforeAfterCard
          title="A clearer finish"
          :before="before01"
          :after="after01"
        />
        <BeforeAfterCard
          title="Detail that holds up"
          :before="before02"
          :after="after02"
        />
        <BeforeAfterCard
          title="Ready for the road"
          :before="before03"
          :after="after03"
        />
        <BeforeAfterCard
          title="If it has wheels and glass, we fix it"
          :before="before04"
          :after="after04"
        />
      </section>
    </main>
    <footer class="landing-footer"><span>Burning River Auto Glass</span><span>Serving Cleveland and Northeast Ohio</span></footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BeforeAfterCard from '../components/BeforeAfterCard.vue'
import before01 from '../assets/before01.jpg'
import after01 from '../assets/after01.jpg'
import before02 from '../assets/before02.jpg'
import after02 from '../assets/after02.jpg'
import before03 from '../assets/before03.jpg'
import after03 from '../assets/after03.jpg'
import before04 from '../assets/before04.jfif'
import after04 from '../assets/after04.jfif'
</script>
