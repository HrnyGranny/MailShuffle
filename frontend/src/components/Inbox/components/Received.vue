<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { getInbox } from "@/api/emailService";
import EmailOpened from "./EmailOpened.vue";

const props = defineProps({ email: String, apiKey: String });
const emit = defineEmits(["hasEmails"]);
const emails = ref([]);
const selectedEmail = ref(null);
const isViewingEmail = ref(false);
let pollingInterval = null;

// Conjunto para almacenar IDs de correos visualizados
const viewedEmails = ref(new Set());

// Cargar correos visualizados desde localStorage
const loadViewedEmails = () => {
  const storedViewedEmails = localStorage.getItem("viewedEmails");
  if (storedViewedEmails) {
    viewedEmails.value = new Set(JSON.parse(storedViewedEmails));
  }
};

// Guardar correos visualizados en localStorage
const saveViewedEmails = () => {
  localStorage.setItem("viewedEmails", JSON.stringify([...viewedEmails.value]));
};

const sortEmails = () => {
  emails.value.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));
};

// Función para obtener la bandeja de entrada
const fetchEmails = async () => {
  try {
    if (props.email && props.apiKey) {
      const lastEmailId = emails.value.length ? emails.value[0]._id : null; // ID del correo más reciente
      const inbox = await getInbox(props.email, props.apiKey, lastEmailId); // Pasar el ID del último correo
      console.log("Inbox:", inbox);
      if (inbox && inbox.length) {
        // Filtrar correos duplicados
        const newEmails = inbox.filter(
          (newEmail) => !emails.value.some((existingEmail) => existingEmail._id === newEmail._id)
        );
        emails.value = [...newEmails, ...emails.value]; // Agregar solo los correos nuevos
        sortEmails();
      }
      emit("hasEmails", emails.value.length > 0);
    }
  } catch (error) {
    console.error("Error fetching emails:", error);
    emit("hasEmails", false);
  }
};

// Función para eliminar un correo de la bandeja de entrada
const handleDeleteEmail = (emailId) => {
  // Filtrar el correo eliminado de la lista
  emails.value = emails.value.filter((email) => email._id !== emailId);

  // Emitir el evento para notificar que la lista ha cambiado
  emit("hasEmails", emails.value.length > 0);

  // Volver a la lista de correos
  backToList();
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
  // Marcar correo como visto
  viewedEmails.value.add(email._id);
  saveViewedEmails(); // Guardar en localStorage
};

// Verificar si un correo ha sido visto
const isEmailViewed = (emailId) => {
  return viewedEmails.value.has(emailId);
};

// Formatear fecha de manera amigable
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  
  // Si es hoy, mostrar la hora
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }
  
  // Si es ayer, mostrar "Ayer"
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Ayer';
  }
  
  // Si es este año pero no hoy ni ayer, mostrar día y mes
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }
  
  // Otro año, mostrar día/mes/año
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: '2-digit' });
};

// Volver a la lista de correos
const backToList = () => {
  isViewingEmail.value = false;
  selectedEmail.value = null;
};

// Ciclo de vida del componente
onMounted(() => {
  loadViewedEmails(); // Cargar correos visualizados desde localStorage
  fetchEmails();
  startPolling();
});

onUnmounted(() => {
  stopPolling();
  saveViewedEmails(); // Guardar correos visualizados en localStorage al desmontar
});

// Verificar cambios en las props
watch(
  () => props.email,
  async () => {
    stopPolling();
    emails.value = [];
    isViewingEmail.value = false;
    selectedEmail.value = null;
    await fetchEmails();
    sortEmails();
    startPolling();
  }
);
</script>

<template>
  <div class="received-container">
    <ul v-if="!isViewingEmail && emails.length" class="email-list list-unstyled mb-0">
      <li v-for="(email, index) in emails" 
          :key="email._id" 
          class="email-box card mb-2"
          :class="{ 'email-unread': !isEmailViewed(email._id) }">
        
        <!-- Contenido del email -->
        <div class="card-body py-2" @click="openEmail(email)">
          <!-- Indicador de no leído -->
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
}
</style>