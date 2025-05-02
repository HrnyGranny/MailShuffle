<script setup>
import { RouterLink } from "vue-router";
import { ref, watch, onMounted, onUnmounted, reactive } from "vue";
import { useWindowsWidth } from "../assets/js/useWindowsWidth";
import MaterialInput from "@/material_components/MaterialInput.vue";
import MaterialButton from "@/material_components/MaterialButton.vue";
import setMaterialInput from "@/assets/js/material-input";

const menuOpen = ref(false);
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
  setMaterialInput();
});

onUnmounted(() => {
  document.removeEventListener('click', closeLoginDropdown);
});

const props = defineProps({
  action: {
    type: Object,
    route: String,
    color: String,
    label: String,
    default: () => ({
      route: "https://www.creative-tim.com/product/vue-material-kit",
      color: "bg-gradient-warning",
      label: "Upgrade",
    })
  },
  transparent: {
    type: Boolean,
    default: false
  },
  light: {
    type: Boolean,
    default: false
  },
  dark: {
    type: Boolean,
    default: false
  },
  sticky: {
    type: Boolean,
    default: false
  },
  darkText: {
    type: Boolean,
    default: false
  },
  showLogin: {
    type: Boolean,
    default: true,
  },
  showGitHub: {
    type: Boolean,
    default: true,
  },
  showHamburger: {
    type: Boolean,
    default: true,
  }
});

// set text color
const getTextColor = () => {
  let color;
  if (props.transparent && textDark.value) {
    color = "text-dark";
  } else if (props.transparent) {
    color = "text-white";
  } else {
    color = "text-dark";
  }

  return color;
};

// set nav color on mobile && desktop

let textDark = ref(props.darkText);
const { type } = useWindowsWidth();

if (type.value === "mobile") {
  textDark.value = true;
} else if (type.value === "desktop" && textDark.value == false) {
  textDark.value = false;
}

watch(
  () => type.value,
  (newValue) => {
    if (newValue === "mobile") {
      textDark.value = true;
    } else {
      textDark.value = false;
    }
  }
);
</script>

