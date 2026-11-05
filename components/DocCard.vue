<template>
    <component :is="href ? 'a' : 'div'" :href="href" class="asi-card">
        <svg
            v-if="icon && icons[icon]"
            class="asi-card-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            :fill="filled ? 'currentColor' : 'none'"
            :stroke="filled ? 'none' : 'currentColor'"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            v-html="icons[icon]"
        />
        <span class="asi-card-title">{{ title }}</span>
        <span class="asi-card-body"><slot /></span>
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { icons, filledIcons, type IconName } from './icons'

const props = defineProps<{
    /** Card heading. Name the destination the way a reader would say it. */
    title: string
    /** Root-relative path or external URL. Without it the card is not a link. */
    href?: string
    /** One of the names in `icons.ts`. */
    icon?: IconName
}>()

const filled = computed(() => !!props.icon && filledIcons.includes(props.icon))
</script>
