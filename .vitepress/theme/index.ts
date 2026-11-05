import DefaultTheme from "vitepress/theme";
import FeedbackForm from "../../components/FeedbackForm.vue";
import type { Theme } from "vitepress";
import { h } from "vue";
import "./style.css";
import { captchaPlugin } from "./captchaFetch";

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DefaultTheme.Layout, null, {
            "layout-top": () => h(FeedbackForm),
            "doc-before": () => h("div", { class: "docs-review-note" }, [
                "Documentation review in progress. ",
                h("a", { href: "/general/documentation-status/" }, "Check the verified scope"),
                " and ",
                h("a", { href: "/general/container-images/" }, "published container images"),
                " before using setup or API examples.",
            ]),
        });
    },
    enhanceApp({ app, router, siteData }) {
        app.use(captchaPlugin);
    },
} satisfies Theme;