<template>
  <nav
    class="navbar navbar-expand-lg top-0"
    :class="{
      'z-index-3 w-100 shadow-none navbar-transparent position-absolute my-3':
        props.transparent,
      'my-3 blur border-radius-lg z-index-3 py-2 shadow py-2 start-0 end-0 mx-4 position-absolute mt-4':
        props.sticky,
      'navbar-light bg-white py-3': props.light,
      ' navbar-dark bg-gradient-dark z-index-3 py-3': props.dark
    }"
  >
    <div
      :class="
        props.transparent || props.light || props.dark
          ? 'container'
          : 'container-fluid px-0'
      "
    >
      <!--Logo navbar expanded-->
      <RouterLink
        class="navbar-brand d-none d-md-block"
        :class="[
          (props.transparent && textDark.value) || !props.transparent
            ? 'text-dark font-weight-bolder ms-sm-3'
            : 'text-white font-weight-bolder ms-sm-3'
        ]"
        :to="{ name: 'presentation' }"
        rel="tooltip"
        title="Designed and Coded by HornyGranny"
        data-placement="bottom"
      >
        <img 
          src="../assets/img/logos/MailShuffleIcoAlone.png" 
          alt="Logo" 
          class="me-2 logo-icon" 
          style="width: 22px; height: 22px; transform: translateY(-3px);" 
        />        
        MailShuffle
      </RouterLink>
      <!--Logo navbar collapsed-->
      <RouterLink
        class="navbar-brand d-block d-md-none"
        :class="
          props.transparent || props.dark
            ? 'text-white'
            : 'font-weight-bolder ms-sm-3'
        "
        to="/"
        rel="tooltip"
        title="Designed and Coded by HornyGranny"
        data-placement="bottom"
      >
        <img 
          src="../assets/img/logos/MailShuffleIcoAlone.png" 
          alt="Logo" 
          class="me-2 logo-icon" 
          style="width: 22px; height: 22px; transform: translateY(-3px);" 
        /> 
      </RouterLink>
      
      <!-- Login and Premium buttons in mobile navbar -->
      <div class="ms-auto d-flex d-lg-none align-items-center">
        <!-- Login dropdown - mobile version -->
        <div v-if="props.showLogin" class="nav-item dropdown position-relative">
          <a
            href="#"
            class="nav-link d-flex cursor-pointer align-items-center login-trigger"
            :class="getTextColor()"
            @click.prevent="loginDropdownOpen = !loginDropdownOpen"
          >
            <i
              class="material-icons opacity-6 me-2 text-md"
              :class="getTextColor()"
            >
              login
            </i>
            Login
            <i class="material-icons ms-1 text-sm">keyboard_arrow_down</i>
          </a>
          
          <div 
            class="dropdown-menu login-dropdown p-3"
            :class="{ show: loginDropdownOpen }"
            style="min-width: 280px; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);"
          >
            <form @submit="handleLogin">
              <h6 class="text-center mb-3">Sign in</h6>
              <div class="mb-3 input-field-container">
                <MaterialInput
                  id="emailMobile"
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
                  id="passwordMobile"
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
        
        <!-- Premium button -->
        <a
          href="/Dashboard"
          class="btn btn-sm mb-0"
          style="background-color: #feb602; border: none; color: black;"
        >
          <img
            src="../assets/img/iconos/crown.png"
            alt="Crown Icon"
            style="width: 20px; height: 20px; transform: translateY(-2px);"
          />
        </a>
      </div>
      
      <!--Hamburguesa-->
      <button 
        v-if="props.showHamburger"
        class="navbar-toggler shadow-none ms-2" 
        @click="menuOpen = !menuOpen"
      >
        <span class="navbar-toggler-icon mt-2" :class="{'is-active': menuOpen}">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </span>
      </button>
      <div :class="['navbar-collapse', 'w-100', 'pt-3', 'pb-2', 'py-lg-0', { collapse: !menuOpen }]" id="navigation">
        <ul class="navbar-nav navbar-nav-hover ms-auto">
          <!-- GITHUB -->
          <li v-if="props.showGitHub" class="nav-item dropdown dropdown-hover mx-2">
            <a
              href="https://github.com/HrnyGranny"
              class="nav-link d-flex cursor-pointer align-items-center"
            >
              <svg
                width="20px"
                height="20px"
                class="material-icons me-2 opacity-6"
                viewBox="0 0 24 24"
                aria-hidden="true"
                data-testid="GitHubIcon"
                :fill="props.transparent && '#fff'"
              >
                <path
                  d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2 2 0 01.64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.2-2.84a3.76 3.76 0 010-2.93s.91-.28 3.11 1.1c1.8-.49 3.7-.49 5.5 0 2.1-1.38 3.02-1.1 3.02-1.1a3.76 3.76 0 010 2.93c.83.74 1.2 1.74 1.2 2.94 0 4.21-2.57 5.13-5.04 5.4.45.37.82.92.82 2.02v3.03c0 .27.1.64.73.55A11 11 0 0012 1.27"
                ></path>
              </svg>
              HrnyGranny
            </a>
          </li>
          <!-- GITHUB END -->
          
          <!-- LOGIN Dropdown - only visible on desktop -->
          <li v-if="props.showLogin" class="nav-item dropdown position-relative mx-2 d-none d-lg-block">
            <a
              href="#"
              class="nav-link ps-2 d-flex cursor-pointer align-items-center login-trigger"
              :class="getTextColor()"
              @click.prevent="loginDropdownOpen = !loginDropdownOpen"
            >
              <i
                class="material-icons opacity-6 me-2 text-md"
                :class="getTextColor()"
              >
                login
              </i>
              Login
              <i class="material-icons ms-1 text-sm">keyboard_arrow_down</i>
            </a>
            
            <div 
              class="dropdown-menu login-dropdown p-3"
              :class="{ show: loginDropdownOpen }"
              style="min-width: 280px; border-radius: 12px; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3); transform: translateX(-30%);"
            >
              <form @submit="handleLogin">
                <h6 class="text-center mb-3">Sign in</h6>
                <div class="mb-3 input-field-container">
                  <MaterialInput
                    id="email"
                    class="input-group-outline my-3"
                    :label="{ text: 'Email', class: 'form-label' }"
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
                    id="password"
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
                <div class="d-flex flex-column align-items-center mb-2">
                  <button 
                    type="submit" 
                    class="btn mb-2 login-btn"
                    style="background-color: #98FE98; border: none; color: #344767; padding: 8px 25px; border-radius: 8px; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3); font-weight: 500; margin-top: 8px;"
                  >
                    Enter
                  </button>
                  <RouterLink to="/forgot-password" class="text-xs" style="color: #8392AB; font-size: 0.75rem;">
                    Forgot your password?
                  </RouterLink>
                </div>
              </form>
            </div>
          </li>
          <!-- LOGIN DROPDOWN END -->
        </ul>
        <ul class="navbar-nav d-lg-block d-none">
          <li class="nav-item">
            <a
              :href="action.route"
              class="btn btn-sm d-flex align-items-center justify-content-center mb-0"
              style="background-color: #feb602; border: none; color: black; "
            >
              <img
                src="../assets/img/iconos/crown.png"
                alt="Crown Icon"
                style="width: 20px; height: 20px; margin-right: 8px; transform: translateY(-1px);"
              />
              <span style="font-weight: bold; line-height: 1.5; padding-top: 2px; ">{{ action.label }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <!-- End Navbar -->
</template>

<style scoped>
/* Animation for the hamburger icon to arrow transition */
.navbar-toggler-bar {
  display: block;
  position: relative;
  width: 22px;
  height: 2px;
  border-radius: 1px;
  transition: transform 0.3s ease, opacity 0.3s ease;
  margin: 5px 0;
}

/* Down arrow animation when menu is open */
.navbar-toggler-icon.is-active .bar1 {
  transform: translateY(9px) rotate(45deg);
  background-color: #000;
}

.navbar-toggler-icon.is-active .bar2 {
  opacity: 0;
}

.navbar-toggler-icon.is-active .bar3 {
  transform: translateY(-7px) rotate(-48deg);
  background-color: #000;
}

/* Estilos para el dropdown de login */
.dropdown-menu.show {
  display: block;
  animation: fadeIn 0.3s;
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
  top: -6px; /* Controls vertical position of the diamond/arrow */
  left: 45px; /* Controls horizontal position of the diamond/arrow */
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