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

const renderToShadow = () => {
  if (!shadowContainer.value) return;

  const shadow = shadowContainer.value.shadowRoot || shadowContainer.value.attachShadow({ mode: 'open' });

  shadow.innerHTML = `
    <style>
      :host {
        all: initial;
        font-family: sans-serif;
        color: #212529;
      }

      a { color: #0d6efd; text-decoration: none; }
      a:hover { text-decoration: underline; }

      img { max-width: 100%; height: auto; }

      table {
        width: 100%;
        table-layout: auto;
        border-collapse: collapse;
      }

      blockquote {
        border-left: 3px solid #ccc;
        margin-left: 0;
        padding-left: 1rem;
        color: #6c757d;
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

watch(() => sanitizedBody.value, () => {
  renderToShadow();
});

const formattedDate = computed(() => {
  if (!props.email?.receivedAt) return "Fecha desconocida";
  const date = new Date(props.email.receivedAt);
  return new Intl.DateTimeFormat('es-ES', {
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

</script>

<template>
  <div class="container-fluid p-0 position-relative min-vh-50 d-flex flex-column">
    <!-- Tarjeta única -->
    <div class="card shadow-sm rounded-3 bg-white flex-grow-1">
      <!-- Cabecera -->
      <div class="card-body py-3 d-flex align-items-center border-bottom">
        <div class="d-flex align-items-center flex-grow-1">
          <div class="avatar-circle d-flex align-items-center justify-content-center me-3">
            {{ email.sender?.charAt(0).toUpperCase() || "?" }}
          </div>
          <div>
            <h5 class="mb-1 fw-medium">{{ email.sender || "Unknown" }}</h5>
            <p class="text-muted small mb-0">{{ formattedDate }}</p>
          </div>
        </div>
        <div class="d-flex gap-2">
          <!-- Botón de volver -->
          <MaterialButton
            variant="gradient"
            size="sm"
            :style="{
              backgroundColor: '#98FE98',
              borderColor: '#98FE98',
              color: '#344767',
              'box-shadow': '0px 2px 6px rgba(0, 0, 0, 0.3)',
            }"
            class="btn btn-back d-flex align-items-center justify-content-center"
            @click="$emit('back')"
          >
            <span class="material-icons">arrow_back</span>
          </MaterialButton>
          <!-- Botón de eliminar -->
          <MaterialButton
            variant="gradient"
            size="md"
            :style="{
              backgroundColor: '#F28B82',
              borderColor: '#F28B82',
              color: '#344767',
              'box-shadow': '0px 2px 6px rgba(0, 0, 0, 0.3)',
            }"
            class="btn btn-delete d-flex align-items-center justify-content-center"
            @click="deleteEmail"
          >
            <span class="material-icons">delete</span>
          </MaterialButton>
        </div>
      </div>

      <!-- Asunto -->
      <div class="card-body py-3 border-bottom">
        <h4 class="mb-0 fw-medium">{{ email.subject || "(No subject)" }}</h4>
      </div>

      <!-- Contenido del correo -->
      <div class="card-body overflow-auto">
        <div class="email-content" v-html="sanitizedBody"></div>
      </div>
    </div>
  </div>
</template>

<style>
.avatar-circle {
  background-color: #98fe98;
  color: #344767;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  font-weight: 500;
  font-size: 1.1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.min-vh-50 {
  min-height: 50vh;
}

.btn-back {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.btn-back:hover {
  transform: scale(1.1);
}



.btn-delete:hover {
  transform: scale(1.1);
}
</style>
