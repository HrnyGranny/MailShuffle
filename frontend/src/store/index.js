import { reactive } from "vue";

export const state = reactive({
  hideConfigButton: false,
  isPinned: false,
  showConfig: false,
  sidebarType: "bg-white",
  isRTL: false,
  mcolor: "",
  darkMode: false,
  isNavFixed: false,
  isAbsolute: false,
  showNavs: true,
  showSidenav: true,
  showNavbar: true,
  showFooter: true,
  showMain: true,
  layout: "default",
});

export const mutations = {
  toggleConfigurator() {
    state.showConfig = !state.showConfig;
  },
  sidebarMinimize() {
    let sidenav_show = document.querySelector("#app");
    if (state.isPinned) {
      sidenav_show.classList.add("g-sidenav-hidden");
      sidenav_show.classList.remove("g-sidenav-pinned");
      state.isPinned = false;
    } else {
      sidenav_show.classList.add("g-sidenav-pinned");
      sidenav_show.classList.remove("g-sidenav-hidden");
      state.isPinned = true;
    }
  },
  sidebarType(payload) {
    state.sidebarType = payload;
  },
  navbarFixed() {
    state.isNavFixed = !state.isNavFixed;
  },
};

export const actions = {
  toggleSidebarColor(payload) {
    mutations.sidebarType(payload);
  },
};
