<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
    <custom-input v-model="formData.code" :label="$t('form.code')" :required="true" />
    <CustomDatePicker v-model="formData.date" :label="$t('table.date')" :required="true" />
    <CustomDatePicker v-model="formData.incident_date" :label="$t('table.incident_date')" :required="true" />
    <custom-dropdown
      v-model="formData.tprm_incident_type_id"
      :label="$t('table.incident_type')"
      :items="getIncidentTypes"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingIncidentTypes"
    />
    <custom-dropdown
      v-model="formData.third_party_id"
      :label="$t('form.third_party')"
      :items="getThirdParties"
      item-text="company_name"
      item-value="id"
      :required="true"
      :loading="loadingThirdParties"
      :disabled="this.$route.query.third_party_id ? true : false"
    />
    <div class="d-flex align-center">
      <v-btn @click="openRisksSelectionDialog" :disabled="!formData.third_party_id">
        {{ $t("table.potential_risks") }}
      </v-btn>
      <custom-input
        v-model="tprm_potential_risk_name"
        class="flex-grow-1 ml-4 mt-2"
        :label="$t('table.potential_risks')"
        :required="true"
        disabled
      />
    </div>
    <quill-editor v-model="formData.root_cause" :label="$t('table.root_cause')" class="pb-4" />
    <quill-editor v-model="formData.remediation_planning" :label="$t('table.remediation_planning')" class="pb-4" />
    <quill-editor v-model="formData.awarness_managment" :label="$t('table.awarness_managment')" class="pb-4" />
    <quill-editor v-model="formData.note" :label="$t('form.notes')" class="pb-4" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>

    <custom-dialog v-model="risksDialog" :title="$t('table.potential_risks')" :width="500" :persistent="true">
      <PotentialRiskSelection
        :thirdPartyId="formData.third_party_id"
        @risk-selected="onRiskSelected"
        @confirm="onRiskConfirmed"
      />
    </custom-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import PotentialRiskSelection from "../tprm/PotentialRiskSelection.vue"
export default {
  name: "TPRMIncidentForm",
  components: { PotentialRiskSelection },
  props: {
    itemPath: {
      type: String,
      required: true
    },
    itemId: {
      type: [Number, String],
      required: true
    },
    editForm: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      formData: {
        name: "",
        note: "",
        code: "",
        date: null,
        incident_date: null,
        root_cause: "",
        remediation_planning: "",
        awarness_managment: "",
        third_party_id: null,
        tprm_incident_type_id: null,
        tprm_potential_risk_id: null,
        active: true
      },
      loading: false,
      risksDialog: false,
      tprm_potential_risk_name: ""
    }
  },

  computed: {
    ...mapGetters({
      getIncidents: "tprmIncidents/getIncidents",
      getCurrentIncident: "tprmIncidents/getCurrentIncident",
      loadingIncidents: "tprmIncidents/isLoading",
      getThirdParties: "tprmThirdParties/getThirdParties",
      loadingThirdParties: "tprmThirdParties/isLoading",
      getIncidentTypes: "tprmIncidentTypes/getIncidentTypes",
      loadingIncidentTypes: "tprmIncidentTypes/isLoading"
    })
  },

  methods: {
    ...mapActions({
      addIncident: "tprmIncidents/addIncident",
      updateIncident: "tprmIncidents/updateIncident",
      fetchIncidentById: "tprmIncidents/fetchIncidentById",
      fetchThirdParties: "tprmThirdParties/fetchThirdParties",
      fetchIncidentTypes: "tprmIncidentTypes/fetchIncidentTypes"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      this.loadingIncidents = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateIncident(this.formData)
      } else {
        await this.addIncident(this.formData)
      }
      this.loadingIncidents = false
      this.closeDrawer()
    },
    openRisksSelectionDialog() {
      this.risksDialog = true
    },
    onRiskSelected(selectedRisks) {
      console.log(selectedRisks)
      this.formData.tprm_potential_risk_id = selectedRisks.id
      this.tprm_potential_risk_name = selectedRisks.name
      // this.risksDialog = false
    },
    onRiskConfirmed() {
      this.risksDialog = false
    }
  },
  async mounted() {
    this.fetchThirdParties()
    this.fetchIncidentTypes()
    if (this.editForm) {
      await this.fetchIncidentById(this.itemId)
      this.formData = { ...this.getCurrentIncident }
      // fill tprm_potential_risk_name
      this.tprm_potential_risk_name = this.getCurrentIncident.potential_risk
        ? this.getCurrentIncident.potential_risk.name
        : ""
    } else if (this.$route.query.third_party_id) {
      // Auto-fill third party from query parameter
      this.formData.third_party_id = parseInt(this.$route.query.third_party_id)
    }
  }
}
</script>

<style scoped></style>
