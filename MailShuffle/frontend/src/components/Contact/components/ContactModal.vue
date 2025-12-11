<script setup>
import MaterialInput from "@/material_components/MaterialInput.vue";
import MaterialTextArea from "@/material_components/MaterialTextArea.vue";
import MaterialToast from "@/material_components/MaterialToast.vue";
import MaterialButton  from "@/material_components/MaterialButton.vue"; 
import { ref, reactive, defineEmits } from "vue";

const emit = defineEmits(['close']);

// Form data with reactive references
const formData = reactive({
  fullName: "",
  email: "",
  message: "",
});

// Track if form has been submitted
const formSubmitted = ref(false);
const toastRef = ref(null);

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
    toastRef.value?.showToast({
      title: "Message sent successfully!",
      type: "success",
      overrides: {
        width: "230px",
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
    toastRef.value?.showToast({
      title: "Error sending message!",
      type: "error",
      overrides: {
        width: "225px",
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
    <MaterialToast ref="toastRef" />
    <!-- Header con nuevo diseño -->
    <div class="dropdown-header">
      <div class="header-content">
        <h5 class="header-title">Get in touch</h5>
        <p class="header-subtitle">We'll get back to you as soon as possible</p>
      </div>
        <button type="button" class="close-btn" @click="close" aria-label="Close">
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
        <div class="row g-3">
          <!-- Full Name Field -->
          <div class="col-md-6">
            <div class="position-relative">
              <MaterialInput
                class="input-group-static input-sm"
                type="text"
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
          
          <!-- Email Field -->
          <div class="col-md-6">
            <div class="position-relative">
              <MaterialInput
                class="input-group-static input-sm"
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
          
          <!-- Message Field -->
          <div class="col-12">
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
        
        <!-- Send Button  -->
        <div class="text-center mt-4 button-offset" style="padding-top: 10px;">
          <MaterialButton 
            type="submit"
            label="Send Message"
            :disabled="isSubmitting"
            fullWidth="true"
            size="medium"
          >
            <span class="material-icons-round" style="margin-right: 6px; font-size: 16px;">send</span>
            {{ isSubmitting ? "Sending..." : "Send Message" }}
          </MaterialButton >
        </div>
      </form>
      
      <!-- Contact Details Section -->
      <div class="contact-details">
        <div class="divider">
          <span>or contact us directly</span>
        </div>
        <div class="contact-method">
          <span class="material-icons-round contact-icon">email</span>
          <a href="mailto:mailshuffle@mailshuffle.xyz" class="contact-link">7dMail@mailshuffle.xyz</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-content {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

/* Header styling */
.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 20px 0 20px;
  position: relative;
}

.header-content {
  flex: 1;
}

.header-title {
  margin: 0;
  font-weight: 600;
  color: #344767;
  font-size: 1.25rem;
}

.header-subtitle {
  margin: 4px 0 0;
  color: #8392AB;
  font-size: 0.85rem;
  font-weight: 400;
}

/* Body styling */
.dropdown-body {
  padding: 15px 20px 20px;
}

/* Close button */
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
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
  z-index: 10;
  padding: 0;
}

.close-btn:hover {
  background-color: #f5f5f5;
  color: #333;
}

/* Form styling */
#contact-form {
  margin-top: 5px;
}

.row {
  margin-left: -10px;
  margin-right: -10px;
}

.col-md-6, .col-12 {
  padding-left: 10px;
  padding-right: 10px;
}

/* Contact details section */
.contact-details {
  margin-top: 20px;
}

.divider {
  position: relative;
  text-align: center;
  margin: 25px 0 15px;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e9ecef;
  z-index: 1;
}

.divider span {
  position: relative;
  z-index: 2;
  background-color: white;
  padding: 0 10px;
  font-size: 0.75rem;
  color: #8392AB;
}

.contact-method {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.contact-icon {
  font-size: 18px;
  color: #8392AB;
  margin-right: 8px;
}

.contact-link {
  color: #344767;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.2s;
}

/* Input styling */
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

/* Validation bubbles */
.validation-bubble {
  position: absolute;
  background-color: #fff8e1;
  color: #e65100;
  font-size: 0.65rem;
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

.button-offset :deep(button span) {
  transform: translateY(2px);
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
    padding: 15px 15px 0 15px;
  }
  
  .dropdown-body {
    padding: 10px 15px 15px 15px;
  }
  
  .header-title {
    font-size: 1.15rem;
  }
  
  .header-subtitle {
    font-size: 0.8rem;
  }
}

@media (max-width: 575.98px) {
  .dropdown-header {
    padding: 12px 12px 0 12px;
  }
  
  .dropdown-body {
    padding: 8px 12px 12px 12px;
  }
}
</style>