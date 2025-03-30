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

// Sanitiza el cuerpo del correo y convierte enlaces en clicables
const sanitizedBody = computed(() => {
  if (!props.email?.body) return ""; // Evita errores si body es undefined o null

  // Convierte URLs en enlaces antes de sanitizar
  const transformedBody = props.email.body.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Sanitiza el HTML (permite etiquetas seguras y atributos específicos)
  return DOMPurify.sanitize(transformedBody, {
    ALLOWED_TAGS: [
      "b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li",
      "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code",
      "pre", "span", "img"
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "title", "style"],
  });
});

// Formatea la fecha de recepción usando receivedAt
const formattedDate = computed(() => {
  if (!props.email?.receivedAt) return "Fecha desconocida";

  const date = new Date(props.email.receivedAt);
  return date.toLocaleString(); // Ajusta según el formato deseado
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
          <p class="email-address">{{ email.recipient || "Unknown" }}</p>
        </div>
        <span class="email-date">{{ formattedDate }}</span>      
      </div>

      <!-- Contenido del correo -->
      <div class="email-body">
        <h4 class="email-subject">{{ email.subject || "(No subject)" }}</h4>
        <div class="email-text" v-html="sanitizedBody"></div>
      </div>
    </div>

    <!-- Botón de volver flotante -->
    <button class="back-button" @click="$emit('back')">Back</button>
  </div>
</template>

<style scoped>
/* Contenedor principal que ocupa todo el espacio disponible */
.email-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  position: relative;
}

/* Tarjeta del correo que ocupa el contenedor */
.email-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

/* Encabezado del correo */
.email-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

/* Avatar redondo con inicial */
.avatar {
  background-color: #98fe98;
  color: #344767;
  font-weight: bold;
  font-size: 1.2rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Información del remitente */
.email-info {
  flex-grow: 1;
  margin-left: 10px;
}

.sender-name {
  font-size: 1rem;
  margin: 0;
  font-weight: bold;
}

.email-address {
  font-size: 0.9rem;
  color: gray;
  margin: 0;
}

/* Fecha */
.email-date {
  font-size: 0.9rem;
  color: gray;
}

/* Contenido del correo */
.email-body {
  flex-grow: 1;
  overflow-y: auto;
  margin-top: 10px;
}

.email-subject {
  font-size: 1.2rem;
  font-weight: bold;
}

.email-text {
  font-size: 1rem;
  line-height: 1.5;
}

/* Botón flotante abajo a la derecha */
.back-button {
  font-family: var(--bs-body-font-family);
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: #98fe98;
  color: #344767;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease;
}
</style>
