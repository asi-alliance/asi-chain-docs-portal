import { nextTick } from "vue";
import { useData } from "vitepress";
import type { EnhanceAppContext } from "vitepress";

/*
 * Client side of the motion layer. The rules that CSS can express live in motion.css, and this file adds
 * what needs a script: the replay of the page fade on route changes, the cross-fade of the theme switch,
 * the diagram reveal, the image fade-in and the glide to an anchor on the same page. Everything here is skipped with prefers-reduced-motion.
 */

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Elements that appear first in a diagram. Anything inside one of them rides along with its parent.
const NODE_SELECTOR =
    "g.d-group, g.d-fragment, g.d-note, g.d-node, g.d-badge, .d-chip, .d-life, .d-fragline, text";
const NODE_MS = 180;
const NODE_TOTAL_MS = 400;
const EDGE_MS = 400;

function playDiagram(figure: HTMLElement) {
    // Wide and narrow variants share a figure and CSS shows one of them. Only the shown one is animated.
    const svg = [...figure.querySelectorAll<SVGSVGElement>("svg.dgm")].find((s) => s.getClientRects().length > 0);
    if (!svg) return;

    const nodes = [...svg.querySelectorAll<SVGElement>(NODE_SELECTOR)].filter(
        (el) => !el.parentElement?.closest(NODE_SELECTOR) && !el.closest("defs"),
    );
    // Stagger at most 30 ms per element, and the last node finishes within 400 ms.
    const step = Math.min(30, (NODE_TOTAL_MS - NODE_MS) / Math.max(nodes.length - 1, 1));
    nodes.forEach((el, i) => {
        // The animation holds the first keyframe through its delay, so nothing is hidden by hand and an
        // interrupted script cannot leave a node invisible.
        el.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: NODE_MS,
            delay: i * step,
            easing: EASE_OUT,
            fill: "backwards",
        });
    });

    for (const edge of svg.querySelectorAll<SVGGeometryElement>(".d-edge")) {
        const dashed = edge.classList.contains("d-dashed");
        let keyframes: Keyframe[];
        if (dashed || typeof edge.getTotalLength !== "function") {
            // A dashed edge already uses stroke-dasharray for its pattern, so it fades instead of drawing.
            keyframes = [{ opacity: 0 }, { opacity: 1 }];
        } else {
            const len = Math.ceil(edge.getTotalLength()) + 1;
            // The arrowhead is a marker and is painted whatever the dash is, so the opacity rises with the line.
            keyframes = [
                { strokeDasharray: `${len}`, strokeDashoffset: len, opacity: 0 },
                { strokeDasharray: `${len}`, strokeDashoffset: len * 0.7, opacity: 1, offset: 0.2 },
                { strokeDasharray: `${len}`, strokeDashoffset: 0, opacity: 1 },
            ];
        }
        edge.animate(keyframes, {
            duration: EDGE_MS,
            delay: NODE_TOTAL_MS,
            easing: EASE_OUT,
            fill: "backwards",
        });
    }
}

function watchDiagrams() {
    if (!("IntersectionObserver" in window)) return;
    const seen = new WeakSet<Element>();
    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
    const io = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (seen.has(entry.target)) continue;
                // A tall figure can never be 20 % in view on a short screen, so a fifth of the viewport counts too.
                const vh = entry.rootBounds?.height ?? window.innerHeight;
                if (entry.intersectionRatio < 0.2 && entry.intersectionRect.height < vh * 0.2) continue;
                seen.add(entry.target);
                io.unobserve(entry.target);
                if (!reduced()) playDiagram(entry.target as HTMLElement);
            }
        },
        { threshold: thresholds },
    );
    const observe = () => {
        for (const fig of document.querySelectorAll<HTMLElement>("figure.diagram")) {
            if (!seen.has(fig)) io.observe(fig);
        }
    };
    return observe;
}

