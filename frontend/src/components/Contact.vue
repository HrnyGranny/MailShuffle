<template>
    <a href="/contact" class="floating-button" aria-label="Ayuda">
      <img :src="iconPath" alt="Ícono" class="icon" />
    </a>
  </template>
  
  <script setup>
  import iconImage from "@/assets/img/iconos/ContactIco.png"; 
  
  const iconPath = iconImage;
  </script>
  
  <style scoped>
  /* Botón flotante con estilo Material */
  .floating-button {
    position: fixed;
    bottom: 90px;
    right: 90px;
    background-color: #98FE98;
    color: white;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s ease;
    text-decoration: none;
    z-index: 9999;
  }
  
  .floating-button:hover {
    background-color: rgb(97, 205, 103);
    transform: scale(1.1);
  }
  
  .icon {
    width: 30px;
    height: 30px;
  }
  </style>
  