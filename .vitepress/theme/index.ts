import DefaultTheme from "vitepress/theme";
import FeedbackForm from "../../components/FeedbackForm.vue";
import type { Theme } from "vitepress";
import { h } from "vue";
import "./style.css";

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DefaultTheme.Layout, null, {
            "layout-top": () => h(FeedbackForm),
        });
    },
    enhanceApp({ app, router, siteData }) {
        // ...
    },
} satisfies Theme;
