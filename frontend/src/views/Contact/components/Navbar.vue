<script setup>
import { RouterLink } from "vue-router";
import { ref, watch } from "vue";
import { useWindowsWidth } from "../../../assets/js/useWindowsWidth";

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
          src="../../../assets/img/logos/MailShuffleIcoAlone.png" 
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
          src="../../../assets/img/iconos/crown.png"
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
        </ul>
        <ul class="navbar-nav d-lg-block d-none">
          <li class="nav-item">
            <a
              :href="action.route"
              class="btn btn-sm d-flex align-items-center justify-content-center mb-0"
              style="background-color: #feb602; border: none; color: black; "
            >
              <img
                src="../../../assets/img/iconos/crown.png"
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