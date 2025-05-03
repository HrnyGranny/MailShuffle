<template>
  <div class="sidebar" :class="{ 'collapsed': !isExpanded, 'mobile': isMobile, 'expanded': isExpanded }">
    <!-- Header clicable que dirige a la página de inicio -->
    <div class="sidebar-header" @click="navigate('/')" role="button">
      <div class="logo-container">
        <div class="brand-container" v-if="isExpanded">
          <img src="@/assets/img/logos/MailShuffleIcoAlone.png" alt="MailShuffle Logo" class="logo-img" />
          <span class="logo">MailShuffle</span>
        </div>
        <div class="brand-container-mini" v-else>
          <img src="@/assets/img/logos/MailShuffleIcoAlone.png" alt="MailShuffle Logo" class="logo-img-mini" />
        </div>
      </div>
    </div>
    
    <div class="sidebar-content">
      <ul class="sidebar-menu">
        <!-- Dashboard -->
        <li class="sidebar-item" :class="{ active: activePath === '/' || activePath === '' }">
          <a href="#" class="sidebar-link" @click.prevent="navigate('/')">
            <span class="material-icons">dashboard</span>
            <span class="menu-text" v-if="isExpanded">Dashboard</span>
          </a>
        </li>
        
        <!-- Emails (Desplegable) -->
        <li class="sidebar-item" :class="{ active: isEmailsActive, open: emailsOpen }">
          <a href="#" class="sidebar-link" @click.prevent="toggleEmails()">
            <span class="material-icons">email</span>
            <span class="menu-text" v-if="isExpanded">Emails</span>
            <span class="material-icons expand-icon" v-if="isExpanded">
              {{ emailsOpen ? 'expand_less' : 'expand_more' }}
            </span>
          </a>
          <transition name="submenu">
            <ul class="submenu" v-if="emailsOpen && isExpanded">
              <li class="submenu-item" :class="{ active: activePath === '/emails/inbox' }">
                <a href="#" class="submenu-link" @click.prevent="navigate('/emails/inbox')">
                  <span class="material-icons">inbox</span>
                  <span>Bandeja de entrada</span>
                </a>
              </li>
              <li class="submenu-item" :class="{ active: activePath === '/emails/sent' }">
                <a href="#" class="submenu-link" @click.prevent="navigate('/emails/sent')">
                  <span class="material-icons">send</span>
                  <span>Enviados</span>
                </a>
              </li>
              <li class="submenu-item" :class="{ active: activePath === '/emails/draft' }">
                <a href="#" class="submenu-link" @click.prevent="navigate('/emails/draft')">
                  <span class="material-icons">drafts</span>
                  <span>Borradores</span>
                </a>
              </li>
            </ul>
          </transition>
        </li>
        
        <!-- Send (No desplegable) -->
        <li class="sidebar-item" :class="{ active: activePath === '/send' }">
          <a href="#" class="sidebar-link" @click.prevent="navigate('/send')">
            <span class="material-icons">send</span>
            <span class="menu-text" v-if="isExpanded">Send</span>
          </a>
        </li>
      </ul>
    </div>
    
    <div class="sidebar-footer" v-if="isExpanded">
      <div class="user-container">
        <div class="user-info">
          <span class="material-icons user-icon">account_circle</span>
          <div class="user-name">HrnyGranny</div>
        </div>
        <div class="last-login">02/05 20:15</div>
      </div>
    </div>
    
    <!-- Botón para cerrar sidebar en móvil -->
    <button v-if="isMobile && isExpanded" class="mobile-close-btn" @click="$emit('toggle-sidebar')">
      <span class="material-icons">close</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    isExpanded: {
      type: Boolean,
      default: true
    },
    activePath: {
      type: String,
      default: '/'
    }
  },
  data() {
    return {
      emailsOpen: false,
      isMobile: false
    };
  },
  computed: {
    isEmailsActive() {
      return this.activePath.startsWith('/emails');
    }
  },
  methods: {
    navigate(path) {
      this.$emit('navigate', path);
    },
    toggleEmails() {
      if (this.isExpanded) {
        this.emailsOpen = !this.emailsOpen;
      } else {
        // Si la sidebar está contraída, expandirla primero
        this.$emit('toggle-sidebar');
        this.emailsOpen = true;
      }
    },
    checkIfMobile() {
      this.isMobile = window.innerWidth < 768;
    }
  },
  mounted() {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkIfMobile);
  }
}
</script>

