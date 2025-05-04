<script setup>
import MaterialInput from "@/material_components/MaterialInput.vue";
import MaterialButton from "@/material_components/MaterialButton.vue";
import { ref, reactive } from "vue";
import Swal from "sweetalert2";
import { registerUser } from "@/api/userService"; 

// Props to control modal visibility
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

// Close modal function
const closeModal = () => {
  emit('close');
};

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

    await registerUser({
      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    // Success message
    Swal.fire({
      toast: true,
      position: "bottom-start",
      title: "Registration successful! Redirecting to payment...",
      color: "#3a526a",
      background: "#feb60257",
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
    
    // Close modal on success
    closeModal();
    
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
  <div v-if="props.show" class="modal-backdrop" @click="closeModal"></div>
  <div v-if="props.show" class="modal-container" @click.stop>
    <div class="modal-content">
      <!-- Reemplazamos el botón de cerrar anterior por el nuevo con icono Font Awesome -->
      <button type="button" class="close-btn" @click="closeModal" aria-label="Close">
        <i class="fas fa-times"></i>
      </button>
      
      <div class="card premium-card shadow border-0">
        <div class="row g-0">
          <!-- Left side: Features & title -->
          <div class="col-lg-5">
            <div class="premium-info h-100 d-flex flex-column">
              <!-- Corner ribbon -->
              <div class="ribbon-container">
                <div class="ribbon">PREMIUM</div>
              </div>
              
              <div class="d-flex align-items-center mb-2">
                <h3 class="mb-0 fw-bold text-dark">Upgrade to Premium</h3>
              </div>
              
              <div class="mb-3 position-relative">
                <div class="price-tag">
                  <span class="price">$9.99</span>
                  <span class="period">/month</span>
                </div>
              </div>
              
              <div class="flex-grow-1">
                <div class="comparison-table">
                  <div class="table-row header-row">
                    <div class="feature-cell">Features</div>
                    <div class="status-cell">Free</div>
                    <div class="status-cell premium">Premium</div>
                  </div>
                  
                  <div class="table-row" v-for="(feature, index) in premiumFeatures" :key="index">
                    <div class="feature-cell">{{ feature }}</div>
                    <div class="status-cell"><i class="fas fa-times"></i></div>
                    <div class="status-cell premium"><i class="fas fa-check"></i></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right side: Form -->
          <div class="col-lg-7">
            <div class="h-100 d-flex flex-column justify-content-center px-3 pt-4 pb-3">
              <div class="w-100">
                <h4 class="text-center fw-bold fs-4 mb-3">Create Your Premium Account</h4>
                
                <form @submit="handleSubmit" method="post" autocomplete="off">
                  <div class="row g-2">
                    <!-- Full Name (full width) -->
                    <div class="col-12">
                      <div class="position-relative mb-1">
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
                    
                    <!-- Username (full width) -->
                    <div class="col-12">
                      <div class="position-relative mb-1">
                        <MaterialInput
                          class="input-group-static"
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
                    
                    <!-- Email (full width) -->
                    <div class="col-12">
                      <div class="position-relative mb-1">
                        <MaterialInput
                          class="input-group-static"
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
                    
                    <!-- Password fields (sharing a row) -->
                    <div class="col-md-6">
                      <div class="position-relative mb-1">
                        <MaterialInput
                          class="input-group-static"
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
                    
                    <div class="col-md-6">
                      <div class="position-relative mb-1">
                        <MaterialInput
                          class="input-group-static"
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
                
                  <div class="mt-4">
                    <div class="text-center">
                      <MaterialButton
                        variant="gradient"
                        :style="{
                          backgroundColor: '#feb602',
                          borderColor: '#feb602',
                          color: '#344767',
                          'box-shadow': '0px 2px 6px rgba(0, 0, 0, 0.3)',
                          fontSize: '0.95rem',
                          padding: '8px 25px'
                        }"
                        class="premium-btn"
                        type="submit"
                        :disabled="isSubmitting"
                      >
                        {{ isSubmitting ? "Processing..." : "Subscribe Now" }}
                      </MaterialButton>
                      
                      <div class="d-flex justify-content-center flex-wrap mt-2">
                        <span class="indicator-item">
                          <i class="fas fa-lock"></i> Secure Payment
                        </span>
                        <span class="indicator-item">
                          <i class="fas fa-undo"></i> Easy Cancellation
                        </span>
                        <span class="indicator-item">
                          <i class="fas fa-headset"></i> 24/7 Support
                        </span>
                      </div>
                      
                      <p class="small text-muted mb-0 mt-2">
                        By clicking "Subscribe Now", you agree to our 
                        <a href="#" class="text-primary">Terms of Service</a> and 
                        <a href="#" class="text-primary">Privacy Policy</a>
                      </p>
                    </div>
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
/* Modal styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  max-width: 100%;
  width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

/* Nuevo estilo para el botón de cerrar, igual al de ContactDropdown */
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
}

.close-btn:hover {
  background-color: #f5f5f5;
  color: #333;
}

/* Premium card */
.premium-card {
  border-radius: 15px;
  overflow: hidden;
}

/* Left side premium info */
.premium-info {
  background-color: #f9f9f9;
  padding: 25px;
  border-right: 1px solid #eee;
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
  background: #feb602;
  color: white;
  text-align: center;
  line-height: 35px;
  letter-spacing: 1px;
  font-weight: bold;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

/* Price styling */
.price-tag {
  background: linear-gradient(45deg, #feb602, #ffcf4d);
  display: inline-block;
  padding: 6px 12px;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(254, 182, 2, 0.3);
  text-align: center;
}

.price {
  font-size: 2.2rem;
  font-weight: bold;
  color: #344767;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
}

.period {
  font-size: 0.9rem;
  color: #344767;
  opacity: 0.8;
}

/* Comparison table */
.comparison-table {
  width: 100%;
  font-size: 0.85rem;
  position: relative;
  z-index: 5;
}

.table-row {
  display: flex;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
}

.header-row {
  font-weight: 600;
  border-bottom: 2px solid #ddd;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.feature-cell {
  flex: 1;
  padding-right: 10px;
}

.status-cell {
  width: 50px;
  text-align: center;
}

.status-cell.premium {
  width: 65px;
}

.status-cell i.fa-times {
  color: #dc3545;
}

.status-cell i.fa-check {
  color: #198754;
}

.status-cell.premium i.fa-check {
  color: #198754;
}

/* Button */
.premium-btn {
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
}

.premium-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4) !important;
}

/* Validation bubble */
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

/* Trust indicators */
.indicator-item {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: #555;
  margin: 0 5px;
}

.indicator-item i {
  margin-right: 4px;
  color: #feb602;
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
  .premium-info {
    border-right: none;
    border-bottom: 1px solid #eee;
    padding: 20px;
  }
  
  .modal-container {
    width: 95%;
  }
}

@media (max-width: 767.98px) {
  .comparison-table {
    max-height: 200px;
    overflow-y: auto;
  }
  
  .modal-container {
    height: 90vh;
    overflow-y: auto;
  }
  
  .premium-card {
    max-height: none;
  }
}
</style>