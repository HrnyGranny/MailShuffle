<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import MailBox from "@/components/Inbox/components/MailBox.vue";
import { getEmailExpiration } from "@/api/emailService"; // API
import "prismjs/themes/prism.css";
import "vue-prism-editor/dist/prismeditor.min.css";

const props = defineProps({
  title: { type: String, required: true },
});

const recipient = ref("");
const apiKey = ref("");
const expiresAt = ref(null);
const isPermanent = ref(false);
const remainingTimeText = ref("00:00:00:00");
const statusColor = ref("success");
const intervalId = ref(null);
const loading = ref(false);

const emit = defineEmits(["recipientUpdated", "tabChanged", "upgradeToPremium"]);

const updateRecipient = ({ email, apiKey: newApiKey }) => {
  recipient.value = email;
  apiKey.value = newApiKey;
  emit("recipientUpdated", { email, apiKey: newApiKey });
  
  // Cuando se actualiza el correo, obtener la información de expiración
  fetchExpirationData();
};

const handleTabChange = (tab) => {
  emit("tabChanged", tab);
};

const handleUpgradeToPremium = () => {
  emit("upgradeToPremium");
};

// Función para obtener los datos de expiración del servidor
const fetchExpirationData = async () => {
  if (!recipient.value || !apiKey.value) return;
  
  try {
    loading.value = true;
    const data = await getEmailExpiration(recipient.value, apiKey.value);
    
    if (data.isPermanent) {
      isPermanent.value = true;
      expiresAt.value = null;
      remainingTimeText.value = "Permanent";
      statusColor.value = "success";
    } else {
      isPermanent.value = false;
      expiresAt.value = data.expiresAt ? new Date(data.expiresAt) : null;
      // Iniciar actualización del contador después de obtener los datos
      updateRemainingTime();
    }
  } catch (error) {
    console.error("Error fetching expiration data:", error);
  } finally {
    loading.value = false;
  }
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
  
  // Format with leading zeros
  const days = String(diffDays).padStart(2, '0');
  const hours = String(diffHours).padStart(2, '0');
  const minutes = String(diffMinutes).padStart(2, '0');
  const seconds = String(diffSeconds).padStart(2, '0');
  
  remainingTimeText.value = `${days}:${hours}:${minutes}:${seconds}`;
  
  // Change color based on remaining time
  if (diffDays <= 2) {
    statusColor.value = "danger";
  } else if (diffDays <= 5) {
    statusColor.value = "warning";
  } else {
    statusColor.value = "success";
  }
};

// Vigilar cambios en recipient y apiKey para actualizar la información de expiración
watch([recipient, apiKey], () => {
  if (recipient.value && apiKey.value) {
    fetchExpirationData();
  }
});

// Start the real-time countdown timer
onMounted(() => {
  if (recipient.value && apiKey.value) {
    fetchExpirationData();
  }
  
  // Actualizar el contador cada segundo
  intervalId.value = setInterval(updateRemainingTime, 1000);
});

// Clean up timer when component is destroyed
onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
</script>

<template>
  <div class="position-relative border-radius-xl overflow-hidden shadow-lg mb-7">
    <div class="container border-bottom">
      <div class="row justify-space-between py-2">
        <div class="col-lg-8 me-auto">
          <MailBox @emailGenerated="updateRecipient" />
        </div>
        <div class="col-lg-3">
          <div class="nav-wrapper position-relative end-0">
            <ul class="nav nav-pills nav-fill flex-row p-1" role="tablist">
              <li class="nav-item">
                <a
                  class="nav-link mb-0 px-0 py-1 active"
                  href="#"
                  role="tab"
                  aria-selected="true"
                  @click.prevent="handleTabChange('preview')"
                >
                  <i class="fas fa-desktop text-sm me-2"></i> MailBox
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link mb-0 px-0 py-1"
                  href="#"
                  role="tab"
                  aria-selected="false"
                  @click.prevent="handleTabChange('code')"
                >
                  <i class="fas fa-code text-sm me-2"></i> API Code
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="tab-content tab-space">
      <div class="tab-pane active p-2">
        <div class="overflow-auto">
          <slot />
        </div>
      </div>
    </div>
    
    <!-- Expiration countdown component - Material Design style -->
    <div 
      class="expiration-container"
      :class="`status-${statusColor}`"
      @click="handleUpgradeToPremium"
    >
      <div class="countdown-display">
        <span v-if="loading">Loading...</span>
        <span v-else>{{ remainingTimeText }}</span>
      </div>
    </div>
  </div>
</template>

<style>
.my-editor {
  color: black;
  font-family: Consolas, Fira Mono, Menlo, Courier, monospace;
  font-size: 1em;
  line-height: 1.5;
  padding: 5px;
  tab-size: 4;
}
.prism-editor__textarea:focus {
  outline: none;
}

/* Material Design styles for the expiration countdown component */
.expiration-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 6px 16px;
  background-color: #f5f5f5;
  border-top: 1px solid rgba(0,0,0,0.08);
  border-radius: 0 0 0.5rem 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
}

.expiration-container:hover {
  filter: brightness(0.98);
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
}

/* Color status classes - full background colors */
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
  font-family: 'Roboto Mono', monospace;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-align: center;
}

.status-success .countdown-display {
  color: #2E7D32;
}

.status-warning .countdown-display {
  color: #FF8F00;
}

.status-danger .countdown-display {
  color: #C62828;
}
</style>