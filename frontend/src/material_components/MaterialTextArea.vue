<script setup>
const props = defineProps({
  id: { type: String, default: "message" },
  rows: { type: Number, default: 4 },
  placeholder: { type: String, default: "" },
  labelClass: { type: String, default: "" },
  modelValue: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="input-group">
    <label :for="id" :class="labelClass"><slot /></label>
    <textarea
      :name="id"
      class="form-control"
      :id="id"
      :placeholder="placeholder"
      :rows="rows"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>
