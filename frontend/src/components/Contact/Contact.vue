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
  <!-- Botón de contacto con bordes redondeados moderados -->
  <a
    ref="contactButtonRef"
    href="#"
    class="position-fixed d-flex align-items-center justify-content-center contact-btn"
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
/* Estilo del botón con bordes moderadamente redondeados */
.contact-btn {
  /* Posicionamiento */
  bottom: 25px;
  right: 48px;
  z-index: 9999;
  
  /* Apariencia visual */
  background-color: #98fe98;
  color: #344767;
  border: 1px solid #98fe98;
  border-radius: 0.75rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  
  /* Tipografía */
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.02em;
  text-decoration: none;
  
  /* Espaciado */
  padding: 10px 16px;
  
  /* Comportamiento */
  cursor: pointer;
  overflow: hidden;
  outline: none;
  
  /* Transición suave */
  transition: transform 0.2s ease-in-out, 
              box-shadow 0.2s ease-in-out,
              background-color 0.2s ease-in-out;
}

/* Estilo hover exactamente igual al custom-button */
.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
}

/* Estilo active/click */
.contact-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
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
    border-radius: 0.75rem; /* Mantener consistencia */
  }
  
  .contact-dropdown {
    width: 250px;
  }
}
</style>