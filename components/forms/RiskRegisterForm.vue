<template>
  <div>
    <form-wrapper v-if="!fetchRiskError && !isLoading" :title="title" @submit="submitRisk" :loading="isSubmitting">
      <custom-input
        :label="$t('form.risk_description')"
        v-model="fields.name"
        :required="true"
        :errors="errors.name"
        @clear-errors="clearError('name')"
        :field-info-text="$t('field_info.risk_description')"
      />
      <custom-input
        :label="$t('form.short_name')"
        v-model="fields.code"
        :required="true"
        :errors="errors.code"
        @clear-errors="clearError('code')"
        :field-info-text="$t('field_info.short_name')"
      />
      <custom-input
        :label="$t('table.compliance_reference')"
        v-model="fields.compliance_ref"
        :required="false"
        :errors="errors.compliance_ref"
        @clear-errors="clearError('compliance_ref')"
        :field-info-text="$t('field_info.compliance_ref')"
      />
      <custom-dropdown
        :items="users"
        item-value="id"
        item-text="name"
        :required="true"
        :label="$t('form.owner')"
        v-model="fields.owner_id"
        :errors="errors.owner_id"
        @clear-errors="clearError('owner_id')"
        :loading="loading.users"
        :field-info-text="$t('field_info.risk_owner')"
      />
      <custom-dropdown
        :items="assets"
        item-value="id"
        item-text="name"
        :required="false"
        :label="$t('table.asset')"
        v-model="fields.grc_asset_id"
        :errors="errors.grc_asset_id"
        @clear-errors="clearError('grc_asset_id')"
        :loading="loading.impacts"
        :field-info-text="$t('field_info.assets')"
      />
      <custom-input
        :label="$t('table.cost')"
        v-model.number="fields.asset_cost"
        :required="false"
        :type="'number'"
        :errors="errors.asset_cost"
        @clear-errors="clearError('asset_cost')"
        :field-info-text="$t('field_info.asset_cost')"
      />
      <custom-input
        :label="$t('table.probability_loss')"
        v-model.number="fields.asset_probability_loss"
        :required="false"
        :type="'number'"
        :errors="errors.asset_probability_loss"
        @clear-errors="clearError('asset_probability_loss')"
        :field-info-text="$t('field_info.asset_probability_loss')"
      />
      <custom-dropdown
        :items="impacts"
        item-value="id"
        item-text="name"
        :required="true"
        :label="$t('form.impact')"
        v-model="fields.impact_id"
        :errors="errors.impact_id"
        @clear-errors="clearError('impact_id')"
        :loading="loading.impacts"
        :field-info-text="$t('field_info.impact')"
      />
      <custom-dropdown
        :items="likelihoods"
        item-value="id"
        item-text="name"
        :required="true"
        :label="$t('form.likelihood')"
        v-model="fields.likely_hood_id"
        :errors="errors.likely_hood_id"
        @clear-errors="clearError('likely_hood_id')"
        :loading="loading.likelihoods"
        :field-info-text="$t('field_info.likelihood')"
      />
      <custom-dropdown
        :items="onsetSpeeds"
        item-value="id"
        item-text="name"
        :required="true"
        :label="$t('form.onset_speed')"
        v-model="fields.onset_speed_id"
        :errors="errors.onset_speed_id"
        @clear-errors="clearError('onset_speed_id')"
        :loading="loading.onsetSpeeds"
        :field-info-text="$t('field_info.onset_speed')"
      />
      <!-- <custom-dropdown
        :items="riskPriorities"
        item-value="id"
        item-text="name"
        :required="true"
        :label="$t('form.risk_priority')"
        v-model="fields.risk_priority_id"
        :errors="errors.risk_priority_id"
        @clear-errors="clearError('risk_priority_id')"
        :loading="loading.riskPriorities"
      /> -->
      <custom-dropdown
        :items="riskTypes"
        item-value="id"
        item-text="name"
        :required="true"
        :label="$t('table.threat')"
        v-model="fields.risk_type_id"
        :errors="errors.risk_type_id"
        @clear-errors="clearError('risk_type_id')"
        :loading="loading.riskTypes"
        :field-info-text="$t('field_info.threat')"
      />
      <custom-dropdown
        :items="getThreats"
        item-value="id"
        item-text="threat_name"
        :required="false"
        :label="$t('table.bcm_threat')"
        v-model="fields.bcm_threat_id"
        :errors="errors.bcm_threat_id"
        @clear-errors="clearError('bcm_threat_id')"
        :loading="loading.riskTypes"
        :field-info-text="$t('field_info.threat')"
      />
      <custom-dropdown
        :items="riskCategories"
        item-value="id"
        item-text="name"
        :required="true"
        :label="$t('table.risk_area')"
        v-model="fields.risk_category_id"
        :errors="errors.risk_category_id"
        @clear-errors="clearError('risk_category_id')"
        :loading="loading.riskCategories"
        :field-info-text="$t('field_info.risk_area')"
      />
      <custom-dropdown
        :items="riskStatuses"
        item-value="id"
        item-text="name"
        :required="true"
        :label="$t('form.risk_status')"
        v-model="fields.risk_status_id"
        :errors="errors.risk_status_id"
        @clear-errors="clearError('risk_status_id')"
        :loading="loading.riskStatuses"
        :field-info-text="$t('field_info.risk_status')"
      />
      <!--
      <custom-date-picker
        v-model="fields.analysis_evaluation_date"
        :label="$t('form.analysis_evaluation_date')"
        :errors="errors.analysis_evaluation_date"
        @clear-errors="clearError('analysis_evaluation_date')"
        :field-info-text="$t('field_info.analysis_evaluation_date')"
      /> -->
      <custom-date-picker
        v-model="fields.identification_date"
        :label="$t('form.identification_date')"
        :errors="errors.identification_date"
        @clear-errors="clearError('identification_date')"
        :required="true"
        :field-info-text="$t('field_info.identification_date')"
      />
      <!-- unit selection -->
      <div class="d-flex w-100 justify-space-between">
        <v-btn
          text
          outlined
          :loading="loading.riskStatuses"
          :disabled="false"
          @click="openUnitDialogModal"
          prepend-icon="mdi-file-document-outline"
          class="pa-4"
        >
          {{ $t("form.select_unit") }}
        </v-btn>
        <span class="mx-2"></span>
        <div @click.stop="openUnitDialogModal" class="d-flex flex-grow-1 z-index-5">
          <custom-dropdown
            :items="unitDisplayfield"
            item-value="id"
            item-text="name"
            :label="$t('table.unit')"
            v-model="fields.unit_id"
            :required="false"
            :disabled="true"
            class="flex-grow-1 mx-1 z-index-1"
          />
        </div>
      </div>
      <custom-dropdown
        v-model="third_party_id"
        :label="$t('form.third_party')"
        :items="getThirdParties"
        item-text="company_name"
        item-value="id"
        :required="false"
        :loading="loadingThirdParties"
      />
      <div class="d-flex w-100 justify-space-between">
        <v-btn @click="openRisksSelectionDialog" text outlined class="pa-4" :disabled="!third_party_id">
          {{ $t("table.potential_risks") }}
        </v-btn>
        <custom-input
          v-model="tprm_potential_risk_name"
          class="flex-grow-1 ml-4"
          :label="$t('table.potential_risks')"
          :required="false"
          disabled
        />
      </div>
      <quill-editor v-model="fields.note" class="mb-4" :field-info-text="$t('field_info.risk_notes')" />
    </form-wrapper>
    <div v-else-if="isLoading" class="loading-message">
      <p>Loading form data...</p>
    </div>
    <div v-else-if="fetchRiskError" class="error-message">
      <p>An error occurred while loading the form:</p>
      <message-display
        :messageTitle="fetchRiskError.title"
        :messageText="fetchRiskError.text"
        :code="fetchRiskError.code"
      />
    </div>
    <custom-dialog
      v-model="openUnitDialog"
      :title="$t('page.units')"
      width="580px"
      @close-dialog="openUnitDialog = false"
    >
      <UnitsTreeSelection
        :items="units"
        @selection-change="handleSelectionChange"
        @send-selected="handleSendSelected"
      />
    </custom-dialog>

    <!-- TPS Form Dialog -->
    <custom-dialog
      v-model="tpsFormDialog"
      :title="$t('form.assign_task')"
      width="580px"
      @close-dialog="handleCloseDialog"
    >
      <TPSTaskForm
        ref="tpsTaskForm"
        :item="fields || riskItem || newRisk || {}"
        :taskable_type="'risk'"
        :taskable_id="newRiskId"
        :assignedTo="riskOwner"
        @close="handleCloseDialog"
      />
    </custom-dialog>

    <!-- TPRM Potential Risk Dialog -->
    <custom-dialog v-model="risksDialog" :title="$t('table.potential_risks')" :width="500" :persistent="true">
      <PotentialRiskSelection
        :thirdPartyId="third_party_id"
        @risk-selected="onRiskSelected"
        @confirm="onRiskConfirmed"
      />
    </custom-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex"
