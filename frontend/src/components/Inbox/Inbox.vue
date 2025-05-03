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
          @recipientUpdated="recipient = $event"
          @tabChanged="currentTab = $event"
        >
          <div class="received-container">
            <div v-if="!recipient.email" class="position-absolute top-50 start-50 translate-middle text-center text-danger fw-bold">
              Internal server error.
            </div>
            <img
              v-else-if="!hasEmails && currentTab === 'preview'"
              src="../../assets/img/LoadingPlane.gif"
              alt="No Emails"
              class="position-absolute top-40 start-50 translate-middle opacity-50 responsive-image"
            />
            <div
              v-if="!hasEmails && recipient.email && currentTab === 'preview'"
              class="position-absolute top-60 start-50 translate-middle text-center w-100"
            >
              <div class="empty-title">Your inbox is empty</div>
              <div class="empty-subtitle">Waiting for incoming emails</div>
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
  max-width: 280px;
  width: 65%;
  filter: grayscale(100%);
}

.empty-title {
  font-size: calc(1rem + 0.5vw);
  font-weight: bold;
  color: #696666;
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  font-size: calc(0.75rem + 0.25vw);
  color: #6c757d;
}

@media (max-width: 576px) {
  .responsive-image {
    max-width: 180px;
  }
  
  .empty-title {
    font-size: 1.1rem;
  }
  
  .empty-subtitle {
    font-size: 0.9rem;
  }
}
</style>