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
const loading = ref(false); // Estado de carga
const error = ref(null); // Estado de error
let intervalId = null; // ID del intervalo para consultas periódicas

// Función para obtener correos del backend
const fetchEmails = async () => {
  loading.value = true;
  try {
    const response = await getEmailsByRecipient(props.recipient);
    emails.value = response;
  } catch (err) {
    error.value = "Error fetching emails.";
    console.error(err);
  } finally {
    loading.value = false;
  }
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
    <div v-if="loading">Loading emails...</div>
    <div v-else-if="error">{{ error }}</div>
    <ul v-else>
      <li v-for="email in emails" :key="email.id">
        <strong>{{ email.subject }}</strong> - {{ email.sender }}
        <p>{{ email.body }}</p>
      </li>
    </ul>
  </div>
</template>