import { createRouter, createWebHistory } from "vue-router";
import PresentationView from "../views/Presentation/PresentationView.vue";
import LoginView from "../views/Login/LoginView.vue";
import UpgradeView from "../views/Upgrade/UpgradeView.vue";
import DashboardView from "../views/Dashboard/Dashboard.vue";
import Error404 from "../views/Error/Error404.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "presentation",
      component: PresentationView,
      meta: {
        title: "MailShuffle | Home",
        metaDescription:
          "Welcome to MailShuffle, generate temporary emails and protect your privacy.",
      },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        title: "MailShuffle | Login",
        metaDescription:
          "Log in to your MailShuffle account to manage your temporary emails.",
      },
    },
    {
      path: "/upgrade",
      name: "upgrade",
      component: UpgradeView,
      meta: {
        title: "MailShuffle | Upgrade Account",
        metaDescription:
          "Upgrade your MailShuffle account and get more features.",
      },
    },
    {
      path: "/Dashboard",
      name: "Dashboard",
      component: DashboardView,
      meta: {
        title: "MailShuffle | Dashboard",
        metaDescription:
          "Manage your temporary emails from the MailShuffle dashboard.",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "Error404",
      component: Error404,
      meta: {
        title: "MailShuffle | Page Not Found",
        metaDescription: "Sorry, the page you are looking for does not exist.",
      },
    },
  ],
});

export default router;
