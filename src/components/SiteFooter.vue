<script setup lang="ts">
import IconBar from "./IconBar.vue"
import logo from "../assets/FadedBREmblem.png"

const navigation = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Why Us", to: "/why-us" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
]

const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="footer-container">

      <!-- Main Footer -->
      <div class="footer-main">

        <!-- Brand -->
        <div class="footer-brand">
          <RouterLink to="/" class="footer-logo">
            <img :src="logo" alt="Burning River Auto Glass" />
          </RouterLink>

          <div class="brand-copy">
            <h2>
              Burning River
              <span>Auto Glass</span>
            </h2>

            <p>
              Professional auto glass repair and replacement
              you can count on.
            </p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="footer-nav" aria-label="Footer navigation">
          <h3>Explore</h3>

          <RouterLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
          >
            {{ item.label }}
          </RouterLink>
        </nav>

        <!-- Contact -->
        <div class="footer-contact">
          <h3>Get In Touch</h3>

          <a href="tel:+13303481455">
            <span class="contact-label">Call Us</span>
            <span>(330) 348-1455</span>
          </a>

          <a href="mailto:burningriverautoglass@gmail.com">
            <span class="contact-label">Email</span>
            <span>burningriverautoglass@gmail.com</span>
          </a>

          <div class="contact-location">
            <span class="contact-label">Service Area</span>
            <span>Northeast Ohio</span>
          </div>

            <IconBar class="footer-icons" />
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <span>
          © {{ year }} Burning River Auto Glass
        </span>

        <span class="footer-tagline">
          Built for the road.
        </span>
      </div>

    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  color: #f2f1eb;
  overflow: hidden;
    background: rgba(8, 18, 31, 0.44);
}

.site-footer::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  background-image:
    linear-gradient(
      135deg,
      transparent 0%,
      rgba(255,255,255,.15) 50%,
      transparent 50%
    );
  background-size: 8px 8px;
}

.footer-container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 70px 32px 24px;
}

/* Main */

.footer-main {
  display: grid;
  grid-template-columns: 2fr 1fr 1.4fr;
  gap: 70px;
  padding-bottom: 30px;
}

/* Brand */

.footer-brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-logo {
  display: block;
  width: 70px;
  margin-bottom: 20px;
}

.footer-logo img {
  display: block;
  width: 100%;
  height: auto;
}

.brand-copy h2 {
  margin: 0;
  font-size: 1.6rem;
  line-height: 1.05;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.brand-copy h2 span {
  display: block;
  color: #718d78;
  font-size: 0.75em;
  margin-top: 5px;
}

.brand-copy p {
  max-width: 320px;
  margin: 18px 0 24px;
  color: #a9aca7;
  line-height: 1.7;
}

/* Iconbar */

.footer-icons {
    margin-top: 1.5rem;
}

/* Navigation / Contact */

.footer-nav,
.footer-contact {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-nav h3,
.footer-contact h3 {
  margin: 0 0 22px;
  color: #718d78;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.footer-nav a,
.footer-contact a {
  text-decoration: none;
  color: #d7d8d4;
  transition:
    color 0.25s ease,
    transform 0.25s ease;
}

.footer-nav a {
  margin-bottom: 13px;
}

.footer-nav a:hover,
.footer-contact a:hover {
  color: #718d78;
  transform: translateX(4px);
}

.footer-contact a {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.contact-label {
  margin-bottom: 4px;
  color: #7e827d;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.contact-location {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

/* Bottom */

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-top: 22px;
  border-top: 1px solid rgba(255,255,255,.1);

  color: #777b76;
  font-size: 0.75rem;
}

.footer-tagline {
  color: #718d78;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

/* Mobile */

@media (max-width: 800px) {
  .footer-main {
    grid-template-columns: 1fr 1fr;
    gap: 45px;
  }

  .footer-brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 520px) {
  .footer-container {
    padding: 55px 24px 20px;
  }

  .footer-main {
    grid-template-columns: 1fr;
    gap: 38px;
    padding-bottom: 45px;
  }

  .footer-brand {
    grid-column: auto;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>