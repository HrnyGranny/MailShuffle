<script setup>
import AboutUsOption from "../AboutUs/Components/AboutUsOption.vue";
</script>

<template>
  <section class="py-9">
    <div class="container ms-7">
      <div class="row">
        <div class="col-lg-6 my-auto">
          <h3>Why MailShuffle?</h3>
          <p class="pe-6">
            We provide a simple and effective solution to avoid spam and protect your privacy. 
            With our random email generator, you can create temporary inboxes to receive emails 
            without exposing your personal email address.
          </p>
          <a
            href="javascript:;"
            class="text-custom icon-move-right"
            :style="{ color: '#4E64EE' }"
          >
            Support Me
            <i class="fas fa-arrow-right text-sm ms-1"></i>
          </a>
        </div>
        <div class="col-lg-6 mt-lg-0 mt-5 ps-lg-0 ps-0">
          <div class="pe-5">
            <AboutUsOption
              :icon="{ component: 'schedule', color: '#4E64EE' }"
              content="Emails last for 7 days, giving you enough time to manage your temporary inbox."
            />
            <AboutUsOption
              :icon="{ component: 'add_circle', color: '#4E64EE' }"
              content="Generate as many random email addresses as you want, completely free."
            />
            <AboutUsOption
              :icon="{ component: 'security', color: '#4E64EE' }"
              content="Your privacy is our priority. Avoid spam and keep your personal email safe."
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>