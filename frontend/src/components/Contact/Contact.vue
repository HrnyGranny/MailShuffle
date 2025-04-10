<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import ContactModal from "./components/ContactModal.vue";
import iconImage from "@/assets/img/iconos/ContactIco.png";
import activeIconImage from "@/assets/img/iconos/x.png";

const iconPath = iconImage;
const activeIconPath = activeIconImage;
const isModalActive = ref(false);

const toggleModal = () => {
  isModalActive.value = true;
};

const closeModal = () => {
  isModalActive.value = false;
};

onMounted(() => {
  const modalElement = document.getElementById("contactModal");
  modalElement.addEventListener("hidden.bs.modal", closeModal);
});

onBeforeUnmount(() => {
  const modalElement = document.getElementById("contactModal");
  modalElement.removeEventListener("hidden.bs.modal", closeModal);
});
</script>

<template>
  <a
    href="#"
    class="floating-button"
    aria-label="Ayuda"
    data-bs-toggle="modal"
    data-bs-target="#contactModal"
    @click="toggleModal"
  >
    <img :src="isModalActive ? activeIconPath : iconPath" alt="Ícono" class="icon" />
  </a>
  <ContactModal id="contactModal" />
</template>

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