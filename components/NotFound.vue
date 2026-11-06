<template>
    <!-- VitePress renders the 404 slot outside any landmark, so the page brings its own main. -->
    <main class="vp-doc asi-not-found">
        <h1>Page Not Found</h1>
        <p>This page does not exist or has moved.</p>
        <CardGrid>
            <DocCard title="Get Started" href="/quick-start/">The node, the indexer and the applications, and how they fit together</DocCard>
            <DocCard title="Use ASI:Chain" href="/use/">Create an account, get test tokens and follow transfers in the explorer</DocCard>
            <DocCard title="Run a Node" href="/nodes/">Run a Rust validator or observer node from the published images</DocCard>
            <DocCard title="Build on ASI:Chain" href="/build/">Build wallets and integrations with the TypeScript SDK, with the Wallet CLI and the technical architecture (components, data flow and network topology)</DocCard>
            <DocCard title="Reference" href="/reference/">Network endpoints, container images and useful links</DocCard>
            <DocCard title="Help" href="/help/">FAQ, troubleshooting and the documentation status</DocCard>
        </CardGrid>
        <p class="asi-not-found-search">Search (Ctrl K) finds any page.</p>
    </main>
</template>

<script setup lang="ts">
import CardGrid from "./CardGrid.vue";
import DocCard from "./DocCard.vue";
</script>
