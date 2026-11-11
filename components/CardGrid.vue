<template>
    <div class="asi-card-grid" :data-columns="columns">
        <slot />
    </div>
</template>

<script setup lang="ts">
defineProps({
    /** Accepted and ignored. The list is always two columns from 640 px and one column below. */
    columns: {
        type: [String, Number],
        default: 2,
    },
})
</script>
