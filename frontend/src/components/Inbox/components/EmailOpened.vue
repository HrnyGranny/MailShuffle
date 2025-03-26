<script setup>
const props = defineProps({
  email: {
    type: Object,
    required: true, // El correo es obligatorio
  },
});

const emit = defineEmits(["back"]); // Emitir evento para volver a la lista de correos
</script>

<template>
  <div class="email-opened">
    <button class="back-button" @click="$emit('back')">← Back</button>
    <h4>{{ email.subject }}</h4>
    <p><strong>From:</strong> {{ email.sender }}</p>
    <p><strong>To:</strong> {{ email.recipient }}</p>
    <p><strong>Body:</strong></p>
    <p>{{ email.body }}</p>
  </div>
</template>

<style scoped>
.email-opened {
  padding: 20px;
}

.back-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #4e64ee;
  margin-bottom: 20px;
}

.back-button:hover {
  text-decoration: underline;
}
</style>