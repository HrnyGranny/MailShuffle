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
      id="tabs-simple"
      @recipientUpdated="recipient = $event"
      @tabChanged="currentTab = $event"
    >
      <div class="received-container">
        <img
          v-if="!hasEmails && recipient.email && currentTab === 'preview'"
          src="../../assets/img/carpeta-vacia.png"
          alt="No Emails"
          class="centered-image"
        />
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
