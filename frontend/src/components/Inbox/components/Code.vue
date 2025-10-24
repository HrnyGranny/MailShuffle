<script setup>
import { computed, ref } from "vue";
import MaterialToast from "@/material_components/MaterialToast.vue";
import MaterialButton from "@/material_components/MaterialButton.vue";
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
      <div class="text-break text-dark">{{ apiUri }}</div>
      <MaterialButton
        class="copy-btn"
        size="tiny"
        :icon="CopyIcon"
        icon-alt="Copy"
        aria-label="Copy API URI"
        @click="copy(apiUri)"
      />
    </div>

    <!-- 2 columns: code + output -->
    <div class="row g-4">
      <!-- Left: Code block -->
      <div class="col-md-6">
        <div
          class="bg-white rounded shadow-sm p-3 border position-relative h-100"
        >
          <small class="text-muted">API Call (JavaScript)</small>
          <MaterialButton
            class="copy-btn"
            size="tiny"
            :icon="CopyIcon"
            icon-alt="Copy"
            aria-label="Copy JavaScript snippet"
            @click="copy(codeJS)"
          />
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
          <MaterialButton
            class="copy-btn"
            size="tiny"
            :icon="CopyIcon"
            icon-alt="Copy"
            aria-label="Copy JSON output"
            @click="copy(outputJSON)"
          />
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
  top: 0.55rem;
  right: 0.55rem;
  --button-bg: rgba(94, 114, 228, 0.08);
}

.copy-btn :deep(.custom-button__icon) {
  width: 18px;
  height: 18px;
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
