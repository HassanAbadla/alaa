<template>
  <v-can show-message :permission="'access_risk_controls'">
    <v-container fluid>
      <v-card flat>
        <v-card-text class="pt-0">
          <custom-table
            :title="title"
            :propItems="riskControls"
            :propLoading="loading"
            :headers="headers"
            :tableConfig="tableConfig"
            showFilter
            :filters.sync="filters"
            @clear-filters="fetchControls"
            hideView
            :sortOnLoad="false"
            show-back-btn
            :back-btn-tooltip="backBtnTooltip"
            :back-btn-path="backBtnPath"
          >
            <template v-slot:item.notes="{ item }">
              <editable-note-form
                :note="item.note"
                :title="item?.code"
                :item-id="item.id"
                :loading="item.isUpdating"
                :disable-edit="true"
                :disable-icon="false"
                iconSize="large"
              />
            </template>
            <template v-slot:level-filters>
              <custom-dropdown
                :items="riskControlTypes"
                item-value="id"
                item-text="name"
                :label="$t('form.risk_control_type')"
                v-model="filters.risk_control_type_id"
                @input="applyFilters"
                clearable
                :loading="loadingRiskControlTypes"
              />
              <custom-dropdown
                :items="riskControlEffectiveness"
                item-value="id"
                item-text="name"
                :label="$t('form.risk_control_effectiveness')"
                v-model="filters.risk_control_effectiveness_id"
                @input="applyFilters"
                clearable
                :loading="loadingRiskControlEffectiveness"
              />
              <custom-dropdown
                :items="operationalImpacts"
                item-value="id"
                item-text="name"
                :label="$t('form.operational_impact')"
                v-model="filters.operational_impact_id"
                @input="applyFilters"
                clearable
                :loading="loadingOperationalImpacts"
              />
            </template>
          </custom-table>
        </v-card-text>
      </v-card>
    </v-container>
  </v-can>
</template>

<script>
import { mapState, mapActions } from "vuex"
import EditableNoteForm from "@/components/forms/EditableNoteForm.vue"
import DynamicBackNavigation from "@/mixins/dynamicBackNavigation"

export default {
  components: { EditableNoteForm },
  name: "RiskControlsPage",
  mixins: [DynamicBackNavigation],
  layout: "dashboard-layout",
  middleware: ["auth", "is-grc"],
  data() {
    return {
      headers: [
        { text: "table.name", value: "name", sortable: false },
        { text: "table.short_name", value: "code", sortable: false },
        { text: "table.notes", value: "notes", sortable: false },
        { text: "table.impact_financial_min", value: "impact_financial_min", sortable: false },
        { text: "table.impact_financial_max", value: "impact_financial_max", sortable: false },
        { text: "table.type", value: "risk_control_type.name", sortable: false },
        { text: "table.effectiveness", value: "risk_control_effectiveness.name", sortable: false },
        { text: "table.operational_impact", value: "operational_impact.name", sortable: false },
        { text: "table.impact_reputation", value: "impact_reputation", sortable: false },
        { text: "table.actions", value: "actions", sortable: false }
      ],
      tableConfig: {
        delete: this.deleteControl,
        itemPath: `/grc/risk-register/${this.riskId()}/controls`,
        createForm: {
          componentPath: "forms/RiskControlForm"
        },
        editForm: {
          componentPath: "forms/RiskControlForm",
          props: { editForm: true }
        },
        permissions: {
          create: "create_risk_control",
          edit: "edit_risk_control",
          delete: "delete_risk_control"
        }
      },
      filters: {
        risk_control_type_id: null,
        risk_control_effectiveness_id: null,
        operational_impact_id: null
      }
    }
  },
  computed: {
    ...mapState("riskControls", [
      "riskControls",
      "currentRisk",
      "loading",
      "riskControlTypes",
      "riskControlEffectiveness",
      "operationalImpacts",
      "loadingLookups"
    ]),
    entityType() {
      return "treatments"
    },
    entityType() {
      return "controls"
    },
    title() {
      if (this.currentRisk) {
        return `${this.$t("form.risk_control")} - ${this.currentRisk.name}`
      }
      return this.$t("form.risk_control")
    }
  },
  methods: {
    ...mapActions("riskControls", [
      "fetchRiskControls",
      "deleteRiskControl",
      "fetchRiskControlTypes",
      "fetchRiskControlEffectiveness",
      "fetchOperationalImpacts"
    ]),
    riskId() {
      return this.$route.params.id
    },
    fetchControls() {
      this.fetchRiskControls({ riskId: this.riskId(), filters: this.filters })
    },
    deleteControl(id) {
      return this.deleteRiskControl(id)
    },
    applyFilters() {
      this.fetchControls()
    }
  },
  async mounted() {
    await this.fetchControls()
    await Promise.all([
      this.fetchRiskControlTypes(),
      this.fetchRiskControlEffectiveness(),
      this.fetchOperationalImpacts()
    ])
  }
}
</script>

<style scoped>
/* Add any scoped styles here if needed */
</style>
