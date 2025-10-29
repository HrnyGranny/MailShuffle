<template>
  <div :class="['preloader', { 'preloader-hidden': !loading }]">
    <!-- Clouds background -->
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
  opacity: 0.25;
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

.cloud1 {
  width: 130px;
  height: 80px;
  top: 15%;
  left: 1400px;
  animation-duration: 2s;
}
.cloud2 {
  width: 195px;
  height: 104px;
  top: 35%;
  left: 1600px;
  animation-duration: 3s;
}
.cloud3 {
  width: 104px;
  height: 65px;
  top: 20%;
  left: 2000px;
  animation-duration: 4s;
}
.cloud4 {
  width: 130px;
  height: 104px;
  top: 70%;
  left: 1100px;
  animation-duration: 3s;
}
.cloud5 {
  width: 221px;
  height: 65px;
  top: 80%;
  left: 1500px;
  animation-duration: 2s;
}

@keyframes moveClouds {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-2000px);
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
  /* Puedes agregar un poco de sombra si quieres */
  /* filter: drop-shadow(0px 4px 8px #aaa); */
}

.loader-lines {
  position: absolute;
  right: 120px;
  top: 28px;
  height: 200px;
  width: 170px;
  pointer-events: none;
  background-image:
    linear-gradient(#c9c7c7 45px, transparent 0),
    linear-gradient(#c9c7c7 45px, transparent 0),
    linear-gradient(#c9c7c7 45px, transparent 0);
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