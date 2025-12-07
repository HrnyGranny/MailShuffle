<template>
  <div :class="['preloader', { 'preloader-hidden': !loading }]">
    <!-- Fondo de nubes -->
    <div class="clouds">
      <div class="cloud cloud1"></div>
      <div class="cloud cloud2"></div>
      <div class="cloud cloud3"></div>
      <div class="cloud cloud4"></div>
      <div class="cloud cloud5"></div>
    </div>

    <!-- Contenedor central (Solo avión y sombra) -->
    <div class="loader-wrapper">
      <div class="loader">
        <!-- Líneas de velocidad -->
        <div class="loader-lines"></div>
        <!-- Avión -->
        <img src="@/assets/img/PlaneAlone2.png" alt="preloader" class="loader-img" />
      </div>
      <!-- Sombra debajo del avión -->
      <div class="plane-shadow"></div>
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
  background: linear-gradient(to bottom, #84fab0 0%, #98FE98 100%);
  z-index: 99999;
  height: 100vh;
  width: 100vw;
  overflow: hidden !important;
  /* Centrado perfecto */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ESTADO OCULTO */
.preloader-hidden {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transition: opacity 0.8s ease-in-out, visibility 0.8s;
}

/* Animación de salida del avión */
.preloader-hidden .loader-img {
  transform: translateX(150vw) scale(1.2) rotate(-10deg) !important;
  transition: transform 1s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.loader-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

/* CLOUDS */
.clouds {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  box-shadow: 0 8px 5px rgba(0,0,0,0.1);
  animation: moveClouds linear infinite;
}

.cloud::before, .cloud::after {
  content: "";
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.cloud::before { width: 78%; height: 78%; top: -30%; left: 10%; }
.cloud::after { width: 52%; height: 52%; top: -20%; left: 50%; }

.cloud1 { width: 260px; height: 160px; top: 10%; left: 100%; opacity: 0.7; filter: blur(2px); animation-duration: 7s; }
.cloud2 { width: 390px; height: 208px; top: 30%; left: 100%; opacity: 0.5; filter: blur(4px); animation-duration: 12s; animation-delay: -5s; }
.cloud3 { width: 208px; height: 130px; top: 20%; left: 100%; opacity: 0.8; filter: blur(1px); animation-duration: 5s; animation-delay: -2s; }
.cloud4 { width: 260px; height: 208px; top: 60%; left: 100%; opacity: 0.6; filter: blur(3px); animation-duration: 9s; animation-delay: -4s; }
.cloud5 { width: 442px; height: 130px; top: 75%; left: 100%; opacity: 0.4; filter: blur(5px); animation-duration: 15s; animation-delay: -1s; }

@keyframes moveClouds {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-100vw - 500px)); }
}

/* LOADER */
.loader {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: envFloating 2.5s ease-in-out infinite;
}

.loader-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 2;
  filter: drop-shadow(5px 10px 15px rgba(0, 0, 0, 0.15));
  will-change: transform;
}

.plane-shadow {
  width: 60px;
  height: 15px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  margin-top: -20px;
  filter: blur(4px);
  animation: shadowPulse 2.5s ease-in-out infinite;
}

/* LÍNEAS DE VELOCIDAD */
.loader-lines {
  position: absolute;
  right: 185px; 
  top: 50px;
  height: 100px;
  width: 200px;
  pointer-events: none;
  z-index: 1;
  opacity: 0.6;
  background-image: 
    linear-gradient(to left, rgba(255,255,255,0) 0%, #4e64ee 50%, rgba(255,255,255,0) 100%),
    linear-gradient(to left, rgba(255,255,255,0) 0%, #4e64ee 50%, rgba(255,255,255,0) 100%),
    linear-gradient(to left, rgba(255,255,255,0) 0%, #4e64ee 50%, rgba(255,255,255,0) 100%);
  background-repeat: no-repeat;
  background-size: 80px 3px;
  background-position: 0px 20px, 30px 50px, 10px 80px;
  animation: speedLines 0.8s linear infinite;
}

/* ANIMACIONES GENERALES */
@keyframes envFloating {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
}

@keyframes shadowPulse {
  0%, 100% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(0.7); opacity: 0.1; }
}

@keyframes speedLines {
  0% { background-position: 150px 20px, 180px 50px, 160px 80px; opacity: 0; }
  20% { opacity: 1; }
  100% { background-position: -50px 20px, -20px 50px, -40px 80px; opacity: 0; }
}
</style>