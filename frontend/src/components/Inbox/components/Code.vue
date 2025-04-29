<script setup>
import { ref, computed } from "vue";
import Swal from "sweetalert2";

// PrismJS
import { PrismEditor } from "vue-prism-editor";
import "prismjs/themes/prism.css";
import "vue-prism-editor/dist/prismeditor.min.css";
import prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";

// Props
const props = defineProps({ email: String, apiKey: String });

const apiUri = computed(
  () =>
    `http://api.mailshuffle.xyz:3000/api/emails/inbox?email=${props.email}&apiKey=${props.apiKey}`
);

const codeJS = computed(() =>
  `
fetch('${apiUri.value}', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(res => {
  if (!res.ok) throw new Error('Error in server response');
  return res.json();
})
.then(data => {
  console.log('✅ Server response:', data);
})
.catch(err => {
  console.error('❌ Error:', err.message);
});
`.trim()
);

const outputJSON = computed(() =>
  `
[
  {
    "sender": "example1@mail.com",
    "subject": "Welcome to Our Service!",
    "body": "Thank you for signing up for our service. We are excited to have you on board!",
    "receivedAt": "2025-04-12T08:00:00.000Z",
    "_id": "email1"
  },
  {
    "sender": "newsletter@company.com",
    "subject": "Your Weekly Newsletter",
    "body": "Here is your weekly newsletter with the latest updates and news.",
    "receivedAt": "2025-04-12T09:00:00.000Z",
    "_id": "email2"
  }
]
`.trim()
);

const highlightJS = (code) =>
  prism.highlight(code, prism.languages.javascript, "javascript");
const highlightJSON = (code) =>
  prism.highlight(code, prism.languages.json, "json");

// Función copiar
const copy = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    Swal.fire({
      toast: true,
      position: "bottom-start",
      title: "Copied!",
      color: "#3a526a",
      background: "#98fe9857",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
      didOpen: (popup) => {
        popup.style.width = "95px";
        popup.style.padding = "5px";
        popup.style.borderRadius = "10px"; // redondeo
      },
    });
  } catch {
    Swal.fire({
      toast: true,
      position: "bottom-start",
      title: "An error occurred!",
      color: "#3a526a",
      background: "#b9424261",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
      didOpen: (popup) => {
        popup.style.width = "200px";
        popup.style.padding = "5px";
        popup.style.borderRadius = "10px"; // redondeo
      },
    });
  }
};
</script>

<template>
  <div class="code-container mt-4 px-3">
    <!-- API URI box -->
    <div class="bg-white rounded shadow-sm p-3 border position-relative mb-4">
      <small class="text-muted">API URI</small>
      <div class="text-break text-dark">{{ apiUri }}</div>
      <button class="copy-btn" @click="copy(apiUri)">Copy</button>
    </div>

    <!-- 2 columns: code + output -->
    <div class="row g-4">
      <!-- Left: Code block -->
      <div class="col-md-6">
        <div
          class="bg-white rounded shadow-sm p-3 border position-relative h-100"
        >
          <small class="text-muted">API Call (JavaScript)</small>
          <button class="copy-btn" @click="copy(codeJS)">Copy</button>
          <PrismEditor
            :modelValue="codeJS"
            :highlight="highlightJS"
            line-numbers
            readonly
            class="code-block mt-2"
          />
        </div>
      </div>

      <!-- Right: Output -->
      <div class="col-md-6">
        <div
          class="bg-white rounded shadow-sm p-3 border position-relative h-100"
        >
          <small class="text-muted">Expected Output (JSON)</small>
          <button class="copy-btn" @click="copy(outputJSON)">Copy</button>
          <PrismEditor
            :modelValue="outputJSON"
            :highlight="highlightJSON"
            line-numbers
            readonly
            class="code-block mt-2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-block {
  background-color: #f8f9fa; /* Fondo gris claro para resaltar el código */
  color: #2c3e50;
  font-family: Consolas, Fira Mono, Menlo, Courier, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  white-space: pre;
  height: 100%; /* Asegura que ocupe toda la altura disponible dentro del contenedor */
  overflow-y: auto; /* Si el contenido es más grande que el contenedor, se habilita el scroll */
}

.copy-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: transparent;
  border: none;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  color: #5e72e4;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0.375rem;
}

.copy-btn:hover {
  background-color: #f0f0f0;
}

/* Asegurar que ambas cajas tengan la misma altura */
.row > .col-md-6 {
  display: flex;
  flex-direction: column;
}

.row > .col-md-6 > .bg-white {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
