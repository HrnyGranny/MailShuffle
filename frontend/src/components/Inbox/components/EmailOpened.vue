<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { deleteEmailById } from "@/api/emailService"; // API
import DOMPurify from "dompurify"
import MaterialButton from "@/material_components/MaterialButton.vue";
import Swal from "sweetalert2";


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
const activeTab = ref('html'); // Por defecto la pestaña HTML está activa

// Configura DOMPurify
DOMPurify.addHook("afterSanitizeAttributes", function (node) {
  if (node.tagName === "A") {
    if (node.hasAttribute("target")) {
      node.setAttribute("rel", "noopener noreferrer");
    } else {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
  }

  if (node.tagName === "IMG") {
    if (!node.hasAttribute("alt")) {
      node.setAttribute("alt", "Email image");
    }
    node.classList.add("img-fluid");
  }

  if (node.tagName === "TABLE") {
    node.classList.add("table");
  }
});

// Sanitiza el HTML del correo
const sanitizedBody = computed(() => {
  if (!props.email?.body) return "";

  const wrappedBody = `<div class="email-content-wrapper">${props.email.body}</div>`;

  return DOMPurify.sanitize(wrappedBody, {
    ALLOWED_TAGS: [
      'a', 'b', 'blockquote', 'br', 'caption', 'code', 'div', 'em',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img', 'li',
      'nl', 'ol', 'p', 'pre', 'span', 'strike', 'strong', 'sub',
      'sup', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'u', 'ul',
      'font', 'center', 'style', 'section', 'article', 'header', 'footer'
    ],
    ALLOWED_ATTR: [
      'align', 'alt', 'bgcolor', 'border', 'cellpadding', 'cellspacing',
      'class', 'color', 'colspan', 'data-*', 'dir', 'height', 'href',
      'id', 'lang', 'name', 'rowspan', 'scope', 'size', 'span', 'src',
      'start', 'style', 'target', 'title', 'type', 'valign', 'width',
      'rel', 'background', 'role', 'aria-*'
    ],
    ADD_TAGS: ['style', 'meta'],
    ADD_ATTR: ['target', 'rel'],
    WHOLE_DOCUMENT: false,
    RETURN_DOM: false,
    FORCE_BODY: true,
    ALLOW_DATA_ATTR: true,
  });
});

// Obtener texto plano del email
const plainTextBody = computed(() => {
  if (!props.email?.body) return "";
  
  // Crear un elemento temporal para extraer el texto
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = props.email.body;
  
  // Reemplazar <br> y párrafos con saltos de línea
  const html = tempDiv.innerHTML;
  const text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<li>/gi, '• ');
  
  // Eliminar todas las demás etiquetas HTML pero mantener su contenido
  tempDiv.innerHTML = text;
  return tempDiv.textContent || tempDiv.innerText || "";
});

