<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { deleteEmailById } from "@/api/emailService"; // API
import MaterialButton from "@/material_components/MaterialButton.vue";
import MaterialToast from "@/material_components/MaterialToast.vue";
import { useSanitizedBody, usePlainTextBody, renderEmailToShadow } from "@/assets/js/emailParser";

// icon
import GoBack from "../../../assets/img/iconos/goback.png";
import Delete from "../../../assets/img/iconos/delete.png";

const props = defineProps({
  email: {
    type: Object,
    required: true, // Objeto de correo que se esta manejando
  },
  address: {
    type: String,
    required: true, // Dirección de correo
  },
  apiKey: {
    type: String,
    required: true, // API key
  },
});

const emit = defineEmits(["back", "delete"]);

const shadowContainer = ref(null);
const toastRef = ref(null);
const activeTab = ref('html'); // Por defecto la pestaña HTML está activa

// Convert props.email to a ref so we can use it with our composables
const emailRef = computed(() => props.email);

// Use the composables from our utility file
const sanitizedBody = useSanitizedBody(emailRef);
const plainTextBody = usePlainTextBody(emailRef);

const renderToShadow = () => {
  renderEmailToShadow(shadowContainer.value, sanitizedBody.value);
};

onMounted(() => {
  renderToShadow();
});

// Re-renderizar el shadow DOM cuando se cambia entre pestañas
watch(() => activeTab.value, (newValue) => {
  if (newValue === 'html') {
    // Pequeño timeout para asegurar que el DOM está listo
    setTimeout(() => {
      renderToShadow();
    }, 0);
  }
});

// También re-renderizar cuando cambia el contenido
watch(() => sanitizedBody.value, () => {
  if (activeTab.value === 'html') {
    renderToShadow();
  }
});

const formattedDate = computed(() => {
  if (!props.email?.receivedAt) return "Unknown date";
  const date = new Date(props.email.receivedAt);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(date);
});

// Eliminar un correo específico
const deleteEmail = async () => {
  try {
    // Validar que las props necesarias estén definidas
    if (!props.email?._id || !props.address || !props.apiKey) {
      console.error("Missing required data: email ID, address, or API key is undefined.");
      return;
    }

    console.log("Deleting email with ID:", props.email._id, "Address:", props.address, "API Key:", props.apiKey);

    // Llamar a la API para eliminar el correo
    await deleteEmailById(props.address, props.apiKey, props.email._id);

    // Mostrar alerta de éxito al eliminar
    toastRef.value?.showToast({
      title: "Email deleted successfully!",
      type: "success",
      overrides: {
        width: "250px",
      },
    });

    // Emitir evento de eliminación para notificar al componente padre
    emit("delete", props.email._id);
    // Emitir evento de volver para cerrar la vista del correo
    emit("back");
  } catch (error) {
    console.error("Error deleting email:", error);

    // Mostrar alerta de error
    toastRef.value?.showToast({
      title: "Error deleting email!",
      type: "error",
      overrides: {
        width: "205px",
      },
    });
  }
};

// Formatear el remitente del correo
const formattedSender = computed(() => {
  if (!props.email?.sender) return "Unknown";
  
  // Intentar extraer el nombre si tiene formato "Nombre <correo@ejemplo.com>"
  const matches = props.email.sender.match(/(.*?)\s*<(.+?)>/);
  if (matches && matches[1]) {
    return matches[1].trim();
  }
  
  return props.email.sender;
});

// Obtener el email del remitente
const senderEmail = computed(() => {
  if (!props.email?.sender) return "";
  
  const matches = props.email.sender.match(/<(.+?)>/);
  if (matches && matches[1]) {
    return matches[1];
  }
  
  // Si no hay formato <email>, devolver el sender completo si parece un email
  if (props.email.sender.includes('@')) {
    return props.email.sender;
  }
  
  return "";
});

