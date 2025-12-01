<script setup>
import { computed, onMounted, ref } from "vue";
import MailBox from "./components/MailBox.vue";
import InboxTabs from "./components/InboxTabs.vue";
import InboxTimer from "./components/InboxTimer.vue";
import Received from "./components/Received.vue";
import Code from "./components/Code.vue";
import setNavPills from "@/assets/js/nav-pills";

const recipient = ref({ email: "", apiKey: "" });
const hasEmails = ref(false);
const currentTab = ref("preview");

const hasRecipient = computed(() => Boolean(recipient.value.email));
const showPreviewPlaceholder = computed(
  () => hasRecipient.value && !hasEmails.value && currentTab.value === "preview"
);
const showCodeTab = computed(
  () => hasRecipient.value && currentTab.value === "code"
);

onMounted(() => {
  setNavPills();
});

const handleRecipientUpdate = (payload) => {
  recipient.value = payload;
  hasEmails.value = false;
};

const handleTabChanged = (tab) => {
  currentTab.value = tab;
};

const handleHasEmails = (status) => {
  hasEmails.value = status;
};
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-lg-12 mx-auto">
        <div class="mb-4 w-100 w-md-50 w-lg-25">
          <h3>InBox</h3>
        </div>
        <div class="position-relative border-radius-xl overflow-hidden shadow-lg mb-7">
          <div class="container border-bottom">
            <div class="row justify-space-between py-2">
              <div class="col-12 col-lg-8 me-auto">
                <MailBox @emailGenerated="handleRecipientUpdate" />
              </div>
              <div class="col-12 col-lg-3 mt-3 mt-lg-0">
                <InboxTabs :activeTab="currentTab" @tabChanged="handleTabChanged" />
              </div>
            </div>
          </div>
          <div class="tab-content tab-space">
            <div class="tab-pane active p-2">
              <div class="overflow-auto">
                <div class="received-container">
                  <div
                    v-if="!hasRecipient"
                    class="position-absolute top-50 start-50 translate-middle text-center text-danger fw-bold"
                  >
                    Internal server error.
                  </div>
                  
                  <!-- GIF placeholder -->
                  <img
                    v-else-if="showPreviewPlaceholder"
                    src="../../assets/img/LoadingPlane.gif"
                    alt="No Emails"
                    class="position-absolute top-40 start-50 translate-middle opacity-50 responsive-image"
                  />
                  
                  <!-- Animated waiting text -->
                  <div
                    v-if="showPreviewPlaceholder"
                    class="position-absolute top-60 start-50 translate-middle text-center w-100"
                  >
                    <h5 class="waiting-text">
                      Waiting for incoming emails<span class="loading-dots"></span>
                    </h5>
                  </div>

                  <Received
                    v-if="hasRecipient && currentTab === 'preview'"
                    :email="recipient.email"
                    :apiKey="recipient.apiKey"
                    @hasEmails="handleHasEmails"
                  />
                  <Code
                    v-if="showCodeTab"
                    :email="recipient.email"
                    :apiKey="recipient.apiKey"
                  />
                </div>
              </div>
            </div>
          </div>
          <InboxTimer :email="recipient.email" :apiKey="recipient.apiKey" />
        </div>
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

/* --- Waiting text styles --- */
.waiting-text {
  color: #a4a5a5; /* Color solicitado */
  font-weight: 400;
  font-size: 1.5rem;
  margin: 0;
  display: inline-block;
}

/* Loading dots animation */
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