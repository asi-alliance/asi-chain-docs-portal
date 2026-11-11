<template>
    <div ref="root" class="asi-steps">
        <slot />
    </div>
</template>

<script setup lang="ts">
/**
 * Wraps a run of `###` headings and numbers them with a CSS counter, so the
 * numbers need no script and the step text stays in the server HTML and in the
 * search index. Use it only where order matters. Leave a blank line after
 * `<Steps>` and before `</Steps>`, and put a `##` above it so heading levels
 * do not skip. Styles are in `.vitepress/theme/blocks.css`.
 *
 * The line that links the steps ends at the circle of the last step. Where the
 * last heading sits depends on the text above it, so the script measures it and
 * passes the length to CSS as --asi-steps-line. Before the script runs the line
 * reaches the bottom of the block.
 */
import { onBeforeUnmount, onMounted, ref } from "vue";

const root = ref<HTMLElement | null>(null);
let observer: ResizeObserver | undefined;

function place() {
    const el = root.value;
    if (!el) return;
    const headings = el.querySelectorAll<HTMLElement>(":scope > h3");
    const last = headings[headings.length - 1];
    if (!last) return;
    // The line starts 28 px down, under the first circle, and ends at the centre of the last one (14 px).
    el.style.setProperty("--asi-steps-line", `${Math.max(0, last.offsetTop - 14)}px`);
}

onMounted(() => {
    place();
    if (typeof ResizeObserver !== "undefined" && root.value) {
        observer = new ResizeObserver(place);
        observer.observe(root.value);
    }
});

onBeforeUnmount(() => observer?.disconnect());
</script>
