import type { Router } from "vitepress";

// VitePress 1.6.4 does not scroll the sidebar to the active item (VPSidebar.vue has no scroll code),
// so on a long menu the current page can sit below the fold. This scrolls the sidebar, not the page.
function reveal() {
    const bar = document.querySelector<HTMLElement>(".VPSidebar");
    const item = bar?.querySelector<HTMLElement>(".VPSidebarItem.is-active > .item > .link");
    if (!bar || !item || !bar.clientHeight) return;
    const b = bar.getBoundingClientRect();
    const i = item.getBoundingClientRect();
    // On desktop the first 64 px of the sidebar sit under the top bar, in the drawer there is no such strip.
    const top = b.top + parseFloat(getComputedStyle(bar).paddingTop);
    const margin = 32;
    if (i.top < top + margin) bar.scrollTop += i.top - top - margin;
    else if (i.bottom > b.bottom - margin) bar.scrollTop += i.bottom - b.bottom + margin;
}

// A group without a link is a row with role=button that toggles on click and Enter, and VitePress puts
// a second focusable toggle, the caret, inside it. axe reports that as nested-interactive, and the
// keyboard stops twice on one control. The row does the job (VitePress toggles such a group from the
// row, not from the caret), so the caret becomes a plain icon: no role, no tabindex, hidden from
// assistive technology. tabindex=-1 is not enough, because axe still counts it as focusable.
// A group with a link keeps its caret as the toggle, because the row holds the link there. VitePress
// still gives that row tabindex=0, and Enter on it does nothing, so without this the keyboard stops
// three times on such a group. The row loses its tabindex, and the link and the caret remain.
// Vue does not restore static attributes on hydration or on a re-render with the same value, so
// running this before hydration is safe.
function fixGroupToggles() {
    document
        .querySelectorAll<HTMLElement>('.VPSidebar .item[role="button"] > .caret[role="button"]')
        .forEach((caret) => {
            caret.removeAttribute("role");
            caret.removeAttribute("tabindex");
            caret.setAttribute("aria-hidden", "true");
        });
    document.querySelectorAll<HTMLElement>(".VPSidebar .item[tabindex]:not([role])").forEach((row) => {
        if (row.querySelector(":scope > .link")) row.removeAttribute("tabindex");
    });
    syncExpanded();
}

// VitePress shows whether a group is open only by the collapsed class, so a screen reader would
// announce every toggle as a plain button. Each toggle gets aria-expanded from that class, and the observer keeps
// it current whenever Vue changes the class (a click, Enter, or a route change that opens the group of
// the new page). Only aria-expanded is written here, so the observer does not trigger itself.
function syncExpanded() {
    document.querySelectorAll<HTMLElement>(".VPSidebar .VPSidebarItem.collapsible").forEach((group) => {
        const toggle = group.querySelector<HTMLElement>(
            ':scope > .item[role="button"], :scope > .item > .caret[role="button"]',
        );
        const open = String(!group.classList.contains("collapsed"));
        if (toggle && toggle.getAttribute("aria-expanded") !== open) toggle.setAttribute("aria-expanded", open);
    });
}

// The 404 page has no sidebar, so after the reader leaves it, VitePress renders a new sidebar element
// and the observer moves to that one.
const observer = typeof window === "undefined" ? null : new MutationObserver(syncExpanded);
let observed: Element | null = null;
function watchSidebar() {
    const bar = document.querySelector(".VPSidebar");
    if (!observer || !bar || bar === observed) return;
    observer.disconnect();
    observer.observe(bar, { subtree: true, attributes: true, attributeFilter: ["class"] });
    observed = bar;
}

export function setupSidebarScroll(router: Router) {
    if (typeof window === "undefined") return;
    // The theme loads as a module script, so the server HTML of the sidebar is already parsed here.
    fixGroupToggles();
    watchSidebar();
    const run = () =>
        requestAnimationFrame(() =>
            requestAnimationFrame(() => {
                fixGroupToggles();
                watchSidebar();
                reveal();
            }),
        );
    router.onAfterRouteChanged = (() => {
        const prev = router.onAfterRouteChanged;
        return (to: string) => {
            run();
            return prev?.(to);
        };
    })();
    window.addEventListener("load", run);
    // The drawer is hidden on a phone until the Menu button opens it.
    document.addEventListener("click", (e) => {
        if ((e.target as Element).closest(".VPLocalNav .menu")) run();
    });
    // VitePress toggles a group on Enter only. A native button also answers Space, and a reader who
    // presses Space on a toggle expects that, so Space clicks the toggle instead of scrolling the page.
    document.addEventListener("keydown", (e) => {
        if (e.key !== " " || e.ctrlKey || e.altKey || e.metaKey || !(e.target instanceof Element)) return;
        const toggle = e.target.closest<HTMLElement>('.VPSidebar [role="button"]');
        if (!toggle) return;
        e.preventDefault();
        if (!e.repeat) toggle.click();
    });
}
