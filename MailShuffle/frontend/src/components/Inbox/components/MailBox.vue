<script setup>
import { ref, onMounted } from "vue";
import { generateTemporalEmail, deleteEmailAddress } from "@/api/emailService";
import MaterialInput from "@/material_components/MaterialInput.vue";
import MaterialButton from "@/material_components/MaterialButton.vue";
import MaterialToast from "@/material_components/MaterialToast.vue";

// Importar iconos desde assets
import CopyIcon from "@/assets/img/iconos/copiar.png";
import ReloadIcon from "@/assets/img/iconos/recargar.png";

// material-input
import setMaterialInput from "@/assets/js/material-input";

// Función para manejar cookies
const setCookie = (name, value, days) => {
  const expires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000
  ).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const getCookie = (name) => {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((row) => row.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
};

// Variables reactivas
const email = ref(""); // Variable para almacenar el correo generado
const apiKey = ref(""); // Variable para almacenar la API Key
const emailId = ref(""); // Variable para almacenar el ID del correo
const toastRef = ref(null);
// Eliminado isCopying para quitar la animación

// Función para generar un correo temporal
const generateEmail = async () => {
  try {
    if (email.value && emailId.value && apiKey.value) {
      const result = await toastRef.value?.showConfirm({
        title: "Are you sure?",
        text: "This will delete the current email address and all associated emails!",
        icon: "warning",
        confirmText: "Yes, delete it!",
        confirmButtonColor: "#4e64ee",
        cancelButtonColor: "#d33",
      });

      if (result?.isConfirmed) {
        try {
          await deleteEmailAddress(emailId.value, apiKey.value);
          setCookie("mailshuffle_email", "", -1);
          setCookie("mailshuffle_apiKey", "", -1);
          setCookie("mailshuffle_emailId", "", -1);
          email.value = "";
          apiKey.value = "";
          emailId.value = "";
        } catch (deleteError) {
          console.error("Error deleting email address:", deleteError);
          toastRef.value?.showToast({
            title: "Error deleting email address!",
            type: "error",
            overrides: { width: "245px" },
          });
          return;
        }
      } else {
        return;
      }
    }

    const response = await generateTemporalEmail();
    email.value = response.email;
    apiKey.value = response.apiKey;
    emailId.value = response._id;

    setCookie("mailshuffle_email", email.value, 7);
    setCookie("mailshuffle_apiKey", apiKey.value, 7);
    setCookie("mailshuffle_emailId", emailId.value, 7);

    emit("emailGenerated", { email: email.value, apiKey: apiKey.value });

    toastRef.value?.showToast({
      title: "Email generated successfully!",
      type: "success",
      overrides: { width: "250px" },
    });
  } catch (error) {
    console.error("Error generating email:", error);
    toastRef.value?.showToast({
      title: "Error generating email!",
      type: "error",
      overrides: { width: "210px" },
    });
  }
};

// Función para copiar el contenido del input al portapapeles
const copyToClipboard = async () => {
  if (!email.value) return;
  
  try {
    // Eliminada la lógica de animación isCopying
    await navigator.clipboard.writeText(email.value);

    toastRef.value?.showToast({
      title: "Email copied successfully!",
      type: "success",
      overrides: { width: "230px" },
    });
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    toastRef.value?.showToast({
      title: "An error occurred!",
      type: "error",
      overrides: { width: "175px" },
    });
  }
};

// Placeholder para la futura funcionalidad del QR
const openQrModal = () => {
  console.log("Abrir modal QR (Pendiente de implementación)");
  copyToClipboard(); 
};

const emit = defineEmits(["emailGenerated"]);

onMounted(async () => {
  setMaterialInput();
  const savedEmail = getCookie("mailshuffle_email");
  const savedApiKey = getCookie("mailshuffle_apiKey");
  const savedEmailId = getCookie("mailshuffle_emailId");
  if (savedEmail && savedApiKey && savedEmailId) {
    email.value = savedEmail;
    apiKey.value = savedApiKey;
    emailId.value = savedEmailId;
    emit("emailGenerated", { email: email.value, apiKey: apiKey.value });
  } else {
    await generateEmail();
  }
});
</script>

<template>
  <section class="my-0 pt-0">
    <MaterialToast ref="toastRef" />
    <div class="container">
      <div class="row justify-content-start">
        <div class="col-12 col-lg-8">
          <!-- Aumentado g-2 a g-3 para más separación entre columnas -->
          <div class="row g-3 align-items-stretch">
            
            <!-- Columna del Input + Botón interno de copiar -->
            <div class="col-12 col-md-9">
              <MaterialInput
                class="input-group-outline border-danger"
                id="email"
                type="email"
                v-model="email"
                :error="true"
                readonly
              >
                <!-- Botón integrado de copiar (dentro del input) -->
                <template #append>
                  <button 
                    class="btn btn-clipboard mb-0" 
                    type="button" 
                    @click="copyToClipboard"
                    title="Copy to clipboard"
                    :disabled="!email"
                  >
                    <!-- Eliminada clase dinámica de animación -->
                    <img 
                        :src="CopyIcon" 
                        alt="Copy" 
                        class="action-icon-input" 
                    />
                  </button>
                </template>
              </MaterialInput>
            </div>
            
            <!-- Columna de botones externos (QR + Reload) -->
            <div class="col-12 col-md-3">
              <div class="button-container">
                <!-- Botón futuro QR -->
                <MaterialButton
                  :icon="CopyIcon"
                  alt="QR Code"
                  aria-label="Show QR Code"
                  @click="openQrModal"
                  class="custom-button"
                />
                
                <!-- Botón Reload -->
                <MaterialButton
                  :icon="ReloadIcon"
                  alt="Reload"
                  aria-label="Generate a new email"
                  @click="generateEmail"
                  class="custom-button"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* --- Estilos nuevos para el botón integrado --- */
.btn-clipboard {
  z-index: 4;
  border: 1px solid #d2d6da;
  border-left: none;
  background-color: transparent;
  padding: 0 12px;
  border-top-right-radius: 0.375rem !important;
  border-bottom-right-radius: 0.375rem !important;
  /* Eliminada transición de fondo para respuesta instantánea */
}

/* Forzamos que el borde y el fondo se mantengan al hacer click/foco */
.btn-clipboard:focus,
.btn-clipboard:active,
.btn-clipboard:active:focus {
  box-shadow: none !important;
  outline: none !important;
  border-color: #d2d6da !important; /* Mismo color que el input */
  background-color: transparent !important; /* Evita que se ponga gris oscuro */
}

@media (hover: hover) {
  .btn-clipboard:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.action-icon-input {
  width: 20px;
  height: 20px;
  opacity: 0.6;
  transition: transform 0.2s, opacity 0.2s;
}

.btn-clipboard:hover .action-icon-input {
  opacity: 1;
  transform: scale(1.1);
}

/* --- Estilos originales restaurados para la responsividad --- */

.icon-button {
  transition: transform 0.2s ease;
}

.icon-button:hover {
  transform: translateY(-2px);
}

.action-icon {
  width: 22px;
  height: 22px;
}

.button-container {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  justify-content: flex-start;
}

@media (max-width: 767px) {
  .icon-button {
    flex: 1 1 0;
  }

  .button-container {
    justify-content: center;
    margin-top: 0.5rem;
  }
  
  .button-container .custom-button {
    flex: 1;
    max-width: 45%; 
  }
}

@media (max-width: 480px) {
  .button-container .custom-button {
    max-width: 48%; 
  }
}

/* Estilo para mantener el campo enfocado */
input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  z-index: 3;
}

input[readonly] {
  cursor: default;
  background-color: #fff !important;
}
</style>