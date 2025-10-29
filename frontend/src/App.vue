<script setup>
import { ref, onMounted } from "vue";
import Preloader from "./components/Preloader.vue";

const loading = ref(true);

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 150000); // Simula la carga de la app
});
</script>

<template>
  <Preloader :loading="loading" />
  <router-view />
</template>
