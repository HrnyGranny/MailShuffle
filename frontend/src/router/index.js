import { createRouter, createWebHistory } from "vue-router";
import PresentationView from "../views/Presentation/PresentationView.vue";
import LoginView from "../views/Login/LoginView.vue";
import UpgradeView from "../views/Upgrade/UpgradeView.vue";
import DashboardView from "../views/Dashboard/Dashboard.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "presentation",
      component: PresentationView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/upgrade",
      name: "upgrade",
      component: UpgradeView,
    },
    {
      path: "/Dashboard",
      name: "Dashboard",
      component: DashboardView,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
