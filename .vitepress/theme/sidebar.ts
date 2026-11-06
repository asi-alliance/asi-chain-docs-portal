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

export function setupSidebarScroll(router: Router) {
    if (typeof window === "undefined") return;
    const run = () => requestAnimationFrame(() => requestAnimationFrame(reveal));
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
