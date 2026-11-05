<template>
    <!-- Hidden from screen readers: the label repeats the sidebar group name, and it sits outside <main>. -->
    <p v-if="label" class="asi-eyebrow" aria-hidden="true">{{ label }}</p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { useSidebar } from 'vitepress/theme'

interface Item {
    text?: string
    link?: string
    items?: Item[]
}

const { sidebarGroups, hasSidebar } = useSidebar()
const { page } = useData()
const route = useRoute()

function normalize(path: string): string {
    return path
        .replace(/[?#].*$/, '')
        .replace(/(^|\/)index\.(md|html)$/, '$1')
        .replace(/\.(md|html)$/, '')
        .replace(/\/$/, '')
}

function contains(items: Item[] | undefined, current: string): boolean {
    return !!items?.some(
        (item) => (item.link && normalize(item.link) === current) || contains(item.items, current),
    )
}

/** The sidebar group that holds the current page, so the label always matches the menu. */
const label = computed(() => {
    if (!hasSidebar.value) return ''
    const current = normalize('/' + page.value.relativePath) || normalize(route.path)
    const group = (sidebarGroups.value as Item[]).find((g) => contains(g.items, current))
    return group?.text ?? ''
})
</script>
