<script setup>
import { ref, computed } from "vue";
import Sidenav from "./components/Sidenav/Index.vue";
import Navbar from "./components/DashNavBar.vue";
import AppFooter from "./components/Footer.vue";

// Estado local
const isNavFixed = ref(false);
const darkMode = ref(false);
const isAbsolute = ref(false);
const showSidenav = ref(true);
const layout = ref("default");
const showNavbar = ref(true);
const showFooter = ref(true);

const navClasses = computed(() => {
  return {
    "position-sticky bg-white left-auto top-2 z-index-sticky":
      isNavFixed.value && !darkMode.value,
    "position-sticky bg-default left-auto top-2 z-index-sticky":
      isNavFixed.value && darkMode.value,
    "position-absolute px-4 mx-0 w-100 z-index-2": isAbsolute.value,
    "px-0 mx-4": !isAbsolute.value,
  };
});
</script>

<template>
  <div
    v-show="layout === 'landing'"
    class="landing-bg h-100 bg-gradient-primary position-fixed w-100"
  ></div>

  <sidenav v-if="showSidenav" />

  <main
    class="main-content position-relative max-height-vh-100 h-100 border-radius-lg"
  >
    <!-- nav -->

    <navbar :class="[navClasses]" v-if="showNavbar" />

    <router-view />

    <app-footer v-show="showFooter" />
  </main>
</template>