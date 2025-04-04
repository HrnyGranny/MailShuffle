<script setup>
import { ref } from "vue";
import MailBox from "@/components/Inbox/components/MailBox.vue";
import { PrismEditor } from "vue-prism-editor";
import "prismjs/themes/prism.css";
import "vue-prism-editor/dist/prismeditor.min.css";
import prism from "prismjs";

const props = defineProps({
  id: { type: String, required: true },
  code: { type: String, required: true },
  title: { type: String, required: true },
  height: { type: String, default: "" },
});

const editorCode = ref(props.code);
const recipient = ref("");
const apiKey = ref("");

const emit = defineEmits(["recipientUpdated", "tabChanged"]);

const updateRecipient = ({ email, apiKey: newApiKey }) => {
  recipient.value = email;
  apiKey.value = newApiKey;
  emit("recipientUpdated", { email, apiKey: newApiKey });
};

const handleTabChange = (tab) => {
  emit("tabChanged", tab);
};

const highlighter = (code) => {
  return prism.highlight(code, prism.languages.html, "html");
};
</script>

<template>
  <div class="position-relative border-radius-xl overflow-hidden shadow-lg mb-7">
    <div class="container border-bottom">
      <div class="row justify-space-between py-2">
        <div class="col-lg-8 me-auto">
          <MailBox @emailGenerated="updateRecipient" />
        </div>
        <div class="col-lg-3">
          <div class="nav-wrapper position-relative end-0">
            <ul class="nav nav-pills nav-fill flex-row p-1" role="tablist">
              <li class="nav-item">
                <a
                  class="nav-link mb-0 px-0 py-1 active"
                  href="#"
                  role="tab"
                  aria-selected="true"
                  @click.prevent="handleTabChange('preview')"
                >
                  <i class="fas fa-desktop text-sm me-2"></i> Preview
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link mb-0 px-0 py-1"
                  href="#"
                  role="tab"
                  aria-selected="false"
                  @click.prevent="handleTabChange('code')"
                >
                  <i class="fas fa-code text-sm me-2"></i> Code
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="tab-content tab-space">
      <div class="tab-pane active p-2" :id="`preview-${id}`">
        <div class="overflow-auto" :class="`${height && `height-${height}`}`">
          <slot />
        </div>
      </div>
      <div class="tab-pane" :id="`code-${id}`">
        <div class="position-relative p-4 pb-2">
          <figure class="highlight">
            <PrismEditor
              class="p-2 bg-gray-100 border-radius-xl height-800 my-editor"
              v-model="editorCode"
              :highlight="highlighter"
              line-numbers
              readonly
            />
          </figure>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.my-editor {
  color: black;
  font-family: Consolas, Fira Mono, Menlo, Courier, monospace;
  font-size: 1em;
  line-height: 1.5;
  padding: 5px;
  tab-size: 4;
}
.prism-editor__textarea:focus {
  outline: none;
}
</style>