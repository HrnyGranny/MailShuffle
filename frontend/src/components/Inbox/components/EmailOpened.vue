<script setup>
import { computed } from "vue";
import DOMPurify from "dompurify";

const props = defineProps({
  email: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["back"]);

// Configura DOMPurify para preservar más estilos y estructura
DOMPurify.addHook('afterSanitizeAttributes', function(node) {
  // Si el nodo tiene atributos style, preservarlos
  if (node.hasAttribute('style')) {
    // Preservar estilos inline
    node.setAttribute('data-original-style', node.getAttribute('style'));
  }
  
  // Permitir target="_blank" en enlaces pero añadir rel="noopener noreferrer" para seguridad
  if (node.tagName === 'A' && node.hasAttribute('target')) {
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

// Sanitiza el cuerpo del correo y convierte enlaces en clicables
const sanitizedBody = computed(() => {
  if (!props.email?.body) return ""; // Evita errores si body es undefined o null

  // Convierte URLs en enlaces antes de sanitizar
  const transformedBody = props.email.body.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  
  // Añadir un contenedor base para aplicar estilos base
  const wrappedBody = `<div class="email-content-wrapper">${transformedBody}</div>`;

  // Sanitiza el HTML con configuración más permisiva para emails
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
      'rel', 'background'
    ],
    ADD_TAGS: ['style', 'meta'],
    ADD_ATTR: ['target', 'rel'],
    WHOLE_DOCUMENT: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    FORCE_BODY: true
  });
});

// Formatea la fecha de recepción usando receivedAt
const formattedDate = computed(() => {
  if (!props.email?.receivedAt) return "Fecha desconocida";

  const date = new Date(props.email.receivedAt);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
});
</script>

<template>
  <div class="email-container">
    <!-- Tarjeta del correo -->
    <div class="email-card">
      <!-- Encabezado -->
      <div class="email-header">
        <div class="avatar">{{ email.sender?.charAt(0).toUpperCase() || "?" }}</div>
        <div class="email-info">
          <h3 class="sender-name">{{ email.sender || "Unknown" }}</h3>
          <p class="email-date">{{ formattedDate }}</p>
        </div>
      </div>

      <!-- Contenido del correo -->
      <div class="email-body">
        <h4 class="email-subject">{{ email.subject || "(No subject)" }}</h4>
        <div class="email-content" v-html="sanitizedBody"></div>
      </div>
    </div>

    <!-- Botón de volver flotante -->
    <button class="back-button" @click="$emit('back')">
      <span class="material-icons">arrow_back</span>
      <span>Back</span>
    </button>
  </div>
</template>

<style>
/* Contenedor principal que ocupa todo el espacio disponible */
.email-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
  min-height: 350px;
}

/* Tarjeta del correo con estilo Material Design */
.email-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Encabezado del correo con estilo Material Design */
.email-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background-color: #f8f9fa;
}

/* Avatar elevado con inicial */
.avatar {
  background-color: #98fe98;
  color: #344767;
  font-weight: 500;
  font-size: 1.1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-right: 16px;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

/* Información del remitente */
.email-info {
  flex-grow: 1;
}

.sender-name {
  font-size: 1rem;
  margin: 0 0 4px 0;
  font-weight: 500;
  color: #333;
}

.email-date {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
  font-weight: 400;
}

/* Contenido del correo */
.email-body {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
}

.email-subject {
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  margin-top: 0;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

/* Contenido del email renderizado */
.email-content {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #444;
  overflow-wrap: break-word;
  word-break: break-word;
}

/* Botón de volver con efecto de elevación */
.back-button {
  font-family: Roboto, var(--bs-body-font-family);
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: #98fe98;
  color: #344767;
  border: none;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.3px;
}

.back-button:hover {
  background: #7be27b;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.back-button .material-icons {
  font-size: 18px;
}

/* Estilos para el contenido de correo HTML */
.email-content img {
  max-width: 100%;
  height: auto;
}

.email-content a {
  color: #1976d2;
  text-decoration: none;
}

.email-content a:hover {
  text-decoration: underline;
}

.email-content ul, 
.email-content ol {
  padding-left: 20px;
}

.email-content blockquote {
  border-left: 3px solid #ddd;
  padding-left: 16px;
  color: #666;
  margin-left: 0;
}

.email-content table {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}

.email-content table td,
.email-content table th {
  border: 1px solid #ddd;
  padding: 8px;
}

.email-content-wrapper {
  font-family: 'Roboto', Arial, sans-serif;
}

/* Fix para emails enviados desde servicios como Gmail */
.email-content [style*="font-family"] {
  font-family: 'Roboto', Arial, sans-serif !important;
}
</style>