<script setup>
defineProps({
});
</script>
<template>
  <footer class="footer py-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mb-4 mx-auto text-center">
          <!-- Enlace para HornyGranny -->
          Copyright © {{ new Date().getFullYear() }} 
          <a 
            href="https://github.com/HrnyGranny" 
            target="_blank" 
            class="text-secondary"
          >
            HrnyGranny
          </a>.
        </div>
      </div>
      <div class="row">
        <div class="col-8 mx-auto text-center mt-1">
          <p class="mb-0 text-secondary">
            v1.0
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
