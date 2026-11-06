import DefaultTheme from "vitepress/theme-without-fonts";
import FeedbackForm from "../../components/FeedbackForm.vue";
import Steps from "../../components/Steps.vue";
import CardGrid from "../../components/CardGrid.vue";
import DocCard from "../../components/DocCard.vue";
import Diagram from "../../components/Diagram.vue";
import NotFound from "../../components/NotFound.vue";
import type { Theme } from "vitepress";
import { h } from "vue";
import "./style.css";
import "./content.css";
import "./chrome.css";
import "./blocks.css";
import "./diagrams.css";
import "./motion.css";
import { captchaPlugin } from "./captchaFetch";
import { setupSidebarScroll } from "./sidebar";
import { setupMotion } from "./motion";

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DefaultTheme.Layout, null, {
            "layout-top": () => h(FeedbackForm),
            // The default 404 has a quote and a button, and no sidebar to find a section in.
            "not-found": () => h(NotFound),
            // doc-before sits outside <main>, so the note is its own complementary landmark
            // and a screen reader can reach it from the landmark list.
            "doc-before": () => [
                h("aside", { class: "docs-review-note", "aria-label": "Documentation status" }, [
                    "Documentation review in progress. ",
                    h("a", { href: "/help/documentation-status/" }, "Check the verified scope"),
                    " and ",
                    h("a", { href: "/reference/container-images/" }, "published container images"),
                    " before using setup or API examples.",
                ]),
            ],
        });
    },
    enhanceApp(ctx) {
        const { app, router } = ctx;
        setupMotion(ctx);
        app.use(captchaPlugin);
        setupSidebarScroll(router);
        app.component("Steps", Steps);
        app.component("CardGrid", CardGrid);
        app.component("DocCard", DocCard);
        app.component("Diagram", Diagram);
    },
} satisfies Theme;
