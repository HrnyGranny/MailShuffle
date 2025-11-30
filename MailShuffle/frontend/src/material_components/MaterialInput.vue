<script>
export default {
  name: "MaterialInput",
  props: {
    id: { type: String, default: "" },
    type: { type: String, default: "text" },
    label: { type: [String, Object], default: "" },
    modelValue: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    size: { type: String, default: "md" },
    error: { type: Boolean, default: false },
    success: { type: Boolean, default: false },
    isRequired: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    inputClass: { type: String, default: "" },
    icon: { type: String, default: "" },
    readonly: { type: Boolean, default: false },
  },
  emits: ["update:modelValue"],
  setup(props) {
    function getClasses(size, success, error) {
      let sizeValue = size && `form-control-${size}`;
      let isValidValue = error ? "is-invalid" : success ? "is-valid" : "";
      return `${sizeValue} ${isValidValue}`;
    }

    return {
      getClasses,
    };
  },
};
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
      :id="id"
      :type="type"
      class="form-control"
      :class="[getClasses(size, success, error), inputClass]"
      :value="modelValue"
      :placeholder="placeholder"
      :required="isRequired"
      :disabled="isDisabled"
      :readonly="readonly"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <!-- AQUÍ ESTÁ LA MAGIA: Slot para añadir botones dentro del input-group -->
    <slot name="append"></slot>
  </div>
</template>