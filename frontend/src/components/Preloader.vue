<template>
  <div :class="['preloader', { 'preloader-hidden': !loading }]">
    <div class="clouds">
      <div class="cloud cloud1"></div>
      <div class="cloud cloud2"></div>
      <div class="cloud cloud3"></div>
      <div class="cloud cloud4"></div>
      <div class="cloud cloud5"></div>
    </div>
    <div class="loader">
      <div class="loader-lines"></div>
      <img src="@/assets/img/PlaneAlone.png" alt="preloader" class="loader-img" />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
defineProps({
  loading: Boolean
});
</script>

<style scoped>
.preloader {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  /* Fondo original restaurado */
  background-color: #98FE98;
  z-index: 99999;
  height: 100%;
  width: 100%;
  overflow: hidden !important;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.5s ease-in-out;
}
.preloader-hidden {
  opacity: 0;
  pointer-events: none;
}

/* Clouds moving right to left */
.clouds {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0; /* Behind loader */
  overflow: hidden;
  left: 0;
  top: 0;
}

.cloud {
  position: absolute;
  background: #fff;
  border-radius: 50%;
  /* Mantenemos el blur y la opacidad para mejor estética */
  opacity: 0.6;
  filter: blur(4px); 
  animation: moveClouds linear infinite;
}

.cloud::before,
.cloud::after {
  content: "";
  position: absolute;
  background: #fff;
  border-radius: 50%;
}

.cloud::before {
  width: 78%;
  height: 78%;
  top: -30%;
  left: 10%;
}
.cloud::after {
  width: 52%;
  height: 52%;
  top: -20%;
  left: 50%;
}

/* --- NUBES GRANDES PERO RÁPIDAS --- */

.cloud1 {
  /* Mantenemos tamaños grandes */
  width: 260px;
  height: 160px;
  top: 15%;
  left: 100%; 
  /* Duraciones cortas para alta velocidad */
  animation-duration: 4s;
  animation-delay: -5s;
}
.cloud2 {
  width: 390px;
  height: 208px;
  top: 35%;
  left: 100%;
  animation-duration: 5s;
  animation-delay: -10s;
}
.cloud3 {
  width: 208px;
  height: 130px;
  top: 25%;
  left: 100%;
  animation-duration: 6s;
  animation-delay: -2s;
}
.cloud4 {
  width: 260px;
  height: 208px;
  top: 70%;
  left: 100%;
  animation-duration: 4.5s;
  animation-delay: -15s;
}
.cloud5 {
  width: 442px;
  height: 130px;
  top: 80%;
  left: 100%;
  animation-duration: 3.5s;
  animation-delay: -8s;
}

/* Animación mejorada para cruzar toda la pantalla */
@keyframes moveClouds {
  0% {
    transform: translateX(0);
  }
  100% {
    /* Mueve la nube todo el ancho de la pantalla + 500px (para asegurar que desaparece) */
    transform: translateX(calc(-100vw - 500px));
  }
}

/* Loader styles */
.loader {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: envFloating 1s ease-in infinite alternate;
  z-index: 1;
}

.loader-img {
  width: 190px;
  height: 190px;
  object-fit: contain;
  z-index: 2;
  position: relative;
  /* Mantenemos la sombra sutil para el avión */
  filter: drop-shadow(0px 5px 10px rgba(0, 0, 0, 0.2));
}

.loader-lines {
  position: absolute;
  right: 120px;
  top: 28px;
  height: 200px;
  width: 170px;
  pointer-events: none;
  background-image:
    linear-gradient(#4e64ee 45px, transparent 0),
    linear-gradient(#4e64ee 45px, transparent 0),
    linear-gradient(#4e64ee 45px, transparent 0);
  background-repeat: no-repeat;
  background-size: 40px 4px;
  background-position: 0px 11px , 8px 35px, 0px 60px;
  animation: envDropping 0.75s linear infinite;
  z-index: 1;
}

@keyframes envFloating {
  0% { transform: translate(-2px, -5px);}
  100% { transform: translate(0, 5px);}
}

@keyframes envDropping {
  0% {
    background-position: 100px 11px , 115px 35px, 105px 60px;
    opacity: 1;
  }
  50% {
    background-position: 0px 11px , 20px 35px, 5px 60px;
  }
  60% {
    background-position: -30px 11px , 0px 35px, -10px 60px;
  }
  75%, 100% {
    background-position: -30px 11px , -30px 35px, -30px 60px;
    opacity: 0;
  }
}
</style>