import { generateErrorMessage } from "@/helpers/error-helpers"
import MessageDisplay from "../MessageDisplay.vue"
import QuillEditor from "@/components/QuillEditor.vue"
import CustomDatePicker from "@/components/custom-form/CustomDatePicker.vue"
import UnitsTreeSelection from "@/components/UnitsTreeSelection.vue"
import TPSTaskForm from "../TPSTaskForm.vue"
import PotentialRiskSelection from "../tprm/PotentialRiskSelection.vue"

export default {
  name: "RiskRegisterForm",
  components: {
    MessageDisplay,
    QuillEditor,
    CustomDatePicker,
    UnitsTreeSelection,
    TPSTaskForm,
    PotentialRiskSelection
  },
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
        name: "",
        code: "",
        note: "",
        owner_id: null,
        risk_priority_id: null,

        risk_type_id: null,
        risk_category_id: null,
        risk_status_id: null,

        impact_id: null,
        likely_hood_id: null,
        onset_speed_id: null,
        analysis_evaluation_date: null,
        identification_date: null,
        grc_asset_id: null,
        bcm_threat_id: null,
        unit_id: null,
        potential_risk_id: null,
        compliance_ref: "",
        asset_cost: null,
        asset_probability_loss: null
      },
      fetchRiskError: null,
      isSubmitting: false,
      localLoading: true,
      openUnitDialog: false,

      tpsFormDialog: false,
      createdRisk: {},
      riskId: null,
      owner: {},
      third_party_id: null,
      risksDialog: false,
      tprm_potential_risk_name: ""
    }
  },
  computed: {
    ...mapGetters({
      getThirdParties: "tprmThirdParties/getThirdParties",
      loadingThirdParties: "tprmThirdParties/isLoading"
    }),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("page.risk")}`
    },
    ...mapState("assets", ["assets"]),
    ...mapState("risk", [
      "risks",
      "riskPriorities",
      "riskTypes",
      "riskCategories",
      "riskStatuses",
      "impacts",
      "likelihoods",
      "onsetSpeeds",
      "loading",
      "errors"
    ]),
    ...mapGetters("risk", ["users"]),
    ...mapGetters({
      getThreats: "threats/getThreats"
    }),
    ...mapState("positions", ["units"]),
    riskItem() {
      return this.risks.find((risk) => risk.id === this.itemId)
    },
    isLoading() {
      return (
        this.loading.riskPriorities ||
        this.loading.riskTypes ||
        this.loading.riskCategories ||
        this.loading.riskStatuses ||
        this.loading.impacts ||
        this.loading.likelihoods ||
        this.loading.onsetSpeeds ||
        this.loading.users ||
        this.localLoading
      )
    },
    unitDisplayfield() {
      const getAllUnits = (units) => {
        let allUnits = []
        for (const unit of units) {
          allUnits.push({
            id: unit.id,
            name: unit.name
          })
          if (unit.children && unit.children.length) {
            allUnits = allUnits.concat(getAllUnits(unit.children))
          }
        }
        return allUnits
      }

      return getAllUnits(this.units)
    },
    newRiskId() {
      return this.createdRisk.id
    },
    riskOwner() {
      return this.createdRisk.owner
    },
    newRisk() {
      return this.createdRisk
    }
  },
  methods: {
    ...mapActions("assets", ["fetchAssets"]),
    ...mapActions("drawer", ["closeDrawer"]),
    ...mapActions("positions", ["fetchUnits"]),
    ...mapActions("risk", [
      "fetchRisks",
      "createRisk",
      "updateRisk",
      "fetchUsers",
      "deleteRisk",
      "fetchRiskPriorities",
      "fetchRiskTypes",
      "fetchRiskCategories",
      "fetchRiskStatuses",
      "fetchImpacts",
      "fetchLikelihoods",
      "fetchOnsetSpeeds"
    ]),
    ...mapActions({
      fetchBcmThreats: "threats/fetchThreats"
    }),
    ...mapActions({
      fetchThirdParties: "tprmThirdParties/fetchThirdParties"
    }),

    async submitRisk() {
      this.isSubmitting = true
      try {
        if (this.editForm) {
          await this.updateRisk({ id: this.itemId, payload: this.fields })
        } else {
          const response = await this.createRisk(this.fields)
          console.log("creat risk response:", response)
          if (response) {
            this.createdRisk = response
            this.tpsFormDialog = true
          }
        }
        // this.closeDrawer()
      } catch (error) {
        console.error(`Error ${this.editForm ? "editing" : "creating"} risk:`, error)
        if (error?.response?.data) {
          this.errors = error.response.data.errors || {}
        }
      } finally {
        this.isSubmitting = false
      }
    },

    clearError(field) {
      if (this.errors && this.errors[field]) {
        this.errors[field] = []
      }
    },
    handleCloseDialog() {
      this.tpsFormDialog = false
      this.closeDrawer()
    },
    async fetchAllDropdownData() {
      try {
        await Promise.all([
          this.fetchRiskPriorities(),
          this.fetchUsers(),
          this.fetchRiskTypes(),
          this.fetchRiskCategories(),
          this.fetchRiskStatuses(),

          this.fetchBcmThreats(),

          this.fetchImpacts(),
          this.fetchLikelihoods(),
          this.fetchOnsetSpeeds(),
          this.fetchAssets(),
          this.fetchUnits(),
          this.fetchThirdParties()
        ])
      } catch (error) {
        console.error("Error fetching dropdown data:", error)
        this.fetchRiskError = generateErrorMessage(error, this.$i18n)
      } finally {
        this.localLoading = false
      }
    },

    async loadRiskData() {
      if (this.editForm && this.itemId) {
        try {
          await this.fetchRisks({ id: this.itemId })
          const risk = this.$store.getters["risk/getRiskById"](this.itemId)
          if (risk) {
            this.fields = {
              name: risk.name,
              code: risk.code,
              note: risk.note,
              owner_id: risk.owner?.id,
              risk_priority_id: risk.risk_priority?.id,
              risk_type_id: risk.risk_type?.id,
              risk_category_id: risk.risk_category?.id,
              risk_status_id: risk.risk_status?.id,
              impact_id: risk.impact?.id,
              likely_hood_id: risk.likely_hood?.id,
              onset_speed_id: risk.onset_speed?.id,
              analysis_evaluation_date: risk.analysis_evaluation_date,
              identification_date: risk.identification_date,
              grc_asset_id: risk.asset?.id,
              bcm_threat_id: risk.bcm_threat?.id,
              unit_id: risk.unit?.id,
              potential_risk_id: risk.potential_risk?.id,
              compliance_ref: risk.compliance_ref,
              asset_cost: risk.asset_cost,
              asset_probability_loss: risk.asset_probability_loss
            }
            if (risk.potential_risk) {
              this.third_party_id = risk.potential_risk.third_party?.id || null
              this.tprm_potential_risk_name = risk.potential_risk?.name || ""
            }
          } else {
            throw new Error("Risk not found")
          }
        } catch (error) {
          console.error("Error fetching risk data:", error)
          this.fetchRiskError = generateErrorMessage(error, this.$i18n)
        }
      }
    },
    openUnitDialogModal() {
      this.openUnitDialog = true
    },
    handleSelectionChange(selectedIds) {
      this.fields.unit_id = selectedIds
    },
    handleSendSelected(selectedIds) {
      console.log("Sending selected ids:", selectedIds)
      this.fields.unit_id = selectedIds
      this.openUnitDialog = false
    },
    openRisksSelectionDialog() {
      this.risksDialog = true
    },
    onRiskSelected(selectedRisks) {
      console.log(selectedRisks)
      this.fields.potential_risk_id = selectedRisks.id
      this.tprm_potential_risk_name = selectedRisks.name
      // this.risksDialog = false
    },
    onRiskConfirmed() {
      this.risksDialog = false
    }
  },
  async mounted() {
    this.localLoading = true
    await this.fetchAllDropdownData()
    await this.loadRiskData()
    this.localLoading = false
  }
}
</script>

<style scoped>
/* .risk-register-form {
} */

.debug-info {
  background-color: #f0f0f0;
  padding: 10px;
  margin-bottom: 10px;
  font-family: monospace;
}

.loading-message,
.error-message {
  padding: 20px;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 20px;
}

.error-message {
  border-color: #ff6b6b;
  color: #d63031;
}
</style>
