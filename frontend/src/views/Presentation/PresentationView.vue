<script setup>
import { onMounted, onUnmounted } from "vue";

//components
import NavbarDefault from "../../components/NavBar/Navbar.vue";
import DefaultFooter from "../../components/Footer.vue";
import Header from "../../components/Header.vue";
import Inbox from "../../components/Inbox/Inbox.vue";
import AboutUs from "../../components/AboutUs/AboutUs.vue";
import Contact from "../../components/Contact/Contact.vue";

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
        <NavbarDefault :sticky="true" :showLogin="true"/>
      </div>
    </div>
  </div>
  <!-- Contact button-->
  <Contact />
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
            <h1 class="pt-3 mt-n5 me-2" :style="{ display: 'inline-block ' }">
              MailShuffle
            </h1>
            <p class="lead px-5 mt-3" :style="{ fontWeight: '500' }">
              Protect your inbox. Generate random emails instantly for safe and
              spam-free signups.
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
    <!-- AboutUs -->
    <AboutUs />
  </div>
  <!-- Footer -->
  <DefaultFooter />
</template>
