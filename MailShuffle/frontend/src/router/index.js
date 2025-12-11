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
        title: "Home | 7dMail",
        metaDescription:
          "Welcome to 7dMail, generate temporary emails and protect your privacy.",
      },
    },
    {
      path: "/Dashboard",
      name: "Dashboard",
      component: DashboardView,
      meta: {
        title: "Dashboard | 7dMail",
        metaDescription:
          "Manage your temporary emails from the 7dMail dashboard.",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "Error404",
      component: Error404,
      meta: {
        title: "Page Not Found | 7dMail",
        metaDescription: "Sorry, the page you are looking for does not exist.",
      },
    },
  ],
});

export default router;
