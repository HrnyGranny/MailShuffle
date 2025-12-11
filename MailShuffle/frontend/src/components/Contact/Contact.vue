<script setup>
  import { ref, onMounted, onUnmounted } from "vue";
  import ContactDropdown from "./components/ContactModal.vue";
  import MaterialButton from "@/material_components/MaterialButton.vue";
  
  const isDropdownActive = ref(false);
  const contactButtonRef = ref(null); 
  const dropdownRef = ref(null);
  
  const toggleDropdown = () => {
    isDropdownActive.value = !isDropdownActive.value;
  };
  
  const closeDropdown = () => {
    isDropdownActive.value = false;
  };
  
  const handleOutsideClick = (event) => {
    const dropdownEl = dropdownRef.value;
    const buttonEl = contactButtonRef.value?.$el || contactButtonRef.value;
    
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
    <!-- Usamos MaterialButton pero sobreescribimos estilos específicos -->
    <MaterialButton
      ref="contactButtonRef"
      class="contact-btn-fixed"
      ariaLabel="Contacto"
      @click="toggleDropdown"
    >
      <!-- Usamos el slot para mantener el orden Texto - Icono -->
      <span class="contact-text">Need help?</span>
      <span class="material-icons-round contact-icon">chat</span>
    </MaterialButton>
      
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

  .contact-btn-fixed {
    /* Posicionamiento fijo original */
    position: fixed;
    bottom: 25px;
    right: 48px;
    z-index: 9999;
  }
  
  .contact-text {
    margin-right: 8px;
  }
  
  .contact-icon {
    font-size: 20px;
  }
  
  /* Estilo para el dropdown/bocadillo (Sin cambios) */
  .contact-dropdown {
    position: fixed;
    bottom: 85px;
    right: 25px;
    width: 325px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    z-index: 9998;
    overflow: hidden;
  }
  
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
  
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .fade-slide-enter-from,
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
  
  /* Media queries adaptadas para sobreescribir los estilos del botón genérico en móvil */
  @media (max-width: 992px) {
    .contact-btn-fixed {
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
    .contact-btn-fixed {
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
    
    .contact-dropdown::after {
      right: 20px;
    }
  }
  
  @media (max-width: 400px) {
    .contact-text {
      display: none;
    }
    
    .contact-btn-fixed {
      padding: 10px; 
    }
    
    .contact-dropdown {
      width: 250px;
    }
  }
  </style>