<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    default: null
  },
  backgroundColor: {
    type: String,
    default: null
  },
  borderColor: {
    type: String,
    default: null
  },
  textColor: {
    type: String,
    default: null
  },
  iconAlt: {
    type: String,
    default: 'Button icon'
  },
  label: {
    type: String,
    default: ''
  },
  ariaLabel: {
    type: String,
    required: true
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium', // small, medium, large
    validator: (value) => ['tiny', 'small', 'medium', 'large'].includes(value)
  }
});

const emit = defineEmits(['click']);

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<template>
  <button
    type="button"
    class="custom-button"
    :style="{
    '--button-bg': backgroundColor || '#98fe98',
    '--button-border': borderColor || '#98fe98',
    '--button-text': textColor || '#344767'
    }"
    :class="{
      'custom-button--icon-only': !label && icon,
      'custom-button--full-width': fullWidth,
      'custom-button--disabled': disabled,
      [`custom-button--${size}`]: true
    }"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @click="handleClick"
  >
    <img v-if="icon" :src="icon" :alt="iconAlt" class="custom-button__icon" />
    <span v-if="label" class="custom-button__label">{{ label }}</span>
    <slot v-else-if="!icon"></slot>
  </button>
</template>

<style scoped>
.custom-button {
  /* Variables para personalización */
  --button-bg: #98fe98;
  --button-border: #98fe98;
  --button-text: #344767;
  --button-shadow: rgba(0, 0, 0, 0.2);
  --button-shadow-hover: rgba(0, 0, 0, 0.2);
  --button-radius: 0.75rem;
  --button-transition-duration: 0.2s;
  
  /* Estilos base */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--button-bg);
  border: 1px solid var(--button-border);
  color: var(--button-text);
  box-shadow: 0 2px 6px var(--button-shadow);
  border-radius: var(--button-radius);
  font-weight: 600;
  cursor: pointer;
  transition: transform var(--button-transition-duration) ease, 
              box-shadow var(--button-transition-duration) ease,
              background-color var(--button-transition-duration) ease;
  padding: 0.625rem 16px;
  font-size: 14px;
  letter-spacing: 0.02em;
  position: relative;
  overflow: hidden;
  -webkit-appearance: none;
  margin: 0;
  outline: none;
  user-select: none;
}

/* Estilos para hover */
.custom-button:hover:not(.custom-button--disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px var(--button-shadow-hover);
  background-color: var(--button-bg);
  color: var(--button-text);
  border-color: var(--button-border);
}

/* Estilos para active/click */
.custom-button:active:not(.custom-button--disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px var(--button-shadow);
  background-color: var(--button-bg);
  color: var(--button-text);
  border-color: var(--button-border);
}

/* Estilos para focus */
.custom-button:focus-visible {
  outline: 2px solid rgba(152, 254, 152, 0.65);
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(152, 254, 152, 0.3);
}

/* Variante: solo icono */
.custom-button--icon-only {
  padding: 0.4rem 0.55rem;
  min-width: var(--button-icon-min, 40px);
  min-height: var(--button-icon-min-height, 38px);
  width: var(--button-icon-width, var(--button-icon-min, 40px));
  height: var(--button-icon-height, var(--button-icon-min-height, 38px));
}

/* Variante: ancho completo */
.custom-button--full-width {
  width: 100%;
}

/* Variante: deshabilitado */
.custom-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
  pointer-events: none;
}

/* Tamaños */
.custom-button--tiny {
  padding: 0.1rem;
  font-size: 0.7rem;
  min-height: 30px;
  min-width: 30px;
  width: 32px;
  height: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.custom-button--tiny.custom-button--icon-only {
  padding: 2px;
  min-width: var(--button-icon-min, 30px);
  min-height: var(--button-icon-min-height, 30px);
  width: var(--button-icon-width, 32px);
  height: var(--button-icon-height, 30px);
}

.custom-button--tiny .custom-button__icon {
  width: 16px;
  height: 16px;
}

.custom-button--small {
  padding: 0.375rem 1rem;
  font-size: 0.75rem;
  min-height: var(--button-small-min-height, 32px);
}

.custom-button--large {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  min-height: 48px;
}

.custom-button--large.custom-button--icon-only {
  padding: 0.55rem;
  min-width: var(--button-large-icon-min, 40px);
  min-height: var(--button-large-icon-min-height, 48px);
  width: var(--button-large-icon-width, 60px);
  height: var(--button-large-icon-height, 48px);
}

/* Estilo del icono */
.custom-button__icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

/* Espacio entre icono y texto */
.custom-button__icon + .custom-button__label {
  margin-left: 0.5rem;
}

/* Ajuste de tamaño de iconos según el tamaño del botón */
.custom-button--small .custom-button__icon {
  width: 18px;
  height: 18px;
}

.custom-button--large .custom-button__icon {
  width: 24px;
  height: 24px;
}
</style>