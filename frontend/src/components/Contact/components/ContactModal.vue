<script setup>
import MaterialInput from "@/material_components/MaterialInput.vue";
import MaterialTextArea from "@/material_components/MaterialTextArea.vue";
import MaterialButton from "@/material_components/MaterialButton.vue";
import { ref, reactive, defineEmits } from "vue";
import Swal from "sweetalert2";

const emit = defineEmits(['close']);

// Form data with reactive references
const formData = reactive({
  fullName: "",
  email: "",
  message: "",
});

// Track if form has been submitted
const formSubmitted = ref(false);

// Form submission state
const isSubmitting = ref(false);

// Simple validation functions
const isValidFullName = () => !!formData.fullName.trim();
const isValidEmail = () => {
  const email = formData.email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const isValidMessage = () => formData.message.trim().length >= 10;

// Check if a field has an error (only after form submission)
const hasError = (field) => {
  if (!formSubmitted.value) return false;

  if (field === "fullName") return !isValidFullName();
  if (field === "email") return !isValidEmail();
  if (field === "message") return !isValidMessage();

  return false;
};

// Get error message for a field
const getErrorMessage = (field) => {
  if (field === "fullName") return "Full name is required";

  if (field === "email") {
    if (!formData.email.trim()) return "Email is required";
    if (!formData.email.includes("@")) return "Email must include @ symbol";
    return "Please enter a valid email";
  }

  if (field === "message")
    return "Please enter a message (at least 10 characters)";

  return "";
};

// Handle form submission
const handleSubmit = async (event) => {
  event.preventDefault();

  // Mark form as submitted (to show validation errors)
  formSubmitted.value = true;

  // Direct validation
  const isFormValid = isValidFullName() && isValidEmail() && isValidMessage();

  // return if form is invalid
  if (!isFormValid) {
    return;
  }

  // Set submitting state
  isSubmitting.value = true;

  try {
    // Here you would implement your actual form submission logic
    // For example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Success message
    Swal.fire({
      toast: true,
      position: "bottom-start",
      title: "Message sent successfully!",
      color: "#3a526a",
      background: "#98fe9857",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
      didOpen: (popup) => {
        popup.style.width = "230px";
        popup.style.padding = "5px";
        popup.style.borderRadius = "10px";
      },
    });

    // Reset form
    formData.fullName = "";
    formData.email = "";
    formData.message = "";

    // Reset form submitted state
    formSubmitted.value = false;
    
    // Close dropdown after successful submission
    emit('close');
  } catch (error) {
    // Error message
    Swal.fire({
      toast: true,
      position: "bottom-start",
      title: "Error sending message!",
      color: "#3a526a",
      background: "#b9424261",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
      didOpen: (popup) => {
        popup.style.width = "225px";
        popup.style.padding = "5px";
        popup.style.borderRadius = "10px";
      },
    });
    console.error("Error sending message:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// Additional function to clear validation when a field is fixed
const updateField = (field) => {
  // If the form hasn't been submitted yet, no need to do anything
  if (!formSubmitted.value) return;

  // For better UX, we could conditionally update the form validation state
  // based on whether all fields are now valid
  if (isValidFullName() && isValidEmail() && isValidMessage()) {
    // All fields are valid, reset the form submitted state so errors disappear
    formSubmitted.value = false;
  }
};
</script>

<template>
  <div class="dropdown-content">
    <div class="dropdown-header">
      <h5 class="fw-bold text-dark m-0">Contact us</h5>
      <button type="button" class="close-btn" @click="$emit('close')" aria-label="Close">
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <div class="dropdown-body">    
      <form
        id="contact-form"
        @submit="handleSubmit"
        method="post"
        autocomplete="off"
      >
        <div class="row g-2">
          <div class="col-md-6">
            <div class="position-relative">
              <MaterialInput
                class="input-group-static input-sm"
                type="text"
                label="Full Name"
                placeholder="Full Name"
                v-model="formData.fullName"
                @input="updateField('fullName')"
                :class="{ 'is-invalid': hasError('fullName') }"
              />
              <div v-if="hasError('fullName')" class="validation-bubble">
                {{ getErrorMessage("fullName") }}
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="position-relative">
              <MaterialInput
                class="input-group-static input-sm"
                label="Email"
                placeholder="hello@email.com"
                v-model="formData.email"
                @input="updateField('email')"
                :class="{ 'is-invalid': hasError('email') }"
              />
              <div v-if="hasError('email')" class="validation-bubble">
                {{ getErrorMessage("email") }}
              </div>
            </div>
          </div>
          <div class="col-12 mt-2">
            <div class="position-relative">
              <MaterialTextArea
                id="message"
                class="input-group-static textarea-sm"
                :rows="4"
                placeholder="How can we help you?"
                v-model="formData.message"
                @input="updateField('message')"
                :class="{ 'is-invalid': hasError('message') }"
              ></MaterialTextArea>
              <div v-if="hasError('message')" class="validation-bubble">
                {{ getErrorMessage("message") }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-3">
          <MaterialButton
            variant="gradient"
            class="send-btn px-3 py-1"
            type="submit"
            :disabled="isSubmitting"
            :style="{
              backgroundColor: '#98FE98',
              borderColor: '#98FE98',
              color: '#344767',
              'box-shadow': '0px 2px 6px rgba(0, 0, 0, 0.2)',
              fontWeight: '500',
              fontSize: '0.85rem'
            }"
          >
            <i class="fas fa-paper-plane me-1"></i>
            {{ isSubmitting ? "Sending..." : "Send Message" }}
          </MaterialButton>
        </div>
      </form>
        <!-- Correo con icono centrado -->
        <div class="email-container text-center mb-3">
        <i class="fas fa-envelope me-2"></i>
        <strong>mailshuffle@mailshuffle.xyz</strong>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-content {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 15px 5px 15px; /* Reducido padding bottom */
  /* Se eliminó el border-bottom */
}

.dropdown-body {
  padding: 10px 15px 15px 15px;
}

/* Estilo para el correo con icono */
.email-container {
  color: #8392AB;
  font-size: 0.75rem;
  padding: 4px 0;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #777;
  font-size: 1.1rem;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: #f5f5f5;
  color: #333;
}

/* Compactamos los inputs para el bocadillo */
:deep(.input-sm .form-control) {
  padding-top: 0.5rem !important;
  padding-bottom: 0.5rem !important;
  font-size: 0.85rem !important;
}

:deep(.textarea-sm .form-control) {
  font-size: 0.85rem !important;
  padding: 0.5rem !important;
  min-height: 100px !important;
}

:deep(.input-sm label),
:deep(.textarea-sm label) {
  font-size: 0.8rem !important;
}

/* Send button */
.send-btn {
  transition: transform 0.2s, box-shadow 0.2s;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.1);
}

/* Validation bubbles */
.validation-bubble {
  position: absolute;
  background-color: #fff8e1;
  color: #e65100;
  font-size: 0.65rem;
  padding: 3px 6px;
  border-radius: 4px;
  border: 1px solid #ffcc80;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  z-index: 100;
  width: max-content;
  margin-top: -8px;
  left: 12px;
  animation: bubble-in 0.3s ease-out;
  max-width: 90%;
}

.validation-bubble::before {
  content: "";
  position: absolute;
  top: -4px;
  left: 8px;
  width: 6px;
  height: 6px;
  background-color: #fff8e1;
  border-top: 1px solid #ffcc80;
  border-left: 1px solid #ffcc80;
  transform: rotate(45deg);
}

@keyframes bubble-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 767.98px) {
  .dropdown-header {
    padding: 12px 12px 5px 12px;
  }
  
  .dropdown-body {
    padding: 5px 12px 12px 12px;
  }
}
</style>