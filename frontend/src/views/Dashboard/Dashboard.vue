<template>
  <div class="dashboard-container">
    <Sidebar :isExpanded="sidebarExpanded" />
    <div class="main-content" :class="{ 'sidebar-expanded': sidebarExpanded }">
      <Navbar 
        :title="pageTitle" 
        @toggle-sidebar="toggleSidebar" 
      />
      <div class="content-wrapper">
        <div class="content-area">
          <slot></slot>
        </div>
      </div>
      <AppFooter :text="footerText" />
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue';
import Navbar from './components/Navbar.vue';
import AppFooter from './components/Footer.vue';

export default {
  name: 'Dashboard',
  components: {
    Sidebar,
    Navbar,
    AppFooter
  },
  props: {
    pageTitle: {
      type: String,
      default: 'Dashboard'
    },
    footerText: {
      type: String,
      default: '© 2025 Dashboard Demo - Todos los derechos reservados'
    }
  },
  data() {
    return {
      sidebarExpanded: true
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarExpanded = !this.sidebarExpanded;
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

.dashboard-container {
  display: flex;
  height: 100vh;
  width: 100%;
  font-family: 'Roboto', sans-serif;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s;
  margin-left: 250px;
  background-color: #f0f2f5;
}

.main-content.sidebar-expanded {
  margin-left: 250px;
}

.main-content:not(.sidebar-expanded) {
  margin-left: 65px;
}

.content-wrapper {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.content-area {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  padding: 24px;
  transition: all 0.3s ease;
}

/* Estilos adicionales para mejorar la apariencia de tarjeta */
.content-area:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

@media (max-width: 768px) {
  .content-area {
    padding: 16px;
  }
}
</style>