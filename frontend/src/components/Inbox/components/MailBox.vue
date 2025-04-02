<script setup>
import { ref, onMounted } from "vue";
import { generateRandomEmail, deleteEmailsByRecipient } from "@/api/emailService";
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

const generateFirstEmail = async (event) => {
  try {

    // Generar un nuevo correo
    email.value = await generateRandomEmail(); // Llamar al backend para generar el correo
    setCookie("mailshuffle_email", email.value, 7); // Guardar el correo en una cookie por 7 días
    emit("emailGenerated", email.value); // Emitir el correo generado al componente padre

  } catch (error) {
    console.error("Error generating First email:", error);
  }
}

// Función para generar un correo aleatorio
const generateEmail = async (event) => {
  try {
    // Mostrar alerta de confirmación antes de eliminar correos
    const result = await Swal.fire({
      title: '<span style="color:#344767;">Are you sure?</span>',
      text: "This will delete all emails associated with the current address!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4e64ee',
      cancelButtonColor: '#d33',
      color: "#7b809a",
      background: '#fff',
      confirmButtonText: 'Yes, delete them!',
      position: 'center',
      toast: true,
    });
    if (result.isConfirmed) {
      
      // Generar un nuevo correo
      email.value = await generateRandomEmail(); // Llamar al backend para generar el correo
      setCookie("mailshuffle_email", email.value, 7); // Guardar el correo en una cookie por 7 días
      emit("emailGenerated", email.value); // Emitir el correo generado al componente padre

      // Eliminar correos
      if (email.value) {
        await deleteEmailsByRecipient(email.value); // Llamar al backend para eliminar correos
        console.log(`Emails associated with ${email.value} deleted successfully.`);
      }

      // Mostrar alerta de éxito al generar
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: 'Emails deleted successfully!',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
    }
  } catch (error) {
    console.error("Error generating email:", error);

    // Mostrar alerta de error
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: 'An error occurred!',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }
};

// Función para copiar el contenido del input al portapapeles
const copyToClipboard = async (event) => {
  try {
    await navigator.clipboard.writeText(email.value); // Copiar el contenido al portapapeles
    const el = event.target.parentElement;
    const alert = document.createElement("div");

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

    // Mostrar alerta de error
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: 'An error occurred!',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }
};

// Emitir eventos al componente padre
const emit = defineEmits(["emailGenerated"]);

// Al montar el componente, verificar si ya existe un correo en las cookies
onMounted(async () => {
  setMaterialInput();
  const savedEmail = getCookie("mailshuffle_email");
  if (savedEmail) {
    email.value = savedEmail; // Usar el correo guardado en la cookie
    emit("emailGenerated", email.value); // Emitir el correo al componente padre
  } else {
    await generateFirstEmail(); // Generar un nuevo correo si no hay cookie
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
                class="input-group-outline border-danger"
                id="email"
                type="email"
                :value="email"
                :error="true"
                readonly
              />
            </div>
            <div class="col-3 ps-0">
              <div class="row g-2">
                <div class="col-6">
                  <MaterialButton
                    variant="gradient"
                    :style="{ backgroundColor: '#98FE98', borderColor: '#98FE98', color: '#344767', 'box-shadow': '0px 2px 6px rgba(0, 0, 0, 0.3)' }"
                    class="mb-0 h-100 w-100 d-flex align-items-center justify-content-center p-2 floating-button"
                    @click="copyToClipboard"
                  >
                    <img :src="CopyIcon" alt="Copy" class="icon-button" />
                  </MaterialButton>
                </div>
                <div class="col-6">
                  <MaterialButton
                    variant="gradient"
                    :style="{ backgroundColor: '#98FE98', borderColor: '#98FE98', color: '#344767', 'box-shadow': '0px 2px 6px rgba(0, 0, 0, 0.3)' }"
                    class="mb-0 h-100 w-100 d-flex align-items-center justify-content-center p-2 floating-button"
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
.floating-button:hover {
    transform: scale(1.1);
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