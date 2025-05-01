<template>
  <div class="dashboard-container">
    <Sidebar 
      :isExpanded="sidebarExpanded" 
      :activePath="currentPath"
      @navigate="handleNavigation" 
    />
    <div class="main-content" :class="{ 'sidebar-expanded': sidebarExpanded }">
      <div class="navbar-container">
        <Navbar 
          :title="pageTitle" 
          @toggle-sidebar="toggleSidebar" 
        />
      </div>
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
      sidebarExpanded: true,
      currentPath: this.$route ? this.$route.path : '/'
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarExpanded = !this.sidebarExpanded;
    },
    handleNavigation(path) {
      // Actualizar el path actual para el resaltado de menú
      this.currentPath = path;
      
      // Si estamos usando Vue Router
      if (this.$router) {
        this.$router.push(path);
      } else {
        // Alternativa si no hay Vue Router: cambiar la URL
        window.location.href = path;
      }
    }
  },
  watch: {
    // Si usamos Vue Router, actualizamos currentPath cuando cambia la ruta
    '$route'(newRoute) {
      if (newRoute) {
        this.currentPath = newRoute.path;
      }
    }
  },
  created() {
    // Capturar la ruta actual al cargar, si estamos usando Vue Router
    if (this.$route) {
      this.currentPath = this.$route.path;
    }
  }
}
</script>

<style>
.dashboard-container {
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #f0f2f5;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s;
  margin-left: 266px; /* 250px (ancho) + 16px (margen izquierdo) */
  background-color: #f0f2f5;
}

.main-content.sidebar-expanded {
  margin-left: 266px;
}

.main-content:not(.sidebar-expanded) {
  margin-left: 81px; /* 65px (ancho colapsado) + 16px (margen izquierdo) */
}

.navbar-container {
  padding: 0 20px;
}

.content-wrapper {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  margin-top: 4px;
}

.content-area {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  padding: 24px;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .content-area {
    padding: 16px;
  }
  
  .main-content, .main-content.sidebar-expanded {
    margin-left: 0;
  }
}
</style>