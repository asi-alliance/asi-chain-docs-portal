<template>
    <!-- The sections and pages come from the sidebar in config.ts and the apps from the DevNet Apps menu,
         so a page added to the sidebar shows up here without a second list to keep in step. -->
    <div class="asi-directory">
        <nav aria-label="Documentation sections">
            <div class="asi-directory-grid">
                <section v-for="group in groups" :key="group.text" class="asi-directory-group">
                    <div class="asi-directory-head">
                        <span v-if="icons[group.link ?? '']" class="asi-directory-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" v-html="icons[group.link ?? '']" />
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
                            <svg viewBox="0 0 24 24" v-html="appIcons[app.text] ?? ''" />
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

type Entry = { text?: string; link?: string; items?: Entry[] };
type Group = { text: string; link?: string; items: { text: string; link: string }[] };

const { theme } = useData();

// Icon paths from Lucide (lucide.dev, ISC license), drawn as 24 px line icons with a 2 px stroke.
const icons: Record<string, string> = {
    "/quick-start/":
        '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    "/use/":
        '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    "/nodes/":
        '<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01"/><path d="M6 18h.01"/>',
    "/build/": '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>',
    "/reference/":
        '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    "/help/":
        '<circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="4"/>',
};

const about: Record<string, string> = {
    "/quick-start/": "What ASI:Chain is and how to get your first test tokens",
    "/use/": "Create an account, get test tokens and follow transfers",
    "/nodes/": "Run a Rust observer or validator from the published images",
    "/build/": "Build apps and scripts with the Wallet SDK or CLI",
    "/reference/": "Endpoints, container images and links to the source",
    "/help/": "Answers to common questions and troubleshooting steps",
};

const appIcons: Record<string, string> = {
    Wallet: icons["/use/"],
    Explorer: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    Faucet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
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

// An external link shows its address, as everywhere else on the site.
const apps = computed(() => {
    const menu = ((theme.value.nav ?? []) as Entry[]).find((entry) => entry.text === "DevNet Apps");
    return (menu?.items ?? [])
        .filter((item) => item.text && item.link)
        .map((item) => ({ text: item.text!, link: item.link!, host: new URL(item.link!).host }));
});
</script>
