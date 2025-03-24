<script setup>
import { onMounted } from "vue";
//Vue Material Kit 2 components
import MaterialInput from "@/material_components/MaterialInput.vue";
import MaterialButton from "@/material_components/MaterialButton.vue";

// Importar iconos desde assets
import CopyIcon from "../../../assets/img/iconos/copiar.png";
import ReloadIcon from "../../../assets/img/iconos/recargar.png";

// material-input
import setMaterialInput from "@/assets/js/material-input";
onMounted(() => {
  setMaterialInput();
});
</script>

<template>
  <section class="my-0 pt-0">
    <div class="container">
      <div class="row">
        <div class="col-md-6 offset-md-0 ms-lg-n4 ms-md-n3">
          <div class="row">
            <div class="col-8">
              <MaterialInput
                class="input-group-outline"
                id="email"
                :label="{ text: 'Email Here...', class: 'form-label' }"
                type="email"
              />
            </div>
            <div class="col-4 ps-0">
              <div class="row g-2">
                <div class="col-6">
                  <MaterialButton
                    variant="gradient"
                    color="success"
                    class="mb-0 h-100 w-100 d-flex align-items-center justify-content-center p-2"
                  >
                    <img :src="CopyIcon" alt="Copy" class="icon-button" />
                  </MaterialButton>
                </div>
                <div class="col-6">
                  <MaterialButton
                    variant="gradient"
                    color="warning"
                    class="mb-0 h-100 w-100 d-flex align-items-center justify-content-center p-2"
                  >
                    <img :src="ReloadIcon" alt="Reload" class="icon-button" />
                  </MaterialButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.icon-button {
  width: 20px;
  height: 20px;
}
</style>