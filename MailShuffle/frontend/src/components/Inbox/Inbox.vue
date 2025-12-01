<script setup>
import { onMounted, ref, watch } from "vue";
import View from "../Inbox/components/View.vue";
import Received from "../Inbox/components/Received.vue";
import Code from "../Inbox/components/Code.vue";
import setNavPills from "@/assets/js/nav-pills";

const recipient = ref({ email: "", apiKey: "" });
const hasEmails = ref(false);
const currentTab = ref("preview");

onMounted(() => {
  setNavPills();
});

watch(recipient, () => {
  hasEmails.value = false;
});
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-lg-12 mx-auto">
        <div class="mb-4 w-100 w-md-50 w-lg-25">
          <h3>InBox</h3>
        </div>
        <View
          title=""
          :activeTab="currentTab"
          @recipientUpdated="recipient = $event"
          @tabChanged="currentTab = $event"
        >
          <div class="received-container">
            <div v-if="!recipient.email" class="position-absolute top-50 start-50 translate-middle text-center text-danger fw-bold">
              Internal server error.
            </div>
            
            <!-- Imagen GIF -->
            <img
              v-else-if="!hasEmails && currentTab === 'preview'"
              src="../../assets/img/LoadingPlane.gif"
              alt="No Emails"
              class="position-absolute top-40 start-50 translate-middle opacity-50 responsive-image"
            />
            
            <!-- Texto de Espera Animado -->
            <div
              v-if="!hasEmails && recipient.email && currentTab === 'preview'"
              class="position-absolute top-60 start-50 translate-middle text-center w-100"
            >
              <h5 class="waiting-text">
                Waiting for incoming emails<span class="loading-dots"></span>
              </h5>
            </div>

            <Received
              v-if="recipient.email && currentTab === 'preview'"
              :email="recipient.email"
              :apiKey="recipient.apiKey"
              @hasEmails="hasEmails = $event"
            />
            <Code
              v-if="recipient.email && currentTab === 'code'"
              :email="recipient.email"
              :apiKey="recipient.apiKey"
            />
          </div>
        </View>
      </div>
    </div>
  </div>
</template>

<style scoped>
.received-container {
  position: relative;
  min-height: 530px;
}

.top-40 {
  top: 40%;
}

.top-60 {
  top: 60%;
}

.responsive-image {
  max-width: 300px;
  width: 65%;
  filter: grayscale(100%);
}

/* --- Estilos del Texto de Espera --- */
.waiting-text {
  color: #a4a5a5; /* Color solicitado */
  font-weight: 400;
  font-size: 1.5rem;
  margin: 0;
  display: inline-block;
}

/* Animación de los puntos suspensivos */
.loading-dots::after {
  content: '';
  animation: dots 1.5s infinite steps(4);
  display: inline-block;
  width: 1.2em; /* Reserva espacio para que el texto no baile */
  text-align: left;
}

@keyframes dots {
  0%, 20% { content: ''; }
  40% { content: '.'; }
  60% { content: '..'; }
  80%, 100% { content: '...'; }
}

@media (max-width: 576px) {
  .responsive-image {
    max-width: 200px;
  }
  
  .waiting-text {
    font-size: 1rem;
  }
}
</style>