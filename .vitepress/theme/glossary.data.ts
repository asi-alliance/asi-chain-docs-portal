import { createContentLoader } from "vitepress";

// Definitions for the term cards of components/GlossaryTerms.vue, read from the Glossary page at build
// time, so each definition is written once. The key is the anchor of the term on that page.
export interface Term {
    title: string;
    html: string;
    // The closing "See [Page](/path/)." sentence of a definition, shown as a link under the card text.
    more?: { text: string; href: string };
}

declare const data: Record<string, Term>;
export { data };

export default createContentLoader("reference/glossary/index.md", {
    render: true,
    transform([page]) {
        const terms: Record<string, Term> = {};
        // VitePress renders each heading as <h2 id="slug" tabindex="-1">Title <a class="header-anchor" ...>
        for (const part of (page?.html ?? "").split(/(?=<h2 id=")/).slice(1)) {
            const head = part.match(/^<h2 id="([^"]+)"[^>]*>(.*?)<a class="header-anchor"[\s\S]*?<\/h2>/);
            if (!head) continue;
            let html = part.slice(head[0].length).trim();
            let more: Term["more"];
            const see = html.match(/\s*See <a href="([^"]+)">([^<]+)<\/a>\.<\/p>$/);
            if (see) {
                more = { href: see[1], text: see[2] };
                html = html.slice(0, see.index) + "</p>";
            }
            terms[head[1]] = { title: head[2].trim(), html: html.replace(/<p>\s*<\/p>/g, ""), more };
        }
        return terms;
    },
});
