<template>
    <!-- A menu of the top bar. Each link shows an icon, its name and what it opens: the host of an app or the
         name of a repository. On a wide screen a menu with several groups lays them out in two columns, and in
         the menu screen of a phone (screenMenu) the groups stack. -->
    <div class="asi-link-menu" :class="screenMenu ? 'is-screen' : groups.length > 1 ? 'is-wide' : ''">
        <div
            v-for="group in groups"
            :key="group.text ?? group.items[0]?.link"
            class="asi-link-menu-group"
            :role="group.text ? 'group' : undefined"
            :aria-label="group.text"
        >
            <p v-if="group.text" class="asi-link-menu-label" aria-hidden="true">{{ group.text }}</p>
            <a
                v-for="item in group.items"
                :key="item.link"
                class="asi-link-menu-item"
                :href="item.link"
                target="_blank"
                rel="noreferrer"
            >
                <span class="asi-link-menu-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" v-html="icons[item.icon] ?? ''" />
                </span>
                <span class="asi-link-menu-text">
                    <span class="asi-link-menu-name">{{ item.text }}</span>
                    <span class="asi-link-menu-note">{{ note(item.link) }}</span>
                </span>
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { icons } from "./icons";

export type LinkMenuItem = { text: string; link: string; icon: string };
export type LinkMenuGroup = { text?: string; items: LinkMenuItem[] };

defineProps<{
    groups: LinkMenuGroup[];
    /** Set by VitePress when the menu is drawn in the menu screen of a phone. */
    screenMenu?: boolean;
}>();

// A repository shows its name, and an app shows its host, the way the site writes external links.
function note(link: string) {
    const url = new URL(link);
    return url.host === "github.com" ? url.pathname.split("/").filter(Boolean).pop() ?? url.host : url.host;
}
</script>
