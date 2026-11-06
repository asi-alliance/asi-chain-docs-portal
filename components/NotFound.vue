<template>
    <!-- VitePress renders the 404 slot outside any landmark, so the page brings its own main. -->
    <main class="vp-doc asi-not-found">
        <h1>Page Not Found</h1>
        <p>This page does not exist or has moved.</p>
        <SectionDirectory />
        <p class="asi-not-found-search">Search (Ctrl K) finds any page.</p>
    </main>
</template>

<script setup lang="ts">
import SectionDirectory from "./SectionDirectory.vue";
</script>
