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

      // Eliminar correos
      if (email.value) {
        await deleteEmailsByRecipient(email.value); // Llamar al backend para eliminar correos
        console.log(`Emails associated with ${email.value} deleted successfully.`);
      }
      
      // Generar un nuevo correo
      email.value = await generateRandomEmail(); // Llamar al backend para generar el correo
      setCookie("mailshuffle_email", email.value, 7); // Guardar el correo en una cookie por 7 días
      emit("emailGenerated", email.value); // Emitir el correo generado al componente padre

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
      icon: 'success',
      title: 'New email generated successfully!',
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
                    :style="{ backgroundColor: '#98FE98', borderColor: '#98FE98', color: '#344767' }"
                    class="mb-0 h-100 w-100 d-flex align-items-center justify-content-center p-2"
                    @click="copyToClipboard"
                  >
                    <img :src="CopyIcon" alt="Copy" class="icon-button" />
                  </MaterialButton>
                </div>
                <div class="col-6">
                  <MaterialButton
                    variant="gradient"
                    :style="{ backgroundColor: '#98FE98', borderColor: '#98FE98', color: '#344767' }"
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