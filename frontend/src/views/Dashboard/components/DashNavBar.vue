<script setup>
import { computed, ref, reactive } from "vue";

// Estado reactivo local
const state = reactive({
  isRTL: false, // Define el estado inicial
  showConfig: false, // Para toggleConfigurator
});

// Estado local para mostrar el menú
const showMenu = ref(false);

// Función para minimizar la barra lateral
const sidebarMinimize = () => {
  const sidenavShow = document.querySelector("#app");
  if (sidenavShow) {
    sidenavShow.classList.toggle("g-sidenav-hidden");
    sidenavShow.classList.toggle("g-sidenav-pinned");
  }
};

// Función para alternar el configurador
const toggleConfigurator = () => {
  state.showConfig = !state.showConfig;
};

// Función para cerrar el menú con un retraso
const closeMenu = () => {
  setTimeout(() => {
    showMenu.value = false;
  }, 100);
};
</script>

<template>
  <nav
    class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl"
    :class="isRTL ? 'top-0 position-sticky z-index-sticky' : ''"
    v-bind="$attrs"
    id="navbarBlur"
    data-scroll="true"
  >
    <div
      class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4"
      :class="isRTL ? 'px-0' : 'me-sm-4'"
      id="navbar"
    >
      <div
        class="pe-md-3 d-flex align-items-center"
        :class="isRTL ? 'me-md-auto' : 'ms-md-auto'"
      >
        <div class="input-group">
          <span class="input-group-text text-body">
            <i class="fas fa-search" aria-hidden="true"></i>
          </span>
          <input
            type="text"
            class="form-control"
            :placeholder="isRTL ? 'أكتب هنا...' : 'Type here...'"
          />
        </div>
      </div>
      <ul class="navbar-nav justify-content-end">
        <li class="nav-item d-flex align-items-center">
          <router-link
            :to="{ name: 'Signin' }"
            class="px-0 nav-link font-weight-bold text-white"
            target="_blank"
          >
            <i class="fa fa-user" :class="isRTL ? 'ms-sm-2' : 'me-sm-2'"></i>
            <span v-if="isRTL" class="d-sm-inline d-none">يسجل دخول</span>
            <span v-else class="d-sm-inline d-none">Sign In</span>
          </router-link>
        </li>
        <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
          <a
            href="#"
            @click="sidebarMinimize"
            class="p-0 nav-link text-white"
            id="iconNavbarSidenav"
          >
            <div class="sidenav-toggler-inner">
              <i class="sidenav-toggler-line bg-white"></i>
              <i class="sidenav-toggler-line bg-white"></i>
              <i class="sidenav-toggler-line bg-white"></i>
            </div>
          </a>
        </li>
        <li class="px-3 nav-item d-flex align-items-center">
          <a class="p-0 nav-link text-white" @click="toggleConfigurator">
            <i class="cursor-pointer fa fa-cog fixed-plugin-button-nav"></i>
          </a>
        </li>
        <li
          class="nav-item dropdown d-flex align-items-center"
          :class="isRTL ? 'ps-2' : 'pe-2'"
        >
          <a
            href="#"
            class="p-0 nav-link text-white"
            :class="[showMenu ? 'show' : '']"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            @click="showMenu = !showMenu"
            @blur="closeMenu"
          >
            <i class="cursor-pointer fa fa-bell"></i>
          </a>
          <ul
            class="px-2 py-3 dropdown-menu dropdown-menu-end me-sm-n4"
            :class="showMenu ? 'show' : ''"
            aria-labelledby="dropdownMenuButton"
          >
            <li class="mb-2">
              <a class="dropdown-item border-radius-md" href="javascript:;">
                <div class="py-1 d-flex">
                  <div class="my-auto">
                    <img
                      src="../../assets/img/team-2.jpg"
                      class="avatar avatar-sm me-3"
                      alt="user image"
                    />
                  </div>
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-1 text-sm font-weight-normal">
                      <span class="font-weight-bold">New message</span> from
                      Laur
                    </h6>
                    <p class="mb-0 text-xs text-secondary">
                      <i class="fa fa-clock me-1"></i>
                      13 minutes ago
                    </p>
                  </div>
                </div>
              </a>
            </li>
            <!-- Más elementos del menú -->
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>