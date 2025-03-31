<template>
    <div :class="['preloader', { 'preloader-hidden': !loading }]">
      <div class="loaded"></div>
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
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fefefe;
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
  
  .loaded {
    width: 60px;
    height: 60px;
    background-image: url("../assets/img/preloading.gif");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
  </style>
  