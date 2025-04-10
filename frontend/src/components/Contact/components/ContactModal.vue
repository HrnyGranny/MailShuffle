<!-- filepath: src/components/ContactModal.vue -->
<script setup>
import MaterialInput from "@/material_components/MaterialInput.vue";
import MaterialTextArea from "@/material_components/MaterialTextArea.vue";
import MaterialButton from "@/material_components/MaterialButton.vue";
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
          <form id="contact-form" method="post" autocomplete="off">
            <div class="row">
              <div class="col-md-6">
                <MaterialInput
                  class="input-group-static mb-4"
                  type="text"
                  label="Full Name"
                  placeholder="Full Name"
                />
              </div>
              <div class="col-md-6 ps-md-2">
                <MaterialInput
                  class="input-group-static mb-4"
                  type="email"
                  label="Email"
                  placeholder="hello@creative-tim.com"
                />
              </div>
            </div>
            <div class="form-group mb-0 mt-md-0 mt-4">
              <MaterialTextArea
                id="message"
                class="input-group-static mb-4"
                :rows="6"
                placeholder="Describe your problem in at least 250 characters"
                >How can we help you?</MaterialTextArea
              >
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
                class="mt-3 mb-0"
                >Send Message</MaterialButton
              >
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
</style>
