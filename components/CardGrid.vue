<template>
    <div class="asi-card-grid" :data-columns="columns">
        <slot />
    </div>
</template>

<script setup lang="ts">
defineProps({
    /** Cards per row on a wide screen: 2 or 3. Three become two under 960 px and one under 640 px. */
    columns: {
        type: [String, Number],
        default: 2,
    },
})
</script>
