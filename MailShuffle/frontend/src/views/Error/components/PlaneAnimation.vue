<template>
    <div class="scene-container">
      <!-- Nubes de fondo -->
      <div class="clouds">
        <div class="cloud cloud1"></div>
        <div class="cloud cloud2"></div>
        <div class="cloud cloud3"></div>
      </div>
  
      <!-- El Edificio -->
      <div class="building-container">
        <div class="building">
          <div class="building-face-front">
            <!-- Ventanas infinitas -->
            <div class="window" v-for="n in 120" :key="n"></div>
          </div>
          
          <div class="building-face-side"></div>
          
          <!-- TECHO: Antenas movidas aquí dentro para mejor perspectiva -->
          <div class="building-roof">
            <div class="antenna a1"></div>
            <div class="antenna a2"></div>
          </div>
        </div>
      </div>
  
      <!-- Efecto de Explosión -->
      <div class="explosion-wrapper">
        <div class="fire fire1"></div>
        <div class="fire fire2"></div>
        <div class="fire fire3"></div>
        <div class="fire fire4"></div>
      </div>
  
      <!-- El Avión -->
      <div class="plane-wrapper">
        <img src="@/assets/img/PlaneAlone2.png" alt="Plane" class="kamikaze-plane" />
        <div class="smoke-trail">
          <div class="smoke s1"></div>
          <div class="smoke s2"></div>
          <div class="smoke s3"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "PlaneAnimation",
  };
  </script>
  
  <style lang="scss" scoped>
  /* --- ESCENA --- */
  .scene-container {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 1;
    overflow: hidden;
  }
  
  /* --- EDIFICIO (Mismos tamaños v4) --- */
  .building-container {
    position: absolute;
    top: 25vh; 
    right: 12%;
    z-index: 10;
    filter: drop-shadow(-25px 25px 15px rgba(0,0,0,0.5));
  }
  
  .building {
    position: relative;
    width: 180px;
    height: 120vh; 
  }
  
  /* Caras del Edificio */
  .building-face-front {
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, #465a6e 0%, #2c3e50 100%);
    border-right: 1px solid #1a252f;
    
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 40px;
    gap: 8px;
    padding: 15px 10px;
    overflow: hidden;
    z-index: 2;
  }
  
  .building-face-side {
    position: absolute;
    top: 0; left: 100%;
    width: 40px; height: 100%;
    background: #1a252f;
    transform-origin: left top;
    transform: skewY(-45deg); 
    border-left: 1px solid rgba(0,0,0,0.3);
    z-index: 1;
  }
  
  .building-roof {
    position: absolute;
    top: -40px; left: 0;
    width: 100%; height: 40px;
    background: #546e7a;
    transform-origin: bottom left;
    transform: skewX(-45deg); /* Inclinación del techo */
    border-bottom: 1px solid #34495e;
    z-index: 3;
    /* Necesario para que las antenas no se salgan del contexto */
    overflow: visible; 
  }
  
  /* --- ANTENAS CORREGIDAS --- */
  .antenna {
    position: absolute;
    background-color: #7f8c8d;
    width: 4px;
    bottom: 15px; /* Plantadas sobre la superficie del techo */
    transform-origin: bottom;
    transform: skewX(45deg); /* Contra-restamos la inclinación del techo para que queden rectas */
    box-shadow: -2px 2px 2px rgba(0,0,0,0.3); /* Sombra de la antena */
  }
  
  .a1 { 
    height: 55px; 
    left: 30%; 
    z-index: 2;
  }
  .a1::after { 
    content: ''; position: absolute; top: -5px; left: -3px; 
    width: 10px; height: 10px; border-radius: 50%; background: #e74c3c; 
    animation: blinkRed 2s infinite; 
  }
  
  .a2 { 
    height: 30px; 
    left: 60%; 
    width: 2px; 
    bottom: 25px; /* Un poco más atrás en el techo */
    z-index: 1;
  }
  
  /* Ventanas */
  .window {
    width: 100%; height: 100%;
    background-color: #34495e;
    border-bottom: 2px solid rgba(255,255,255,0.05);
  }
  .window:nth-child(3n) { background-color: #f1c40f; box-shadow: 0 0 5px #f1c40f; opacity: 0.8; }
  .window:nth-child(7n) { background-color: #f1c40f; opacity: 0.5; }
  .window:nth-child(5n+1) { background-color: #ffeaa7; opacity: 0.9; }
  
  /* --- AVIÓN --- */
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
  
  /* --- EXPLOSIÓN --- */
  .explosion-wrapper {
    position: absolute;
    right: calc(12% + 50px);
    top: 65%; 
    width: 10px; height: 10px;
    z-index: 20;
  }
  .fire {
    position: absolute; border-radius: 50%;
    top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  .fire1 { width: 180px; height: 180px; background: #ff3300; animation: explosionCore 5s ease-out infinite; }
  .fire2 { width: 140px; height: 140px; background: #ff9900; animation: explosionCore 5s ease-out infinite 0.1s; }
  .fire3 { width: 100px; height: 100px; background: #ffff00; animation: explosionCore 5s ease-out infinite 0.2s; }
  .fire4 { width: 50px; height: 50px; background: #ffffff; animation: explosionCore 5s ease-out infinite 0.3s; }
  
  /* --- KEYFRAMES --- */
  @keyframes kamikaze {
    0% { left: -150px; top: 30%; opacity: 1; transform: rotate(5deg); }
    35% { top: 50%; }
    48% { left: calc(88% - 190px); top: 60%; opacity: 1; transform: rotate(10deg); }
    50% { left: calc(88% - 170px); top: 60%; opacity: 0; transform: scale(0.5) rotate(45deg); }
    100% { opacity: 0; }
  }
  
  @keyframes smokePuff {
    0% { opacity: 0.6; transform: scale(0.5); }
    100% { opacity: 0; transform: translate(-60px, 10px) scale(2); }
  }
  
  @keyframes explosionCore {
    0%, 49% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    53% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.5); }
    55% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
    100% { opacity: 0; }
  }
  
  @keyframes blinkRed {
    0%, 100% { opacity: 1; box-shadow: 0 0 10px red; }
    50% { opacity: 0.4; box-shadow: none; }
  }
  
  .clouds { position: absolute; width: 100%; height: 100%; overflow: hidden; pointer-events: none; }
  .cloud { position: absolute; background: rgba(255,255,255,0.6); border-radius: 50%; animation: moveClouds linear infinite; }
  .cloud::before, .cloud::after { content: ""; position: absolute; background: inherit; border-radius: 50%; }
  .cloud::before { width: 78%; height: 78%; top: -30%; left: 10%; }
  .cloud::after { width: 52%; height: 52%; top: -20%; left: 50%; }
  .cloud1 { width: 200px; height: 100px; top: 15%; left: 100%; animation-duration: 20s; }
  .cloud2 { width: 300px; height: 150px; top: 40%; left: 100%; animation-duration: 30s; animation-delay: -10s; }
  .cloud3 { width: 120px; height: 60px; top: 70%; left: 100%; animation-duration: 15s; animation-delay: -5s; }
  @keyframes moveClouds { from { transform: translateX(0); } to { transform: translateX(-120vw); } }
  </style>