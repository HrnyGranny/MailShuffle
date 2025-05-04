<template>
  <div class="error-page">
    <b-container class="d-flex flex-column error-container-wrapper">
      <div class="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        <div class="errorContainer">
          <div class="error-illustration">
            <div class="error-icon">
              <i class="fas fa-search"></i>
            </div>
          </div>
          <h1 class="errorCode">404</h1>
          <div class="error-divider"></div>
          <h2 class="error-title">Page Not Found</h2>
          <p class="errorInfo">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <router-link class="mt-4 d-block" to="/">
            <MaterialButton
              variant="gradient"
              size="md"
              :style="{
                backgroundColor: '#98FE98',
                borderColor: '#98FE98',
                color: '#344767',
                'box-shadow': '0px 2px 6px rgba(0, 0, 0, 0.3)',
              }"
              class="btn btn-primary errorBtn"
            >
              <i class="fas fa-home me-2"></i>
              <span>Return to Home</span>
            </MaterialButton>
          </router-link>
        </div>
      </div>
      
      <!-- Espacio mínimo entre la tarjeta y el footer -->
      <div class="footer-spacer"></div>
      
      <!-- Tu componente de footer personalizado -->
      <DefaultFooter class="custom-footer" />
    </b-container>
  </div>
</template>

<script>
// Importando tu componente de footer
import DefaultFooter from "@/components/Footer.vue";

export default {
  name: "ErrorPage",
  components: {
    DefaultFooter
  }
};
</script>

<style lang="scss" scoped>
.error-page {
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: "Helvetica Neue", Arial, sans-serif;
  
  .error-container-wrapper {
    min-height: 100vh;
    position: relative;
    padding-bottom: 20px; /* Reducido aún más */
    display: flex;
    flex-direction: column;
  }

  .errorContainer {
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background-color: white;
    border-radius: 15px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    animation: fadeIn 0.8s ease-in-out;
    margin-top: 20vh; /* Aumentado para bajar más el conjunto */
  }

  /* Espacio mínimo entre tarjeta y footer */
  .footer-spacer {
    height: 10px; /* Reducido aún más */
  }

  .error-illustration {
    margin-bottom: 1rem;
    
    .error-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto;
      background-color: #f8f9fa;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #98FE98;
      font-size: 30px;
      border: 3px solid #98FE98;
      animation: pulse 2s infinite;
    }
  }

  .errorCode {
    margin: 0.5rem 0;
    font-size: 120px;
    font-weight: 800;
    color: #344767;
    line-height: 1;
    text-shadow: 3px 3px 0 rgba(152, 254, 152, 0.5);
    letter-spacing: -5px;
  }

  .error-divider {
    width: 60px;
    height: 4px;
    background-color: #98FE98;
    margin: 1rem auto;
    border-radius: 2px;
  }

  .error-title {
    font-size: 28px;
    font-weight: 600;
    color: #344767;
    margin-bottom: 1rem;
  }

  .errorInfo {
    font-size: 16px;
    color: #6c757d;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .errorBtn {
    background-color: #98fe98;
    border-color: #98fe98;
    color: #344767;
    font-weight: 600;
    padding: 10px 20px;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(152, 254, 152, 0.4);
    }

    i {
      vertical-align: middle;
    }
  }

  .custom-footer {
    width: 100%;
    padding-top: 2px; /* Mínimo padding superior */
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
}
</style>