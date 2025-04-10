<script setup>
import { computed, reactive } from "vue";

// Estado reactivo local
const state = reactive({
  isRTL: false, // Define el estado inicial
});

// Función para minimizar la barra lateral
const sidebarMinimize = () => {
  const sidenavShow = document.querySelector("#app");
  if (sidenavShow) {
    sidenavShow.classList.toggle("g-sidenav-hidden");
    sidenavShow.classList.toggle("g-sidenav-pinned");
  }
};

const minimizeSidebar = () => {
  if (window.innerWidth < 1200) {
    sidebarMinimize();
  }
};

// Definición de propiedades
defineProps({
  to: {
    type: String,
    required: true,
  },
  navText: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <router-link :to="to" class="nav-link" @click="minimizeSidebar">
    <div
      class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center"
    >
      <slot name="icon"></slot>
    </div>
    <span class="nav-link-text" :class="isRTL ? ' me-1' : 'ms-1'">{{
      navText
    }}</span>
  </router-link>
</template>