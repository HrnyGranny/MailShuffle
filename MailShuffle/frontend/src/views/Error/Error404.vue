<template>
  <div class="error-page">
    
    <!-- --- ANIMACIÓN DE FONDO --- -->
    <div class="scene-container">
      <!-- Nubes de fondo -->
      <div class="clouds">
        <div class="cloud cloud1"></div>
        <div class="cloud cloud2"></div>
        <div class="cloud cloud3"></div>
      </div>

      <!-- El Edificio -->
      <div class="building">
        <div class="window" v-for="n in 30" :key="n"></div>
      </div>

      <!-- Efecto de Explosión (Mejorado con capas) -->
      <div class="explosion-wrapper">
        <div class="fire fire1"></div>
        <div class="fire fire2"></div>
        <div class="fire fire3"></div>
        <div class="fire fire4"></div>
      </div>

      <!-- El Avión -->
      <div class="plane-wrapper">
        <img src="@/assets/img/PlaneAlone.png" alt="Plane" class="kamikaze-plane" />
        <!-- Humo negro en la cola -->
        <div class="smoke-trail">
          <div class="smoke s1"></div>
          <div class="smoke s2"></div>
          <div class="smoke s3"></div>
        </div>
      </div>
    </div>
    <!-- ------------------------- -->

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
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden !important;
  /* FONDO VERDE (MARCA) */
  background: linear-gradient(to bottom, #84fab0 0%, #98FE98 100%);

  /* --- ANIMACIÓN --- */
  .scene-container {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 1;
    overflow: hidden;
  }

  /* EDIFICIO */
  .building {
    position: absolute;
    bottom: -10px;
    right: 8%;
    width: 160px;
    height: 85vh;
    background-color: #34495e;
    border: 4px solid #2c3e50;
    border-bottom: none;
    z-index: 10;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-content: flex-start;
    padding-top: 15px;
    box-shadow: -15px 0 25px rgba(0,0,0,0.3);
  }
  .window {
    width: 28px; height: 40px;
    background-color: #f1c40f; margin: 6px;
    opacity: 0.8; box-shadow: 0 0 8px #f1c40f;
  }
  .window:nth-child(even) { background-color: #2c3e50; box-shadow: none; opacity: 0.4; }

  /* AVIÓN */
  .plane-wrapper {
    position: absolute;
    width: 140px; height: 140px;
    z-index: 12;
    animation: kamikaze 5s linear infinite;
  }
  .kamikaze-plane {
    width: 100%; height: 100%;
    object-fit: contain; transform: rotate(5deg);
  }

  /* HUMO NEGRO */
  .smoke-trail {
    position: absolute; top: 60px; left: -20px;
    width: 50px; height: 50px;
  }
  .smoke {
    position: absolute; background: #444; border-radius: 50%;
    opacity: 0; animation: smokePuff 0.8s linear infinite;
  }
  .s1 { width: 20px; height: 20px; animation-delay: 0s; }
  .s2 { width: 25px; height: 25px; top: 10px; left: -10px; animation-delay: 0.2s; }
  .s3 { width: 15px; height: 15px; top: -5px; left: -15px; animation-delay: 0.4s; }

  /* EXPLOSIÓN DE FUEGO (CAPAS) */
  .explosion-wrapper {
    position: absolute;
    right: 14%; /* Punto de impacto */
    top: 49%;
    width: 10px; height: 10px;
    z-index: 20;
  }
  .fire {
    position: absolute; border-radius: 50%;
    top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  /* Capa roja (exterior) */
  .fire1 {
    width: 150px; height: 150px; background: #ff3300;
    animation: explosionCore 5s ease-out infinite;
  }
  /* Capa naranja */
  .fire2 {
    width: 120px; height: 120px; background: #ff9900;
    animation: explosionCore 5s ease-out infinite 0.1s;
  }
  /* Capa amarilla */
  .fire3 {
    width: 80px; height: 80px; background: #ffff00;
    animation: explosionCore 5s ease-out infinite 0.2s;
  }
  /* Capa blanca (centro caliente) */
  .fire4 {
    width: 40px; height: 40px; background: #ffffff;
    animation: explosionCore 5s ease-out infinite 0.3s;
  }

  /* KEYFRAMES */
  @keyframes kamikaze {
    0% { left: -150px; top: 15%; opacity: 1; transform: rotate(5deg); }
    40% { top: 35%; }
    48% { left: calc(90% - 160px); top: 40%; opacity: 1; transform: rotate(10deg); }
    50% { left: calc(90% - 140px); top: 40%; opacity: 0; transform: scale(0.5) rotate(45deg); }
    100% { opacity: 0; }
  }

  @keyframes smokePuff {
    0% { opacity: 0.6; transform: scale(0.5); }
    100% { opacity: 0; transform: translate(-60px, 10px) scale(2); }
  }

  @keyframes explosionCore {
    0%, 49% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1); } /* BOOM */
    53% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.5); }
    55% { opacity: 0; transform: translate(-50%, -50%) scale(2); } /* Se disipa */
    100% { opacity: 0; }
  }

  /* NUBES */
  .clouds { position: absolute; width: 100%; height: 100%; overflow: hidden; }
  .cloud { position: absolute; background: rgba(255,255,255,0.5); border-radius: 50%; animation: moveClouds linear infinite; }
  .cloud::before, .cloud::after { content: ""; position: absolute; background: inherit; border-radius: 50%; }
  .cloud::before { width: 78%; height: 78%; top: -30%; left: 10%; }
  .cloud::after { width: 52%; height: 52%; top: -20%; left: 50%; }
  .cloud1 { width: 200px; height: 100px; top: 15%; left: 100%; animation-duration: 20s; }
  .cloud2 { width: 300px; height: 150px; top: 40%; left: 100%; animation-duration: 30s; animation-delay: -10s; }
  .cloud3 { width: 120px; height: 60px; top: 70%; left: 100%; animation-duration: 15s; animation-delay: -5s; }
  @keyframes moveClouds { from { transform: translateX(0); } to { transform: translateX(-120vw); } }

  /* --- CSS ORIGINAL --- */
  .overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.4); z-index: 2; }
  .error-container-wrapper { height: 100%; position: relative; z-index: 3; padding: 0; }
  .content-centerer { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; padding-bottom: 60px; }
  .errorContainer { text-align: center; width: 90%; max-width: 600px; padding: 2rem 1.5rem; background-color: rgba(255, 255, 255, 0.9); border-radius: 15px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); animation: fadeIn 0.8s ease-in-out; backdrop-filter: blur(5px); @media (max-height: 600px) { padding: 1rem; transform: scale(0.85); } }
  .errorCode { margin: 0.5rem 0; font-size: clamp(80px, 12vw, 160px); font-weight: 800; color: #344767; line-height: 1; text-shadow: 4px 4px 0 rgba(152, 254, 152, 0.5); letter-spacing: -5px; animation: fadeInBounce 1.2s ease-out; }
  .error-divider { width: 80px; height: 4px; background-color: #98FE98; margin: 1rem auto; border-radius: 2px; }
  .error-title { font-size: clamp(20px, 4vw, 30px); font-weight: 600; color: #344767; margin-bottom: 0.5rem; }
  .errorInfo { font-size: clamp(13px, 2.5vw, 16px); color: #6c757d; margin-bottom: 1rem; line-height: 1.4; }
  .errorBtn { display: inline-block; :deep(.custom-button) { padding: 10px 25px; font-weight: bold; } }
  .custom-footer { position: absolute; bottom: 0; left: 0; width: 100%; padding: 45px 0; z-index: 10; .copyright-text { font-size: 14px; } .version-text { font-size: 12px; opacity: 0.8; } @media (max-height: 600px) { padding: 5px 0; .copyright-text { font-size: 12px} .version-text { font-size: 10px; margin-bottom: 20px !important; } } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeInBounce { 0% { opacity: 0; transform: scale(0.8); } 70% { opacity: 1; transform: scale(1.05); } 100% { transform: scale(1); } }
}
</style>