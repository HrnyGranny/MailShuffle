<script setup>
import { defineProps, defineEmits } from "vue";
import MaterialButton from "@/material_components/MaterialButton.vue";

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "confirm"]);
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-wrapper">
      <!-- Backdrop -->
      <div class="modal-backdrop" @click="$emit('close')"></div>

      <!-- Modal Container -->
      <div class="modal-container">
        <div class="modal-content">
          
          <!-- Close Button -->
          <button type="button" class="close-btn" @click="$emit('close')" aria-label="Close">
            <i class="material-icons">close</i>
          </button>

          <div class="modal-body text-center">
            
            <!-- Warning Icon -->
            <div class="icon-container mb-3">
              <i class="material-icons warning-icon">warning_amber</i>
            </div>

            <h5 class="modal-title">Are you sure?</h5>
            
            <p class="info-text">
              This will delete the current email address and all associated emails!
            </p>

            <!-- Buttons Row -->
            <div class="buttons-row mt-4">
              <!-- Botón Izquierdo (Cancel) envuelto -->
              <div class="btn-wrapper">
                <MaterialButton
                  label="Cancel"
                  size="medium"
                  class="full-width-btn"
                  @click="$emit('close')"
                />
              </div>
              
              <!-- Botón Derecho (Confirm) envuelto -->
              <div class="btn-wrapper">
                <MaterialButton
                  label="Confirm"
                  size="medium"
                  backgroundColor="#f28b82"
                  borderColor="#f28b82"
                  class="full-width-btn"
                  @click="$emit('confirm')"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
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
  max-width: 380px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  transition: all 0.2s;
  z-index: 10;
  padding: 0;
}

.close-btn:hover {
  background-color: #f5f5f5;
  color: #333;
}

.close-btn .material-icons {
  font-size: 20px;
}

.modal-title {
  margin: 0 0 0.5rem 0;
  font-weight: 700;
  color: #344767;
  font-size: 1.3rem;
}

.info-text {
  text-align: center;
  color: #7b809a;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.icon-container {
  display: flex;
  justify-content: center;
}

.warning-icon {
  font-size: 4rem;
  color: #f44335;
  background: #ffecec;
  border-radius: 50%;
  padding: 10px;
}

/* --- ESTILOS PARA IGUALAR ANCHO DE BOTONES --- */
.buttons-row {
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
}

.btn-wrapper {
  flex: 1;          /* Fuerza que ambos contenedores midan lo mismo */
  display: flex;    /* Asegura que el botón hijo se comporte bien */
}

.full-width-btn {
  width: 100%;      /* El botón ocupa todo el wrapper */
  justify-content: center; /* Centra el texto si usa flex internamente */
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@media (max-width: 400px) {
  .buttons-row {
    flex-direction: column;
  }
  
  .btn-wrapper {
    width: 100%;
  }
}
</style>