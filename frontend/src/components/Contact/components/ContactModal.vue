<script setup>
import MaterialInput from "@/material_components/MaterialInput.vue";
import MaterialTextArea from "@/material_components/MaterialTextArea.vue";
import MaterialButton from "@/material_components/MaterialButton.vue";
import { ref, reactive } from "vue";
import Swal from "sweetalert2";

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
  <div
    class="modal fade"
    id="contactModal"
    tabindex="-1"
    aria-labelledby="contactModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <!-- Cabecera con imagen, título y botón de cierre -->
        <div
          class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent"
        >
          <div
            class="custom-gradient border-radius-lg p-3 d-flex align-items-center justify-content-between"
          >
            <h3 class="mb-0">Contact us</h3>
          </div>
        </div>

        <!-- Cuerpo del modal -->
        <div class="modal-body">
          <p>
            For any inquiries or support, feel free to reach out to us at
            <strong>mailshuffle@mailshuffle.xyz</strong> or contact us using our
            contact form.
          </p>
          <form
            id="contact-form"
            @submit="handleSubmit"
            method="post"
            autocomplete="off"
          >
            <div class="row">
              <div class="col-md-6">
                <div class="input-field-container">
                  <MaterialInput
                    class="input-group-static mb-4"
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
              <div class="col-md-6 ps-md-2">
                <div class="input-field-container">
                  <MaterialInput
                    class="input-group-static mb-4"
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
            </div>
            <div class="form-group mb-0 mt-md-0 mt-4">
              <div class="input-field-container">
                <MaterialTextArea
                  id="message"
                  class="input-group-static mb-4"
                  :rows="6"
                  placeholder="Describe your problem in at least 250 characters"
                  v-model="formData.message"
                  @input="updateField('message')"
                  :class="{ 'is-invalid': hasError('message') }"
                  >How can we help you?</MaterialTextArea
                >
                <div v-if="hasError('message')" class="validation-bubble">
                  {{ getErrorMessage("message") }}
                </div>
              </div>
            </div>
            <div class="text-center">
              <MaterialButton
                variant="gradient"
                :style="{
                  backgroundColor: '#98FE98',
                  borderColor: '#98FE98',
                  color: '#344767',
                  'box-shadow': '0px 2px 6px rgba(0, 0, 0, 0.3)',
                }"
                class="mt-3 mb-0 send-btn"
                type="submit"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? "Sending..." : "Send Message" }}
              </MaterialButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-gradient {
  background: #98fe98;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
  color: #344767;
}

.is-invalid {
  border-color: #dc3545 !important;
  background-color: #fff8f8 !important;
}

.input-field-container {
  position: relative;
  margin-bottom: 20px;
}

.validation-bubble {
  position: absolute;
  background-color: #fff8e1;
  color: #e65100;
  font-size: 0.75rem;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid #ffcc80;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 100;
  width: max-content;
  margin-top: -15px;
  left: 20px;
  animation: bubble-in 0.3s ease-out;
  max-width: 90%;
}

.validation-bubble::before {
  content: "";
  position: absolute;
  top: -5px;
  left: 10px;
  width: 10px;
  height: 10px;
  background-color: #fff8e1;
  border-top: 1px solid #ffcc80;
  border-left: 1px solid #ffcc80;
  transform: rotate(45deg);
}

.send-btn:hover {
  transform: scale(1.1);
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
</style>
