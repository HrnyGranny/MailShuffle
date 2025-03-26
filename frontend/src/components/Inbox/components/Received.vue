<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { getEmailsByRecipient } from "@/api/emailService";
import EmailModal from "./EmailModal.vue"; // Importar el nuevo componente del modal

const props = defineProps({
  recipient: {
    type: String,
    required: true, // El recipient es obligatorio
  },
});

const emails = ref([]); // Lista de correos
const error = ref(null); // Estado de error
const selectedEmail = ref(null); // Correo seleccionado para mostrar en el modal
const showModal = ref(false); // Estado del modal (abierto o cerrado)
const selectedEmailElement = ref(null); // Referencia al elemento del mensaje seleccionado
let pollingInterval = null; // Intervalo para el polling
const emit = defineEmits(["hasEmails"]); // Emitir evento para notificar si hay correos

// Función para obtener correos del backend
const fetchEmails = async () => {
  try {
    if (props.recipient) {
      const response = await getEmailsByRecipient(props.recipient);
      emails.value = response; // Actualizar la lista de correos
      emit("hasEmails", emails.value.length > 0); // Emitir si hay correos
    }
  } catch (err) {
    if (err.response && err.response.status === 404) {
      emails.value = []; // Si no hay correos, vaciar la lista
      emit("hasEmails", false); // Emitir que no hay correos
    } else {
      error.value = "Error fetching emails.";
      console.error(err);
    }
  }
};

// Función para iniciar el polling
const startPolling = () => {
  pollingInterval = setInterval(async () => {
    await fetchEmails(); // Llamar a la función para comprobar nuevos correos
  }, 3000); // Cada 3 segundos
};

// Función para detener el polling
const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
};

// Función para abrir el modal con la información del correo seleccionado
const openModal = (email, element) => {
  selectedEmail.value = email;
  selectedEmailElement.value = element; // Guardar la referencia al elemento del mensaje
  showModal.value = true;

  // Desplazar la pantalla hacia el mensaje seleccionado
  if (selectedEmailElement.value) {
    selectedEmailElement.value.scrollIntoView({
      behavior: "smooth", // Desplazamiento suave
      block: "center", // Centrar el mensaje en la pantalla
    });
  }
};

// Función para cerrar el modal
const closeModal = () => {
  showModal.value = false;
  selectedEmail.value = null;
};

// Configurar el polling al montar el componente
onMounted(() => {
  fetchEmails(); // Obtener correos al montar el componente
  startPolling(); // Iniciar el polling
});

// Detener el polling al desmontar el componente
onUnmounted(() => {
  stopPolling();
});

// Reactualizar correos si cambia el recipient
watch(() => props.recipient, async () => {
  await fetchEmails(); // Actualizar correos al cambiar el recipient
});
</script>

<template>
  <div class="received-container">
    <div v-if="error">{{ error }}</div>
    <ul v-if="emails.length">
      <li
        v-for="email in emails"
        :key="email.id"
        @click="openModal(email, $event.target)"
      >
        <strong>{{ email.subject }}</strong> - {{ email.sender }}
        <p>{{ email.body }}</p>
      </li>
    </ul>

    <!-- Modal -->
    <EmailModal
      v-if="showModal"
      :email="selectedEmail"
      :recipient="recipient"
      @close="closeModal"
    />
  </div>
</template>

<style scoped>
/* Estilos para el contenedor de correos */
.received-container {
  position: relative; /* Necesario para que el modal sea relativo a este contenedor */
  margin-bottom: 400px; /* Ajusta el valor según el espacio que necesites */
  min-height: 300px; /* Asegura que el contenedor tenga un tamaño mínimo */
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