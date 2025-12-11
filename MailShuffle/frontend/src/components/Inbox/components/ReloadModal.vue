<script setup>
  import { defineProps, defineEmits, ref, watch } from "vue";
  import MaterialInput from "@/material_components/MaterialInput.vue";
  import MaterialButton from "@/material_components/MaterialButton.vue";
  import { faker } from '@faker-js/faker';
  
  const props = defineProps({
    show: {
      type: Boolean,
      default: false,
    },
  });
  
  const emit = defineEmits(["close", "confirm"]);
  
  const customName = ref("");
  const selectedDomain = ref("@mailshuffle.xyz");
  
  // Función para generar nombre aleatorio
  const generateRandomName = (event) => {
  if (event && event.currentTarget) {
    event.currentTarget.blur();
  }
  customName.value = faker.internet.username().toLowerCase();
};

  // Generar uno nuevo automáticamente al abrir

  const getCookie = (name) => {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((row) => row.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
};

watch(
    () => props.show,
    (newVal) => {
      if (newVal) {
        const fullEmail = getCookie("mailshuffle_email");
        if (fullEmail) {
          // Divide el email por la '@' y toma la primera parte (índice 0)
          customName.value = fullEmail.split('@')[0];
        }
      }
    }
  );
  
  const handleConfirm = () => {
    const fullEmail = `${customName.value}${selectedDomain.value}`;
    emit("confirm", fullEmail);
  };
  </script>
  
  <template>
    <Teleport to="body">
      <div v-if="show" class="modal-wrapper">
        <!-- Backdrop -->
        <div class="modal-backdrop" @click="$emit('close')"></div>
  
        <!-- Contenedor del Modal (Ancho 380px) -->
        <div class="modal-container">
          <div class="modal-content">
            
            <!-- Botón de cerrar -->
            <button type="button" class="close-btn" @click="$emit('close')" aria-label="Close">
              <i class="fas fa-times"></i>
            </button>
  
            <div class="modal-body">
              <h5 class="modal-title">Edit Email Address</h5>
              
              <p class="info-text">
                Configure your new address. This action will permanently delete your current inbox.
              </p>
  
              <!-- Formulario -->
              <div class="form-content mt-4">
                
                <!-- 1. Label y Input Name -->
                <div class="mb-3">
                  <label class="box-label">Name</label> <!-- Título añadido -->
                  <div class="input-group-container input-custom-glow">
                    <MaterialInput
                      class="input-group-outline"
                      type="text"
                      label=""
                      placeholder="Email Name"
                      v-model="customName"
                    >
                      <template #append>
                        <button 
                          class="btn btn-clipboard mb-0" 
                          type="button" 
                          @click="generateRandomName"
                          title="Generate random name"
                        >
                          <i class="material-icons">shuffle</i>
                        </button>
                      </template>
                    </MaterialInput>
                  </div>
                </div>
  
                <!-- 2. Label y Select Domain -->
                <div class="mb-4">
                  <label class="box-label">Domain</label> <!-- Título añadido -->
                  <div class="domain-select-wrapper">
                    <select v-model="selectedDomain" class="domain-select">
                      <option value="@mailshuffle.xyz">@mailshuffle.xyz</option>
                    </select>
                    <i class="material-icons select-arrow">expand_more</i>
                  </div>
                </div>
  
                <!-- 3. Action Button -->
                <div class="action-row text-center">
                  <MaterialButton
                    fullWidth="true"
                    label="Generate!"
                    size="large"
                    backgroundColor="#98fe98"
                    textColor="#344767"
                    @click="handleConfirm"
                  />
                </div>
              </div>
  
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </template>
  
  <style scoped>
  /* --- Estructura Modal --- */
  .modal-wrapper {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    z-index: 9999;
    display: flex;
    align-items: center; justify-content: center;
  }
  
  .modal-backdrop {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    backdrop-filter: blur(2px);
  }
  
  .modal-container {
    position: relative;
    z-index: 1001;
    width: 90%;
    max-width: 325px; 
    margin: auto;
    font-family: 'Roboto', sans-serif;
  }
  
  .modal-content {
    background: white;
    border-radius: 15px;
    padding: 2rem 1.5rem;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    width: 100%;
    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  .close-btn {
    position: absolute;
    top: 20px; right: 20px;
    background: none; border: none;
    cursor: pointer; color: #777;
    font-size: 1.1rem;
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
    z-index: 10; padding: 0;
  }
  .close-btn:hover { background-color: #f5f5f5; color: #333; }
  
  .modal-title {
    margin: 0 0 1rem 0;
    font-weight: 700;
    color: #344767;
    text-align: center;
    font-size: 1.3rem;
  }
  
  .info-text {
    text-align: center;
    color: #7b809a;
    font-size: 0.85rem;
    line-height: 1.5;
    margin-bottom: 0;
  }
  
  /* --- Nuevos Títulos (Labels) --- */
  .box-label {
    display: block; 
    text-align: left; 
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 0.4rem;
    margin-left: 2px; /* Un pequeño margen para alinear visualmente */
  }
  
  .input-custom-glow :deep(input):focus {
    border: 1px solid #98fe98 !important;
    box-shadow: 0 0 8px rgba(152, 254, 152, 0.8) !important;
  }
  
  /* --- Botón del formulario --- */
  .btn-clipboard {
    z-index: 4;
    border: 1px solid #d2d6da;
    border-left: none;
    background-color: transparent;
    padding: 0 12px;
    border-top-right-radius: 0.375rem !important;
    border-bottom-right-radius: 0.375rem !important;
    color: #777;
    transition: all 0.2s;
    cursor: pointer;
    display: flex;
    align-items: center; justify-content: center;
  }
  
  .btn-clipboard:focus, .btn-clipboard:active {
    box-shadow: none !important;
    outline: none !important;
    border-color: #d2d6da !important;
    background-color: transparent !important;
    color: #777 !important;
  }
  
  .btn-clipboard:hover {
    background-color: #f5f5f5 !important;
    color: #333 !important;
    border-color: #d2d6da;
  }
  
  /* --- Dropdown Manual --- */
  .domain-select-wrapper {
    position: relative;
    background: #fff;
    border: 1px solid #d2d6da;
    border-radius: 0.375rem;
    display: flex; align-items: center;
    height: 44px;
    transition: all 0.2s ease;
  }
  
  .domain-select {
    appearance: none; background: transparent; border: none;
    width: 100%; height: 100%;
    padding: 0 30px 0 12px;
    font-size: 0.875rem; color: #495057;
    cursor: pointer; outline: none; z-index: 2;
    border-radius: 0.375rem;
  }
  
  /* SOLUCIÓN AL FONDO NEGRO: Forzar estilo en las opciones */
  .domain-select option {
    background-color: #ffffff !important;
    color: #344767;
  }
  
  .select-arrow {
    position: absolute; right: 10px;
    font-size: 20px; color: #7b809a;
    z-index: 1; pointer-events: none;
  }
  
  /* --- Action Button --- */
  .action-row {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  
  .input-group-container :deep(.input-group) {
    display: flex; align-items: stretch;
  }
  </style>