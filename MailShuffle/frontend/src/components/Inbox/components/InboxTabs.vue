<script setup>
const props = defineProps({
  activeTab: { type: String, default: "preview" }
});

const emit = defineEmits(["tabChanged"]);

const handleTabChange = (tab) => {
  if (props.activeTab !== tab) {
    emit("tabChanged", tab);
  }
};
</script>

<template>
  <div class="nav-wrapper position-relative end-0">
    <ul class="nav nav-pills nav-fill flex-row p-1" role="tablist">
      <li class="nav-item">
        <a
          class="nav-link mb-0 px-0 py-1"
          :class="{ active: activeTab === 'preview' }"
          href="#"
          role="tab"
          :aria-selected="activeTab === 'preview'"
          @click.prevent="handleTabChange('preview')"
        >
          <i class="fas fa-desktop text-sm me-2"></i> MailBox
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link mb-0 px-0 py-1"
          :class="{ active: activeTab === 'code' }"
          href="#"
          role="tab"
          :aria-selected="activeTab === 'code'"
          @click.prevent="handleTabChange('code')"
        >
          <i class="fas fa-code text-sm me-2"></i> API Code
        </a>
      </li>
    </ul>
  </div>
</template>
