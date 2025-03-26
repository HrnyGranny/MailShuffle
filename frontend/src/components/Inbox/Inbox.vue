<script setup>
import { onMounted, ref, watch } from "vue";
import BaseLayout from "../Inbox/components/BaseLayout.vue";
import View from "../Inbox/components/View.vue";
import Received from "../Inbox/components/Received.vue";
import setNavPills from "@/assets/js/nav-pills";

const recipient = ref("");
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
          v-if="!hasEmails && recipient"
          src="../../assets/img/carpeta-vacia.png"
          alt="No Emails"
          class="centered-image"
        />
        <Received
          v-if="recipient"
          :recipient="recipient"
          @hasEmails="hasEmails = $event"
        />
      </div>
    </View>
  </BaseLayout>
</template>

<style scoped>
.received-container {
  position: relative;
  margin-bottom: 350px;
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