<script setup>
import { onMounted, ref } from "vue";

// Importar iconos desde assets
import Button from "../assets/img/buttons/SupportMe.png";

// Estado para animación de elementos
const isVisible = ref(false);

// Opciones de MailShuffle (datos)
const mailShuffleOptions = [
  {
    icon: "schedule",
    backgroundColor: "#98FE98",
    iconColor: "#344767",
    content: "Emails last for 7 days, giving you enough time to manage your temporary inbox."
  },
  {
    icon: "add_circle",
    backgroundColor: "#98FE98",
    iconColor: "#344767",
    content: "Generate as many random email addresses as you want, completely free."
  },
  {
    icon: "security",
    backgroundColor: "#98FE98",
    iconColor: "#344767",
    content: "Your privacy is our priority. Avoid spam and keep your personal email safe."
  }
];

// Función para cargar el botón de donación de PayPal
const loadPayPalButton = () => {
  const script = document.createElement("script");
  script.src = "https://www.paypalobjects.com/donate/sdk/donate-sdk.js";
  script.charset = "UTF-8";
  script.onload = () => {
    PayPal.Donation.Button({
      env: "production",
      hosted_button_id: "ZY2SHV8XNDW6G",
      image: {
        src: Button,
        alt: "Donate with PayPal button",
        title: "Support us with a donation",
      },
    }).render("#donate-button-container");
  };
  document.body.appendChild(script);
};

// Cargar el botón de PayPal y activar animación al montar el componente
onMounted(() => {
  loadPayPalButton();
  // Activar animaciones después de un pequeño retardo
  setTimeout(() => {
    isVisible.value = true;
  }, 300);
});
</script>

<template>
  <section class="why-section">
    <div class="container">
      <div class="why-content">
        <!-- Columna izquierda con descripción y botón de soporte -->
        <div class="info-column" :class="{ 'animate-in': isVisible }">
          <h3 class="section-title">Why MailShuffle?</h3>
          <p class="section-description">
            We provide a simple and effective solution to avoid spam and protect your privacy. 
            With our random email generator, you can create temporary inboxes to receive emails 
            without exposing your personal email address.
          </p>
          <!-- Botón de soporte -->
          <div id="donate-button-container" class="donate-container"></div>
        </div>
        
        <!-- Columna derecha con opciones -->
        <div class="options-column">
          <div class="options-list">
            <!-- Iteramos sobre las opciones directamente -->
            <div 
              v-for="(option, index) in mailShuffleOptions" 
              :key="index" 
              class="option-item"
              :class="{ 'animate-in': isVisible }"
              :style="{ transitionDelay: `${index * 150}ms` }"
            >
              <!-- Contenedor del ícono -->
              <div
                class="option-icon"
                :style="{ backgroundColor: option.backgroundColor }"
              >
                <i
                  class="material-icons"
                  :style="{ color: option.iconColor }"
                >
                  {{ option.icon }}
                </i>
              </div>
              <!-- Contenido del texto -->
              <div class="option-content">
                <p v-html="option.content" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
// Variables de color
$accent-color: #98FE98;
$hover-color: darken(#98FE98, 5%);

// Mixins
@mixin transition($property: all, $duration: 0.3s) {
  transition: $property $duration ease-in-out;
}

// Estilos de sección
.why-section {
  padding: 1.8rem 0;
  position: relative;
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.why-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 3rem;
  position: relative;
  z-index: 1;
}

// Columna de información
.info-column {
  flex: 1;
  min-width: 300px;
  opacity: 0;
  transform: translateY(20px);
  @include transition(all, 0.6s);
  
  &.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  margin-bottom: 1.5rem;
  position: relative;
  
  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 83px; 
    height: 4px;
    background-color: $accent-color;
    border-radius: 2px;
  }
}

.section-description {
  line-height: 1.6;
  color: #7b809a;
  margin-bottom: 2rem;
}

.donate-container {
  display: inline-block;
  margin-top: 1rem;
  
  img {
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-3px);
    }
  }
}

// Columna de opciones
.options-column {
  flex: 1;
  min-width: 300px;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.option-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem 0; 
  opacity: 0;
  transform: translateX(20px);
  @include transition;
  
  &.animate-in {
    opacity: 1;
    transform: translateX(0);
  }
  
  &:hover .option-icon {
    transform: scale(1.05);
    background-color: $hover-color;
  }
}

.option-icon {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  margin-right: 1rem;
  @include transition;
  
  i {
    font-size: 1.5rem;
  }
}

.option-content {
  flex: 1;
  
  p {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.5;
  }
}

// Responsive
@media (max-width: 768px) {
  .why-content {
    flex-direction: column;
  }
  
  .section-title {
    font-size: 2rem;
    
    &::after {
      width: 75px; 
    }
  }
  
  .options-list {
    margin-top: 1rem;
  }
}
</style>