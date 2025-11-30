<script setup>
import { computed, ref } from "vue";
import MaterialToast from "@/material_components/MaterialToast.vue";
// Eliminamos MaterialButton ya que usaremos botones nativos para el estilo "icon-only"
import { buildApiUri, buildCodeSnippet, getSampleOutput } from "@/assets/js/code";
import CopyIcon from "@/assets/img/iconos/copiar.png";

// PrismJS
import { PrismEditor } from "vue-prism-editor";
import "prismjs/themes/prism.css";
import "vue-prism-editor/dist/prismeditor.min.css";
import prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";

// Props
const props = defineProps({ email: String, apiKey: String });
const toastRef = ref(null);

const apiUri = computed(() => buildApiUri(props.email, props.apiKey));

const codeJS = computed(() => buildCodeSnippet(apiUri.value));

const outputJSON = computed(() => getSampleOutput());

const highlightJS = (code) =>
  prism.highlight(code, prism.languages.javascript, "javascript");
const highlightJSON = (code) =>
  prism.highlight(code, prism.languages.json, "json");

// Función copiar
const copy = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    toastRef.value?.showToast({
      title: "Copied!",
      type: "success",
      overrides: {
        width: "95px",
      },
    });
  } catch {
    toastRef.value?.showToast({
      title: "An error occurred!",
      type: "error",
      overrides: {
        width: "200px",
      },
    });
  }
};
</script>

<template>
  <div class="code-container mt-4 px-3">
    <MaterialToast ref="toastRef" />
    
    <!-- API URI box -->
    <div class="bg-white rounded shadow-sm p-3 border position-relative mb-4">
      <small class="text-muted">API URI</small>
      <div class="text-break text-dark pe-5">{{ apiUri }}</div>
      
      <!-- Botón estilo integrado -->
      <button 
        class="btn btn-clipboard" 
        type="button" 
        @click="copy(apiUri)"
        title="Copy API URI"
      >
        <img :src="CopyIcon" alt="Copy" class="action-icon" />
      </button>
    </div>

    <!-- 2 columns: code + output -->
    <div class="row g-4">
      <!-- Left: Code block -->
      <div class="col-md-6">
        <div
          class="bg-white rounded shadow-sm p-3 border position-relative h-100"
        >
          <small class="text-muted">API Call (JavaScript)</small>
          
          <!-- Botón estilo integrado -->
          <button 
            class="btn btn-clipboard" 
            type="button" 
            @click="copy(codeJS)"
            title="Copy JavaScript snippet"
          >
            <img :src="CopyIcon" alt="Copy" class="action-icon" />
          </button>

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
          
          <!-- Botón estilo integrado -->
          <button 
            class="btn btn-clipboard" 
            type="button" 
            @click="copy(outputJSON)"
            title="Copy JSON output"
          >
            <img :src="CopyIcon" alt="Copy" class="action-icon" />
          </button>

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
  background-color: #f8f9fa;
  color: #2c3e50;
  font-family: Consolas, Fira Mono, Menlo, Courier, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  white-space: pre;
  height: 100%;
  overflow-y: auto;
}

/* --- Estilos unificados para el botón de copiar (igual que en EmailGenerator) --- */
.btn-clipboard {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
  
  border: none; /* Sin borde en las cards queda más limpio, o puedes poner 1px solid transparent */
  background-color: transparent;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
}

.btn-clipboard:focus,
.btn-clipboard:active {
  box-shadow: none !important;
  outline: none !important;
  background-color: rgba(0, 0, 0, 0.05) !important; /* Feedback visual sutil al clickar */
}

@media (hover: hover) {
  .btn-clipboard:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.action-icon {
  width: 20px;
  height: 20px;
  opacity: 0.6;
  transition: transform 0.2s, opacity 0.2s;
}

.btn-clipboard:hover .action-icon {
  opacity: 1;
  transform: scale(1.1);
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

/* Ajuste para que el texto no se monte sobre el botón en la caja de URI */
.pe-5 {
  padding-right: 3rem !important;
}
</style>