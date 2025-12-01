<script setup>
import Swal from "sweetalert2";

const toastBaseConfig = {
  toast: true,
  position: "bottom-start",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: false,
};

const palette = {
  success: { background: "#98fe9857", color: "#3a526a" },
  error: { background: "#b9424261", color: "#3a526a" },
  warning: { background: "#fff", color: "#344767" },
};

const computeWidth = (title = "") => {
  const length = title.length;
  if (length <= 18) return "200px";
  if (length <= 26) return "220px";
  if (length <= 34) return "235px";
  if (length <= 44) return "250px";
  return "270px";
};

const showToast = ({ title, type = "success", overrides = {} }) => {
  const paletteEntry = palette[type] ?? palette.success;
  const { didOpen, width, ...restOverrides } = overrides;

  Swal.fire({
    ...toastBaseConfig,
    title,
    background: paletteEntry.background,
    color: paletteEntry.color,
    didOpen: (popup) => {
      popup.style.width = width ?? computeWidth(title);
      popup.style.padding = "5px";
      popup.style.borderRadius = "10px";
      if (typeof didOpen === "function") didOpen(popup);
    },
    ...restOverrides,
  });
};

// Exponemos solo showToast
defineExpose({ showToast });
</script>

<template>
  <span aria-hidden="true" />
</template>