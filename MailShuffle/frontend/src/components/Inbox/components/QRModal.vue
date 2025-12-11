<script setup>
import { defineProps, defineEmits, ref, computed } from "vue";
import MaterialInput from "@/material_components/MaterialInput.vue";
import MaterialToast from "@/material_components/MaterialToast.vue";

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

// Estado del toggle
const isReadOnly = ref(false);
const toastRef = ref(null); 

// Computed para el link simulado
const shareLink = computed(() => {
  return `https://7dMail.tech/share/xyz123${isReadOnly.value ? '?readonly=true' : ''}`;
});

const close = () => {
  emit("close");
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value);
    
    toastRef.value?.showToast({
      title: "Share link copied!",
      type: "success",
      overrides: {
        width: "170px",
      },
    });
  } catch (err) {
    console.error("Failed to copy: ", err);
    toastRef.value?.showToast({
      title: "Failed to copy link",
      type: "error",
    });
  }
};
</script>

<template>
  <Teleport to="body">
    <MaterialToast ref="toastRef" class="toast-layer" />
  </Teleport>

  <Teleport to="body">
    <div v-if="show" class="modal-wrapper">
      <!-- Backdrop -->
      <div class="modal-backdrop" @click="close"></div>

      <!-- Contenedor del Modal -->
      <div class="modal-container">
        <div class="modal-content">
          <!-- Botón de cerrar -->
          <button type="button" class="close-btn" @click="close" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>

          <div class="modal-body">
            <h5 class="modal-title">Share Inbox Access</h5>

            <!-- 1. QR Code -->
            <div class="qr-container">
              <img 
                :src="`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=ShareAccess:${isReadOnly ? 'ReadOnly' : 'Full'}`" 
                alt="QR Code" 
                class="qr-image"
              />
            </div>

            <!-- 2. Toggle Switch -->
            <div class="toggle-container">
              <label class="switch">
                <input type="checkbox" v-model="isReadOnly">
                <span class="slider round"></span>
              </label>
              <span class="toggle-label">Read Only</span>
            </div>
            
            <p class="info-text">
              {{ isReadOnly 
                ? 'User can only view emails.' 
                : 'User can view, delete and generate new emails.' }}
            </p>

            <!-- 3. Input Box con botón Copy integrado -->
            <div class="input-container mt-4">
              <!-- Eliminado el div wrapper extra para que funcione el Flexbox nativo -->
              <MaterialInput
                class="input-group-outline"
                type="text"
                v-model="shareLink"
                readonly
              >
                <template #append>
                  <button 
                    class="btn btn-clipboard mb-0" 
                    type="button" 
                    @click="copyLink"
                    title="Copy link"
                  >
                    <i class="material-icons">content_copy</i>
                  </button>
                </template>
              </MaterialInput>
            </div>

          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 11000;
}

.toast-layer :deep(.material-toast) {
  z-index: 11001 !important;
}

.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal-container {
  position: relative;
  z-index: 1001;
  width: 90%;
  max-width: 350px;
  margin: auto;
}

.modal-content {
  background: white;
  border-radius: 15px;
  padding: 2rem 1.5rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  width: 100%;
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  color: #777;
  font-size: 1.1rem;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  z-index: 10;
  padding: 0;
}

.close-btn:hover {
  background-color: #f5f5f5;
  color: #333;
}

.modal-title {
  margin: 0 0 1.5rem 0;
  font-weight: 700;
  color: #344767;
  text-align: center;
  font-size: 1.3rem;
}

.qr-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.qr-image {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 10px;
  width: 180px;
  height: 180px;
}

/* --- Toggle Switch --- */
.toggle-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 0.5rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 46px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #98fe98;
}

input:focus + .slider {
  box-shadow: 0 0 1px #98fe98;
}

input:checked + .slider:before {
  transform: translateX(22px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.toggle-label {
  font-weight: 600;
  color: #344767;
  font-size: 0.95rem;
  position: relative;
  top: -4px; 
}

.info-text {
  text-align: center;
  color: #7b809a;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  min-height: 1.2em;
}

/* --- CORRECCIÓN FINAL: Uso de Flexbox natural (igual que MailBox.vue) --- */
.btn-clipboard {
  z-index: 4;
  border: 1px solid #d2d6da;
  border-left: none;
  background-color: transparent;
  padding: 0 12px;
  border-top-right-radius: 0.375rem !important;
  border-bottom-right-radius: 0.375rem !important;
  color: #777;
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Eliminamos height: 100% y position: absolute para confiar en el flex del input-group */
}

.btn-clipboard:hover {
  background-color: #f5f5f5;
  color: #333;
  border-color: #d2d6da;
}

.btn-clipboard:focus,
.btn-clipboard:active {
  box-shadow: none !important;
  outline: none !important;
  border-color: #d2d6da !important;
}

.btn-clipboard .material-icons {
  font-size: 20px; 
}

.input-container :deep(.input-group) {
  margin-bottom: 0; 
  /* Asegurar que flex funcione si el componente hijo lo usa */
  display: flex; 
  align-items: stretch;
}

@keyframes popIn {
  from { 
    opacity: 0; 
    transform: scale(0.9); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
}

:global(.swal2-container) {
  z-index: 12000 !important;
}
</style>