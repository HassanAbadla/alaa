<template>
  <form-template
    :editForm="editForm"
    :itemId="itemId"
    :fields="fields"
    store="threatImpacts"
    singlularEntityName="Impact"
    pluralEntityName="Impacts"
  >
    <template #default="{ formData, updateField, getFieldError }">
      <custom-dropdown
        :label="$t('table.impact_category')"
        v-model="formData.bcm_impact_category_id"
        :items="impactCategories"
        item-value="id"
        item-text="name"
        :loading="isLoadingImpactCategories"
        :disabled="isLoadingImpactCategories"
        :errors="getFieldError('bcm_impact_category_id')"
        required
      />
      <custom-dropdown
        :label="$t('table.impact_strength')"
        v-model="formData.bcm_impact_strength_id"
        :items="impactStrengths"
        item-value="id"
        item-text="name"
        :loading="isLoadingImpactStrengths"
        :disabled="isLoadingImpactStrengths"
        :errors="getFieldError('bcm_impact_strength_id')"
        required
      />
      <custom-dropdown
        :label="$t('table.threat')"
        v-model="formData.bcm_threat_id"
        :items="threats"
        item-value="id"
        item-text="threat_name"
        :loading="isLoadingThreats"
        :disabled="isLoadingThreats"
        :errors="getFieldError('bcm_threat_id')"
        required
      />
      <custom-dropdown
        :label="$t('table.distribution_time')"
        v-model="formData.bcm_distribution_time_id"
        :items="distributionTimes"
        item-value="id"
        item-text="bcm_code"
        :loading="isLoadingDistributionTimes"
        :disabled="isLoadingDistributionTimes"
        :errors="getFieldError('bcm_distribution_time_id')"
        required
      />
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
        bcm_impact_category_id: null,
        bcm_impact_strength_id: null,
        bcm_threat_id: null,
        bcm_distribution_time_id: null
      }
    }
  },
  computed: {
    ...mapGetters({
      impactCategories: "threatImpactCategories/getCategories",
      isLoadingCategories: "threatImpactCategories/isLoading",
      impactStrengths: "threatImpactStrengths/getStrengths",
      isLoadingImpactStrengths: "threatImpactStrengths/isLoading",
      threats: "threats/getThreats",
      isLoadingThreats: "threats/isLoading",
      distributionTimes: "threatDistributionTimes/getDistributionTimes",
      isLoadingDistributionTimes: "threatDistributionTimes/isLoading"
    })
  },
  methods: {
    ...mapActions({
      fetchImpactCategories: "threatImpactCategories/fetchCategories",
      fetchImpactStrengths: "threatImpactStrengths/fetchStrengths",
      fetchThreats: "threats/fetchThreats",
      fetchDistributionTimes: "threatDistributionTimes/fetchDistributionTimes"
    })
  },
  async mounted() {
    Promise.all([
      this.fetchImpactCategories(),
      this.fetchImpactStrengths(),
      this.fetchThreats(),
      this.fetchDistributionTimes()
    ])
  }
}
</script>
