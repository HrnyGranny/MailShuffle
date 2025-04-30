<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-title">
        Copyright © {{ new Date().getFullYear() }} 
          <a 
            href="https://github.com/HrnyGranny" 
            target="_blank" 
            class="text-secondary"
          >
            HrnyGranny
          </a>.
      </div>
      <div class="footer-subtitle">v1.0</div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.app-footer {
  padding: 16px;
  background-color: transparent;
  text-align: center;
}

.footer-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.footer-subtitle {
  font-size: 12px;
  color: #64748b;
  opacity: 0.7;
}
</style>