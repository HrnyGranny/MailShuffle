<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { getEmailsByRecipient, deleteEmailById } from "@/api/emailService";
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

const deleteEmail = async (id) => {
  try {
    await deleteEmailById(id); // Llamar al backend para eliminar el correo
    emails.value = emails.value.filter((email) => email._id !== id); // Actualizar la lista local
  } catch (error) {
    console.error("Error deleting email:", error);
  }
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
      <li
        v-for="(email, index) in emails"
        :key="email._id"
        class="email-item"
        :class="{ 'alternate': index % 2 === 0 }"
      >
        <div class="email-content" @click="openEmail(email)">
          <strong class="email-subject">{{ email.subject }}</strong>
          <span class="email-sender"> - {{ email.sender }}</span>
        </div>
        <button class="delete-button" @click.stop="deleteEmail(email._id)">
          <span class="material-icons">delete</span>
        </button>
      </li>
    </ul>
    <EmailOpened v-if="isViewingEmail && selectedEmail" :email="selectedEmail" @back="backToList" />
  </div>
</template>

<style scoped>
.received-container {
  width: 100%;
  min-height: 300px;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.email-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  width: 100%;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 18px;
}

.email-item:hover {
  background-color: #f0f0f0;
}

.email-content {
  flex-grow: 1;
}

.email-subject {
  color: #344767; /* Color del asunto */
  font-weight: bold;
}

.email-sender {
  color: #7b829a; /* Color del remitente */
  font-style: italic;
}

.delete-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #e74c3c;

  font-size: 24px;
  padding-right: 30px;
}

.delete-button:hover {
  color: #c0392b;
}

.alternate {
  background-color: #f9f9f9;
}
</style>