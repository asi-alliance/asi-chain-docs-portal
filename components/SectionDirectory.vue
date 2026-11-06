<template>
    <!-- The sections and pages come from the sidebar in config.ts and the apps from the DevNet Apps menu,
         so a page added to the sidebar shows up here without a second list to keep in step. -->
    <div class="asi-directory">
        <nav aria-label="Documentation sections">
            <div class="asi-directory-grid">
                <section v-for="group in groups" :key="group.text" class="asi-directory-group">
                    <!-- The title link stretches over the whole panel, so a click anywhere opens the landing page,
                         and the links of the list sit above it and open their own pages. -->
                    <div class="asi-directory-head">
                        <span v-if="sectionIcons[group.link ?? '']" class="asi-directory-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" v-html="icons[sectionIcons[group.link ?? '']]" />
                        </span>
                        <h2 class="asi-directory-title">
                            <a v-if="group.link" :href="group.link">{{ group.text }}</a>
                            <template v-else>{{ group.text }}</template>
                        </h2>
                    </div>
                    <p v-if="about[group.link ?? '']" class="asi-directory-about">{{ about[group.link ?? ""] }}</p>
                    <ul class="asi-directory-list">
                        <li v-for="item in group.items" :key="item.link">
                            <a :href="item.link">{{ item.text }}</a>
                        </li>
                    </ul>
                </section>
            </div>
        </nav>
        <section v-if="apps.length" class="asi-directory-apps" aria-labelledby="asi-directory-apps-title">
            <h2 id="asi-directory-apps-title" class="asi-directory-apps-title">DevNet Apps</h2>
            <div class="asi-directory-grid">
                <a v-for="app in apps" :key="app.link" class="asi-directory-app" :href="app.link" target="_blank" rel="noreferrer">
                    <span class="asi-directory-head">
                        <span class="asi-directory-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" v-html="icons[app.icon] ?? ''" />
                        </span>
                        <span class="asi-directory-title">{{ app.text }}</span>
                    </span>
                    <span v-if="appAbout[app.text]" class="asi-directory-about">{{ appAbout[app.text] }}</span>
                    <span class="asi-directory-host">{{ app.host }}</span>
                </a>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";
import { icons } from "./icons";

type Entry = { text?: string; link?: string; icon?: string; items?: Entry[]; props?: { groups?: { items: Entry[] }[] } };
type Group = { text: string; link?: string; items: { text: string; link: string }[] };

const { theme } = useData();

// Icons come from components/icons.ts by name.
const sectionIcons: Record<string, string> = {
    "/quick-start/": "rocket",
    "/use/": "wallet",
    "/nodes/": "server",
    "/build/": "code-xml",
    "/reference/": "book-open",
    "/help/": "life-buoy",
};

const about: Record<string, string> = {
    "/quick-start/": "What ASI:Chain is and how to get your first test tokens",
    "/use/": "Create an account, get test tokens and follow transfers",
    "/nodes/": "Run a Rust observer or validator from the published images",
    "/build/": "Build apps and scripts with the Wallet SDK or CLI",
    "/reference/": "Endpoints, container images and links to the source",
    "/help/": "Answers to common questions and troubleshooting steps",
};

const appAbout: Record<string, string> = {
    Wallet: "Create accounts, send ASI and deploy contracts",
    Explorer: "Blocks, transfers, deployments and validators",
    Faucet: "Get test ASI for your address",
};

const groups = computed<Group[]>(() => {
    const sidebar = (Array.isArray(theme.value.sidebar) ? theme.value.sidebar : []) as Entry[];
    return sidebar.map((group) => ({
        text: group.text ?? "",
        link: group.link,
        items: (group.items ?? [])
            .filter((item) => item.text && item.link)
            .map((item) => ({ text: item.text!, link: item.link! })),
    }));
});

// The DevNet Apps menu is a LinkMenu, so its links sit in the groups of the component. An external link
// shows its address, as everywhere else on the site.
const apps = computed(() => {
    const menu = ((theme.value.nav ?? []) as Entry[]).find((entry) => entry.text === "DevNet Apps");
    return (menu?.items ?? [])
        .flatMap((item) => item.props?.groups?.flatMap((group) => group.items) ?? [item])
        .filter((item) => item.text && item.link)
        .map((item) => ({ text: item.text!, link: item.link!, icon: item.icon ?? "", host: new URL(item.link!).host }));
});
</script>