<style scoped>
.sidebar {
  height: calc(100vh - 32px);
  width: 250px;
  background-color: white;
  position: fixed;
  left: 16px;
  top: 16px;
  z-index: 1010;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
}

.sidebar.collapsed {
  width: 65px;
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e0e0e0;
  padding: 0 8px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.logo-container {
  padding: 0 30px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  transition: padding 0.3s ease;
}

.sidebar.collapsed .logo-container {
  padding: 0;
  display: flex;
  justify-content: center;
}

.brand-container {
  display: flex;
  align-items: center;
  padding-left: 4px;
  transition: all 0.3s ease;
}

.brand-container-mini {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.logo-img {
  height: 28px;
  width: 28px;
  margin-right: 18px;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.logo-img-mini {
  height: 32px;
  width: 32px;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.logo {
  font-weight: 600;
  font-size: 18px;
  color: #344767;
  letter-spacing: 0.5px;
  padding-left: 1px;
  margin-top: 5px;
  transition: all 0.3s ease;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding-top: 16px;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-item {
  margin-bottom: 4px;
  position: relative;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #344767;
  text-decoration: none;
  transition: all 0.3s;
  border-left: 3px solid transparent;
  border-radius: 0 4px 4px 0;
  position: relative;
}

.sidebar-link:hover {
  background-color: rgba(152, 254, 152, 0.2);
  color: #344767;
}

.sidebar-item.active > .sidebar-link {
  background-color: rgba(152, 254, 152, 0.3);
  color: #344767;
  border-left: 3px solid #98fe98;
}

.material-icons {
  margin-right: 10px;
  transition: margin 0.3s ease;
  color: #344767;
}

.expand-icon {
  margin-left: auto;
  margin-right: 0;
  font-size: 20px;
  transition: transform 0.3s;
}

.open .expand-icon {
  transform: rotate(360deg);
}

.menu-text {
  font-size: 14px;
  font-weight: 500;
  opacity: 1;
  transition: opacity 0.2s ease;
}

.sidebar.collapsed .menu-text {
  display: none;
  opacity: 0;
}

.sidebar.collapsed .material-icons {
  margin-right: 0;
}

/* Submenu styles */
.submenu {
  list-style: none;
  padding: 0;
  margin: 0;
  margin-left: 24px;
  overflow: hidden;
}

.submenu-item {
  margin-bottom: 2px;
}

.submenu-link {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  color: #344767;
  text-decoration: none;
  border-radius: 4px;
  font-size: 13px;
  transition: all 0.2s;
}

.submenu-link:hover {
  background-color: rgba(152, 254, 152, 0.1);
}

.submenu-item.active .submenu-link {
  background-color: rgba(152, 254, 152, 0.2);
  color: #344767;
  font-weight: 500;
}

.submenu-link .material-icons {
  font-size: 18px;
  margin-right: 8px;
}

/* Animación para el submenu */
.submenu-enter-active, .submenu-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
}

.submenu-enter-from, .submenu-leave-to {
  max-height: 0;
  opacity: 0;
}

.sidebar-footer {
  border-top: 1px solid #e0e0e0;
  padding: 14px 16px;
  margin-top: auto;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.user-container {
  display: flex;
  flex-direction: column;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-icon {
  font-size: 22px;
  color: #98fe98;
  margin-right: 10px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #344767;
}

.last-login {
  font-size: 11px;
  color: #344767;
  opacity: 0.7;
  background-color: rgba(152, 254, 152, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  margin-top: 8px;
  align-self: flex-start;
}

/* Botón de cierre para móvil */
.mobile-close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  z-index: 1020;
}

.mobile-close-btn .material-icons {
  margin-right: 0;
  font-size: 24px;
  color: #344767;
}

/* Estilos para móvil */
@media (max-width: 768px) {
  .sidebar {
    left: -280px; /* Ocultar por defecto */
    top: 0;
    height: 100vh;
    border-radius: 0;
    width: 280px;
    transition: left 0.3s ease;
  }
  
  .sidebar.collapsed {
    left: -280px; /* Ocultar completamente cuando está colapsado */
    width: 280px;
  }
  
  .sidebar.expanded {
    left: 0; /* Mostrar cuando está expandido */
  }
}
</style>