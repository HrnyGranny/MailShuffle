<script setup>
defineProps({
  links: {
    type: Array,
    name: String,
    href: String,
    default: () => [
      { href: "https://www.creative-tim.com/", name: "Company" },
      { href: "https://www.creative-tim.com/presentation", name: "About Us" },
      { href: "https://www.creative-tim.com/presentation", name: "Team" },
      {
        href: "https://www.creative-tim.com/templates/vuejs",
        name: "Products",
      },
      { href: "https://www.creative-tim.com/blog", name: "Blog" },
      { href: "https://www.creative-tim.com/license", name: "License" },
    ],
  },
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
            href="" 
            target="_blank" 
            class="text-secondary"
          >
            HornyGranny
          </a>.
        </div>
      </div>
      <div class="row">
        <div class="col-8 mx-auto text-center mt-1">
          <p class="mb-0 text-secondary">
            v1.5.6
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
