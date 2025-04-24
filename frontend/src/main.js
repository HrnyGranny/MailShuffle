import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

// Nucleo Icons
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";

// Bootstrap CSS y JS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Material Kit
import "./assets/js/material-input.js";
import "./assets/js/ripple-effect.js";
import "./assets/scss/material-kit.scss";

const app = createApp(App);

app.use(createPinia());
app.use(router);

// Dynamic SEO
router.afterEach((to) => {
  // Update title
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }

  // Update meta description
  if (to.meta && to.meta.metaDescription) {
    let meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", to.meta.metaDescription);
    } else {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      meta.setAttribute("content", to.meta.metaDescription);
      document.head.appendChild(meta);
    }
  }
});

app.mount("#app");
