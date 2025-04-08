<script setup>
import { onMounted } from "vue";

// Example components
import DefaultNavbar from "./components/Navbar.vue";

// Material components
import MaterialInput from "@/material_components/MaterialInput.vue";
import MaterialTextArea from "@/material_components/MaterialTextArea.vue";
import MaterialButton from "@/material_components/MaterialButton.vue";

// Material input setup
import setMaterialInput from "@/assets/js/material-input";

// Image for the background
import image from "@/assets/img/LoginPlane.jpg";

onMounted(() => {
  setMaterialInput();
});
</script>

<template>
  <DefaultNavbar transparent darkText/>
  <div
    class="page-header align-items-start min-vh-100"
    :style="{
      backgroundImage: `url(${image})`,
    }"
    loading="lazy"
  >
    <span class="mask bg-gradient-dark opacity-6"></span>
    <div class="container my-auto">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7 col-10 custom-container">
          <div
            class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5"
          >
            <div
              class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent"
            >
             <div class="custom-gradient border-radius-lg p-3 d-flex align-items-center justify-content-between">
                <h3 class="mb-0">Contact us</h3>
              <!-- Imagen al lado del texto -->
                <img
                  src="../../assets/img/logos/MailShuffleIcoAlone.png"
                  alt="Contact Icon"
                  class="me-2"
                  style="width: 40px; height: 40px;"
                />
              </div>
            </div>
            <div class="card-body">
              <p class="pb-3">
                For any inquiries or support, feel free to reach out to us at
                <strong>mailshuffle@mailshuffle.xyz</strong> or contact us using
                our contact form.
              </p>
              <form id="contact-form" method="post" autocomplete="off">
                <div class="card-body p-0 my-3">
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
                  <div class="row">
                    <div class="col-md-12 text-center">
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
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="footer position-absolute bottom-2 py-2 w-100">
      <div class="container">
        <div class="row align-items-center justify-content-lg-between">
          <div class="col-12 col-md-6 my-auto">
            <div
              class="copyright text-center text-sm text-white text-lg-start"
            >
              © {{ new Date().getFullYear() }}, made with
              <i class="fa fa-heart" aria-hidden="true"></i> by
              <a
                href="https://github.com/HrnyGranny"
                class="font-weight-bold text-white"
                target="_blank"
                >HornyGranny</a
              >
              for a life free of spam.
            </div>
          </div>
          <div class="col-12 col-md-6">
            <ul
              class="nav nav-footer justify-content-center justify-content-lg-end"
            >
            <!--Por si quieres meter algo a la derecha-->
              <li class="nav-item">
                <a
                  href="/contact"
                  class="nav-link text-white"
                  target="_blank"
                  ></a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.custom-gradient {
  background: #98FE98;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
  color: #344767;
}

.custom-container {
  max-width: 500px; /* Ajusta este valor según sea necesario */
}
</style>