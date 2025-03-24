<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { getEmailsByRecipient } from "@/api/emailService";

const props = defineProps({
  recipient: {
    type: String,
    required: true, // El recipient es obligatorio
  },
});

const emails = ref([]); // Lista de correos
const error = ref(null); // Estado de error
let intervalId = null; // ID del intervalo para consultas periódicas

const selectedEmail = ref(null); // Correo seleccionado para mostrar en el modal
const showModal = ref(false); // Estado del modal (abierto o cerrado)

// Función para obtener correos del backend
const fetchEmails = async () => {
  try {
    const response = await getEmailsByRecipient(props.recipient);
    emails.value = response; // Actualizar la lista de correos
  } catch (err) {
    error.value = "Error fetching emails.";
    console.error(err);
  }
};

// Función para abrir el modal con la información del correo seleccionado
const openModal = (email) => {
  selectedEmail.value = email;
  showModal.value = true;
};

// Función para cerrar el modal
const closeModal = () => {
  showModal.value = false;
  selectedEmail.value = null;
};

// Configurar consultas periódicas
onMounted(() => {
  fetchEmails(); // Obtener correos al montar el componente
  intervalId = setInterval(fetchEmails, 5000); // Consultar cada 5 segundos
});

// Limpiar el intervalo al desmontar el componente
onUnmounted(() => {
  clearInterval(intervalId);
});

// Reactualizar correos si cambia el recipient
watch(() => props.recipient, fetchEmails);
</script>

<template>
  <div>
    <h3>Received Emails for {{ recipient }}</h3>
    <div v-if="error">{{ error }}</div>
    <ul>
      <li v-for="email in emails" :key="email.id" @click="openModal(email)">
        <strong>{{ email.subject }}</strong> - {{ email.sender }}
        <p>{{ email.body }}</p>
      </li>
    </ul>

    <!-- Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <button class="close-button" @click="closeModal">×</button>
        <h4>{{ selectedEmail.subject }}</h4>
        <p><strong>From:</strong> {{ selectedEmail.sender }}</p>
        <p><strong>To:</strong> {{ recipient }}</p>
        <p><strong>Body:</strong></p>
        <p>{{ selectedEmail.body }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos para la lista de correos */
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

/* Estilos para el modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 90%;
  max-width: 500px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.close-button:hover {
  color: red;
}
</style>