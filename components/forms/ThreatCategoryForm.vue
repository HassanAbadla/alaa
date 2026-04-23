<template>
  <form-template
    :editForm="editForm"
    :itemId="itemId"
    :fields="fields"
    store="threatCategories"
    singlularEntityName="Category"
    pluralEntityName="Categories"
  >
    <template #default="{ formData, updateField, getFieldError }">
      <!-- Remove v-if conditions since we're using flattened fields -->
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
      <custom-dropdown
        :label="$t('table.threat_type')"
        v-model="formData.bcm_lifethreat_type_id"
        :items="threatTypes"
        item-value="id"
        item-text="name"
        :loading="loadingThreatTypes"
        :disabled="loadingThreatTypes"
        :errors="getFieldError('bcm_lifethreat_type_id')"
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
  name: "ThreatCategoryForm",
  props: {
    editForm: {
      type: Boolean,
      default: false
    },
    itemId: { type: Number }
  },
  data() {
    return {
      fields: {
        "name.en": "",
        "name.ar": "",
        code: "",
        note: "",
        color: "",
        bcm_lifethreat_type_id: null
      }
    }
  },
  computed: {
    ...mapGetters({
      threatTypes: "threatTypes/getTypes",
      loadingThreatTypes: "threatTypes/isLoading"
    })
  },
  methods: {
    ...mapActions({
      fetchThreatTypes: "threatTypes/fetchTypes"
    })
  },
  async mounted() {
    await this.fetchThreatTypes()
  }
}
</script>
