<script setup lang="ts">
import { ref } from 'vue'
import BurningRiverAutoGlassWordmark from '../components/BurningRiverAutoGlassWordmark.vue'
import IconBar from '../components/IconBar.vue'

const formStatus = ref('')

function submitContactForm(event: SubmitEvent) {
  const form = event.currentTarget as HTMLFormElement
  const formData = new FormData(form)
  const name = String(formData.get('name') ?? '')
  const email = String(formData.get('email') ?? '')
  const phone = String(formData.get('phone') ?? '')
  const service = String(formData.get('service') ?? '')
  const message = String(formData.get('message') ?? '')
  const subject = `Glass service request from ${name}`
  const body = [`Name: ${name}`, `Email: ${email}`, `Phone: ${phone}`, `Service: ${service}`, '', message].join('\n')

  formStatus.value = 'Opening your email client...'
  window.location.href = `mailto:burningriverautoglass@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
</script>

<template>
  <div class="landing-page contact-page">
    <main class="contact-page__main">
      <div class="contact-page__logo"><BurningRiverAutoGlassWordmark /></div>
      <div class="contact-page__heading">
        <p class="eyebrow"><span></span> Let's get you moving</p>
        <h1>Bring us the damage.<br><em>We'll bring the fix.</em></h1>
        <p>Tell us what happened and we'll help you figure out the next step. Prefer to talk? <a href="tel:3303481455">(330) 348-1455</a></p>
      </div>
      <form class="contact-form" @submit.prevent="submitContactForm">
        <div class="contact-form__row"><label><span>Name</span><input name="name" type="text" autocomplete="name" required placeholder="Your name" /></label><label><span>Phone</span><input name="phone" type="tel" autocomplete="tel" placeholder="(330) 348-1455" /></label></div>
        <label><span>Email</span><input name="email" type="email" autocomplete="email" required placeholder="you@example.com" /></label>
        <label><span>What do you need?</span><select name="service"><option>Windshield repair</option><option>Auto glass replacement</option><option>Mobile service</option><option>Not sure yet</option></select></label>
        <label><span>Message</span><textarea name="message" rows="5" required placeholder="Tell us what happened..."></textarea></label>
        <div class="contact-form__submit"><button class="button button--orange" type="submit">Send request <span>-></span></button><small>{{ formStatus || 'We will get back to you shortly.' }}</small></div>
      </form>
      <IconBar />
    </main>
    <footer class="landing-footer"><span>Burning River Auto Glass</span><span>Serving Cleveland and Northeast Ohio</span></footer>
  </div>
</template>
