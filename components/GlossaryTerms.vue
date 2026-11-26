<script setup lang="ts">
// A link into the Glossary reads as a term, and its definition opens in a card next to it, so the
// reader stays on the page. A mouse opens the card after a short hover. A click, a tap, Enter or Space
// pins it, and a keyboard moves focus into it. Escape, a click outside or a route change closes it.
// Ctrl, Shift or middle click still follows the link, and without JavaScript the term stays a link.
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { onContentUpdated, useRoute } from "vitepress";
import { data as terms, type Term } from "../.vitepress/theme/glossary.data";

const PREFIX = "/reference/glossary/#";
const ID = "asi-term-card";
// 300 ms keeps a card from flashing while the pointer crosses the text, 200 ms lets it reach the card.
const OPEN_DELAY = 300;
const CLOSE_DELAY = 200;

const route = useRoute();
const mounted = ref(false);
const term = ref<(Term & { id: string }) | null>(null);
const box = ref({ top: 0, left: 0, width: 360, above: false });
const card = ref<HTMLElement | null>(null);
let trigger: HTMLAnchorElement | null = null;
let pinned = false;
let openTimer = 0;
let closeTimer = 0;

const onGlossary = () => route.path.startsWith("/reference/glossary/");

function mark(a: HTMLAnchorElement) {
    a.classList.add("asi-term");
    // The VitePress router takes link clicks on window in the capture phase, before this component, and
    // leaves a link with a target attribute to the browser. Then onClick can keep the reader on the page.
    a.setAttribute("target", "_self");
    a.setAttribute("role", "button");
    a.setAttribute("aria-haspopup", "dialog");
    a.setAttribute("aria-controls", ID);
    a.setAttribute("aria-expanded", "false");
}

function markAll() {
    if (onGlossary()) return;
    document.querySelectorAll<HTMLAnchorElement>(`.vp-doc a[href^="${PREFIX}"]`).forEach((a) => {
        if (terms[a.getAttribute("href")!.slice(PREFIX.length)]) mark(a);
    });
}

// A term found at event time is marked too, in case the page rendered after markAll ran.
function termOf(target: EventTarget | null): HTMLAnchorElement | null {
    if (onGlossary() || !(target instanceof Element)) return null;
    const a = target.closest<HTMLAnchorElement>(`.vp-doc a[href^="${PREFIX}"]`);
    if (!a || !terms[a.getAttribute("href")!.slice(PREFIX.length)]) return null;
    if (!a.classList.contains("asi-term")) mark(a);
    return a;
}

const inCard = (t: EventTarget | null) => t instanceof Node && !!card.value?.contains(t);

async function open(a: HTMLAnchorElement, pin: boolean, focus: boolean) {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    const id = a.getAttribute("href")!.slice(PREFIX.length);
    trigger?.setAttribute("aria-expanded", "false");
    trigger = a;
    a.setAttribute("aria-expanded", "true");
    pinned = pin;
    const vw = document.documentElement.clientWidth;
    box.value = { ...box.value, width: Math.min(360, vw - 32) };
    term.value = { id, ...terms[id] };
    await nextTick();
    place();
    if (focus) card.value?.focus();
}

// Below the last line of the term, or above it when the card does not fit under it in the window.
function place() {
    if (!trigger || !card.value) return;
    const rects = trigger.getClientRects();
    const r = rects[rects.length - 1];
    const vw = document.documentElement.clientWidth;
    const h = card.value.offsetHeight;
    const w = box.value.width;
    const below = r.bottom + 8 + h <= window.innerHeight - 8;
    const above = !below && r.top - 8 - h >= 72;
    box.value = {
        width: w,
        above,
        top: (above ? r.top - 8 - h : r.bottom + 8) + window.scrollY,
        left: Math.max(16, Math.min(r.left - 16, vw - w - 16)) + window.scrollX,
    };
}

function close(refocus = false) {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    if (!term.value) return;
    term.value = null;
    pinned = false;
    trigger?.setAttribute("aria-expanded", "false");
    if (refocus) trigger?.focus();
    trigger = null;
}

