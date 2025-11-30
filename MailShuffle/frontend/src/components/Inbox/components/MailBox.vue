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

// Función para generar un correo temporal
const generateEmail = async () => {
  try {
    // Verificar si existe un correo actual (ya sea cargado desde cookies o generado previamente)
    if (email.value && emailId.value && apiKey.value) {
      // Mostrar alerta de confirmación antes de eliminar la dirección de correo
      const result = await toastRef.value?.showConfirm({
        title: "Are you sure?",
        text: "This will delete the current email address and all associated emails!",
        icon: "warning",
        confirmText: "Yes, delete it!",
        confirmButtonColor: "#4e64ee",
        cancelButtonColor: "#d33",
      });

      if (result?.isConfirmed) {
        console.log("emailId before delete:", emailId.value);
        console.log("apiKey before delete:", apiKey.value);

        try {
          // Llamar a la API para eliminar la dirección de correo
          await deleteEmailAddress(emailId.value, apiKey.value);

          // Limpiar las cookies y las variables reactivas
          setCookie("mailshuffle_email", "", -1); // Eliminar cookie
          setCookie("mailshuffle_apiKey", "", -1); // Eliminar cookie
          setCookie("mailshuffle_emailId", "", -1); // Eliminar cookie
          email.value = "";
          apiKey.value = "";
          emailId.value = "";

          console.log("Correo eliminado correctamente.");
        } catch (deleteError) {
          console.error("Error deleting email address:", deleteError);
          toastRef.value?.showToast({
            title: "Error deleting email address!",
            type: "error",
            overrides: {
              width: "245px",
            },
          });
          return; // Detener el flujo si ocurre un error al eliminar
        }
      } else {
        return; // Si el usuario cancela, detener el flujo
      }
    }

    // Generar un nuevo correo temporal
    const response = await generateTemporalEmail();
    console.log("Response from generateTemporalEmail:", response);
    email.value = response.email;
    apiKey.value = response.apiKey;
    emailId.value = response._id; // Almacenar el ID del correo

    // Guardar el correo, la API Key y el ID en cookies
    setCookie("mailshuffle_email", email.value, 7);
    setCookie("mailshuffle_apiKey", apiKey.value, 7);
    setCookie("mailshuffle_emailId", emailId.value, 7);

    emit("emailGenerated", { email: email.value, apiKey: apiKey.value });

    // Mostrar alerta de éxito
    toastRef.value?.showToast({
      title: "Email generated successfully!",
      type: "success",
      overrides: {
        width: "250px",
      },
    });
  } catch (error) {
    console.error("Error generating email:", error);

    // Mostrar alerta de error
    toastRef.value?.showToast({
      title: "Error generating email!",
      type: "error",
      overrides: {
        width: "210px",
      },
    });
  }
};

// Función para copiar el contenido del input al portapapeles
const copyToClipboard = async (event) => {
  try {
    await navigator.clipboard.writeText(email.value); // Copiar el contenido al portapapeles

    // Mostrar alerta de éxito
    toastRef.value?.showToast({
      title: "Email copied successfully!",
      type: "success",
      overrides: {
        width: "230px",
      },
    });
  } catch (error) {
    console.error("Error copying to clipboard:", error);

    // Mostrar alerta de error
    toastRef.value?.showToast({
      title: "An error occurred!",
      type: "error",
      overrides: {
        width: "175px",
      },
    });
  }
};

// Emitir eventos al componente padre
const emit = defineEmits(["emailGenerated"]);

// Al montar el componente, verificar si ya existe un correo en las cookies
onMounted(async () => {
  setMaterialInput();
  const savedEmail = getCookie("mailshuffle_email");
  const savedApiKey = getCookie("mailshuffle_apiKey");
  const savedEmailId = getCookie("mailshuffle_emailId");
  if (savedEmail && savedApiKey && savedEmailId) {
    email.value = savedEmail;
    apiKey.value = savedApiKey;
    emailId.value = savedEmailId;
    emit("emailGenerated", { email: email.value, apiKey: apiKey.value }); // Emitir el correo al componente padre
  } else {
    await generateEmail(); // Generar un nuevo correo si no hay cookie
  }
});
</script>

<template>
  <section class="my-0 pt-0">
    <MaterialToast ref="toastRef" />
    <div class="container">
      <div class="row justify-content-start">
        <div class="col-12 col-lg-8">
          <!-- Mantener la estructura original con los col-md -->
          <div class="row g-2 align-items-stretch">
            <div class="col-12 col-md-9">
              <MaterialInput
                class="input-group-outline border-danger"
                id="email"
                type="email"
                v-model="email"
                :error="true"
                readonly
              />
            </div>
            <div class="col-12 col-md-3">
              <!-- Solo modificar esta parte para los botones -->
              <div class="button-container">
                <MaterialButton
                  :icon="CopyIcon"
                  alt="Copy"
                  aria-label="Copy generated email"
                  @click="copyToClipboard"
                />
                <MaterialButton
                  :icon="ReloadIcon"
                  alt="Reload"
                  aria-label="Generate a new email"
                  @click="generateEmail"
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
}

input[readonly] {
  cursor: default;
}
</style>
