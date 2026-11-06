<script setup lang="ts">
import { computed } from "vue";

// Inlines the SVG that `npm run diagrams` renders from .vitepress/diagrams/src/<name>.mjs, so the diagram
// ends up in the server HTML, takes its colors from the site theme and keeps selectable text.
const props = defineProps<{ name: string; caption: string }>();

const files = import.meta.glob("../.vitepress/diagrams/out/*.svg", {
    query: "?raw",
    import: "default",
    eager: true,
}) as Record<string, string>;

const pick = (file: string) => files[`../.vitepress/diagrams/out/${file}`];
const wide = computed(() => {
    const svg = pick(`${props.name}.svg`);
    if (!svg) throw new Error(`Diagram "${props.name}" has no SVG, run npm run diagrams`);
    return svg;
});
const narrow = computed(() => pick(`${props.name}.narrow.svg`));
</script>

<template>
    <figure class="diagram" :class="{ 'diagram-solo': !narrow }">
        <div class="diagram-body">
            <div class="diagram-wide" v-html="wide" />
            <div v-if="narrow" class="diagram-narrow" v-html="narrow" />
        </div>
        <figcaption>{{ caption }}</figcaption>
    </figure>
</template>
