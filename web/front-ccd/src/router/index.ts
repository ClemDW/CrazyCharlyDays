import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CreateArticle from "../views/CreateArticle.vue";
import AuthView from "../views/AuthView.vue";

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
  ],
});

export default router;
