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
    class="position-fixed rounded-circle d-flex align-items-center justify-content-center shadow contact-btn"
    aria-label="Ayuda"
    data-bs-toggle="modal"
    data-bs-target="#contactModal"
    @click="toggleModal"
  >
    <img :src="isModalActive ? activeIconPath : iconPath" alt="Ícono" class="contact-icon" />
  </a>
  <ContactModal id="contactModal" />
</template>

<style scoped>
/* CSS mínimo necesario */
.contact-btn {
  bottom: 90px;
  right: 90px;
  background-color: #98fe98;
  width: 60px;
  height: 60px;
  transition: transform 0.2s ease;
  z-index: 9999;
}

.contact-btn:hover {
  transform: scale(1.1);
}

.contact-icon {
  width: 30px;
  height: 30px;
}

/* Media queries simplificados */
@media (max-width: 992px) {
  .contact-btn {
    bottom: 50px;
    right: 50px;
    width: 55px;
    height: 55px;
  }
  
  .contact-icon {
    width: 27px;
    height: 27px;
  }
}

@media (max-width: 576px) {
  .contact-btn {
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
  }
  
  .contact-icon {
    width: 22px;
    height: 22px;
  }
}
</style>