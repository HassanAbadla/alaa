<template>
  <form-template
    :editForm="editForm"
    :itemId="itemId"
    :fields="fields"
    store="threatImpactStrengths"
    singlularEntityName="Strength"
    pluralEntityName="Strengths"
  >
    <template #default="{ formData, updateField, getFieldError }">
      <!-- Flattened fields - much simpler! -->
      <custom-input
        :label="$t('table.english_name')"
        v-model="formData['name.en']"
        :errors="getFieldError('name.en')"
        restrictLanguage="en"
        required
      />
      <custom-input
        :label="$t('table.arabic_name')"
        v-model="formData['name.ar']"
        :errors="getFieldError('name.ar')"
        restrictLanguage="ar"
        required
      />
      <custom-input :label="$t('table.code')" v-model="formData.code" :errors="getFieldError('code')" required />
      <custom-color-picker
        :label="$t('table.color')"
        v-model="formData.color"
        :errors="getFieldError('color')"
        required
      />

      <quill-editor v-model="formData.note" class="mb-4" />
    </template>
  </form-template>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import QuillEditor from "../QuillEditor.vue"
import FormTemplate from "./FormTemplate.vue"

export default {
  components: { FormTemplate, QuillEditor },
  name: "ThreatImpactStrengthForm",
  props: {
    editForm: {
      type: Boolean,
      default: false
    },
    itemId: { type: Number }
  },
  data() {
    return {
      // Flattened field structure
      fields: {
        "name.en": "",
        "name.ar": "",
        code: "",
        note: "",
        color: ""
      }
    }
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({})
  },
  async mounted() {
    Promise.all([])
  }
}
</script>