// An image that is still loading stays transparent until it arrives. A timer drops the hold in case the
// load event was missed, for instance when it fired before the listener was attached.
function fadeImages() {
    for (const img of document.querySelectorAll<HTMLImageElement>(".vp-doc img")) {
        if (img.complete || img.classList.contains("asi-img-wait")) continue;
        img.classList.add("asi-img-wait");
        const release = () => {
            img.classList.remove("asi-img-wait");
            clearTimeout(timer);
        };
        const timer = window.setTimeout(release, 3000);
        img.addEventListener("load", release, { once: true });
        img.addEventListener("error", release, { once: true });
        // The load may have finished between the check above and the listeners.
        if (img.complete) release();
    }
}

function replayPageFade() {
    const el = document.querySelector<HTMLElement>(".VPContent .vp-doc, .VPContent .asi-home-page");
    el?.animate([{ opacity: 0, transform: "translateY(4px)" }, { opacity: 1, transform: "none" }], {
        duration: 240,
        easing: EASE_OUT,
    });
}

// The VitePress router jumps to an anchor on the same page and glides only for a heading anchor less than a
// screen away. Its click handler is registered first and scrolls in the next animation frame, so smooth
// scroll-behavior set during the same click applies to that scroll. It is dropped when the scroll ends, so
// page changes and the browser's own jumps stay instant. The timer covers a click that does not scroll.
function glideToAnchors() {
    const root = document.documentElement;
    let timer = 0;
    const release = () => {
        root.style.removeProperty("scroll-behavior");
        clearTimeout(timer);
    };
    window.addEventListener(
        "click",
        (e) => {
            if (reduced() || e.button !== 0 || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
            const link = e.target instanceof Element ? e.target.closest("a") : null;
            if (!link || link.hasAttribute("target") || link.hasAttribute("download") || link.closest(".vp-raw")) return;
            const href = link.getAttribute("href");
            if (!href) return;
            const url = new URL(href, link.baseURI);
            if (!url.hash || url.origin !== location.origin || url.pathname !== location.pathname) return;
            if (url.search !== location.search) return;
            root.style.scrollBehavior = "smooth";
            clearTimeout(timer);
            window.addEventListener("scrollend", release, { once: true });
            timer = window.setTimeout(release, 1500);
        },
        { capture: true },
    );
}

export function setupMotion({ app, router }: EnhanceAppContext) {
    if (typeof window === "undefined") return;

    // Theme switch: the documented `toggle-appearance` provider, with a cross-fade of the two snapshots.
    const { isDark } = app.runWithContext(() => useData());
    app.provide("toggle-appearance", async () => {
        const flip = () => {
            isDark.value = !isDark.value;
        };
        const doc = document as Document & { startViewTransition?: (cb: () => Promise<void> | void) => any };
        if (!doc.startViewTransition || reduced()) {
            flip();
            return;
        }
        const root = document.documentElement;
        root.classList.add("asi-theme-switch");
        const transition = doc.startViewTransition(async () => {
            flip();
            await nextTick();
        });
        try {
            await transition.finished;
        } finally {
            root.classList.remove("asi-theme-switch");
        }
    });

    // The sidebar groups rise with @starting-style, which would also play on the first render of the page.
    // The class that enables it waits for two frames after the root component has mounted.
    app.mixin({
        mounted() {
            if (this.$parent) return;
            requestAnimationFrame(() =>
                requestAnimationFrame(() => document.documentElement.classList.add("asi-ready")),
            );
        },
    });

    glideToAnchors();

    const observeDiagrams = watchDiagrams();
    let lastPath = location.pathname;
    const afterRender = async () => {
        await nextTick();
        requestAnimationFrame(() => {
            observeDiagrams?.();
            if (!reduced()) fadeImages();
        });
    };

    const previous = router.onAfterRouteChanged;
    router.onAfterRouteChanged = async (to: string) => {
        await previous?.(to);
        const path = new URL(to, location.href).pathname;
        // A hash change on the same page keeps the content where it is.
        if (path !== lastPath) {
            lastPath = path;
            await nextTick();
            if (!reduced()) replayPageFade();
        }
        afterRender();
    };

    // First load: the page fade is a CSS animation, so it plays from the first paint without a flash.
    window.addEventListener("load", afterRender, { once: true });
    if (document.readyState === "complete") afterRender();
    else document.addEventListener("DOMContentLoaded", afterRender, { once: true });
}
