<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { getInbox, deleteEmailById } from "@/api/emailService";
import EmailOpened from "./EmailOpened.vue";
import Swal from "sweetalert2";
import MaterialButton from "@/material_components/MaterialButton.vue";

const props = defineProps({ email: String, apiKey: String });
const emit = defineEmits(["hasEmails"]);
const emails = ref([]);
const selectedEmail = ref(null);
const isViewingEmail = ref(false);
let pollingInterval = null;

// Función para obtener la bandeja de entrada
const fetchEmails = async () => {
  try {
    if (props.email && props.apiKey) {
      const inbox = await getInbox(props.email, props.apiKey); // Llamar a la API para obtener la bandeja de entrada
      emails.value = inbox; // Actualizar la lista de correos
      emit("hasEmails", emails.value.length > 0);
    }
  } catch (error) {
    console.error("Error fetching emails:", error);
    emails.value = [];
    emit("hasEmails", false);
  }
};

// Iniciar el polling para actualizar la bandeja de entrada
const startPolling = () => {
  pollingInterval = setInterval(fetchEmails, 3000);
};

// Detener el polling
const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
};

// Abrir un correo para visualizarlo
const openEmail = (email) => {
  selectedEmail.value = email;
  isViewingEmail.value = true;
};

// Eliminar un correo específico
const deleteEmail = async (emailId) => {
  console.log("Deleting email with ID:", emailId);
  try {
    if (props.email && props.apiKey) {
      await deleteEmailById(props.email, props.apiKey, emailId); // Llamar a la API para eliminar el correo
      emails.value = emails.value.filter((email) => email._id !== emailId); // Actualizar la lista local

      // Mostrar alerta de éxito al eliminar
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: 'Email deleted successfully!',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
    }
  } catch (error) {
    console.error("Error deleting email:", error);

    // Mostrar alerta de error
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: 'Error deleting email!',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }
};

// Volver a la lista de correos
const backToList = () => {
  isViewingEmail.value = false;
  selectedEmail.value = null;
};

// Ciclo de vida del componente
onMounted(() => {
  fetchEmails();
  startPolling();
});

onUnmounted(stopPolling);

// Verificar cambios en las props
watch(() => props.email, async () => {
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
    <ul v-if="!isViewingEmail && emails.length" class="email-list">
      <li
        v-for="(email, index) in emails"
        :key="email._id"
        class="email-box"
      >
        <!-- Botón de eliminar -->
        <MaterialButton
          variant="gradient"
          color="danger"
          class="delete-btn"
          @click.stop="deleteEmail(email._id)"
        >
          <span class="material-icons delete-icon">delete</span>
        </MaterialButton>

        <!-- Contenido del email -->
        <div class="email-body" @click="openEmail(email)">
          <div class="text-dark fw-bold">{{ email.subject }}</div>
          <div class="text-secondary">{{ email.sender }}</div>
        </div>
      </li>
    </ul>

    <EmailOpened
      v-if="isViewingEmail && selectedEmail"
      :email="selectedEmail"
      @back="backToList"
    />
  </div>
</template>


<style scoped>
.received-container {
  width: 100%;
  min-height: 300px;
}

.email-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 16px;
}

.email-box {
  position: relative;
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.075);
  transition: box-shadow 0.2s ease;
  cursor: pointer;
}

.email-box:hover {
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.12);
}

.email-body {
  display: flex;
  flex-direction: column;
  word-break: break-word;
}

.delete-btn {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  padding: 8px;
  background-color: #98FE98 !important;
  border-color: #98FE98 !important;
  color: #ffffff !important;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  z-index: 2;
}

.delete-icon {
  font-size: 24px;
}
</style>

