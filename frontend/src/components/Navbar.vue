<script setup>
import { RouterLink } from "vue-router";
import { ref, watch } from "vue";
import { useWindowsWidth } from "../assets/js/useWindowsWidth";

// images
import ArrDark from "@/assets/img/down-arrow-dark.svg";
import downArrow from "@/assets/img/down-arrow.svg";
import DownArrWhite from "@/assets/img/down-arrow-white.svg";

const menuOpen = ref(false);

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
  }
});
// set arrow  color
function getArrowColor() {
  if (props.transparent && textDark.value) {
    return ArrDark;
  } else if (props.transparent) {
    return DownArrWhite;
  } else {
    return ArrDark;
  }
}

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
        MailShuffle
      </RouterLink>
      <!--Collapsed premium-->
      <a
        href="https://www.creative-tim.com/product/vue-material-kit-pro"
        class="btn btn-sm mb-0 ms-auto d-lg-none d-block"
        style="background-color: #feb602; border: none; color: black;"
      >
        <img
          src="../assets/img/iconos/crown.png"
          alt="Crown Icon"
          style="width: 20px; height: 20px; transform: translateY(-2px);"
        />
      </a>
      <!--Hamburguesa-->
      <button class="navbar-toggler shadow-none ms-2" @click="menuOpen = !menuOpen">
        <span class="navbar-toggler-icon mt-2">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </span>
      </button>
      <div :class="['navbar-collapse', 'w-100', 'pt-3', 'pb-2', 'py-lg-0', { collapse: !menuOpen }]" id="navigation">
        <ul class="navbar-nav navbar-nav-hover ms-auto">
          <!-- Dropdown con GitHub y About Us -->
          <li class="nav-item dropdown dropdown-hover mx-2">
            <a
              role="button"
              class="nav-link ps-2 d-flex cursor-pointer align-items-center"
              :class="getTextColor()"
              id="dropdownMenuMore"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="material-icons opacity-6 me-2 text-md" :class="getTextColor()">menu</i>
              More
              <img
                :src="getArrowColor()"
                alt="down-arrow"
                class="arrow ms-2 d-lg-block d-none"
              />
            </a>
            <div
              class="dropdown-menu dropdown-menu-end dropdown-menu-animation dropdown-md mt-0 mt-lg-3 p-3 border-radius-lg"
              aria-labelledby="dropdownMenuMore"
            >
              <ul class="list-group">
                <li class="nav-item list-group-item border-0 p-0">
                  <a
                    class="dropdown-item py-2 ps-3 border-radius-md"
                    href="https://github.com/HrnyGranny"
                  >
                    <h6 class="dropdown-header text-dark font-weight-bolder d-flex align-items-start p-0">
                      GitHub
                    </h6>
                    <span class="text-sm text-start">View our repository</span>
                  </a>
                </li>
                <li class="nav-item list-group-item border-0 p-0">
                  <RouterLink
                    class="dropdown-item py-2 ps-3 border-radius-md"
                    to="/about-us"
                  >
                    <h6 class="dropdown-header text-dark font-weight-bolder d-flex align-items-start p-0">
                      About Us
                    </h6>
                    <span class="text-sm text-start">Learn more about us</span>
                  </RouterLink>
                </li>
              </ul>
            </div>
          </li>
          <!-- Login -->
          <li class="nav-item mx-2">
            <RouterLink
              class="nav-link ps-2 d-flex cursor-pointer align-items-center"
              :class="getTextColor()"
              to="/login"
            >
              <i class="material-icons opacity-6 me-2 text-md" :class="getTextColor()">login</i>
              Login
            </RouterLink>
          </li>
        </ul>
        <ul class="navbar-nav d-lg-block d-none">
          <!-- Upgrade -->
          <li class="nav-item">
            <a
              :href="action.route"
              class="btn btn-sm d-flex align-items-center justify-content-center mb-0"
              style="background-color: #feb602; border: none; color: black;"
            >
              <img
                src="../assets/img/iconos/crown.png"
                alt="Crown Icon"
                style="width: 20px; height: 20px; margin-right: 8px; transform: translateY(-1px);"
              />
              <span style="font-weight: bold; line-height: 1.5; padding-top: 2px;">{{ action.label }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>