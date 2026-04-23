<template>
  <form-template
    :editForm="editForm"
    :itemId="itemId"
    :fields="fields"
    store="threats"
    singlularEntityName="Threat"
    pluralEntityName="Threats"
  >
    <template #default="{ formData, updateField, getFieldError }">
      <!-- String fields -->
      <custom-input
        :label="$t('table.name')"
        v-model="formData.threat_name"
        :errors="getFieldError('threat_name')"
        required
      />
      <custom-input
        :label="$t('table.short_name')"
        v-model="formData.threat_short_name"
        :errors="getFieldError('threat_short_name')"
        required
      />

      <custom-date-picker
        :label="$t('table.threat_date')"
        v-model="formData.threat_date"
        :error-messages="getFieldError('threat_date')"
      />
      <custom-input
        :label="$t('table.rto_code')"
        v-model="formData.rto_code"
        :errors="getFieldError('rto_code')"
        required
      />
      <custom-input
        :label="$t('table.rto_value')"
        v-model="formData.rto_value"
        :errors="getFieldError('rto_value')"
        type="number"
        required
      />
      <custom-input
        :label="$t('table.rpo_code')"
        v-model="formData.rpo_code"
        :errors="getFieldError('rpo_code')"
        required
      />
      <custom-input
        :label="$t('table.rpo_value')"
        v-model="formData.rpo_value"
        :errors="getFieldError('rpo_value')"
        type="number"
        required
      />
      <custom-input
        :label="$t('table.mrpd_code')"
        v-model="formData.mrpd_code"
        :errors="getFieldError('mrpd_code')"
        required
      />
      <custom-input
        :label="$t('table.mrpd_value')"
        v-model="formData.mrpd_value"
        :errors="getFieldError('mrpd_value')"
        type="number"
        required
      />

      <custom-input
        :label="$t('table.threat_persons')"
        v-model="formData.threat_persons"
        :errors="getFieldError('threat_persons')"
      />
      <custom-input
        :label="$t('table.location')"
        v-model="formData.threat_location"
        :errors="getFieldError('threat_location')"
      />
      <custom-input
        :label="$t('table.threat_supplies')"
        v-model="formData.threat_supplies"
        :errors="getFieldError('threat_supplies')"
      />
      <custom-input
        :label="$t('table.threat_software')"
        v-model="formData.threat_software"
        :errors="getFieldError('threat_software')"
      />
      <custom-input
        :label="$t('table.threat_hardware')"
        v-model="formData.threat_hardware"
        :errors="getFieldError('threat_hardware')"
      />
      <custom-input
        :label="$t('table.dependencies_internal')"
        v-model="formData.dependencies_internal"
        :errors="getFieldError('dependencies_internal')"
      />
      <custom-input
        :label="$t('table.dependencies_external')"
        v-model="formData.dependencies_external"
        :errors="getFieldError('dependencies_external')"
      />

      <custom-dropdown
        :label="$t('table.risk')"
        v-model="formData.risk_id"
        :items="risks"
        item-value="id"
        item-text="name"
        :loading="isLoadingRisks"
        :disabled="isLoadingRisks"
        :errors="getFieldError('risk_id')"
      />

      <custom-dropdown
        :label="$t('table.peak_times')"
        v-model="formData.bcm_peaktimes_id"
        :items="peakTimes"
        item-value="id"
        item-text="peaktime_description"
        :loading="isLoadingPeakTimes"
        :disabled="isLoadingPeakTimes"
        :errors="getFieldError('bcm_peaktimes_id')"
        required
      />
      <custom-dropdown
        :label="$t('table.asset')"
        v-model="formData.grc_assets_id"
        :items="assets"
        item-value="id"
        item-text="name"
        :loading="isLoadingAssests"
        :disabled="isLoadingAssests"
        :errors="getFieldError('grc_assets_id')"
        required
      />
      <custom-dropdown
        :label="$t('table.category')"
        v-model="formData.bcm_threat_category_id"
        :items="categories"
        item-value="id"
        item-text="name"
        :loading="isLoadingCategories"
        :disabled="isLoadingCategories"
        :errors="getFieldError('bcm_threat_category_id')"
        required
      />
      <custom-dropdown
        :label="$t('table.user')"
        v-model="formData.user_id"
        :items="users"
        item-value="id"
        item-text="full_name"
        :loading="isLoadingUsers"
        :disabled="isLoadingUsers"
        :errors="getFieldError('user_id')"
      />
      <quill-editor v-model="formData.threat_note" class="mb-4" />
    </template>
  </form-template>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import QuillEditor from "../QuillEditor.vue"
import FormTemplate from "./FormTemplate.vue"

export default {
  components: { FormTemplate, QuillEditor },
  name: "ThreatForm",
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
        threat_name: "",
        threat_short_name: "",
        threat_note: "",
        threat_date: null, //required
        rto_code: "", //required
        rto_value: 0, //required
        rpo_code: "", //required
        rpo_value: 0, //required
        mrpd_code: "", //required
        mrpd_value: 0, //required
        peak_time_text: "",
        threat_persons: "",
        threat_location: "",
        threat_supplies: "",
        threat_software: "",
        threat_hardware: "",
        dependencies_internal: "",
        dependencies_external: "",
        risk_id: null,
        bcm_peaktimes_id: null, //required
        grc_assets_id: null, //required
        bcm_threat_category_id: null,
        user_id: null //required
      }
    }
  },
  computed: {
    ...mapGetters({
      assets: "assets/assets",
      isLoadingAssests: "assets/loadingAssets",
      peakTimes: "peakTimes/getPeakTimes",
      isLoadingPeakTimes: "peakTimes/isLoading",
      categories: "threatCategories/getCategories",
      isLoadingCategories: "threatCategories/isLoading",
      users: "users/users",
      isLoadingUsers: "users/loading",

      risks: "risk/risks",
      isLoadingRisks: "risk/isLoadingRisks"
    })
  },
  methods: {
    ...mapActions({
      fetchPeakTimes: "peakTimes/fetchPeakTimes",
      fetchAssets: "assets/fetchAssets",
      fetchCategories: "threatCategories/fetchCategories",
      fetchUsers: "users/fetchUsers",
      fetchRisks: "risk/fetchRisks"
    })
  },
  async mounted() {
    Promise.all([
      this.fetchPeakTimes(),
      this.fetchAssets(),
      this.fetchCategories(),
      this.fetchUsers(),
      this.fetchRisks()
    ])
  }
}
</script>
