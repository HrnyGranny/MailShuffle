<script setup>
import { onMounted, ref, watch } from "vue";
import BaseLayout from "../Inbox/components/BaseLayout.vue";
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
  <BaseLayout title="InBox">
    <View
      title=""
      @recipientUpdated="recipient = $event"
      @tabChanged="currentTab = $event"
    >
      <div class="received-container">
        <div v-if="!recipient.email" class="error-message">
          Internal server error.
        </div>
        <img
          v-else-if="!hasEmails && currentTab === 'preview'"
          src="../../assets/img/LoadingPlane.gif"
          alt="No Emails"
          class="centered-image"
        />
        <div
          v-if="!hasEmails && recipient.email && currentTab === 'preview'"
          class="empty-inbox-text"
        >
          <div class="empty-inbox-title">Your inbox is empty</div>
          <div class="empty-inbox-subtitle">Waiting for incoming emails</div>
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
  </BaseLayout>
</template>

<style scoped>
.received-container {
  position: relative;
  min-height: 530px; /* Tamaño mínimo */
  height: auto; /* Crece dinámicamente */
}

.centered-image {
  position: absolute;
  top: 40%; /* Ajusta la posición vertical */
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 280px;
  opacity: 0.5;
  filter: grayscale(100%);
}

.empty-inbox-text {
  position: absolute;
  top: 60%; /* Ajusta la posición del texto */
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.empty-inbox-title {
  font-size: 1.5rem; /* Texto más grande */
  font-weight: bold;
  color: #696666; /* Color más oscuro */
  margin-bottom: 0.5rem;
}

.empty-inbox-subtitle {
  font-size: 1rem; /* Texto más pequeño */
  color: #6c757d; /* Color más claro */
}

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 1.2rem;
  color: red; /* Color rojo para el mensaje de error */
  font-weight: bold;
}
</style>