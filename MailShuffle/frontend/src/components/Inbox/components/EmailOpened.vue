<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { deleteEmailById } from "@/api/emailService";
import MaterialButton from "@/material_components/MaterialButton.vue";
import MaterialToast from "@/material_components/MaterialToast.vue";
import { PrismEditor } from "vue-prism-editor";
import "prismjs/themes/prism.css";
import "vue-prism-editor/dist/prismeditor.min.css";
import { useSanitizedBody, renderEmailToShadow } from "@/assets/js/emailParser";
import { formatHTML, highlightCode } from "@/assets/js/codeFormatter";

const props = defineProps({
  email: { type: Object, required: true },
  address: { type: String, required: true },
  apiKey: { type: String, required: true },
});

const emit = defineEmits(["back", "delete"]);

const shadowContainer = ref(null);
const toastRef = ref(null);
const activeTab = ref("html");

const emailRef = computed(() => props.email);
const sanitizedBody = useSanitizedBody(emailRef);
const htmlSourceBody = computed(() => props.email?.body ?? "");
const formattedHtmlSource = computed(() => formatHTML(htmlSourceBody.value));

const renderToShadow = () => {
  if (shadowContainer.value) {
    renderEmailToShadow(shadowContainer.value, sanitizedBody.value);
  }
};

onMounted(renderToShadow);

watch(activeTab, (tab) => {
  if (tab === "html") {
    setTimeout(renderToShadow, 0);
  }
});

watch(sanitizedBody, () => {
  if (activeTab.value === "html") {
    renderToShadow();
  }
});

const formattedDate = computed(() => {
  if (!props.email?.receivedAt) return "Unknown date";
  const date = new Date(props.email.receivedAt);
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
});

const deleteEmail = async () => {
  try {
    if (!props.email?._id || !props.address || !props.apiKey) {
      console.error("Missing required data: email ID, address, or API key is undefined.");
      return;
    }

    await deleteEmailById(props.address, props.apiKey, props.email._id);

    toastRef.value?.showToast({
      title: "Email deleted successfully!",
      type: "success",
      overrides: {
        width: "235px",
      },
    });

    emit("delete", props.email._id);
    emit("back");
  } catch (error) {
    console.error("Error deleting email:", error);

    toastRef.value?.showToast({
      title: "Error deleting email!",
      type: "error",
      overrides: {
        width: "205px",
      },
    });
  }
};

const formattedSender = computed(() => {
  if (!props.email?.sender) return "Unknown";

  const matches = props.email.sender.match(/(.*?)\s*<(.+?)>/);
  if (matches && matches[1]) {
    return matches[1].trim();
  }

  return props.email.sender;
});

const senderEmail = computed(() => {
  if (!props.email?.sender) return "";

  const matches = props.email.sender.match(/<(.+?)>/);
  if (matches && matches[1]) {
    return matches[1];
  }

  if (props.email.sender.includes("@")) {
    return props.email.sender;
  }

  return "";
});

const senderInitials = computed(() => {
  const sender = formattedSender.value;
  if (!sender || sender === "Unknown") return "?";

  const words = sender.split(" ");
  if (words.length > 1) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

  return sender.charAt(0).toUpperCase();
});

const avatarColor = computed(() => {
  const colors = [
    { bg: "#BBDEFB", text: "#1565C0" },
    { bg: "#C8E6C9", text: "#2E7D32" },
    { bg: "#FFECB3", text: "#FF8F00" },
    { bg: "#F8BBD0", text: "#C2185B" },
    { bg: "#D1C4E9", text: "#4527A0" },
    { bg: "#B2EBF2", text: "#00838F" },
    { bg: "#98FE98", text: "#344767" },
  ];

  if (!senderEmail.value) return colors[6];

  const hashCode = senderEmail.value.split("").reduce((acc, char) => {
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
            <!-- Botón Back con Material Icon -->
            <MaterialButton
              size="large"
              alt="Back"
              aria-label="Go back to inbox"
              class="square-btn"
              @click="$emit('back')"
            >
              <i class="material-icons">arrow_back</i>
            </MaterialButton>
            
            <!-- Botón Delete con Material Icon -->
            <MaterialButton
              size="large"
              backgroundColor="#f28b82"
              borderColor="#f28b82"
              alt="Delete"
              aria-label="Delete email"
              class="square-btn"
              @click="deleteEmail"
            >
              <i class="material-icons">delete</i>
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
            <PrismEditor
              :modelValue="formattedHtmlSource"
              :highlight="highlightCode"
              line-numbers
              readonly
              class="code-block"
            />
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

<style scoped>
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
  padding: 0;
}

.code-block {
  background-color: #f8f9fa;
  color: #2c3e50;
  font-family: Consolas, "Fira Mono", Menlo, Courier, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  overflow-y: visible;
  white-space: pre;
}

.code-block :deep(.prism-editor-wrapper) {
  height: auto;
  max-height: none;
  overflow: visible;
  align-items: stretch;
}

.code-block :deep(.prism-editor__container) {
  min-height: 100%;
}

.code-block :deep(.prism-editor__line-numbers) {
  height: auto;
}

.code-block .token.comment,
.code-block .token.prolog,
.code-block .token.doctype,
.code-block .token.cdata {
  color: #94a3b8;
}

.code-block .token.punctuation {
  color: #64748b;
}

.code-block .token.tag,
.code-block .token.constant,
.code-block .token.symbol,
.code-block .token.deleted {
  color: #5e72e4;
}

.code-block .token.attr-name,
.code-block .token.namespace {
  color: #fb6340;
}

.code-block .token.attr-value,
.code-block .token.string,
.code-block .token.char,
.code-block .token.builtin,
.code-block .token.inserted {
  color: #2dce89;
}

.code-block .token.operator,
.code-block .token.entity,
.code-block .token.url,
.code-block .token.variable {
  color: #11cdef;
}

.code-block .token.important,
.code-block .token.keyword,
.code-block .token.selector {
  color: #f5365c;
}

.code-block .token.bold {
  font-weight: 600;
}

.code-block .token.italic {
  font-style: italic;
}

/* Mejora de la experiencia de usuario */
::selection {
  background-color: rgba(152, 254, 152, 0.4);
  color: #344767;
}

/* --- NUEVOS ESTILOS PARA BOTONES CUADRADOS CON MATERIAL ICONS --- */
.square-btn {
  padding: 0 !important;
  width: 48px !important;  /* Ancho para botón "Large" */
  height: 48px !important; /* Alto para botón "Large" */
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
}

.material-icons {
  font-size: 24px;
  line-height: 1;
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
    width: 100%;
    margin-top: 1rem;
  }
  
  .square-btn {
    width: auto !important;
    flex: 1;
    padding: 0 1rem !important;
    border-radius: 0.75rem;
  }
  
}
</style>