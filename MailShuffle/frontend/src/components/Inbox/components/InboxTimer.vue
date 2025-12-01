<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { getEmailExpiration } from "@/api/emailService";

const props = defineProps({
  email: { type: String, default: "" },
  apiKey: { type: String, default: "" }
});

const emit = defineEmits(["upgrade"]);

const isPermanent = ref(false);
const expiresAt = ref(null);
const remainingTimeText = ref("00:00:00:00");
const statusColor = ref("success");
const intervalId = ref(null);
const loading = ref(false);

const hasCredentials = computed(() => Boolean(props.email && props.apiKey));

const resetState = () => {
  isPermanent.value = false;
  expiresAt.value = null;
  remainingTimeText.value = "00:00:00:00";
  statusColor.value = "success";
};

const updateRemainingTime = () => {
  if (isPermanent.value) {
    remainingTimeText.value = "Permanent";
    statusColor.value = "success";
    return;
  }

  if (!expiresAt.value) {
    remainingTimeText.value = "00:00:00:00";
    statusColor.value = "success";
    return;
  }

  const now = new Date();
  const expirationDate = new Date(expiresAt.value);
  const diffMs = expirationDate - now;

  if (diffMs <= 0) {
    remainingTimeText.value = "Expired";
    statusColor.value = "danger";
    return;
  }

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const days = String(diffDays).padStart(2, "0");
  const hours = String(diffHours).padStart(2, "0");
  const minutes = String(diffMinutes).padStart(2, "0");
  const seconds = String(diffSeconds).padStart(2, "0");

  remainingTimeText.value = `${days}:${hours}:${minutes}:${seconds}`;

  if (diffDays <= 2) {
    statusColor.value = "danger";
  } else if (diffDays <= 5) {
    statusColor.value = "warning";
  } else {
    statusColor.value = "success";
  }
};

const fetchExpirationData = async () => {
  if (!hasCredentials.value) {
    resetState();
    return;
  }

  try {
    loading.value = true;
    const data = await getEmailExpiration(props.email, props.apiKey);

    if (data.isPermanent) {
      isPermanent.value = true;
      expiresAt.value = null;
      remainingTimeText.value = "Permanent";
      statusColor.value = "success";
    } else {
      isPermanent.value = false;
      expiresAt.value = data.expiresAt ? new Date(data.expiresAt) : null;
      updateRemainingTime();
    }
  } catch (error) {
    console.error("Error fetching expiration data:", error);
    resetState();
  } finally {
    loading.value = false;
  }
};

const startTimer = () => {
  stopTimer();
  intervalId.value = setInterval(updateRemainingTime, 1000);
};

const stopTimer = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
};

watch(
  () => [props.email, props.apiKey],
  async () => {
    await fetchExpirationData();
    if (hasCredentials.value) {
      startTimer();
    } else {
      stopTimer();
    }
  }
);

onMounted(async () => {
  await fetchExpirationData();
  if (hasCredentials.value) {
    startTimer();
  }
});

onUnmounted(() => {
  stopTimer();
});
</script>

<template>
  <div class="expiration-container" :class="`status-${statusColor}`" @click="$emit('upgrade')">
    <div class="countdown-display">
      <span v-if="loading">Loading...</span>
      <span v-else>{{ remainingTimeText }}</span>
    </div>
  </div>
</template>

<style scoped>
.expiration-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 6px 16px;
  background-color: #f5f5f5;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0 0 0.5rem 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.expiration-container:hover {
  filter: brightness(0.98);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.status-success {
  background-color: rgba(76, 175, 80, 0.1);
}

.status-warning {
  background-color: rgba(255, 193, 7, 0.1);
}

.status-danger {
  background-color: rgba(244, 67, 54, 0.1);
}

.countdown-display {
  font-family: "Roboto Mono", monospace;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-align: center;
}

.status-success .countdown-display {
  color: #2e7d32;
}

.status-warning .countdown-display {
  color: #ff8f00;
}

.status-danger .countdown-display {
  color: #c62828;
}
</style>
