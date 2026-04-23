<!-- RiskDetails.vue -->
<template>
  <div class="ma-4">
    <back-btn :tooltipText="$t('page.back_to_risk_register')" :path="'/grc/risk-register'" />
    <div class="text-h4 font-weight-bold ma-4">{{ $t("page.risk_details") }}</div>
    <v-card v-if="risk" flat class="pa-4">
      <!-- Header Section -->
      <v-row>
        <v-col cols="12" sm="8">
          <div class="text-h5 font-weight-medium mb-2">{{ risk.name }}</div>
          <v-chip
            small
            :color="risk.risk_status?.color || 'grey'"
            :text-color="getTextColorForBackground(risk.risk_status?.color || 'grey')"
            class="mr-2"
          >
            {{ risk.risk_status?.name }}
          </v-chip>
        </v-col>
      </v-row>

      <!-- Main Content -->
      <v-row class="mt-4">
        <!-- Left Column - Combined Risk Information & Assessment  -->
        <v-col cols="12" md="6">
          <v-card outlined class="pa-4" height="100%">
            <v-row>
              <!-- Risk Information section -->
              <v-col cols="12" md="6" class="pr-md-2">
                <div class="text-subtitle-1 font-weight-medium mb-4">{{ $t("page.risk_infortmation") }}</div>
                <v-list dense>
                  <display-list-item :label="$t('table.threat')" :value="risk.risk_type" :show-chip="false" />
                  <display-list-item :label="$t('table.risk_area')" :value="risk.risk_category" :show-chip="false" />
                  <display-list-item
                    :label="$t('table.owner')"
                    :value="risk.owner"
                    :show-chip="false"
                    value-field="full_name"
                  />
                </v-list>
              </v-col>

              <!-- Risk Assessment section -->
              <v-col cols="12" md="6" class="pl-md-2">
                <div class="text-subtitle-1 font-weight-medium mb-4">{{ $t("page.risk_assesment") }}</div>
                <v-list dense>
                  <display-list-item :label="$t('table.impact')" :value="risk.impact" />
                  <display-list-item :label="$t('table.likelihood')" :value="risk.likely_hood" />
                  <display-list-item
                    :label="$t('table.overall_inherent_risk_rating')"
                    :value="risk.risk_rating"
                    chip-field="score"
                  />
                  <display-list-item
                    :label="$t('table.overall_residual_risk_rating')"
                    :value="risk.overall_residual_rating"
                    chip-field="score"
                  />
                </v-list>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <!-- Right Column - Asset Information -->
        <v-col cols="12" md="6">
          <v-card outlined class="pa-4" height="100%">
            <div class="text-subtitle-1 font-weight-medium mb-4">{{ $t("page.asset_information") }}</div>

            <asset-information :asset="risk.asset" />
          </v-card>
        </v-col>
      </v-row>

      <!-- Risk Data Sections -->
      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <risk-data-section
            :title="$t('table.consequences')"
            :items="riskConsequences"
            :loading="consequencesLoading"
            :columns="consequencesColumns"
            :config="consequencesConfig"
          />
        </v-col>
        <v-col cols="12" md="6">
          <risk-data-section
            :title="$t('table.controls')"
            :items="riskControls"
            :loading="controlsLoading"
            :columns="controlsColumns"
            :config="controlsConfig"
          />
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <risk-data-section
            :title="$t('table.causes')"
            :items="riskCauses"
            :loading="causesLoading"
            :columns="causesColumns"
            :config="causesConfig"
          />
        </v-col>
        <v-col cols="12" md="6">
          <risk-data-section
            :title="$t('table.treatments')"
            :items="riskTreatments"
            :loading="treatmentsLoading"
            :columns="treatmentsColumns"
            :config="treatmentsConfig"
          />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { colorUtils } from "@/mixins/colorUtils"
import DisplayListItem from "@/components/display-page/DisplayListItem.vue"
import RiskDataSection from "./RiskDataSection.vue"
import BackBtn from "../custom-table/BackBtn.vue"
import AssetInformation from "./AssetInformation.vue"

