<script setup>
import { onMounted } from "vue";

// example components
import DefaultNavbar from "@/components/Navbar.vue";
import Header from "@/components/Header.vue";

//Vue material components
import MaterialInput from "@/material_components/MaterialInput.vue";
import MaterialSwitch from "@/material_components/MaterialSwitch.vue";
import MaterialButton from "@/material_components/MaterialButton.vue";
import Contact from "../../components/Contact/Contact.vue";

// material-input
import setMaterialInput from "@/assets/js/material-input";

//image
import BackImage from "@/assets/img/LoginPlane.jpg";

onMounted(() => {
  setMaterialInput();
});
</script>
<template>
  <DefaultNavbar transparent :showLogin="false" />
  <Contact/>
  <Header>
    <div
      class="page-header align-items-start min-vh-100"
      :style="{
        backgroundImage: `url(${BackImage})`
      }"
      loading="lazy"
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container my-auto">
        <div class="row">
          <div class="col-lg-4 col-md-8 col-12 mx-auto">
            <div class="card z-index-0 fadeIn3 fadeInBottom">
              <div
                class="card-header p-0 position-relative mt-n4 mx-3 z-index-2"
              >
                <div
                  class="custom-gradient border-radius-lg py-3 pe-1"
                >
                  <div class="d-flex justify-content-center mb-2">
                  </div>
                  <h4
                    class="text-dark font-weight-bolder text-center mt-2 mb-0"
                  >
                    Sign in
                  </h4>
                </div>
              </div>
              <div class="card-body">
                <form role="form" class="text-start">
                  <MaterialInput
                    id="email"
                    class="input-group-outline my-3"
                    :label="{ text: 'Email', class: 'form-label' }"
                    type="email"
                  />
                  <MaterialInput
                    id="password"
                    class="input-group-outline mb-3"
                    :label="{ text: 'Password', class: 'form-label' }"
                    type="password"
                  />
                  <MaterialSwitch
                    class="d-flex align-items-center mb-3"
                    id="rememberMe"
                    labelClass="mb-0 ms-3"
                    checked
                    >Remember me</MaterialSwitch
                  >

                  <div class="text-center">
                    <MaterialButton
                      class="my-4 mb-2"
                      variant="gradient"
                      fullWidth
                      :style="{
                        backgroundColor: '#98FE98',
                        borderColor: '#98FE98',
                        color: '#344767',
                        'box-shadow': '0px 2px 6px rgba(0, 0, 0, 0.3)',
                      }"
                      >Sign in
                      </MaterialButton
                    >
                  </div>
                  <p class="mt-4 text-sm text-center">
                    Don't have an account?
                    <a
                      href="#"
                      class="text-success text-gradient font-weight-bold"
                      >Sign up</a
                    >
                  </p>
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
                © {{ new Date().getFullYear() }}, made by
                <a
                  href="https://github.com/HrnyGranny"
                  class="font-weight-bold text-white"
                  target="_blank"
                  >HornyGranny</a
                >
              </div>
            </div>
            <div class="col-12 col-md-6">
              <ul
                class="nav nav-footer justify-content-center justify-content-lg-end"
              >
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
  </Header>
</template>

<style scoped>
.custom-gradient {
  background: #98FE98;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
  color: #344767;
}
</style>
