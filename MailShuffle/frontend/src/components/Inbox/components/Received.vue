<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { getInbox } from "@/api/emailService";
import EmailOpened from "./EmailOpened.vue";

const props = defineProps({ email: String, apiKey: String });
const emit = defineEmits(["hasEmails"]);

const emails = ref([]);
const selectedEmail = ref(null);
const isViewingEmail = ref(false);
const viewedEmails = ref(new Set());
let pollingInterval = null;

const hasCredentials = computed(() => Boolean(props.email && props.apiKey));

const loadViewedEmails = () => {
  const storedViewedEmails = localStorage.getItem("viewedEmails");
  if (storedViewedEmails) {
    viewedEmails.value = new Set(JSON.parse(storedViewedEmails));
  }
};

const saveViewedEmails = () => {
  localStorage.setItem("viewedEmails", JSON.stringify([...viewedEmails.value]));
};

const sortEmails = () => {
  emails.value.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));
};

const fetchEmails = async () => {
  if (!hasCredentials.value) {
    emit("hasEmails", false);
    return;
  }

  try {
    const lastEmailId = emails.value.length ? emails.value[0]._id : null;
    const inbox = await getInbox(props.email, props.apiKey, lastEmailId);

    if (inbox && inbox.length) {
      const newEmails = inbox.filter(
        (newEmail) => !emails.value.some((existingEmail) => existingEmail._id === newEmail._id)
      );
      emails.value = [...newEmails, ...emails.value];
      sortEmails();
    }

    emit("hasEmails", emails.value.length > 0);
  } catch (error) {
    console.error("Error fetching emails:", error);
    emit("hasEmails", false);
  }
};

const handleDeleteEmail = (emailId) => {
  emails.value = emails.value.filter((email) => email._id !== emailId);
  emit("hasEmails", emails.value.length > 0);
  backToList();
};

const startPolling = () => {
  if (!hasCredentials.value) {
    stopPolling();
    return;
  }

  stopPolling();
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
  viewedEmails.value.add(email._id);
  saveViewedEmails();
};

const isEmailViewed = (emailId) => viewedEmails.value.has(emailId);

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  }

  return date.toLocaleDateString("en-US", { day: "numeric", month: "numeric", year: "2-digit" });
};

const backToList = () => {
  isViewingEmail.value = false;
  selectedEmail.value = null;
};

onMounted(() => {
  loadViewedEmails();
  fetchEmails();
  startPolling();
});

onUnmounted(() => {
  stopPolling();
  saveViewedEmails();
});

watch(
  [() => props.email, () => props.apiKey],
  async () => {
    stopPolling();
    emails.value = [];
    isViewingEmail.value = false;
    selectedEmail.value = null;

    if (!hasCredentials.value) {
      emit("hasEmails", false);
      return;
    }

    await fetchEmails();
    startPolling();
  }
);
</script>

<template>
  <div class="received-container">
    <ul v-if="!isViewingEmail && emails.length" class="email-list list-unstyled mb-0">
      <li
        v-for="email in emails"
        :key="email._id"
        class="email-box card mb-2"
        :class="{ 'email-unread': !isEmailViewed(email._id) }"
      >
        <div class="card-body py-2" @click="openEmail(email)">
          <div v-if="!isEmailViewed(email._id)" class="unread-dot"></div>

          <div class="d-flex justify-content-between align-items-center mb-1">
            <div class="fw-bold">{{ email.subject }}</div>
            <small class="text-muted ms-2">{{ formatTime(email.receivedAt) }}</small>
          </div>
          <div class="text-muted small">{{ email.sender }}</div>
        </div>
      </li>
    </ul>

    <EmailOpened
      v-if="isViewingEmail && selectedEmail"
      :email="selectedEmail"
      :address="props.email"
      :apiKey="props.apiKey"
      @back="backToList"
      @delete="handleDeleteEmail"
    />
  </div>
</template>

<style scoped>
.email-box {
  position: relative;
  border-radius: 0.5rem;
  transition: box-shadow 0.2s ease;
  overflow: hidden;
  cursor: pointer;
  min-height: 50px; /* Reducido para tarjetas más compactas */
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(52, 71, 103, 0.15); 
  background: #f1f1f2;

}

.email-box:hover {
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.email-unread .fw-bold {
  font-weight: 600 !important;
}

.unread-dot {
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: #2ecc71;
}

/* Contenido con margen para el punto */
.email-unread .card-body {
  padding-left: 1.5rem;
  background: #ffffff;

}
</style>