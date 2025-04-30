<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
    <div class="container-fluid">
      <button 
        class="hamburger-button me-3" 
        type="button" 
        @click="toggleSidebar"
        aria-label="Toggle sidebar"
      >
        <span class="material-icons">menu</span>
      </button>
      
      <span class="navbar-brand fw-medium">{{ title }}</span>
      
      <div class="d-flex ms-auto align-items-center">
        <!-- Notification icon with dropdown -->
        <div class="dropdown me-3">
          <div class="position-relative notification-icon-container" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <span class="material-icons notification-icon">notifications</span>
            <span class="notification-badge">5</span>
          </div>
          <ul class="dropdown-menu dropdown-menu-end notification-dropdown">
            <li class="dropdown-header">Notifications</li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <a class="dropdown-item notification-item" href="#">
                <div class="notification-icon-bg bg-success">
                  <span class="material-icons text-white">email</span>
                </div>
                <div class="notification-content">
                  <p class="notification-text">New email received</p>
                  <span class="notification-time">5 minutes ago</span>
                </div>
              </a>
            </li>
            <li>
              <a class="dropdown-item notification-item" href="#">
                <div class="notification-icon-bg bg-primary">
                  <span class="material-icons text-white">person_add</span>
                </div>
                <div class="notification-content">
                  <p class="notification-text">New user registered</p>
                  <span class="notification-time">2 hours ago</span>
                </div>
              </a>
            </li>
            <li>
              <a class="dropdown-item notification-item" href="#">
                <div class="notification-icon-bg bg-warning">
                  <span class="material-icons text-white">event</span>
                </div>
                <div class="notification-content">
                  <p class="notification-text">Scheduled event</p>
                  <span class="notification-time">Tomorrow at 10:00</span>
                </div>
              </a>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-center" href="#">View all</a></li>
          </ul>
        </div>
        
        <!-- Settings icon with dropdown -->
        <div class="dropdown">
          <div class="settings-icon-container" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <span class="material-icons settings-icon">settings</span>
          </div>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="#">
              <span class="material-icons align-middle me-2 text-muted" style="font-size: 18px;">person</span>
              Profile
            </a></li>
            <li><a class="dropdown-item" href="#">
              <span class="material-icons align-middle me-2 text-muted" style="font-size: 18px;">tune</span>
              Settings
            </a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">
              <span class="material-icons align-middle me-2 text-muted" style="font-size: 18px;">logout</span>
              Logout
            </a></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    title: {
      type: String,
      default: 'Dashboard'
    }
  },
  methods: {
    toggleSidebar() {
      this.$emit('toggle-sidebar');
    }
  }
}
</script>

<style scoped>
.navbar {
  height: 64px;
  padding: 0 16px;
  z-index: 1000;
}

.hamburger-button {
  background: transparent;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.hamburger-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.hamburger-button:focus {
  outline: none;
}

.hamburger-button .material-icons {
  font-size: 28px;
  color: #344767;
}

.navbar-brand {
  font-size: 18px;
  color: #344767;
}

/* Notification icon styles */
.notification-icon-container {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.notification-icon-container:hover {
  background-color: rgba(152, 254, 152, 0.15);
}

.notification-icon {
  font-size: 24px;
  color: #344767;
}

.notification-badge {
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: #f44336;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Settings icon styles */
.settings-icon-container {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.settings-icon-container:hover {
  background-color: rgba(152, 254, 152, 0.15);
}

.settings-icon {
  font-size: 24px;
  color: #344767;
}

/* Notification dropdown styles */
.notification-dropdown {
  width: 320px;
  padding: 0;
}

.dropdown-header {
  font-weight: 600;
  color: #344767;
  padding: 12px 16px;
  font-size: 14px;
}

.notification-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
}

.notification-icon-bg {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.notification-icon-bg .material-icons {
  font-size: 18px;
}

.notification-content {
  flex: 1;
}

.notification-text {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: #344767;
}

.notification-time {
  font-size: 11px;
  color: #64748b;
}

.dropdown-item:hover {
  background-color: rgba(152, 254, 152, 0.15);
}

.dropdown-divider {
  margin: 0;
  opacity: 0.2;
}
</style>