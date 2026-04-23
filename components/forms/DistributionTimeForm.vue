<template>
  <form-template
    :editForm="editForm"
    :itemId="itemId"
    :fields="fields"
    store="threatDistributionTimes"
    singlularEntityName="DistributionTime"
    pluralEntityName="DistributionTimes"
  >
    <template #default="{ formData, updateField, getFieldError }">
      <!-- Flattened fields - much simpler! -->
      <custom-input
        :label="$t('table.code')"
        v-model="formData.bcm_code"
        :errors="getFieldError('bcm_code')"
        required
      />
      <custom-input
        :label="$t('table.from_code')"
        v-model="formData.bcm_from_code"
        :errors="getFieldError('bcm_from_code')"
        required
      />
      <custom-input
        :label="$t('table.to_code')"
        v-model="formData.bcm_to_code"
        :errors="getFieldError('bcm_to_code')"
        required
      />
      <custom-input
        :label="$t('table.from_value')"
        v-model="formData.bcm_from_value"
        :errors="getFieldError('bcm_from_value')"
        type="number"
        required
      />
      <custom-input
        :label="$t('table.to_value')"
        v-model="formData.bcm_to_value"
        :errors="getFieldError('bcm_to_value')"
        type="number"
        required
      />
      <custom-color-picker
        :label="$t('table.color')"
        v-model="formData.bcm_color"
        :errors="getFieldError('bcm_color')"
        required
      />
    </template>
  </form-template>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

import FormTemplate from "./FormTemplate.vue"

export default {
  components: { FormTemplate },
  name: "DistributionTimeForm",
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
        bcm_code: "",
        bcm_from_code: "",
        bcm_from_value: 0,
        bcm_to_code: "",
        bcm_to_value: 0,
        bcm_color: ""
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
