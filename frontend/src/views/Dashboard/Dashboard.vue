<template>
  <div class="dashboard-container">
    <!-- Sidebar siempre visible cuando está expandido -->
    <Sidebar 
      :isExpanded="sidebarExpanded" 
      :activePath="currentPath"
      @navigate="handleNavigation"
      @toggle-sidebar="toggleSidebar" 
    />
    
    <!-- Overlay para móvil cuando el sidebar está abierto -->
    <div 
      v-if="isMobile && sidebarExpanded" 
      class="sidebar-overlay" 
      @click="toggleSidebar"
    ></div>
    
    <div class="main-content" :class="{ 'sidebar-expanded': sidebarExpanded, 'mobile': isMobile }">
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
        <Contact />
      </div>
      <AppFooter :text="footerText" />
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue';
import Navbar from './components/Navbar.vue';
import AppFooter from './components/Footer.vue';
import Contact from "@/components/Contact/Contact.vue";

export default {
  name: 'Dashboard',
  components: {
    Sidebar,
    Navbar,
    AppFooter,
    Contact
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
      sidebarExpanded: !this.checkIfMobile(),
      currentPath: this.$route ? this.$route.path : '/',
      isMobile: this.checkIfMobile()
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarExpanded = !this.sidebarExpanded;
    },
    handleNavigation(path) {
      // Actualizar el path actual para el resaltado de menú
      this.currentPath = path;
      
      // Cerrar sidebar después de navegar en móvil
      if (this.isMobile) {
        this.sidebarExpanded = false;
      }
      
      // Si estamos usando Vue Router
      if (this.$router) {
        this.$router.push(path);
      } else {
        // Alternativa si no hay Vue Router: cambiar la URL
        window.location.href = path;
      }
    },
    checkIfMobile() {
      return window.innerWidth < 768;
    },
    handleResize() {
      const wasMobile = this.isMobile;
      this.isMobile = this.checkIfMobile();
      
      // Solo auto-colapsar sidebar cuando cambiamos de desktop a móvil
      if (!wasMobile && this.isMobile) {
        this.sidebarExpanded = false;
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
  },
  mounted() {
    // Agregar listener de redimensionamiento
    window.addEventListener('resize', this.handleResize);
    this.handleResize(); // Inicializar al montar
  },
  beforeUnmount() {
    // Eliminar listener de redimensionamiento
    window.removeEventListener('resize', this.handleResize);
  }
}
</script>

<style>
.dashboard-container {
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #f0f2f5;
  position: relative; /* Para posicionamiento de elementos hijos */
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

/* Overlay para móvil cuando sidebar está abierto */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1005; /* Justo debajo del sidebar */
}

/* Estilos para móvil */
@media (max-width: 768px) {
  .content-area {
    padding: 16px;
  }
  
  .main-content {
    margin-left: 0 !important; /* Forzar margen cero en móvil */
    width: 100%;
  }
  
  .main-content.mobile {
    margin-top: 64px; /* Espacio para la navbar fija */
    height: calc(100vh - 64px); /* Ajustar altura para evitar scroll */
  }
  
  .content-wrapper {
    padding: 12px;
  }
}
</style>