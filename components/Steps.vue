<template>
    <div class="asi-steps">
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
 */
</script>
