<template>
  <v-can show-message :permission="'access_risk_treatments'">
    <v-container fluid>
      <v-card flat>
        <v-card-text class="pt-0">
          <custom-table
            :title="title"
            :propItems="riskTreatments"
            :propLoading="isLoading"
            :headers="headers"
            :tableConfig="tableConfig"
            hideView
            showFilter
            :filters.sync="filters"
            @clear-filters="fetchTreatments"
            :sortOnLoad="false"
            show-back-btn
            :back-btn-tooltip="backBtnTooltip"
            :back-btn-path="backBtnPath"
          >
            <template v-slot:level-filters>
              <custom-dropdown
                :items="users"
                item-value="id"
                item-text="name"
                :label="$t('form.owner')"
                v-model="filters.owner_id"
                @input="applyFilters"
                clearable
                :loading="loading.users"
              />
              <custom-dropdown
                :items="impacts"
                item-value="id"
                item-text="name"
                :label="$t('form.impact')"
                v-model="filters.impact_id"
                @input="applyFilters"
                clearable
                :loading="loading.impacts"
              />
              <custom-dropdown
                :items="likelihoods"
                item-value="id"
                item-text="name"
                :label="$t('form.likelihood')"
                v-model="filters.likely_hood_id"
                @input="applyFilters"
                clearable
                :loading="loading.likelihoods"
              />
              <custom-dropdown
                :items="riskPriorities"
                item-value="id"
                item-text="name"
                :label="$t('table.treatment_rating')"
                v-model="filters.treatment_rating_id"
                @input="applyFilters"
                clearable
                :loading="loadingRiskPriorities"
              />
              <custom-dropdown
                :items="riskTreatmentStatuses"
                item-value="id"
                item-text="name"
                :label="$t('table.type_of_treatment_action')"
                v-model="filters.treatment_status_id"
                @input="applyFilters"
                :loading="loadingLookups.riskTreatmentStatuses"
                clearable
              />
              <div class="d-flex flex-row">
                <custom-input
                  class="mr-1"
                  v-model="filters.min_budget"
                  :label="$t('form.min_budget')"
                  type="number"
                  @input="applyFilters"
                ></custom-input>
                <custom-input
                  class="ml-1"
                  v-model="filters.max_budget"
                  :label="$t('form.max_budget')"
                  type="number"
                  @input="applyFilters"
                ></custom-input>
              </div>
            </template>

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

            <template v-slot:item.owner="{ item }">
              <v-can disable-only :permission="'edit_risk_treatment'">
                <template #default="{ disabled }">
                  <button-dropdown-picker
                    :value="item.owner?.id"
                    :options="users"
                    :selectedText="item.owner?.full_name || $t('page.select_owner')"
                    :loading="loading.users"
                    btnColor="grey"
                    :btn-disabled="disabled"
                    @change="(option) => updateOwner(item, option)"
                  />
                </template>
              </v-can>
            </template>

            <template v-slot:item.likely_hood="{ item }">
              <color-label :text="item.likely_hood?.name" :color="item.likely_hood?.color" />
            </template>

            <template v-slot:item.impact="{ item }">
              <color-label :text="item.impact?.name" :color="item.impact?.color" />
            </template>

            <template v-slot:item.rating="{ item }">
              <color-label :text="item.treatment_rating?.name" :color="item.treatment_rating?.color" />
            </template>

            <template v-slot:item.treatment_status="{ item }">
              <v-can disable-only :permission="'edit_risk_treatment'">
                <template #default="{ disabled }">
                  <button-dropdown-picker
                    :value="item.treatment_status?.id"
                    :options="riskTreatmentStatuses"
                    :selectedText="item.treatment_status?.name || $t('page.select_status')"
                    :loading="loadingLookups.riskTreatmentStatuses"
                    btnColor="grey"
                    :btn-disabled="disabled"
                    @change="(option) => updateStatus(item, option)"
                  />
                </template>
              </v-can>
            </template>
            <template v-slot:item.budget="{ item }">
              {{ formatCurrency(item.budget, false, "suffix", $i18n) }}
            </template>

            <template v-slot:item.progress="{ item }">
              {{ formatPercentage(item.progress, false) }}
            </template>

            <template v-slot:item.start_date="{ item }">
              <formated-date-time hide-time :date="item.start_date" />
            </template>

            <template v-slot:item.end_date="{ item }">
              <formated-date-time hide-time :date="item.end_date" />
            </template>

            <!-- tasks templte -->
            <template v-slot:[`item.tasks`]="{ item }">
              <v-btn small icon text @click="viewTaskDialog(item)" class="d-flex align-center justify-start">
                <v-icon size="large">mdi-calendar-check-outline</v-icon>
                <span>
                  {{ item?.tasks?.length || 0 }}
                </span>
              </v-btn>
            </template>
          </custom-table>
        </v-card-text>
      </v-card>

      <!-- TPS Task View Dialog -->
      <custom-dialog
        v-model="tpsTaskViewDialog"
        :title="$t('table.assigned_tasks')"
        width="580px"
        @close-dialog="handleCloseDialog"
      >
        <TPSTaskView :selectedItemTask="selectedItemTask" />
      </custom-dialog>
    </v-container>
  </v-can>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex"
import EditableNoteForm from "@/components/forms/EditableNoteForm.vue"
import ButtonDropdownPicker from "@/components/custom-table/ButtonDropdownPicker.vue"
import ColorLabel from "@/components/custom-table/ColorLabel.vue"
import FormatedDateTime from "@/components/FormatedDateTime.vue"
import { formatCurrency, formatPercentage } from "@/helpers/formatters"
import DynamicBackNavigation from "@/mixins/dynamicBackNavigation"
import TPSTaskView from "../../../../../components/TPSTaskView.vue"

