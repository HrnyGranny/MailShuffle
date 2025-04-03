<script setup>
import { ref, onMounted } from "vue";
import { generateTemporalEmail, deleteEmailAddress } from "@/api/emailService";
import MaterialInput from "@/material_components/MaterialInput.vue";
import MaterialButton from "@/material_components/MaterialButton.vue";
import Swal from "sweetalert2";

// Importar iconos desde assets
import CopyIcon from "../../../assets/img/iconos/copiar.png";
import ReloadIcon from "../../../assets/img/iconos/recargar.png";

// material-input
import setMaterialInput from "@/assets/js/material-input";

// Función para manejar cookies
const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
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

// Función para generar un correo temporal
const generateEmail = async () => {
  try {
    // Verificar si existe un correo actual (ya sea cargado desde cookies o generado previamente)
    if (email.value && emailId.value && apiKey.value) {
      // Mostrar alerta de confirmación antes de eliminar la dirección de correo
      const result = await Swal.fire({
        title: '<span style="color:#344767;">Are you sure?</span>',
        text: "This will delete the current email address and all associated emails!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4e64ee',
        cancelButtonColor: '#d33',
        color: "#7b809a",
        background: '#fff',
        confirmButtonText: 'Yes, delete it!',
        position: 'center',
      });

      if (result.isConfirmed) {
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
          Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'error',
            title: 'Error deleting email address!',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
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
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'success',
      title: 'New email generated successfully!',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  } catch (error) {
    console.error("Error generating email:", error);

    // Mostrar alerta de error
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: 'Error generating email!',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }
};

// Función para copiar el contenido del input al portapapeles
const copyToClipboard = async (event) => {
  try {
    await navigator.clipboard.writeText(email.value); // Copiar el contenido al portapapeles

    // Mostrar alerta de éxito
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'success', 
      title: 'Email copied successfully!',
      showConfirmButton: false, 
      timer: 3000,
      timerProgressBar: true
    });
  } catch (error) {
    console.error("Error copying to clipboard:", error);
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
    <div class="container">
      <div class="row">
        <div class="col-md-6 offset-md-0 ms-lg-n4 ms-md-n3">
          <div class="row">
            <div class="col-9">
              <MaterialInput
                class="input-group-outline border-success"
                id="email"
                type="email"
                :value="email"
                :success=true
                readonly
              />
            </div>
            <div class="col-3 ps-0">
              <div class="row g-2">
                <div class="col-6">
                  <MaterialButton
                    variant="gradient"
                    :style="{ backgroundColor: '#98FE98', borderColor: '#98FE98', color: '#344767', 'box-shadow': '0px 2px 6px rgba(0, 0, 0, 0.3)' }"
                    class="mb-0 h-100 w-100 d-flex align-items-center justify-content-center p-2"
                    @click="copyToClipboard"
                  >
                    <img :src="CopyIcon" alt="Copy" class="icon-button" />
                  </MaterialButton>
                </div>
                <div class="col-6">
                  <MaterialButton
                    variant="gradient"
                    :style="{ backgroundColor: '#98FE98', borderColor: '#98FE98', color: '#344767', 'box-shadow': '0px 2px 6px rgba(0, 0, 0, 0.3)' }"
                    class="mb-0 h-100 w-100 d-flex align-items-center justify-content-center p-2"
                    @click="generateEmail"
                  >
                    <img :src="ReloadIcon" alt="Reload" class="icon-button" />
                  </MaterialButton>
                </div>
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
  width: 22px;
  height: 22px;
}
/* Cambiar el color del título */
.swal-title {
  color: #ff5722;
  font-weight: bold;
}

/* Cambiar el color del texto del popup */
.swal-popup {
  color: #4caf50; 
}
</style>