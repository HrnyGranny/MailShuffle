<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import ContactDropdown from "./components/ContactModal.vue";

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
  <!-- Botón de contacto estilo MongoDB Atlas -->
  <a
    ref="contactButtonRef"
    href="#"
    class="position-fixed rounded-pill d-flex align-items-center justify-content-center shadow contact-btn"
    aria-label="Contacto"
    @click.prevent="toggleDropdown"
  >
    <span class="contact-text">¿Need help?</span>
    <span class="material-icons-round contact-icon">chat</span>
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
/* Estilo del botón inspirado en MongoDB Atlas */
.contact-btn {
  bottom: 25px;
  right: 48px;
  background-color: #98fe98;
  padding: 10px 16px;
  color: #344767;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  z-index: 9999;
  text-decoration: none;
  border: none;
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.contact-text {
  margin-right: 8px;
}

.contact-icon {
  font-size: 20px;
}

/* Estilo para el dropdown/bocadillo */
.contact-dropdown {
  position: fixed;
  bottom: 85px;
  right: 25px;
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

/* Media queries */
@media (max-width: 992px) {
  .contact-btn {
    padding: 8px 14px;
    font-size: 13px;
  }
  
  .contact-icon {
    font-size: 18px;
  }
  
  .contact-dropdown {
    bottom: 80px;
    width: 320px;
  }
}

@media (max-width: 576px) {
  .contact-btn {
    padding: 6px 12px;
    font-size: 12px;
    bottom: 15px;
    right: 15px;
  }
  
  .contact-icon {
    font-size: 16px;
  }
  
  .contact-dropdown {
    bottom: 65px;
    right: 15px;
    width: 280px;
  }
  
  /* Ajustar posición del triángulo en móvil */
  .contact-dropdown::after {
    right: 20px;
  }
}

@media (max-width: 359px) {
  .contact-text {
    display: none;
  }
  
  .contact-btn {
    padding: 8px;
    border-radius: 50%;
  }
  
  .contact-dropdown {
    width: 250px;
  }
}
</style>