<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { RouterLink } from "vue-router";
import MaterialInput from "@/material_components/MaterialInput.vue";

const loginDropdownOpen = ref(false);

// Form data with reactive references
const formData = reactive({
  email: "",
  password: "",
});

// Track if form has been submitted
const formSubmitted = ref(false);

// Simple validation functions
const isValidEmail = () => {
  const email = formData.email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const isValidPassword = () => formData.password.trim().length >= 6;

// Check if a field has an error (only after form submission)
const hasError = (field) => {
  if (!formSubmitted.value) return false;

  if (field === "email") return !isValidEmail();
  if (field === "password") return !isValidPassword();

  return false;
};

// Get error message for a field
const getErrorMessage = (field) => {
  if (field === "email") {
    if (!formData.email.trim()) return "Email is required";
    if (!formData.email.includes("@")) return "Email must include @ symbol";
    return "Please enter a valid email";
  }

  if (field === "password") {
    if (!formData.password.trim()) return "Password is required";
    return "Password must be at least 6 characters";
  }

  return "";
};

// Función para manejar el envío del formulario de login
const handleLogin = (e) => {
  e.preventDefault();
  
  // Mark form as submitted (to show validation errors)
  formSubmitted.value = true;

  // Direct validation
  const isFormValid = isValidEmail() && isValidPassword();

  // return if form is invalid
  if (!isFormValid) {
    return;
  }

  // Aquí iría tu lógica de autenticación
  console.log('Login attempt with:', formData.email, formData.password);
  
  // Cerrar dropdown después de enviar un formulario válido
  loginDropdownOpen.value = false;
  formSubmitted.value = false;
};

// Additional function to clear validation when a field is fixed
const updateField = (field) => {
  // If the form hasn't been submitted yet, no need to do anything
  if (!formSubmitted.value) return;

  // For better UX, update the form validation state if all fields are now valid
  if (isValidEmail() && isValidPassword()) {
    // All fields are valid, reset the form submitted state so errors disappear
    formSubmitted.value = false;
  }
};

// Función para cerrar el dropdown cuando se hace clic fuera
const closeLoginDropdown = (e) => {
  if (!e.target.closest('.login-dropdown') && !e.target.closest('.login-trigger')) {
    loginDropdownOpen.value = false;
  }
};

// Configurar event listener para cerrar el dropdown al hacer clic afuera
onMounted(() => {
  document.addEventListener('click', closeLoginDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeLoginDropdown);
});

const props = defineProps({
  textColor: {
    type: String,
    default: "text-dark",
  },
  isMobile: {
    type: Boolean,
    default: false,
  }
});

const toggleDropdown = (event) => {
  event.preventDefault();
  loginDropdownOpen.value = !loginDropdownOpen.value;
};
</script>

<template>
  <div class="nav-item dropdown position-relative">
    <a
      href="#"
      class="nav-link d-flex cursor-pointer align-items-center login-trigger"
      :class="props.textColor"
      @click.prevent="toggleDropdown"
    >
      <i class="material-icons opacity-6 me-2 text-md" :class="props.textColor">
        login
      </i>
      Login
      <i class="material-icons ms-1 text-sm">keyboard_arrow_down</i>
    </a>
    
    <div 
      class="dropdown-menu login-dropdown p-3"
      :class="{ show: loginDropdownOpen }"
      :style="props.isMobile 
        ? 'min-width: 280px; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);' 
        : 'min-width: 280px; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3); transform: translateX(-30%);'"
    >
      <form @submit="handleLogin">
        <h6 class="text-center mb-3">Sign in</h6>
        <div class="mb-3 input-field-container">
          <MaterialInput
            :id="props.isMobile ? 'emailMobile' : 'email'"
            class="input-group-outline my-3"
            :label="{ text: 'Email', class: 'form-label' }"
            type="email"
            v-model="formData.email"
            @input="updateField('email')"
            :class="{ 'is-invalid': hasError('email') }"
          />
          <div v-if="hasError('email')" class="validation-bubble">
            {{ getErrorMessage("email") }}
          </div>
        </div>
        <div class="mb-3 input-field-container">
          <MaterialInput
            :id="props.isMobile ? 'passwordMobile' : 'password'"
            class="input-group-outline mb-3"
            :label="{ text: 'Password', class: 'form-label' }"
            type="password"
            v-model="formData.password"
            @input="updateField('password')"
            :class="{ 'is-invalid': hasError('password') }"
          />
          <div v-if="hasError('password')" class="validation-bubble">
            {{ getErrorMessage("password") }}
          </div>
        </div>
        <div class="d-flex flex-column align-items-center mb-3">
          <button 
            type="submit" 
            class="btn mb-2 login-btn"
            style="background-color: #98FE98; border: none; color: #344767; padding: 8px 25px; border-radius: 8px; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3); font-weight: 500; margin-top: 8px"
          >
            Enter
          </button>
          <RouterLink to="/forgot-password" class="text-xs" style="color: #8392AB; font-size: 0.75rem;">
            Forgot your password?
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Estilos para el dropdown de login */
.dropdown-menu.show {
  display: block;
  animation: fadeIn 0.3s;
  z-index: 1000;
}

.login-dropdown {
  position: absolute;
  z-index: 1000;
  background-color: #fff;
}

.login-dropdown::before {
  content: "";
  position: absolute;
  margin-left: 12px;
  margin-top: 10px;
  top: -6px;
  left: 45px;
  width: 20px;
  height: 20px;
  background-color: #fff;
  transform: rotate(45deg);
  border-top: 1px solid rgba(0,0,0,0.1);
  border-left: 1px solid rgba(0,0,0,0.1);
}

.login-btn:hover {
  transform: scale(1.1);
}

.text-xs {
  transition: color 0.3s ease;
}

.text-xs:hover {
  color: #344767 !important;
  text-decoration: underline;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Estilos para validación y campos de formulario */
.is-invalid {
  border-color: #dc3545 !important;
  background-color: #fff8f8 !important;
}

.input-field-container {
  position: relative;
  margin-bottom: 20px;
}

.validation-bubble {
  position: absolute;
  background-color: #fff8e1;
  color: #e65100;
  font-size: 0.75rem;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid #ffcc80;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 100;
  width: max-content;
  margin-top: -15px;
  left: 20px;
  animation: bubble-in 0.3s ease-out;
  max-width: 90%;
}

.validation-bubble::before {
  content: "";
  position: absolute;
  top: -5px;
  left: 10px;
  width: 10px;
  height: 10px;
  background-color: #fff8e1;
  border-top: 1px solid #ffcc80;
  border-left: 1px solid #ffcc80;
  transform: rotate(45deg);
}

@keyframes bubble-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>