<script setup>
import { onMounted, ref, watch } from "vue";
import BaseLayout from "../Inbox/components/BaseLayout.vue";
import View from "../Inbox/components/View.vue";
import Received from "../Inbox/components/Received.vue";
import setNavPills from "@/assets/js/nav-pills";

const recipient = ref({ email: "", apiKey: "" }); // Ahora es un objeto con email y apiKey
const hasEmails = ref(false);

onMounted(() => {
  setNavPills();
});

watch(recipient, () => {
  hasEmails.value = false; // Resetear el estado de correos al cambiar de recipient
});
</script>

<template>
  <BaseLayout title="InBox">
    <View title="" id="tabs-simple" @recipientUpdated="recipient = $event">
      <div class="received-container">
        <img
          v-if="!hasEmails && recipient.email"
          src="../../assets/img/carpeta-vacia.png"
          alt="No Emails"
          class="centered-image"
        />
        <Received
          v-if="recipient.email"
          :email="recipient.email"
          :apiKey="recipient.apiKey"
          @hasEmails="hasEmails = $event"
        />
      </div>
    </View>
  </BaseLayout>
</template>

<style scoped>
.received-container {
  position: relative;
  margin-bottom: 280px;
  min-height: 300px;
}

.centered-image {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 150px;
  opacity: 0.5;
}
</style>