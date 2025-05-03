import { createRouter, createWebHistory } from "vue-router";
import PresentationView from "../views/Presentation/PresentationView.vue";
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
        title: "Home | MailShuffle",
        metaDescription:
          "Welcome to MailShuffle, generate temporary emails and protect your privacy.",
      },
    },
    {
      path: "/Dashboard",
      name: "Dashboard",
      component: DashboardView,
      meta: {
        title: "Dashboard | MailShuffle",
        metaDescription:
          "Manage your temporary emails from the MailShuffle dashboard.",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "Error404",
      component: Error404,
      meta: {
        title: "Page Not Found | MailShuffle",
        metaDescription: "Sorry, the page you are looking for does not exist.",
      },
    },
  ],
});

export default router;
