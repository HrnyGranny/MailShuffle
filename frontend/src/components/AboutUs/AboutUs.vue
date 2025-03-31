<script setup>
import { onMounted } from "vue";
import AboutUsOption from "../AboutUs/Components/AboutUsOption.vue";

// Importar iconos desde assets
import Button from "../../assets/img/buttons/SupportUs_button.png";

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

// Cargar el botón de PayPal al montar el componente
onMounted(() => {
  loadPayPalButton();
});
</script>

<template>
  <section class="py-9 section-adjust">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 my-auto">
          <h3>Why MailShuffle?</h3>
          <p class="pe-6">
            We provide a simple and effective solution to avoid spam and protect your privacy. 
            With our random email generator, you can create temporary inboxes to receive emails 
            without exposing your personal email address.
          </p>
          <!-- Botón de soporte -->
          <div id="donate-button-container" style="display: inline-block;"></div>
          <!--Contact Us-->         
        </div>
        <!-- Columna de opciones -->
        <div class="col-lg-6 mt-lg-0 mt-5 ps-lg-0 ps-0">
          <div class="pe-5">
            <AboutUsOption
              :icon="{ component: 'schedule', backgroundColor: '#98FE98', iconColor: '#344767' }"
              content="Emails last for 7 days, giving you enough time to manage your temporary inbox."
            />
            <AboutUsOption
              :icon="{ component: 'add_circle', backgroundColor: '#98FE98', iconColor: '#344767' }" 
              content="Generate as many random email addresses as you want, completely free."
            />
            <AboutUsOption
              :icon="{ component: 'security', backgroundColor: '#98FE98', iconColor: '#344767' }"
              content="Your privacy is our priority. Avoid spam and keep your personal email safe."
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-adjust {
  margin-top: -140px;
  margin-bottom: -60px;
}
</style>