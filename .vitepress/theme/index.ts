import DefaultTheme from "vitepress/theme-without-fonts";
import FeedbackForm from "../../components/FeedbackForm.vue";
import Steps from "../../components/Steps.vue";
import CardGrid from "../../components/CardGrid.vue";
import DocCard from "../../components/DocCard.vue";
import Diagram from "../../components/Diagram.vue";
import type { Theme } from "vitepress";
import { h } from "vue";
import "./style.css";
import "./content.css";
import "./chrome.css";
import "./blocks.css";
import "./diagrams.css";
import { captchaPlugin } from "./captchaFetch";
import { setupSidebarScroll } from "./sidebar";

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DefaultTheme.Layout, null, {
            "layout-top": () => h(FeedbackForm),
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
    enhanceApp({ app, router, siteData }) {
        app.use(captchaPlugin);
        setupSidebarScroll(router);
        app.component("Steps", Steps);
        app.component("CardGrid", CardGrid);
        app.component("DocCard", DocCard);
        app.component("Diagram", Diagram);
    },
} satisfies Theme;
