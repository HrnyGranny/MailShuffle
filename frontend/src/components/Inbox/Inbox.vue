<script setup>
import { onMounted } from "vue";

// Sections components
import BaseLayout from "../Inbox/components/BaseLayout.vue";
import View from "../Inbox/components/View.vue";

// Send page components

// import TabsSimple from "./components/TabsSimple.vue";

// import Send from "@/components/Inbox/Send.vue";

// Receive page components codes

// import { TabsSimpleCode } from "./components/Codes";

// import Receive from "@/components/Inbox/Receive.vue";

//nav-pills
import setNavPills from "@/assets/js/nav-pills";

//hook
onMounted(() => {
  setNavPills();
});
</script>
<template>
  <BaseLayout title="InBox">
    <!-- view -->
    <View title="" :code="TabsSimpleCode" id="tabs-simple">
      <TabsSimple />
    </View>

  </BaseLayout>
</template>
