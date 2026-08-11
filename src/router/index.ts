import { createRouter, createWebHistory } from 'vue-router'
import ContactView from '../views/ContactView.vue'
import GalleryView from '../views/GalleryView.vue'
import HomeView from '../views/HomeView.vue'
import ServicesView from '../views/ServicesView.vue'
import WhyUsView from '../views/WhyUsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/contact', name: 'contact', component: ContactView },
    { path: '/gallery', name: 'gallery', component: GalleryView },
    { path: '/services', name: 'services', component: ServicesView },
    { path: '/why-us', name: 'why-us', component: WhyUsView },
  ],
})

export default router
