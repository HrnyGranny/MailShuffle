<script>
  import MaterialButton from "@/material_components/MaterialButton.vue";
  import PlaneAnimation from "./components/PlaneAnimation.vue";
  
  export default {
    name: "ErrorPage",
    components: {
      MaterialButton,
      PlaneAnimation
    },
  };
  </script>
  
  <template>
    <div class="error-page">
      
      <!-- --- Animation --- -->
      <PlaneAnimation />
       
      <!-- Overlay -->
      <div class="overlay"></div>
      
      <b-container class="d-flex flex-column error-container-wrapper">
        <div class="content-centerer">
          <div class="errorContainer">
            <h1 class="errorCode">404</h1>
            <div class="error-divider"></div>
            <h2 class="error-title">Mayday! Page Not Found</h2>
            <p class="errorInfo">
              We've lost contact with the control tower. The page you are looking for has dropped off the radar.
            </p>
            <router-link class="mt-3 d-block" to="/">
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
        
        <footer class="footer custom-footer">
          <div class="container">
            <div class="row">
              <div class="col-12 mb-2 mx-auto text-center text-white copyright-text">
                Copyright © {{ new Date().getFullYear() }} 
                <a href="https://github.com/HrnyGranny" target="_blank" class="text-white fw-bold">HrnyGranny</a>.
              </div>
              <div class="col-12 mx-auto text-center">
                <p class="mb-0 text-white version-text">v1.0</p>
              </div>
            </div>
          </div>
        </footer>
      </b-container>
    </div>
  </template>
  
  <style lang="scss" scoped>
  .error-page {
    height: 100vh;
    width: 100vw;
    position: relative;
    overflow: hidden !important;
    background: linear-gradient(to bottom, #84fab0 0%, #98FE98 100%);

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 2;
    }
  
    .error-container-wrapper {
      height: 100%;
      position: relative;
      z-index: 3;
      padding: 0;
    }
  
    .content-centerer {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      padding-bottom: 60px;
    }
  
    .errorContainer {
      text-align: center;
      width: 90%;
      max-width: 600px;
      padding: 2rem 1.5rem;
      background-color: rgba(255, 255, 255, 0.9);
      border-radius: 15px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      animation: fadeIn 0.8s ease-in-out;
      backdrop-filter: blur(5px);
  
      @media (max-height: 600px) {
        padding: 1rem;
        transform: scale(0.85);
      }
    }
  
    .errorCode {
      margin: 0.5rem 0;
      font-size: clamp(80px, 12vw, 160px);
      font-weight: 800;
      color: #344767;
      line-height: 1;
      text-shadow: 4px 4px 0 rgba(152, 254, 152, 0.5);
      letter-spacing: -5px;
      animation: fadeInBounce 1.2s ease-out;
    }
  
    .error-divider {
      width: 80px;
      height: 4px;
      background-color: #98FE98;
      margin: 1rem auto;
      border-radius: 2px;
    }
  
    .error-title {
      font-size: clamp(20px, 4vw, 30px);
      font-weight: 600;
      color: #344767;
      margin-bottom: 0.5rem;
    }
  
    .errorInfo {
      font-size: clamp(13px, 2.5vw, 16px);
      color: #6c757d;
      margin-bottom: 1rem;
      line-height: 1.4;
    }
  
    .errorBtn {
      display: inline-block;
  
      :deep(.custom-button) {
        padding: 10px 25px;
        font-weight: bold;
      }
    }
  
    .custom-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 45px 0;
      z-index: 10;
  
      .copyright-text {
        font-size: 14px;
      }
  
      .version-text {
        font-size: 12px;
        opacity: 0.8;
      }
  
      @media (max-height: 600px) {
        padding: 5px 0;
  
        .copyright-text {
          font-size: 12px
        }
  
        .version-text {
          font-size: 10px;
          margin-bottom: 20px !important;
        }
      }
    }
  
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  
    @keyframes fadeInBounce {
      0% {
        opacity: 0;
        transform: scale(0.8);
      }
      70% {
        opacity: 1;
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }
  }
  </style>