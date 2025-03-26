<script setup>
const props = defineProps({
  email: {
    type: Object,
    required: true, // El correo es obligatorio
  },
  recipient: {
    type: String,
    required: true, // El recipient es obligatorio
  },
});

const emit = defineEmits(["close"]); // Emitir evento para cerrar el modal
</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <button class="close-button" @click="$emit('close')">×</button>
      <h4>{{ email.subject }}</h4>
      <p><strong>From:</strong> {{ email.sender }}</p>
      <p><strong>To:</strong> {{ recipient }}</p>
      <p><strong>Body:</strong></p>
      <p>{{ email.body }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Estilos para el modal */
.modal {
  position: absolute; /* Relativo al contenedor padre */
  top: 0;
  left: 0;
  width: 100%;
  min-height: 753px;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Fondo semitransparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 90%;
  max-width: 500px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.close-button:hover {
  color: red;
}
</style>