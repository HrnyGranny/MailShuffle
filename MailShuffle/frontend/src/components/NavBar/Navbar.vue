<script setup>
import { RouterLink } from "vue-router";
import { ref, watch, onMounted } from "vue";
import { useWindowsWidth } from "@/assets/js/useWindowsWidth";
import setMaterialInput from "@/assets/js/material-input";
import LoginDropdown from "../NavBar/components/Login.vue";
import UpgradeModal from "../NavBar/components/Upgrade.vue";

const menuOpen = ref(false);
// Control modal visibility
const showUpgradeModal = ref(false);

// Function to open premium modal
const openUpgradeModal = (e) => {
  e.preventDefault();
  showUpgradeModal.value = true;
};

// Function to close premium modal
const closeUpgradeModal = () => {
  showUpgradeModal.value = false;
};

// Function to scroll to top
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  setMaterialInput();
});

const props = defineProps({
  action: {
    type: Object,
    default: () => ({
      route: "/upgrade",
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
      'navbar-light bg-white py-3': props.light
    }"
  >
    <div
      :class="
        props.transparent || props.light
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
        @click.prevent="scrollToTop"
      >
        <img 
          src="@/assets/img/logos/7dMailIcoAlone.png" 
          alt="Logo" 
          class="me-2 logo-icon" 
          style="width: 22px; height: 22px; transform: translateY(-3px);" 
        />        
        7dMail
      </RouterLink>
      <!--Logo navbar collapsed-->
      <RouterLink
        class="navbar-brand d-block d-md-none"
        :class="
          props.transparent
            ? 'text-white'
            : 'font-weight-bolder ms-sm-3'
        "
        to="/"
        rel="tooltip"
        title="Designed and Coded by HornyGranny"
        data-placement="bottom"
        @click.prevent="scrollToTop"
      >
        <img 
          src="@/assets/img/logos/7dMailIcoAlone.png" 
          alt="Logo" 
          class="me-2 logo-icon" 
          style="width: 22px; height: 22px; transform: translateY(-3px);" 
        /> 
      </RouterLink>
      
      <!-- Login and Premium buttons in mobile navbar -->
      <div class="ms-auto d-flex d-lg-none align-items-center">
        <!-- Login dropdown - mobile version -->
        <LoginDropdown v-if="props.showLogin" :textColor="getTextColor()" :isMobile="true" />
        
        <!-- Premium button with shimmer effect -->
        <a
          href="#"
          class="btn btn-sm mb-0 premium-btn-container"
          style="background-color: #feb602; border: none; color: black; position: relative;"
          @click="openUpgradeModal"
        >
          <img
            src="@/assets/img/iconos/crown.png"
            alt="Crown Icon"
            class="crown-icon"
            style="width: 20px; height: 20px; transform: translateY(-2px); position: relative; z-index: 1;"
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
          <LoginDropdown 
            v-if="props.showLogin" 
            class="mx-2 d-none d-lg-block" 
            :textColor="getTextColor()" 
            :isMobile="false" 
          />
          <!-- LOGIN DROPDOWN END -->
        </ul>
        <ul class="navbar-nav d-lg-block d-none">
          <li class="nav-item">
            <!-- Premium button with shimmer effect - desktop version -->
            <a
              href="#"
              class="btn btn-sm d-flex align-items-center justify-content-center mb-0 premium-btn-container"
              style="background-color: #feb602; border: none; color: black; position: relative;"
              @click="openUpgradeModal"
            >
              <img
                src="@/assets/img/iconos/crown.png"
                alt="Crown Icon"
                class="crown-icon"
                style="width: 20px; height: 20px; margin-right: 8px; transform: translateY(-1px); position: relative; z-index: 1;"
              />
              <span class="premium-text" style="font-weight: bold; line-height: 1.5; padding-top: 2px; position: relative; z-index: 1;">{{ action.label }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <!-- End Navbar -->
  
  <!-- Premium Upgrade Modal -->
  <UpgradeModal :show="showUpgradeModal" @close="closeUpgradeModal" />
</template>

<style scoped>
/* Animation for the hamburger icon to arrow transition */
.navbar-toggler-bar {
  display: block;
  position: relative;
  width: 22px;
  height: 1.5px !important;
  border-radius: 5px !important;
  transition: transform 0.3s ease, opacity 0.3s ease;
  margin: 5px 0;
}

/* Down arrow animation when menu is open */
.navbar-toggler-icon.is-active .bar1 {
  transform: translateY(9px) rotate(45deg);
}

.navbar-toggler-icon.is-active .bar2 {
  opacity: 0;
}

.navbar-toggler-icon.is-active .bar3 {
  transform: translateY(-7.5px) rotate(-45deg);
}

/* Golden shimmer effect */
.premium-btn-container {
  position: relative;
  overflow: hidden;
}

.premium-btn-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    rgba(137,60,21,0.3) 0%, 
    rgba(255,222,68,0.5) 17%, 
    rgba(177,116,30,0.3) 24%, 
    rgba(255,231,82,0.5) 40%, 
    rgba(224,147,38,0.3) 50%, 
    rgba(228,150,42,0.3) 59%, 
    rgba(176,120,27,0.3) 70%, 
    rgba(239,179,51,0.5) 85%, 
    rgba(135,58,26,0.3) 100%);
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.premium-btn-container:hover::before {
  opacity: 1;
  animation: golden-shimmer 5s infinite alternate ease-in-out;
}

.premium-btn-container:active::before {
  animation: golden-shimmer 1s infinite alternate ease-in-out;
}

/* Text shimmer effect */
.premium-text {
  position: relative;
  z-index: 1;
}

.premium-btn-container:hover .premium-text {
  animation: text-shimmer 5s infinite alternate ease-in-out;
}

.premium-btn-container:active .premium-text {
  animation: text-shimmer 1s infinite alternate ease-in-out;
}

/* Crown shimmer */
.premium-btn-container:hover .crown-icon {
  animation: crown-shimmer 5s infinite alternate ease-in-out;
  filter: drop-shadow(0 0 2px rgba(255, 222, 68, 0.7));
}

.premium-btn-container:active .crown-icon {
  animation: crown-shimmer 1s infinite alternate ease-in-out;
}

@keyframes golden-shimmer {
  0% {
    background-size: 100%;
    background-position: 50%;
  }
  50% {
    background-size: 500%;
    background-position: 0%;
  }
  100% {
    background-size: 200%;
    background-position: 100%;
  }
}

@keyframes text-shimmer {
  0% {
    text-shadow: 0 0 2px rgba(255, 222, 68, 0.2);
  }
  50% {
    text-shadow: 0 0 8px rgba(255, 222, 68, 0.7);
  }
  100% {
    text-shadow: 0 0 4px rgba(255, 222, 68, 0.4);
  }
}

@keyframes crown-shimmer {
  0% {
    filter: drop-shadow(0 0 1px rgba(255, 222, 68, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 4px rgba(255, 222, 68, 0.8));
  }
  100% {
    filter: drop-shadow(0 0 2px rgba(255, 222, 68, 0.5));
  }
}
</style>