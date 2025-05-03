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
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
        <div class="row g-0">
          <!-- Right side with contact form (now takes full width) -->
          <div class="col-12">
            <div class="p-4 p-lg-5">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="fw-bold text-dark m-0">Contact us</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              
              <p class="text-muted mb-4">
                For any inquiries or support, feel free to reach out to us using our contact form or directly at
                <strong>mailshuffle@mailshuffle.xyz</strong>.
              </p>
              
              <form
                id="contact-form"
                @submit="handleSubmit"
                method="post"
                autocomplete="off"
              >
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="position-relative">
                      <MaterialInput
                        class="input-group-static"
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
                        class="input-group-static"
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
                  <div class="col-12 mt-3">
                    <div class="position-relative">
                      <MaterialTextArea
                        id="message"
                        class="input-group-static"
                        :rows="6"
                        placeholder="Describe your problem in at least 250 characters"
                        v-model="formData.message"
                        @input="updateField('message')"
                        :class="{ 'is-invalid': hasError('message') }"
                      >How can we help you?</MaterialTextArea>
                      <div v-if="hasError('message')" class="validation-bubble">
                        {{ getErrorMessage("message") }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="text-center mt-4">
                  <MaterialButton
                    variant="gradient"
                    class="send-btn px-4 py-2"
                    type="submit"
                    :disabled="isSubmitting"
                    :style="{
                      backgroundColor: '#98FE98',
                      borderColor: '#98FE98',
                      color: '#344767',
                      'box-shadow': '0px 2px 6px rgba(0, 0, 0, 0.2)',
                      fontWeight: '500'
                    }"
                  >
                    <i class="fas fa-paper-plane me-2"></i>
                    {{ isSubmitting ? "Sending..." : "Send Message" }}
                  </MaterialButton>
                  
                  <div class="d-flex justify-content-center mt-3 flex-wrap">
                    <span class="badge bg-light text-dark mx-1 p-2 d-flex align-items-center">
                      <i class="fas fa-lock text-success me-1"></i> Secure
                    </span>
                    <span class="badge bg-light text-dark mx-1 p-2 d-flex align-items-center">
                      <i class="fas fa-shield-alt text-success me-1"></i> Private
                    </span>
                    <span class="badge bg-light text-dark mx-1 p-2 d-flex align-items-center">
                      <i class="fas fa-bolt text-success me-1"></i> Fast Response
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Contact banner styling */
.contact-banner {
  background-color: #f8f9fa;
  background-image: linear-gradient(120deg, #f8f9fa 0%, #e4ffe4 100%);
  position: relative;
  overflow: hidden;
}

/* Ribbon container */
.ribbon-container {
  position: absolute;
  top: 0;
  right: 0;
  overflow: hidden;
  width: 150px;
  height: 150px;
}

.ribbon {
  position: absolute;
  top: 30px;
  right: -50px;
  width: 200px;
  background: #4caf50;
  color: white;
  text-align: center;
  line-height: 35px;
  letter-spacing: 1px;
  font-weight: bold;
  transform: rotate(45deg);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

/* Contact highlight box */
.contact-highlight {
  background: linear-gradient(45deg, #98FE98, #c3ffc3);
  box-shadow: 0 3px 8px rgba(152, 254, 152, 0.3);
}

/* Feature icons */
.feature-item {
  font-size: 0.9rem;
  color: #555;
}

.feature-item i {
  font-size: 1.1rem;
}

/* Button hover animation */
.send-btn {
  transition: transform 0.2s, box-shadow 0.2s;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3) !important;
}

/* Validation bubbles */
.validation-bubble {
  position: absolute;
  background-color: #fff8e1;
  color: #e65100;
  font-size: 0.7rem;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ffcc80;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  z-index: 100;
  width: max-content;
  margin-top: -12px;
  left: 20px;
  animation: bubble-in 0.3s ease-out;
  max-width: 90%;
}

.validation-bubble::before {
  content: "";
  position: absolute;
  top: -5px;
  left: 10px;
  width: 8px;
  height: 8px;
  background-color: #fff8e1;
  border-top: 1px solid #ffcc80;
  border-left: 1px solid #ffcc80;
  transform: rotate(45deg);
}

/* Animation */
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
@media (max-width: 991.98px) {
  .modal-dialog {
    max-width: 90%;
    margin: 1.75rem auto;
  }
}

@media (max-width: 767.98px) {
  .modal-dialog {
    max-width: 95%;
    margin: 1rem auto;
  }
}

@media (max-width: 575.98px) {
  .modal-dialog {
    max-width: 98%;
    margin: 0.5rem auto;
  }
}
</style>