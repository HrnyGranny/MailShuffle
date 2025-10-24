<template>
  <div class="error-page">
    <!-- Background GIF container -->
    <div class="background-gif"></div>
    <!-- Semi-transparent overlay -->
    <div class="overlay"></div>
    
    <b-container class="d-flex flex-column error-container-wrapper">
      <div class="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        <div class="errorContainer">
          <h1 class="errorCode">404</h1>
          <div class="error-divider"></div>
          <h2 class="error-title">Page Not Found</h2>
          <p class="errorInfo">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <router-link class="mt-4 d-block" to="/">
            <MaterialButton
              class="errorBtn"
              background-color="#98fe98"
              border-color="#98fe98"
              text-color="#344767"
              aria-label="Go to home"
              size="small"
            >
              <i class="fas fa-home me-2"></i>
              <span>Home</span>
            </MaterialButton>
          </router-link>
        </div>
      </div>
      
      <!-- Espacio mínimo entre la tarjeta y el footer -->
      <div class="footer-spacer"></div>
      
      <!-- Custom footer -->
      <footer class="footer py-5 custom-footer">
        <div class="container">
          <div class="row">
            <div class="col-12 col-lg-8 mb-4 mx-auto text-center">
              Copyright © {{ new Date().getFullYear() }} 
              <a 
                href="https://github.com/HrnyGranny" 
                target="_blank" 
                class="text-white"
              >
                HrnyGranny
              </a>.
            </div>
          </div>
          <div class="row">
            <div class="col-12 mx-auto text-center mt-1">
              <p class="mb-0 text-white">
                v1.0
              </p>
            </div>
          </div>
        </div>
      </footer>
    </b-container>
  </div>
</template>

<script>
import MaterialButton from "@/material_components/MaterialButton.vue";

export default {
  name: "ErrorPage",
  components: {
    MaterialButton,
  },
};
</script>

<style lang="scss" scoped>
.error-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden; /* Prevent GIF from causing scrollbars */
  
  /* Background GIF styling */
  .background-gif {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-image: url("@/assets/img/Error404.gif"); /* Replace with your GIF URL */
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  
  /* Semi-transparent overlay for better readability */
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.5); /* Adjust opacity as needed */
  }
  
  .error-container-wrapper {
    min-height: 100vh;
    position: relative;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    z-index: 3; /* Above the GIF and overlay */
  }

  .errorContainer {
    text-align: center;
    width: 90%;
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    background-color: rgba(255, 255, 255, 0.9); /* Semi-transparent background */
    border-radius: 15px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.8s ease-in-out;
    margin-top: 15vh; /* Restaurado al valor original */
    backdrop-filter: blur(5px); /* Blur effect for modern browsers */

    @media (max-width: 767px) {
      width: 95%;
      padding: 1.5rem 1rem;
    }
  }

  /* Espacio mínimo entre tarjeta y footer */
  .footer-spacer {
    height: 10px; /* Mantenido como en el original */
  }

  .errorCode {
    margin: 1.5rem 0; /* Restaurado al valor original */
    font-size: clamp(100px, 15vw, 180px);
    font-weight: 800;
    color: #344767;
    line-height: 0.9;
    text-shadow: 4px 4px 0 rgba(152, 254, 152, 0.5);
    letter-spacing: -5px;
    animation: fadeInBounce 1.2s ease-out;
    
    @media (max-width: 576px) {
      letter-spacing: -2px;
      text-shadow: 2px 2px 0 rgba(152, 254, 152, 0.5);
    }
  }

  .error-divider {
    width: 80px;
    height: 4px;
    background-color: #98FE98;
    margin: 1.5rem auto;
    border-radius: 2px;
    
    @media (max-width: 576px) {
      width: 60px;
      height: 3px;
      margin: 1rem auto;
    }
  }

  .error-title {
    font-size: clamp(24px, 5vw, 32px);
    font-weight: 600;
    color: #344767;
    margin-bottom: 1rem;
    
    @media (max-width: 576px) {
      margin-bottom: 0.75rem;
    }
  }

  .errorInfo {
    font-size: clamp(14px, 3vw, 16px);
    color: #6c757d;
    margin-bottom: 1.5rem;
    line-height: 1.6;
    
    @media (max-width: 576px) {
      margin-bottom: 1rem;
      line-height: 1.4;
    }
  }

  .errorBtn {
    display: inline-block;

    :deep(.custom-button) {
      padding: 10px 20px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    :deep(.custom-button:hover) {
      transform: scale(1.1);
    }

    :deep(i) {
      vertical-align: middle;
    }

    @media (max-width: 576px) {
      :deep(.custom-button) {
        padding: 8px 16px;
        font-size: 18px;
      }
    }
  }

  .custom-footer {
    width: 100%;
    padding-top: 2px;
    position: relative;
    z-index: 3; /* Above the GIF and overlay */
    color: white; /* Makes the footer text more visible on dark backgrounds */
    font-size: 14px;
    
    @media (max-width: 576px) {
      font-size: 12px;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeInBounce {
    0% { opacity: 0; transform: scale(0.8); }
    70% { opacity: 1; transform: scale(1.05); }
    100% { transform: scale(1); }
  }
}
</style>