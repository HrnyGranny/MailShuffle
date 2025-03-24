<script setup>
import { onMounted, ref } from "vue";

// Sections components
import BaseLayout from "../Inbox/components/BaseLayout.vue";
import View from "../Inbox/components/View.vue";
import Received from "../Inbox/components/Received.vue";

const recipient = ref(""); // Variable para almacenar el correo generado

//nav-pills
import setNavPills from "@/assets/js/nav-pills";

//hook
onMounted(() => {
  setNavPills();
});
</script>

<template>
  <BaseLayout title="InBox">
    <!-- View -->
    <View title="" id="tabs-simple" @recipientUpdated="recipient = $event">
      <!-- Received -->
      <Received v-if="recipient" :recipient="recipient" />
    </View>
  </BaseLayout>
</template>