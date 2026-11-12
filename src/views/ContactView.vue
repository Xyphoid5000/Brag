<script setup lang="ts">
import { ref } from 'vue'

const formStatus = ref('')
const formError = ref(false)
const sending = ref(false)

async function submitContactForm(event: SubmitEvent) {
  const form = event.currentTarget as HTMLFormElement
  const formData = new FormData(form)
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const service = String(formData.get('service') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()
  const company = String(formData.get('company') ?? '').trim()

  formError.value = false
  sending.value = true
  formStatus.value = 'Sending…'
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, email, phone, service, message, company }),
    })
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
    if (!res.ok || !data.ok) {
      throw new Error(data.error || 'Something went wrong sending your message.')
    }
    formStatus.value = 'Thanks — your request is on its way. We will get back to you shortly.'
    form.reset()
  } catch (err) {
    formError.value = true
    formStatus.value = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="landing-page contact-page">
    <main class="contact-page__main">
      <div class="contact-page__heading">
        <p class="eyebrow"><span></span> Let's get you moving</p>
        <h1>Bring us the damage.<br><em>We'll bring the fix.</em></h1>
        <p>Tell us what happened and we'll help you figure out the next step. Prefer to talk? <a href="tel:3303481455">(330) 348-1455</a></p>
      </div>
      <form class="contact-form" @submit.prevent="submitContactForm">
        <input name="company" type="text" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true" />
        <div class="contact-form__row"><label><span>Name</span><input name="name" type="text" autocomplete="name" required placeholder="Your name" /></label><label><span>Phone</span><input name="phone" type="tel" autocomplete="tel" placeholder="(330) 348-1455" /></label></div>
        <label><span>Email</span><input name="email" type="email" autocomplete="email" required placeholder="you@example.com" /></label>
        <label><span>What do you need?</span><select name="service"><option>Windshield repair</option><option>Auto glass replacement</option><option>Mobile service</option><option>Not sure yet</option></select></label>
        <label><span>Message</span><textarea name="message" rows="5" required placeholder="Tell us what happened..."></textarea></label>
        <div class="contact-form__submit"><button class="button button--orange" type="submit" :disabled="sending">Send request <span>-></span></button><small aria-live="polite" :class="{ 'form-error': formError }">{{ formStatus || 'We will get back to you shortly.' }}</small></div>
      </form>
    </main>
  </div>
</template>
