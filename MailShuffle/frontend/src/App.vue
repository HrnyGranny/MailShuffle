<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"; // OJO: Es useRouter, con 'r' al final
import Preloader from "./components/Preloader.vue";

const router = useRouter();
const loading = ref(false);

// Este "guardia" salta ANTES de que cambie la página, eliminando el flash
router.beforeEach((to, from, next) => {
  // IMPORTANTE: Comprueba en tu router/index.js si la ruta se llama 'ErrorPage' o 'Error404'
  // Aquí compruebo ambos por seguridad:
  if (to.name === 'ErrorPage' || to.name === 'Error404') {
    loading.value = false;
  } else {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 1500);
  }
  next(); // Deja pasar a la siguiente página
});
</script>

<template>
  <Preloader :loading="loading" />
  <router-view />
</template>