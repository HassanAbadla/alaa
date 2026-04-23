<template>
  <form-template
    :editForm="editForm"
    :itemId="itemId"
    :fields="fields"
    store="peakTimes"
    singlularEntityName="PeakTime"
    pluralEntityName="PeakTimes"
  >
    <template #default="{ formData, updateField, getFieldError }">
      <custom-input
        :label="$t('table.description')"
        v-model="formData.peaktime_description"
        :errors="getFieldError('peaktime_description')"
        required
      />
      <custom-input
        :label="$t('table.from_code')"
        v-model="formData.peaktime_from_code"
        :errors="getFieldError('peaktime_from_code')"
        required
      />
      <custom-input
        :label="$t('table.to_code')"
        v-model="formData.peaktime_to_code"
        :errors="getFieldError('peaktime_to_code')"
        required
      />
      <custom-input
        :label="$t('table.from_name')"
        v-model="formData.peaktime_from_name"
        :errors="getFieldError('peaktime_from_name')"
        required
      />
      <custom-input
        :label="$t('table.to_name')"
        v-model="formData.peaktime_to_name"
        :errors="getFieldError('peaktime_to_name')"
        required
      />
      <custom-input
        :label="$t('table.from_value')"
        v-model.number="formData.peaktime_from_value"
        :errors="getFieldError('peaktime_from_value')"
        type="number"
        required
      />
      <custom-input
        :label="$t('table.to_value')"
        v-model.number="formData.peaktime_to_value"
        :errors="getFieldError('peaktime_to_value')"
        type="number"
        required
      />

      <custom-color-picker
        :label="$t('table.color')"
        v-model="formData.peaktime_color"
        :errors="getFieldError('peaktime_color')"
      />
    </template>
  </form-template>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

import FormTemplate from "./FormTemplate.vue"

export default {
  components: { FormTemplate },
  name: "PeakTimeForm",
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
        peaktime_description: "",
        peaktime_from_code: "",
        peaktime_from_name: "",
        peaktime_from_value: 0,
        peaktime_to_code: "",
        peaktime_to_name: "",
        peaktime_to_value: 0,
        peaktime_color: ""
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
