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
app.mount("#app");