export default {
  name: "RiskDetails",
  components: {
    DisplayListItem,
    RiskDataSection,
    BackBtn,
    AssetInformation
  },
  mixins: [colorUtils],
  data() {
    return {
      assetLoading: false
    }
  },

  computed: {
    riskId() {
      return this.$route.params.id
    },
    consequencesConfig() {
      return {
        itemPath: `/grc/risk-register/${this.riskId}/consequences`,
        createForm: {
          componentPath: "forms/RiskConsequenceForm"
        },
        permissions: {
          create: "create_risk_consequence"
        }
      }
    },
    controlsConfig() {
      return {
        itemPath: `/grc/risk-register/${this.riskId}/controls`,
        createForm: {
          componentPath: "forms/RiskControlForm"
        },
        permissions: {
          create: "create_risk_control"
        }
      }
    },
    treatmentsConfig() {
      return {
        itemPath: `/grc/risk-register/${this.riskId}/treatments`,
        createForm: {
          componentPath: "forms/RiskTreatmentForm"
        },
        permissions: {
          create: "create_risk_treatment"
        }
      }
    },
    causesConfig() {
      return {
        itemPath: `/grc/risk-register/${this.riskId}/causes`,
        createForm: {
          componentPath: "forms/RiskCauseForm"
        },
        permissions: {
          create: "create_risk_cause"
        }
      }
    },
    ...mapState("risk", {
      risk: "risk"
    }),
    ...mapState("riskConsequences", {
      riskConsequences: "riskConsequences",
      consequencesLoading: "loading"
    }),
    ...mapState("riskCauses", {
      riskCauses: "riskCauses",
      causesLoading: "loading"
    }),
    ...mapState("riskControls", {
      riskControls: "riskControls",
      controlsLoading: "loading"
    }),
    ...mapState("riskTreatments", {
      riskTreatments: "riskTreatments",
      treatmentsLoading: "loading"
    }),

    // For consequences table
    consequencesColumns() {
      return [
        { text: this.$t("table.name"), value: "code", sortable: false },
        { text: this.$t("table.notes"), value: "notes", sortable: false }
      ]
    },

    // For causes table
    causesColumns() {
      return [
        { text: this.$t("table.name"), value: "code", sortable: false },
        { text: this.$t("table.notes"), value: "notes", sortable: false }
      ]
    },

    // For controls table
    controlsColumns() {
      return [
        { text: this.$t("table.name"), value: "name", sortable: false },
        { text: this.$t("table.short_name"), value: "code", sortable: false },
        { text: this.$t("table.notes"), value: "notes", sortable: false },
        { text: this.$t("table.impact_financial_min"), value: "impact_financial_min", sortable: false },
        { text: this.$t("table.impact_financial_max"), value: "impact_financial_max", sortable: false },
        { text: this.$t("table.type"), value: "risk_control_type.name", sortable: false },
        { text: this.$t("table.effectiveness"), value: "risk_control_effectiveness.name", sortable: false },
        { text: this.$t("table.operational_impact"), value: "operational_impact.name", sortable: false },
        { text: this.$t("table.impact_reputation"), value: "impact_reputation", sortable: false }
      ]
    },
    treatmentsColumns() {
      return [
        { text: this.$t("table.risk_treatment_description"), value: "name", sortable: false },
        { text: this.$t("table.type_of_treatment_action"), value: "treatment_status", sortable: false },
        { text: this.$t("table.owner_of_treatment_actaion"), value: "owner", sortable: false },
        { text: this.$t("table.residual_risk_likelihood"), value: "likely_hood", sortable: false },
        { text: this.$t("table.residual_risk_impact"), value: "impact", sortable: false },
        { text: this.$t("table.treatment_rating"), value: "rating", sortable: false },
        { text: this.$t("table.risk_budget"), value: "budget", sortable: false },
        { text: this.$t("table.progress"), value: "progress", sortable: false },
        { text: this.$t("table.notes"), value: "notes", sortable: false },
        { text: this.$t("table.deadline_for_action"), value: "end_date", sortable: false }
      ]
    }
  },
  methods: {
    ...mapActions("risk", ["fetchRisk"]),
    ...mapActions("riskConsequences", ["fetchRiskConsequences"]),
    ...mapActions("riskCauses", ["fetchRiskCauses"]),
    ...mapActions("riskControls", ["fetchRiskControls"]),
    ...mapActions("riskTreatments", ["fetchRiskTreatments"]),

    async fetchAllData() {
      try {
        this.assetLoading = true
        await Promise.all([
          this.fetchRisk(this.riskId),
          this.fetchRiskConsequences(this.riskId),
          this.fetchRiskCauses(this.riskId),
          this.fetchRiskControls({ riskId: this.riskId }),
          this.fetchRiskTreatments({ riskId: this.riskId })
        ])
        this.assetLoading = false
      } catch (error) {
        console.error("Error fetching risk data:", error)
        this.assetLoading = false
      }
    }
  },
  created() {
    this.fetchAllData()
  }
}
</script>

<style scoped>
.v-list-item {
  min-height: 40px;
}
</style>
