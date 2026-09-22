import { createRouter, createWebHistory } from "vue-router"

const ContactView = () => import("../views/ContactView.vue")
const GalleryView = () => import("../views/GalleryView.vue")
const HomeView = () => import("../views/HomeView.vue")
const ServicesView = () => import("../views/ServicesView.vue")
const WhyUsView = () => import("../views/WhyUsView.vue")

import {
  cover,
  reveal,
} from "../composables/usePageTransition"

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL
  ),

  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },

    {
      path: "/contact",
      name: "contact",
      component: ContactView,
    },

    {
      path: "/gallery",
      name: "gallery",
      component: GalleryView,
    },

    {
      path: "/services",
      name: "services",
      component: ServicesView,
    },

    {
      path: "/why-us",
      name: "why-us",
      component: WhyUsView,
    },

    /*
     * Standalone breakroom route.
     *
     * This route intentionally bypasses the normal
     * page transition system.
     */
    {
      path: "/breakroom",
      name: "breakroom",

      component: () =>
        import(
          "../components/WindshieldRescue.vue"
        ),

      meta: {
        noTransition: true,
        disableScroll: true,
      },
    },
  ],

  scrollBehavior() {
    return {
      top: 0,
    }
  },
})

/*
 * Pre-router transition
 */
router.beforeEach(
  async (to, from) => {
    /*
     * Don't animate if either the page we're
     * leaving OR the page we're entering is
     * marked as a no-transition route.
     */
    if (
      to.fullPath !== from.fullPath &&
      !to.meta.noTransition &&
      !from.meta.noTransition
    ) {
      await cover()
    }

    return true
  }
)

/*
 * Post-router transition
 */
router.afterEach(
  async (to, from) => {
   if (to.meta.disableScroll) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
    /*
     * Keep the breakroom completely outside
     * the normal transition system.
     */
    if (
      to.fullPath !== from.fullPath &&
      !to.meta.noTransition &&
      !from.meta.noTransition
    ) {
      requestAnimationFrame(
        async () => {
          await reveal()
        }
      )
    }
  }
)

export default router