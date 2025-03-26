<script setup>
import { onMounted, ref } from "vue";

// Sections components
import BaseLayout from "../Inbox/components/BaseLayout.vue";
import View from "../Inbox/components/View.vue";
import Received from "../Inbox/components/Received.vue";

const recipient = ref(""); // Variable para almacenar el correo generado

//nav-pills
import setNavPills from "@/assets/js/nav-pills";

//hook
onMounted(() => {
  setNavPills();
});
</script>

<template>
  <BaseLayout title="InBox">
    <!-- View -->
    <View title="" id="tabs-simple" @recipientUpdated="recipient = $event">
      <!-- Contenedor de correos -->
      <div class="received-container">
        <!-- Imagen centrada si no hay correos -->
        <img
          v-if="!recipient"
          src="../../assets/img/carpeta-vacia.png"
          alt="No Emails"
          class="centered-image"
        />
        <!-- Componente Received si hay correos -->
        <Received v-if="recipient" :recipient="recipient" />
      </div>
    </View>
  </BaseLayout>
</template>

<style scoped>
.received-container {
  position: relative; /* Necesario para centrar elementos hijos */
  margin-bottom: 450px; /* Ajusta el valor según el espacio que necesites */
  min-height: 300px; /* Asegura que el contenedor tenga un tamaño mínimo */
}

.centered-image {
  position: absolute; /* Posiciona la imagen dentro del contenedor */
  top: 120%; /* Centra verticalmente */
  left: 50%; /* Centra horizontalmente */
  transform: translate(
    -50%,
    -50%
  ); /* Ajusta el punto de referencia al centro */
  max-width: 150px; /* Tamaño máximo de la imagen */
  opacity: 0.5; /* Opcional: hace que la imagen sea semitransparente */
}
</style>