const renderToShadow = () => {
  if (!shadowContainer.value) return;

  const shadow = shadowContainer.value.shadowRoot || shadowContainer.value.attachShadow({ mode: 'open' });

  shadow.innerHTML = `
    <style>
      :host {
        all: initial;
        font-family: var(--bs-font-sans-serif);
        color: #212529;
        line-height: 1.5;
      }

      a { 
        color: #0d6efd; 
        text-decoration: none;
        transition: color 0.2s ease;
      }
      a:hover { 
        text-decoration: underline;
        color: #0a58ca;
      }

      img { 
        max-width: 100%; 
        height: auto; 
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }

      table {
        width: 100%;
        table-layout: auto;
        border-collapse: collapse;
        margin-bottom: 1rem;
        border-radius: 4px;
        overflow: hidden;
      }

      th, td {
        padding: 0.75rem;
        vertical-align: top;
        border-top: 1px solid #dee2e6;
      }

      thead th {
        vertical-align: bottom;
        border-bottom: 2px solid #dee2e6;
        background-color: rgba(0,0,0,0.02);
      }

      blockquote {
        border-left: 4px solid #98fe98;
        margin-left: 0;
        padding: 0.5rem 0 0.5rem 1rem;
        color: #495057;
        background-color: rgba(152, 254, 152, 0.05);
        border-radius: 0 4px 4px 0;
      }

      code {
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.875em;
        color: #d63384;
        padding: 0.2em 0.4em;
        background-color: rgba(0,0,0,0.05);
        border-radius: 3px;
      }

      pre {
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        padding: 1rem;
        margin-bottom: 1rem;
        background-color: #f8f9fa;
        border-radius: 4px;
        overflow: auto;
      }

      h1, h2, h3, h4, h5, h6 {
        margin-top: 0;
        margin-bottom: 0.5rem;
        font-weight: 500;
        line-height: 1.2;
        color: #212529;
      }

      p {
        margin-top: 0;
        margin-bottom: 1rem;
      }

      ul, ol {
        padding-left: 2rem;
        margin-top: 0;
        margin-bottom: 1rem;
      }

      hr {
        margin: 1.5rem 0;
        color: #dee2e6;
        opacity: 0.25;
      }

      .email-content-wrapper * {
        max-width: 100%;
        box-sizing: border-box;
      }

      [style*="background-image"] {
        background-size: cover !important;
        background-position: center !important;
      }
    </style>
    ${sanitizedBody.value}
  `;
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
    Swal.fire({
      toast: true,
      position: "bottom-start",
      title: "Email deleted successfully!",
      color: "#3a526a",
      background: "#98fe9857",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
      didOpen: (popup) => {
        popup.style.width = "250px";
        popup.style.padding = "5px";
        popup.style.borderRadius = "10px"; // redondeo
      },
    });

    // Emitir evento de eliminación para notificar al componente padre
    emit("delete", props.email._id);
    // Emitir evento de volver para cerrar la vista del correo
    emit("back");
  } catch (error) {
    console.error("Error deleting email:", error);

    // Mostrar alerta de error
    Swal.fire({
      toast: true,
      position: "bottom-start",
      title: "Error deleting email!",
      color: "#3a526a",
      background: "#b9424261",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
      didOpen: (popup) => {
        popup.style.width = "205px";
        popup.style.padding = "5px";
        popup.style.borderRadius = "10px"; // redondeo
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
  <div class="container-fluid p-0 position-relative min-vh-50 d-flex flex-column">
    <!-- Contenedor principal con efecto de elevación -->
    <div class="card border-0 shadow-lg rounded-4 bg-white flex-grow-1 overflow-hidden animate__animated animate__fadeIn">
      <!-- Cabecera con información del remitente -->
      <div class="card-header bg-white py-4 px-4 border-0 border-bottom border-light">
        <div class="d-flex justify-content-between align-items-start">
          <!-- Sección izquierda: Avatar e información del asunto (reemplazando al remitente) -->
          <div class="d-flex">
            <div class="avatar-circle flex-shrink-0 me-3" 
                :style="{backgroundColor: avatarColor.bg, color: avatarColor.text}">
              {{ senderInitials }}
            </div>
            <div class="overflow-hidden">
              <!-- Asunto reemplaza completamente al remitente -->
              <h5 class="mb-1 fw-semibold text-truncate" style="max-width: 280px;">
                {{ email.subject || "(No subject)" }}
              </h5>
              
              <div class="d-flex align-items-center gap-2">
                <p v-if="senderEmail" class="text-muted small mb-0 text-truncate" style="max-width: 220px;">
                  <i class="bi bi-envelope-fill me-1 small"></i>{{ senderEmail }}
                </p>
                <span v-if="senderEmail" class="text-muted mx-1">•</span>
                <p class="text-muted small mb-0">
                  <i class="bi bi-clock me-1 small"></i>{{ formattedDate }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Sección derecha: Botones de acción -->
          <div class="d-flex gap-2">
            <!-- Botón de volver -->
            <MaterialButton
              variant="gradient"
              size="sm"
              :style="{
                backgroundColor: '#98FE98',
                borderColor: '#98FE98',
                color: '#344767',
                boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
              }"
              class="btn-action btn-back d-flex align-items-center justify-content-center"
              @click="$emit('back')"
              aria-label="Back"
            >
              <span class="material-icons">arrow_back</span>
            </MaterialButton>
            
            <!-- Botón de eliminar -->
            <MaterialButton
              variant="gradient"
              size="lg"
              :style="{
                backgroundColor: '#F28B82',
                borderColor: '#F28B82',
                color: '#344767',
                boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
              }"
              class="btn-action btn-delete d-flex align-items-center justify-content-center"
              @click="deleteEmail"
              aria-label="Delete email"
            >
              <span class="material-icons">delete</span>
            </MaterialButton>
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
/* Importar Bootstrap Icons si no está incluido globalmente */
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");

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

.btn-action {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
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
  .avatar-circle {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
  
  .btn-action {
    width: 36px;
    height: 36px;
  }
}
</style>