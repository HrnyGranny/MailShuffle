<script setup>
import { onMounted, onUnmounted } from "vue";

//example components
import NavbarDefault from "../../components/Navbar.vue";
import DefaultFooter from "../../components/Footer.vue";
import Header from "../../components/Header.vue";
import Inbox from "../../components/Inbox/Inbox.vue";
import HowTo from "../../components/HowTo/HowTo.vue";

//Vue Material Kit 2 components
import MaterialSocialButton from "@/material_components/MaterialSocialButton.vue";

//images
import vueMkHeader from "@/assets/img/PaperPv.jpg";

//hooks
const body = document.getElementsByTagName("body")[0];
onMounted(() => {
  body.classList.add("presentation-page");
  body.classList.add("bg-gray-200");
});
onUnmounted(() => {
  body.classList.remove("presentation-page");
  body.classList.remove("bg-gray-200");
});
</script>

<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <NavbarDefault :sticky="true" />
      </div>
    </div>
  </div>
  <!-- Header -->
  <Header>
    <div
      class="page-header min-vh-75"
      :style="`background-image: url(${vueMkHeader})`"
      loading="lazy"
    >
      <div class="container">
        <div class="row">
          <div class="col-lg-7 text-center mx-auto position-relative">
            <h1
              class="pt-3 mt-n5 me-2"
              :style="{ display: 'inline-block ' }"
            >
              MailShuffle
            </h1>
            <p class="lead px-5 mt-3" :style="{ fontWeight: '500' }">
              Protect your inbox. Generate random emails instantly for safe and spam-free signups.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Header>
  <!--body-->
  <div class="card card-body blur shadow-blur mx-3 mx-md-4 mt-n6">
    <!-- Inbox -->
    <Inbox />
    <!-- How To -->
    <HowTo />
    <!-- Thanks -->
    <div class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-5 ms-auto">
            <h4 class="mb-1">Thank you for your support!</h4>
            <p class="lead mb-0">We deliver the best web products</p>
          </div>
          <div class="col-lg-5 me-lg-auto my-lg-auto text-lg-end mt-5">
            <MaterialSocialButton
              route="https://twitter.com/intent/tweet?text=Check%20Material%20Design%20System%20made%20by%20%40CreativeTim%20%23webdesign%20%23designsystem%20%23bootstrap5&url=https%3A%2F%2Fwww.creative-tim.com%2Fproduct%2Fmaterial-design-system-pro"
              component="twitter"
              color="twitter"
              label="Tweet"
            />
            <MaterialSocialButton
              route="https://www.facebook.com/sharer/sharer.php?u=https://www.creative-tim.com/product/material-design-system-pro"
              component="facebook-square"
              color="facebook"
              label="Share"
            />
            <MaterialSocialButton
              route=""
              component="pinterest"
              color="pinterest"
              label="Pin it"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Footer -->
  <DefaultFooter />
</template>
