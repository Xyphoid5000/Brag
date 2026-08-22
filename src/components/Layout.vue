<template>
    <div class="site-layout">
        <div class="glass-content">
            <SiteHeader />
            <main class="site-main">
                <slot></slot>
            </main>
        </div>
        <SiteFooter />
    </div>
</template>

<script setup lang="ts">
import SiteHeader from './SiteHeader.vue'
import SiteFooter from './SiteFooter.vue'

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