// Obtener iniciales para el avatar
const senderInitials = computed(() => {
  const sender = formattedSender.value;
  if (!sender || sender === "Unknown") return "?";
  
  // Si hay espacios, tomar la primera letra de cada palabra (máximo 2)
  const words = sender.split(' ');
  if (words.length > 1) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }
  
  // Si es una sola palabra, tomar la primera letra
  return sender.charAt(0).toUpperCase();
});

// Color aleatorio consistente basado en el email del remitente
const avatarColor = computed(() => {
  const colors = [
    { bg: '#BBDEFB', text: '#1565C0' }, // Blue
    { bg: '#C8E6C9', text: '#2E7D32' }, // Green
    { bg: '#FFECB3', text: '#FF8F00' }, // Yellow
    { bg: '#F8BBD0', text: '#C2185B' }, // Pink
    { bg: '#D1C4E9', text: '#4527A0' }, // Purple
    { bg: '#B2EBF2', text: '#00838F' }, // Cyan
    { bg: '#98FE98', text: '#344767' }, // Original Green
  ];
  
  // Si no hay email, usar el color original
  if (!senderEmail.value) return colors[6];
  
  // Generar índice basado en la dirección de correo
  const hashCode = senderEmail.value.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const index = Math.abs(hashCode) % colors.length;
  return colors[index];
});
</script>

<template>
  <div class="container-fluid p-0 position-relative min-vh-50 d-flex flex-column email-opened">
    <MaterialToast ref="toastRef" />
    <!-- Contenedor principal con efecto de elevación -->
    <div class="card border-0 shadow-lg rounded-4 bg-white flex-grow-1 overflow-hidden animate__animated animate__fadeIn">
      <!-- Cabecera con información del remitente -->
      <div class="card-header bg-white py-4 px-4 border-0 border-bottom border-light">
        <div class="d-flex flex-column flex-md-row justify-content-between gap-3 align-items-start align-items-md-center">
          <!-- Sección izquierda: Avatar e información del asunto (reemplazando al remitente) -->
          <div class="d-flex align-items-start w-100">
            <div
              class="avatar-circle flex-shrink-0 me-3"
              :style="{ backgroundColor: avatarColor.bg, color: avatarColor.text }"
            >
              {{ senderInitials }}
            </div>
            <div class="overflow-hidden flex-grow-1">
              <!-- Asunto reemplaza completamente al remitente -->
              <h5 class="mb-1 fw-semibold text-truncate email-subject">
                {{ email.subject || "(No subject)" }}
              </h5>

              <div class="d-flex flex-column flex-sm-row align-items-sm-center gap-2">
                <p
                  v-if="senderEmail"
                  class="text-muted small mb-0 text-truncate email-sender"
                >
                  <i class="bi bi-envelope-fill me-1 small"></i>{{ senderEmail }}
                </p>
                <span v-if="senderEmail" class="text-muted d-none d-sm-inline">•</span>
                <p class="text-muted small mb-0">
                  <i class="bi bi-clock me-1 small"></i>{{ formattedDate }}
                </p>
              </div>
            </div>
          </div>

          <!-- Sección derecha: Botones de acción -->
          <div class="d-flex gap-2 flex-shrink-0">
            <MaterialButton
              size="large"
              :icon="GoBack"
              alt="Back"
              aria-label="Go back to inbox"
              @click="$emit('back')"
            />
            <MaterialButton
              :icon="Delete"
              backgroundColor="#f28b82"
              borderColor="#f28b82"
              textColor="#ffffff"
              alt="Delete"
              aria-label="Delete email"
              @click="deleteEmail"
            />
          </div>
        </div>
      </div>

      <!-- Contenedor del contenido del correo - Sin scroll, expandible -->
      <div class="card-body p-0">
        <!-- Pestañas para ver formato HTML o texto plano -->
        <ul class="nav nav-tabs px-4 pt-2 border-0">
          <li class="nav-item">
            <a class="nav-link" :class="{ active: activeTab === 'html' }" 
               href="#" 
               @click.prevent="activeTab = 'html'" 
               aria-current="page">
              <i class="bi bi-file-richtext me-1"></i>HTML
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: activeTab === 'plain' }" 
               href="#" 
               @click.prevent="activeTab = 'plain'">
              <i class="bi bi-file-text me-1"></i>Plain Text
            </a>
          </li>
        </ul>
        
        <!-- Contenido del correo sin restricción de altura -->
        <div class="email-content-container p-4">
          <!-- Placeholder cuando no hay contenido -->
          <div v-if="!email.body" class="text-center py-5 text-muted">
            <i class="bi bi-envelope-x display-1 mb-3 d-block opacity-50"></i>
            <p>This email has no content to display.</p>
          </div>
          
          <!-- Contenido del email en Shadow DOM (HTML) -->
          <div v-else-if="activeTab === 'html'" ref="shadowContainer" class="w-100"></div>
          
          <!-- Contenido del email en texto plano -->
          <div v-else-if="activeTab === 'plain'" class="w-100 plain-text-content">
            <pre class="text-content">{{ plainTextBody }}</pre>
          </div>
        </div>
        
        <!-- Barra inferior con información sin botón de responder -->
        <div class="email-footer d-flex justify-content-center align-items-center px-4 py-3 border-top bg-light">
          <div>
            <span class="text-muted small">
              <i class="bi bi-shield-check me-1"></i>Secure content rendered with protection
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Estilos para el header y otros elementos */
.avatar-circle {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.8);
  transition: transform 0.2s ease;
}

