<script setup>
import MaterialInput from "@/material_components/MaterialInput.vue";
import MaterialButton from "@/material_components/MaterialButton.vue";
import { ref, reactive } from "vue";
import Swal from "sweetalert2";

// Form data with reactive references
const formData = reactive({
  fullName: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
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
const isValidUsername = () => formData.username.trim().length >= 4;
const isValidPassword = () => formData.password.length >= 8;
const isValidConfirmPassword = () => 
  formData.password === formData.confirmPassword && !!formData.confirmPassword;

// Check if a field has an error (only after form submission)
const hasError = (field) => {
  if (!formSubmitted.value) return false;

  if (field === "fullName") return !isValidFullName();
  if (field === "email") return !isValidEmail();
  if (field === "username") return !isValidUsername();
  if (field === "password") return !isValidPassword();
  if (field === "confirmPassword") return !isValidConfirmPassword();

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

  if (field === "username") return "Username must be at least 4 characters";

  if (field === "password") return "Password must be at least 8 characters";

  if (field === "confirmPassword") {
    if (!formData.confirmPassword) return "Please confirm your password";
    return "Passwords don't match";
  }

  return "";
};

// Handle form submission
const handleSubmit = async (event) => {
  event.preventDefault();

  // Mark form as submitted (to show validation errors)
  formSubmitted.value = true;

  // Direct validation
  const isFormValid = 
    isValidFullName() && 
    isValidEmail() && 
    isValidUsername() && 
    isValidPassword() && 
    isValidConfirmPassword();

  // return if form is invalid
  if (!isFormValid) {
    return;
  }

  // Set submitting state
  isSubmitting.value = true;

  try {
    // Here you would implement your actual form submission and payment logic
    // For example: await fetch('/api/register-premium', { method: 'POST', body: JSON.stringify(formData) })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Success message
    Swal.fire({
      toast: true,
      position: "bottom-start",
      title: "Registration successful! Redirecting to payment...",
      color: "#3a526a",
      background: "#98fe9857",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
      didOpen: (popup) => {
        popup.style.width = "350px";
        popup.style.padding = "5px";
        popup.style.borderRadius = "10px";
      },
    });

    // Reset form
    formData.fullName = "";
    formData.email = "";
    formData.username = "";
    formData.password = "";
    formData.confirmPassword = "";

    // Reset form submitted state
    formSubmitted.value = false;
    
    // Here you would typically redirect to PayPal payment processing
    // window.location.href = '/payment';
  } catch (error) {
    // Error message
    Swal.fire({
      toast: true,
      position: "bottom-start",
      title: "Error during registration!",
      color: "#3a526a",
      background: "#b9424261",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
      didOpen: (popup) => {
        popup.style.width = "250px";
        popup.style.padding = "5px";
        popup.style.borderRadius = "10px";
      },
    });
    console.error("Error during registration:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// Additional function to clear validation when a field is fixed
const updateField = (field) => {
  // If the form hasn't been submitted yet, no need to do anything
  if (!formSubmitted.value) return;

  // Check if all fields are now valid
  if (isValidFullName() && isValidEmail() && isValidUsername() && 
      isValidPassword() && isValidConfirmPassword()) {
    // All fields are valid, reset the form submitted state so errors disappear
    formSubmitted.value = false;
  }
};

// Premium features list
const premiumFeatures = [
  "Unlimited temporary email addresses",
  "Premium domains access", 
  "Extended email storage (90 days)",
  "Priority customer support",
  "No ads experience",
  "Custom domains integration",
  "Advanced filtering options",
  "Bulk operations for emails",
  "API access for developers",
  "Enhanced security features"
];
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <div class="card overflow-visible">
          <!-- Header with title - Note the overflow-visible class in parent -->
          <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
            <div class="custom-gradient border-radius-lg p-3 d-flex align-items-center justify-content-between">
              <h3 class="mb-0">Upgrade to Premium</h3>
            </div>
          </div>

          <!-- Card body -->
          <div class="card-body p-4">
            <div class="row">
              <!-- Left side: Premium benefits -->
              <div class="col-md-5 pe-md-4 mb-4 mb-md-0">
                <div class="premium-benefits">
                  <h4 class="mb-3">Premium Benefits</h4>
                  <div class="price-banner mb-4">
                    <span class="price">$9.99</span>
                    <span class="period">/month</span>
                  </div>
                  <ul class="feature-list">
                    <li v-for="(feature, index) in premiumFeatures" :key="index">
                      <i class="fas fa-check-circle text-success me-2"></i>
                      {{ feature }}
                    </li>
                  </ul>
                  <div class="guarantee mt-4">
                    <i class="fas fa-shield-alt me-2"></i>
                    30-day money-back guarantee
                  </div>
                </div>
              </div>

              <!-- Right side: Registration form -->
              <div class="col-md-7 ps-md-4 form-section">
                <h4 class="mb-3">Create Your Premium Account</h4>
                <form @submit="handleSubmit" method="post" autocomplete="off">
                  <div class="row">
                    <div class="col-md-12">
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
                    <div class="col-md-12">
                      <div class="input-field-container">
                        <MaterialInput
                          class="input-group-static mb-4"
                          label="Email"
                          placeholder="your@email.com"
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
                  <div class="row">
                    <div class="col-md-12">
                      <div class="input-field-container">
                        <MaterialInput
                          class="input-group-static mb-4"
                          label="Username"
                          placeholder="Choose a username"
                          v-model="formData.username"
                          @input="updateField('username')"
                          :class="{ 'is-invalid': hasError('username') }"
                        />
                        <div v-if="hasError('username')" class="validation-bubble">
                          {{ getErrorMessage("username") }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="input-field-container">
                        <MaterialInput
                          class="input-group-static mb-4"
                          type="password"
                          label="Password"
                          placeholder="Create a password"
                          v-model="formData.password"
                          @input="updateField('password')"
                          :class="{ 'is-invalid': hasError('password') }"
                        />
                        <div v-if="hasError('password')" class="validation-bubble">
                          {{ getErrorMessage("password") }}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 ps-md-2">
                      <div class="input-field-container">
                        <MaterialInput
                          class="input-group-static mb-4"
                          type="password"
                          label="Confirm Password"
                          placeholder="Confirm your password"
                          v-model="formData.confirmPassword"
                          @input="updateField('confirmPassword')"
                          :class="{ 'is-invalid': hasError('confirmPassword') }"
                        />
                        <div v-if="hasError('confirmPassword')" class="validation-bubble">
                          {{ getErrorMessage("confirmPassword") }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="text-center mt-4">
                    <MaterialButton
                      variant="gradient"
                      :style="{
                        backgroundColor: '#98FE98',
                        borderColor: '#98FE98',
                        color: '#344767',
                        'box-shadow': '0px 2px 6px rgba(0, 0, 0, 0.3)',
                        fontSize: '1rem',
                        padding: '10px 25px'
                      }"
                      class="mt-3 mb-0 premium-btn"
                      type="submit"
                      :disabled="isSubmitting"
                    >
                      {{ isSubmitting ? "Processing..." : "Subscribe Now" }}
                    </MaterialButton>
                    <p class="mt-3 small text-muted">
                      By clicking "Subscribe Now", you agree to our 
                      <a href="#" class="text-primary">Terms of Service</a> and 
                      <a href="#" class="text-primary">Privacy Policy</a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
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

.card {
  border-radius: 15px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
  border: none;
}

/* Crucial fix: Allow the header to overflow */
.overflow-visible {
  overflow: visible !important;
}

/* Make the header stand out more */
.card-header {
  transform: translateY(-20px);
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

.premium-benefits {
  padding: 20px;
  background-color: #f9fffe;
  border-radius: 12px;
  height: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.feature-list {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
}

.feature-list li {
  margin-bottom: 12px;
  font-size: 0.95rem;
  display: flex;
  align-items: flex-start;
}

.feature-list li i {
  color: #2ecc71;
  margin-right: 10px;
  margin-top: 2px;
}

.price-banner {
  background: linear-gradient(to right, #98fe98, #7aed7a);
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.price {
  font-size: 2.2rem;
  font-weight: bold;
  color: #344767;
}

.period {
  font-size: 1rem;
  color: #344767;
}

.guarantee {
  text-align: center;
  background-color: #f1f8e9;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #33691e;
}

.premium-btn {
  width: 80%;
  max-width: 300px;
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
}

.premium-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4) !important;
}

.form-section {
  border-left: 1px solid #eee;
}

@media (max-width: 767px) {
  .form-section {
    border-left: none;
    border-top: 1px solid #eee;
    padding-top: 30px;
    margin-top: 20px;
  }
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