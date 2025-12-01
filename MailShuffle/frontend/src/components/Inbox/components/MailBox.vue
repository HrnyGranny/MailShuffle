<script setup>
import { ref, onMounted } from "vue";
import { generateTemporalEmail, deleteEmailAddress } from "@/api/emailService";
import MaterialInput from "@/material_components/MaterialInput.vue";
import MaterialButton from "@/material_components/MaterialButton.vue";
import MaterialToast from "@/material_components/MaterialToast.vue";
import QrModal from "@/components/Inbox/components/QRModal.vue";
import DeleteModal from "@/components/Inbox/components/ReloadModal.vue";
import setMaterialInput from "@/assets/js/material-input";

const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const getCookie = (name) => {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((row) => row.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
};

const email = ref(""); 
const apiKey = ref(""); 
const emailId = ref(""); 
const toastRef = ref(null);
const showQr = ref(false);
const showDeleteModal = ref(false);
const emit = defineEmits(["emailGenerated"]);

// 1. Reload button: decide whether to confirm deletion or generate immediately
const handleGenerateClick = async () => {
  if (email.value && emailId.value && apiKey.value) {
    showDeleteModal.value = true;
  } else {
    await performGeneration();
  }
};

// 2. Confirm deletion in modal
const confirmDelete = async () => {
  showDeleteModal.value = false;
  
  try {
    await deleteEmailAddress(emailId.value, apiKey.value);
    
    setCookie("mailshuffle_email", "", -1);
    setCookie("mailshuffle_apiKey", "", -1);
    setCookie("mailshuffle_emailId", "", -1);
    email.value = "";
    apiKey.value = "";
    emailId.value = "";
    
    await performGeneration();
    
  } catch (deleteError) {
    console.error("Error deleting email address:", deleteError);
    toastRef.value?.showToast({
      title: "Error deleting email address!",
      type: "error",
      overrides: { width: "245px" },
    });
  }
};

const performGeneration = async () => {
  try {
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

const copyToClipboard = async () => {
  if (!email.value) return;
  try {
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

const openQrModal = () => {
  showQr.value = true;
};

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
    await performGeneration();
  }
});
</script>

<template>
  <section class="my-0 pt-0">
    <MaterialToast ref="toastRef" />
    
    <QrModal 
      :show="showQr" 
      @close="showQr = false" 
    />

    <!-- Delete confirmation modal -->
    <DeleteModal 
      :show="showDeleteModal"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />

    <div class="container">
      <div class="row justify-content-start">
        <div class="col-12 col-lg-7">
          <div class="row g-3 align-items-stretch">
            
            <!-- Columna del Input -->
            <div class="col-12 col-md-9">
              <MaterialInput
                class="input-group-outline border-danger"
                id="email"
                type="email"
                v-model="email"
                :error="true"
                readonly
              >
                <template #append>
                  <button 
                    class="btn btn-clipboard mb-0" 
                    type="button" 
                    @click="copyToClipboard"
                    title="Copy to clipboard"
                    :disabled="!email"
                  >
                    <i class="material-icons">content_copy</i>
                  </button>
                </template>
              </MaterialInput>
            </div>
            
            <!-- External button column -->
            <div class="col-12 col-md-3">
              <div class="button-container">
                <MaterialButton
                  aria-label="Show QR Code"
                  @click="openQrModal"
                  class="custom-button square-btn" 
                >
                  <i class="material-icons">qr_code_2</i>
                </MaterialButton>
                
                <MaterialButton
                  aria-label="Generate a new email"
                  @click="handleGenerateClick"
                  class="custom-button square-btn" 
                >
                  <i class="material-icons">autorenew</i>
                </MaterialButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.square-btn {
  padding: 0 !important;
  width: 42px !important; 
  min-width: 42px !important;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.material-icons {
  font-size: 22px;
  line-height: 1;
}

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
  align-items: center;
  justify-content: center;
}

.btn-clipboard:hover:not(:disabled) {
  background-color: #f5f5f5;
  color: #333;
  border-color: #d2d6da;
}

.btn-clipboard:focus,
.btn-clipboard:active {
  box-shadow: none !important;
  outline: none !important;
  border-color: #d2d6da !important;
}

.btn-clipboard .material-icons {
  font-size: 20px; 
}

.icon-button {
  transition: transform 0.2s ease;
}

.icon-button:hover {
  transform: translateY(-2px);
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