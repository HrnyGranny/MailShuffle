<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { getEmailsByRecipient } from "@/api/emailService";
import EmailOpened from "./EmailOpened.vue";

const props = defineProps({ recipient: String });
const emit = defineEmits(["hasEmails"]);
const emails = ref([]);
const selectedEmail = ref(null);
const isViewingEmail = ref(false);
let pollingInterval = null;

const fetchEmails = async () => {
  try {
    if (props.recipient) {
      emails.value = await getEmailsByRecipient(props.recipient);
      emit("hasEmails", emails.value.length > 0);
    }
  } catch {
    emails.value = [];
    emit("hasEmails", false);
  }
};

const startPolling = () => {
  pollingInterval = setInterval(fetchEmails, 3000);
};

const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
};

const openEmail = (email) => {
  selectedEmail.value = email;
  isViewingEmail.value = true;
};

const backToList = () => {
  isViewingEmail.value = false;
  selectedEmail.value = null;
};

onMounted(() => {
  fetchEmails();
  startPolling();
});

onUnmounted(stopPolling);

watch(() => props.recipient, async () => {
  stopPolling();
  emails.value = [];
  isViewingEmail.value = false;
  selectedEmail.value = null;
  await fetchEmails();
  startPolling();
});
</script>

<template>
  <div class="received-container">
    <ul v-if="!isViewingEmail && emails.length">
      <li v-for="email in emails" :key="email.id" @click="openEmail(email)">
        <strong>{{ email.subject }}</strong> - {{ email.sender }}
      </li>
    </ul>
    <EmailOpened v-if="isViewingEmail && selectedEmail" :email="selectedEmail" @back="backToList" />
  </div>
</template>

<style scoped>
.received-container {
  position: relative;
  margin-bottom: 400px;
  min-height: 300px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

li:hover {
  background-color: #f9f9f9;
}
</style>