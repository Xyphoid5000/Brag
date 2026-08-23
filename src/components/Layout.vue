<template>
    <div class="site-layout">
        <div class="glass-content">
            <SiteHeader v-show="!hideLayout" />
            <main class="site-main">
                <slot></slot>
            </main>
        </div>
        <SiteFooter v-show="!hideLayout"/>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SiteHeader from './SiteHeader.vue'
import SiteFooter from './SiteFooter.vue'
import { useRoute } from 'vue-router'

const router = useRoute();

const hideLayout = computed(() => {
    return router.name === "breakroom";
});

</script>

<style lang="scss">
    .site-layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .glass-content {
        display: flex;
        flex: 1;
        flex-direction: column;
        position: relative;
    }

    .site-main {
        flex: 1;
    }

</style>