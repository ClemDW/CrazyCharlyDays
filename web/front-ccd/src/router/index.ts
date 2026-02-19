import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CreateArticle from "../views/CreateArticle.vue";
import AuthView from "../views/AuthView.vue";
import CampaignConfig from "../views/CampaignConfig.vue";
import MyBox from "../views/MyBox.vue";
import AdminBoxes from "../views/AdminBoxes.vue";
import AdminSubscribers from "../views/AdminSubscribers.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/create-article",
      name: "create-article",
      component: CreateArticle,
    },
    {
      path: "/auth",
      name: "auth",
      component: AuthView,
    },
    {
      path: "/admin/campaign",
      name: "campaign-config",
      component: CampaignConfig,
    },
    {
      path: "/my-box",
      name: "my-box",
      component: MyBox,
    },
    {
      path: "/admin/boxes",
      name: "admin-boxes",
      component: AdminBoxes,
    },
    {
      path: "/admin/subscribers",
      name: "admin-subscribers",
      component: AdminSubscribers,
    },
  ],
});

export default router;
