<template>
    <component :is="href ? 'a' : 'div'" :href="href" class="asi-card">
        <span class="asi-card-title">{{ title }}</span>
        <span class="asi-card-body"><slot /></span>
    </component>
</template>

<script setup lang="ts">
defineProps<{
    /** Card heading. Name the destination the way a reader would say it. */
    title: string
    /** Root-relative path or external URL. Without it the card is not a link. */
    href?: string
}>()
</script>