.avatar-circle:hover {
  transform: scale(1.05);
}

.email-opened .btn-action {
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem;
}

.email-opened .btn-action .material-icons {
  font-size: 1.1rem;
}

.email-opened .email-subject {
  max-width: 100%;
}

.email-opened .email-sender {
  max-width: 320px;
}

.nav-tabs .nav-link.active {
  font-weight: 500;
  color: #344767;
  border-color: #dee2e6 #dee2e6 #fff;
}

.nav-tabs .nav-link {
  color: #6c757d;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  cursor: pointer;
}

.nav-tabs .nav-link:hover:not(.active) {
  background-color: rgba(0,0,0,0.02);
  border-color: transparent;
  color: #344737;
}

.card {
  transition: box-shadow 0.3s ease;
}

.email-content-container {
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f8f9fa' fill-opacity='0.6'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  min-height: 315px; /* Altura mínima para el contenido */
}

/* Estilos para texto plano */
.plain-text-content {
  padding: 1rem;
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  background-color: #f8f9fa;
  border-radius: 0.25rem;
}

.text-content {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 0.9rem;
  color: #212529;
  margin: 0;
  padding: 1rem;
  background: transparent;
  border: none;
  font-family: inherit;
}

/* Mejora de la experiencia de usuario */
::selection {
  background-color: rgba(152, 254, 152, 0.4);
  color: #344767;
}

@media (max-width: 768px) {
  
  .email-opened .avatar-circle {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
  
  .email-opened .btn-action {
    width: 38px;
    height: 38px;
  }

  .email-opened .card-header .d-flex.flex-column {
    align-items: stretch !important;
  }

  .email-opened .email-sender {
    max-width: 100%;
  }

  .email-opened .card-header .d-flex.gap-2 {
    align-self: flex-end;
  }
}

@media (max-width: 576px) {
  .email-opened .card-header .d-flex.align-items-start {
    flex-wrap: wrap;
  }

  .email-opened .card-header .d-flex.align-items-start > .avatar-circle {
    margin-bottom: 0.5rem;
  }

  .email-opened .card-header .d-flex.flex-column.flex-sm-row {
    align-items: flex-start !important;
  }

  .email-opened .card-header .d-flex.gap-2 {
    align-self: flex-end;
  }
}
</style>