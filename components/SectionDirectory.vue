<template>
    <!-- The groups and pages come from the sidebar in config.ts and the apps from the DevNet Apps menu,
         so a page added to the sidebar shows up here without a second list to keep in step. -->
    <nav class="asi-directory" aria-label="Documentation sections">
        <div class="asi-directory-grid">
            <section v-for="group in groups" :key="group.text" class="asi-directory-group">
                <h2 class="asi-directory-title">
                    <a v-if="group.link" :href="group.link">{{ group.text }}</a>
                    <template v-else>{{ group.text }}</template>
                </h2>
                <ul class="asi-directory-list">
                    <li v-for="item in group.items" :key="item.link">
                        <a v-if="item.external" :href="item.link" target="_blank" rel="noreferrer">{{ item.text }}</a>
                        <a v-else :href="item.link">{{ item.text }}</a>
                    </li>
                </ul>
            </section>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";

type Entry = { text?: string; link?: string; items?: Entry[] };
type Group = { text: string; link?: string; items: { text: string; link: string; external: boolean }[] };

const { theme } = useData();

const groups = computed<Group[]>(() => {
    const sidebar = (Array.isArray(theme.value.sidebar) ? theme.value.sidebar : []) as Entry[];
    const list: Group[] = sidebar.map((group) => ({
        text: group.text ?? "",
        link: group.link,
        items: (group.items ?? [])
            .filter((item) => item.text && item.link)
            .map((item) => ({ text: item.text!, link: item.link!, external: false })),
    }));
    // An external link is labelled with its address, as everywhere else on the site.
    const apps = ((theme.value.nav ?? []) as Entry[]).find((entry) => entry.text === "DevNet Apps");
    if (apps?.items?.length) {
        list.push({
            text: apps.text!,
            items: apps.items
                .filter((item) => item.link)
                .map((item) => ({ text: new URL(item.link!).host, link: item.link!, external: true })),
        });
    }
    return list;
});
</script>
