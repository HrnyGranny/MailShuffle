<template>
  <a
    href="#"
    class="floating-button"
    aria-label="Ayuda"
    data-bs-toggle="modal"
    data-bs-target="#contactModal"
  >
    <img :src="iconPath" alt="Ícono" class="icon" />
  </a>
  <ContactModal />
</template>

<script setup>
import ContactModal from "./components/ContactModal.vue";
import iconImage from "@/assets/img/iconos/ContactIco.png";

const iconPath = iconImage;
</script>

<style scoped>
/* Botón flotante con estilo Material */
.floating-button {
  position: fixed;
  bottom: 90px;
  right: 90px;
  background-color: #98fe98;
  color: white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  text-decoration: none;
  z-index: 9999;
}

.floating-button:hover {
  transform: scale(1.1);
}

.icon {
  width: 30px;
  height: 30px;
}
</style>
