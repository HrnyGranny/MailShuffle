<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import ContactDropdown from "./components/ContactModal.vue";
import iconImage from "@/assets/img/iconos/ContactIco.png";
import activeIconImage from "@/assets/img/iconos/x.png";

const iconPath = iconImage;
const activeIconPath = activeIconImage;
const isDropdownActive = ref(false);
const contactButtonRef = ref(null);
const dropdownRef = ref(null);

const toggleDropdown = () => {
  isDropdownActive.value = !isDropdownActive.value;
};

const closeDropdown = () => {
  isDropdownActive.value = false;
};

// Implementación manual para cerrar el dropdown al hacer clic fuera
const handleOutsideClick = (event) => {
  const dropdownEl = dropdownRef.value;
  const buttonEl = contactButtonRef.value;
  
  if (isDropdownActive.value && 
      dropdownEl && 
      buttonEl && 
      !dropdownEl.contains(event.target) && 
      !buttonEl.contains(event.target)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});
</script>

<template>
  <!-- Botón exactamente como estaba en el original -->
  <a
    ref="contactButtonRef"
    href="#"
    class="position-fixed rounded-circle d-flex align-items-center justify-content-center shadow contact-btn"
    aria-label="Ayuda"
    @click.prevent="toggleDropdown"
  >
    <img :src="isDropdownActive ? activeIconPath : iconPath" alt="Ícono" class="contact-icon" />
  </a>
    
  <!-- El bocadillo que aparece cuando se hace clic -->
  <transition name="fade-slide">
    <div 
      v-if="isDropdownActive" 
      ref="dropdownRef"
      class="contact-dropdown"
    >
      <ContactDropdown @close="closeDropdown" />
    </div>
  </transition>
</template>

<style scoped>
/* CSS exactamente como estaba en el original para el botón */
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

/* Estilo para el dropdown/bocadillo */
.contact-dropdown {
  position: fixed;
  bottom: 160px;
  right: 90px;
  width: 350px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  z-index: 9998;
  overflow: hidden;
}

/* Triángulo del bocadillo */
.contact-dropdown::after {
  content: "";
  position: absolute;
  bottom: -10px;
  right: 25px;
  width: 20px;
  height: 20px;
  background-color: white;
  transform: rotate(45deg);
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
  z-index: -1;
}

/* Animaciones */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Media queries - manteniendo las originales para el botón */
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
  
  .contact-dropdown {
    bottom: 110px;
    right: 50px;
    width: 320px;
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
  
  .contact-dropdown {
    bottom: 70px;
    right: 20px;
    width: 280px;
  }
  
  /* Ajustar posición del triángulo en móvil */
  .contact-dropdown::after {
    right: 20px;
  }
}

@media (max-width: 359px) {
  .contact-dropdown {
    width: 250px;
  }
}
</style>