function focusAfter(el: HTMLElement) {
    const all = [
        ...document.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
    ].filter((n) => n.getClientRects().length > 0 && !inCard(n));
    all[all.indexOf(el) + 1]?.focus();
}

function onPointerOver(e: PointerEvent) {
    if (e.pointerType !== "mouse") return;
    if (inCard(e.target)) return clearTimeout(closeTimer);
    const a = termOf(e.target);
    if (!a) return;
    clearTimeout(closeTimer);
    if (a === trigger) return;
    clearTimeout(openTimer);
    // Moving from one open card to the next term switches at once.
    if (term.value && !pinned) open(a, false, false);
    else if (!term.value) openTimer = window.setTimeout(() => open(a, false, false), OPEN_DELAY);
}

function onPointerOut(e: PointerEvent) {
    if (e.pointerType !== "mouse") return;
    const from = termOf(e.target) ?? (inCard(e.target) ? card.value : null);
    if (!from) return;
    const to = e.relatedTarget;
    if (to instanceof Node && (from.contains(to) || inCard(to) || trigger?.contains(to))) return;
    clearTimeout(openTimer);
    if (term.value && !pinned) closeTimer = window.setTimeout(() => close(), CLOSE_DELAY);
}

function onClick(e: MouseEvent) {
    const a = termOf(e.target);
    if (a) {
        if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        // Stops the VitePress router too, which skips a click with defaultPrevented.
        e.preventDefault();
        if (a === trigger && pinned) close();
        else open(a, true, e.detail === 0);
        return;
    }
    if (term.value && !inCard(e.target)) close();
}

function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape" && term.value) {
        e.preventDefault();
        close(true);
        return;
    }
    // The card sits at the end of the body, so Tab out of it would land at the bottom of the page.
    // Leaving it either way closes it, and focus goes on from the term.
    if (e.key === "Tab" && term.value && inCard(e.target)) {
        const links = [...card.value!.querySelectorAll<HTMLElement>("a[href]")];
        const last = links[links.length - 1];
        if (e.shiftKey ? e.target === card.value || e.target === links[0] : e.target === last) {
            e.preventDefault();
            const from = trigger;
            close(true);
            if (!e.shiftKey && from) focusAfter(from);
        }
        return;
    }
    // A link answers Enter only. role=button promises Space as well.
    if (e.key === " " && !e.repeat) {
        const a = termOf(e.target);
        if (!a) return;
        e.preventDefault();
        if (a === trigger && pinned) close();
        else open(a, true, true);
    }
}

function onFocusIn(e: FocusEvent) {
    if (term.value && !inCard(e.target) && e.target !== trigger) close();
}

const onResize = () => close();

watch(() => route.path, () => close());
onContentUpdated(markAll);

onMounted(() => {
    mounted.value = true;
    markAll();
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    window.addEventListener("resize", onResize);
});

onBeforeUnmount(() => {
    document.removeEventListener("pointerover", onPointerOver);
    document.removeEventListener("pointerout", onPointerOut);
    document.removeEventListener("click", onClick, true);
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("focusin", onFocusIn);
    window.removeEventListener("resize", onResize);
});
</script>

<template>
    <Teleport v-if="mounted" to="body">
        <Transition name="asi-term-card">
            <div
                v-if="term"
                :id="ID"
                ref="card"
                class="asi-term-card"
                :class="{ 'is-above': box.above }"
                role="dialog"
                aria-labelledby="asi-term-card-title"
                tabindex="-1"
                :style="{ top: box.top + 'px', left: box.left + 'px', width: box.width + 'px' }"
            >
                <p id="asi-term-card-title" class="asi-term-card-title" v-html="term.title" />
                <div class="asi-term-card-body" v-html="term.html" />
                <p class="asi-term-card-links">
                    <a v-if="term.more" :href="term.more.href">{{ term.more.text }}</a>
                    <a :href="PREFIX + term.id">Glossary</a>
                </p>
            </div>
        </Transition>
    </Teleport>
</template>
