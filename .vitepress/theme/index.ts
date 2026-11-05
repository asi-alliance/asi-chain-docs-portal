import DefaultTheme from "vitepress/theme";
import FeedbackForm from "../../components/FeedbackForm.vue";
import Steps from "../../components/Steps.vue";
import CardGrid from "../../components/CardGrid.vue";
import DocCard from "../../components/DocCard.vue";
import Diagram from "../../components/Diagram.vue";
import HeroTerminal from "../../components/HeroTerminal.vue";
import SectionLabel from "../../components/SectionLabel.vue";
import type { Theme } from "vitepress";
import { h } from "vue";
import "./style.css";
import "./content.css";
import "./chrome.css";
import "./blocks.css";
import "./diagrams.css";
import { captchaPlugin } from "./captchaFetch";

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DefaultTheme.Layout, null, {
            "layout-top": () => h(FeedbackForm),
            "doc-before": () => [
                h("div", { class: "docs-review-note" }, [
                    "Documentation review in progress. ",
                    h("a", { href: "/general/documentation-status/" }, "Check the verified scope"),
                    " and ",
                    h("a", { href: "/general/container-images/" }, "published container images"),
                    " before using setup or API examples.",
                ]),
                h(SectionLabel),
            ],
            "home-hero-info-before": () => h("p", { class: "asi-hero-badges" }, [
                h("span", { class: "VPBadge tip" }, "DevNet"),
            ]),
            "home-hero-image": () => h(HeroTerminal),
        });
    },
    enhanceApp({ app, router, siteData }) {
        app.use(captchaPlugin);
        app.component("Steps", Steps);
        app.component("CardGrid", CardGrid);
        app.component("DocCard", DocCard);
        app.component("Diagram", Diagram);
    },
} satisfies Theme;