export default {
  name: "RiskTreatmentsPage",
  mixins: [DynamicBackNavigation],
  components: {
    EditableNoteForm,
    ButtonDropdownPicker,
    ColorLabel,
    FormatedDateTime,
    TPSTaskView
  },
  layout: "dashboard-layout",
  middleware: ["auth", "is-grc"],

  data() {
    return {
      filters: {
        treatment_status_id: null,
        min_budget: null,
        max_budget: null,
        owner_id: null,
        impact_id: null,
        likely_hood_id: null,
        treatment_rating_id: null
      },
      headers: [
        { text: "table.risk_treatment_description", value: "name", sortable: false },
        { text: "table.type_of_treatment_action", value: "treatment_status", sortable: false },
        { text: "table.owner_of_treatment_actaion", value: "owner", sortable: false },
        { text: "table.residual_risk_likelihood", value: "likely_hood", sortable: false },
        { text: "table.residual_risk_impact", value: "impact", sortable: false },
        { text: "table.treatment_rating", value: "rating", sortable: false },
        { text: "table.risk_budget", value: "budget", sortable: false },
        { text: "table.progress", value: "progress", sortable: false },

        { text: "table.start_date", value: "start_date", sortable: false },
        { text: "table.deadline_for_action", value: "end_date", sortable: false },
        { text: "table.notes", value: "notes", sortable: false },
        { text: "table.tasks", value: "tasks", tooltip: "table.tasks" },
        { text: "table.actions", value: "actions", sortable: false }
      ],
      tableConfig: {
        delete: this.deleteTreatment,
        itemPath: `/grc/risk-register/${this.riskId()}/treatments`,
        createForm: {
          componentPath: "forms/RiskTreatmentForm"
        },
        editForm: {
          componentPath: "forms/RiskTreatmentForm",
          props: { editForm: true }
        },
        permissions: {
          create: "create_risk_treatment",
          edit: "edit_risk_treatment",
          delete: "delete_risk_treatment"
        }
      },
      selectedItemTask: [],
      tpsTaskViewDialog: false
    }
  },

  computed: {
    ...mapState("riskTreatments", [
      "riskTreatments",
      "currentRisk",
      "loading",
      "riskTreatmentStatuses",
      "loadingLookups"
    ]),
    ...mapState("risk", ["impacts", "likelihoods", "riskPriorities"]),
    ...mapGetters("risk", ["users"]),

    entityType() {
      return "treatments"
    },

    title() {
      if (this.currentRisk) {
        return `${this.$t("form.risk_treatment")} - ${this.currentRisk.name}`
      }
      return this.$t("form.risk_treatment")
    },

    isLoading() {
      return (
        this.loading ||
        this.loadingLookups?.riskTreatmentStatuses ||
        this.loadingLookups?.users ||
        this.loadingLookups?.impacts ||
        this.loadingLookups?.likelihoods
      )
    }
  },

  methods: {
    formatCurrency,
    formatPercentage,
    ...mapActions("riskTreatments", [
      "fetchRiskTreatments",
      "deleteRiskTreatment",
      "fetchRiskTreatmentStatuses",
      "updateRiskTreatment"
    ]),
    ...mapActions("risk", ["fetchUsers", "fetchImpacts", "fetchLikelihoods", "fetchRiskPriorities"]),

    riskId() {
      return this.$route.params.id
    },

    async updateOwner(item, newOwner) {
      try {
        const payload = {
          ...item,
          owner_id: newOwner.id,
          treatment_status_id: item.treatment_status?.id,
          impact_id: item.impact?.id,
          likely_hood_id: item.likely_hood?.id
        }
        await this.updateRiskTreatment({ id: item.id, payload })
        item.owner = newOwner
      } catch (error) {
        console.error("Error updating owner:", error)
      }
    },

    async updateStatus(item, newStatus) {
      try {
        const payload = {
          ...item,
          owner_id: item.owner?.id,
          treatment_status_id: newStatus.id,
          impact_id: item.impact?.id,
          likely_hood_id: item.likely_hood?.id
        }
        await this.updateRiskTreatment({ id: item.id, payload })
        item.treatment_status = newStatus
      } catch (error) {
        console.error("Error updating status:", error)
      }
    },

    async fetchAllDropdownData() {
      try {
        await Promise.all([
          this.fetchRiskTreatmentStatuses(),
          this.fetchUsers(),
          this.fetchImpacts(),
          this.fetchLikelihoods(),
          this.fetchRiskPriorities()
        ])
      } catch (error) {
        console.error("Error fetching dropdown data:", error)
      }
    },

    fetchTreatments() {
      this.fetchRiskTreatments({
        riskId: this.riskId(),
        filters: this.filters
      })
    },

    deleteTreatment(id) {
      return this.deleteRiskTreatment(id)
    },

    applyFilters() {
      this.fetchTreatments()
    },
    viewTaskDialog(item) {
      this.selectedItemTask = item?.tasks
      this.tpsTaskViewDialog = true
    },
    formatDate(dateString) {
      if (!dateString) return ""

      // Customize date formatting based on your locale
      const date = new Date(dateString)
      return date.toLocaleDateString(this.$i18n.locale, {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    }
  },

  async mounted() {
    await this.fetchTreatments()
    await this.fetchAllDropdownData()
  }
}
</script>

<style scoped>
.v-card {
  box-shadow: none;
}
</style>
