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
// assistive technology. tabindex=-1 is not enough, axe still counts it as focusable. Groups with a
// link keep their caret, because there the row is the link. Vue does not restore static attributes
// on hydration, so running this before hydration is safe.
function unnestCarets() {
    document
        .querySelectorAll<HTMLElement>('.VPSidebar .item[role="button"] > .caret[role="button"]')
        .forEach((caret) => {
            caret.removeAttribute("role");
            caret.removeAttribute("tabindex");
            caret.setAttribute("aria-hidden", "true");
        });
}

export function setupSidebarScroll(router: Router) {
    if (typeof window === "undefined") return;
    // The theme loads as a module script, so the server HTML of the sidebar is already parsed here.
    unnestCarets();
    const run = () =>
        requestAnimationFrame(() =>
            requestAnimationFrame(() => {
                unnestCarets();
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
}
