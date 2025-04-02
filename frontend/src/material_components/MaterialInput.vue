<script setup>
import { ref, onMounted } from "vue";

const inputRef = ref(null);

defineProps({
  id: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  label: {
    type: [String, Object],
    text: String,
    class: String,
    default: () => ({
      class: "",
    }),
  },
  value: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "md",
  },
  error: {
    type: Boolean,
    default: false,
  },
  success: {
    type: Boolean,
    default: false,
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  inputClass: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
});

function getClasses(size, success, error) {
  let sizeValue, isValidValue;

  sizeValue = size && `form-control-${size}`;

  if (error) {
    isValidValue = "is-invalid";
  } else if (success) {
    isValidValue = "is-valid";
  } else {
    isValidValue = "";
  }

  return `${sizeValue} ${isValidValue}`;
}

onMounted(() => {
  if (inputRef.value) {
    inputRef.value.setAttribute('readonly', true); // Asegurar que el campo sea de solo lectura
  }
});
</script>

<template>
  <div class="input-group">
    <label v-if="label" :class="label.class">{{
      typeof label == "string" ? label : label.text
    }}</label>
    <span v-if="icon" class="input-group-text"
      ><i class="fas" :class="`fa-${icon}`" aria-hidden="true"></i
    ></span>
    <input
      ref="inputRef"
      :id="id"
      :type="type"
      class="form-control"
      :class="[getClasses(size, success, error), inputClass]"
      :value="value"
      :placeholder="placeholder"
      :isRequired="isRequired"
      :disabled="isDisabled"
      readonly
    />
  </div>
</template>

<style scoped>
.icon-button {
  width: 22px;
  height: 22px;
}

.floating-button:hover {
  background-color: rgb(97, 205, 103);
  transform: scale(1.1);
}

/* Estilo para mantener el borde de color */
input {
  border: 2px solid #98FE98; /* Cambia #4e64ee por el color que prefieras */
  box-shadow: 0 0 0 2px rgba(63, 187, 125, 0.25); /* Ajusta el color y la transparencia según tus necesidades */
}

input[readonly] {
  cursor: default;
}
</style>
