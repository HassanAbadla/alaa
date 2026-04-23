<template>
  <div>
    <form-wrapper v-if="!fetchError && !loading" :title="title" @submit="submitRiskTreatment" :loading="isSubmitting">
      <custom-input
        :label="$t('table.risk_treatment_description')"
        v-model="fields.name"
        :required="true"
        :errors="errors.name"
        @clear-errors="clearError('name')"
      />

      <custom-dropdown
        :items="users"
        item-value="id"
        item-text="name"
        :required="true"
        :label="$t('table.owner_of_treatment_actaion')"
        v-model="fields.owner_id"
        :errors="errors.owner_id"
        @clear-errors="clearError('owner_id')"
        :loading="loadingLookups.users"
      />
      <custom-dropdown
        :items="impacts"
        item-value="id"
        item-text="name"
        :required="true"
        :label="$t('table.residual_risk_impact')"
        v-model="fields.impact_id"
        :errors="errors.impact_id"
        @clear-errors="clearError('impact_id')"
        :loading="loadingLookups.impacts"
      />
      <custom-dropdown
        :items="likelihoods"
        item-value="id"
        item-text="name"
        :required="true"
        :label="$t('table.residual_risk_likelihood')"
        v-model="fields.likely_hood_id"
        :errors="errors.likely_hood_id"
        @clear-errors="clearError('likely_hood_id')"
        :loading="loadingLookups.likelihoods"
      />
      <!-- Original Dropdowns -->
      <custom-dropdown
        :items="riskTreatmentStatuses"
        item-value="id"
        item-text="name"
        :required="true"
        :label="$t('table.type_of_treatment_action')"
        v-model="fields.treatment_status_id"
        :errors="errors.treatment_status_id"
        @clear-errors="clearError('treatment_status_id')"
        :loading="loadingLookups.riskTreatmentStatuses"
      />
      <custom-input
        :label="$t('form.progress')"
        v-model="fields.progress"
        type="number"
        :required="true"
        :errors="errors.progress"
        @clear-errors="clearError('progress')"
      />
      <custom-input
        :label="$t('table.risk_budget')"
        v-model="fields.budget"
        type="number"
        isCurrency
        non-negative
        :required="true"
        :errors="errors.budget"
        @clear-errors="clearError('budget')"
      />
      <custom-date-picker
        :label="$t('form.start_date')"
        v-model="fields.start_date"
        :errors="errors.start_date"
        @clear-errors="clearError('start_date')"
      />
      <custom-date-picker
        :label="$t('table.deadline_for_action')"
        v-model="fields.end_date"
        :errors="errors.end_date"
        @clear-errors="clearError('end_date')"
        :start-date="fields.start_date"
        :is-end-date="true"
      />
      <quill-editor v-model="fields.note" class="mb-4" />
    </form-wrapper>
    <message-display
      v-if="fetchError"
      :messageTitle="fetchError.title"
      :messageText="fetchError.text"
      :code="fetchError.code"
    />

    <!-- TPS Form Dialog -->
    <custom-dialog
      v-model="tpsFormDialog"
      :title="$t('form.assign_task')"
      width="580px"
      @close-dialog="handleCloseDialog"
    >
      <TPSTaskForm
        ref="tpsTaskForm"
        :item="fields || newTreatment || {}"
        :taskable_type="'treatment'"
        :taskable_id="newTreatmentId"
        :assignedTo="treatmentOwner"
        @close="handleCloseDialog"
      />
    </custom-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex"
import { generateErrorMessage } from "@/helpers/error-helpers"
import MessageDisplay from "../MessageDisplay.vue"
import QuillEditor from "@/components/QuillEditor.vue"
import TPSTaskForm from "../TPSTaskForm.vue"

export default {
  name: "RiskTreatmentForm",
  components: { MessageDisplay, QuillEditor },
  props: {
    editForm: {
      type: Boolean,
      default: false
    },
    itemId: { type: Number }
  },
  layout: "dashboard-layout",
  data() {
    return {
      fields: {
        name: "",
        code: "",
        note: "",
        risk_id: this.$route.params.id,
        treatment_status_id: "",
        owner_id: "",
        impact_id: "",
        likely_hood_id: "",
        progress: "",
        budget: "",
        start_date: "",
        end_date: ""
      },
      errors: {},
      fetchError: null,
      loading: false,
      isSubmitting: false,

      tpsFormDialog: false,
      createdTreatment: {}
    }
  },
  computed: {
    ...mapState("riskTreatments", ["riskTreatmentStatuses", "loadingLookups"]),
    ...mapState("risk", ["impacts", "likelihoods"]),
    ...mapGetters("risk", ["users"]),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("form.risk_treatment")}`
    },
    newTreatmentId() {
      return this.createdTreatment?.id
    },
    treatmentOwner() {
      return this.createdTreatment.owner
    },
    newTreatment() {
      return this.createdTreatment
    }
  },
  methods: {
    ...mapActions("riskTreatments", ["createRiskTreatment", "updateRiskTreatment", "fetchRiskTreatmentStatuses"]),
    ...mapActions("risk", ["fetchUsers", "fetchImpacts", "fetchLikelihoods"]),
    ...mapActions("drawer", ["closeDrawer"]),

    async submitRiskTreatment() {
      this.isSubmitting = true
      this.errors = {}
      try {
        if (this.editForm) {
          await this.updateRiskTreatment({ id: this.itemId, payload: this.fields })
        } else {
          const response = await this.createRiskTreatment(this.fields)
          console.log("creat risk response:", response)
          if (response) {
            this.createdTreatment = response
            this.tpsFormDialog = true
          }
        }
        // this.closeDrawer()
      } catch (error) {
        if (error?.response?.data) {
          this.errors = error.response.data.errors || {}
        } else {
          console.error(`Error ${this.editForm ? "editing" : "creating"} risk treatment:`, error)
        }
      } finally {
        this.isSubmitting = false
      }
    },
    handleCloseDialog() {
      this.tpsFormDialog = false
      this.closeDrawer()
    },

    async fetchRiskTreatment() {
      this.loading = true
      try {
        const treatment = await this.$store.getters["riskTreatments/getRiskTreatmentById"](this.itemId)
        if (treatment) {
          this.fields = {
            budget: treatment?.budget,
            code: treatment?.code,
            end_date: treatment?.end_date,
            start_date: treatment?.start_date,
            name: treatment?.name,
            note: treatment?.note,
            progress: treatment?.progress,
            owner_id: treatment?.owner?.id,
            impact_id: treatment.impact?.id,
            likely_hood_id: treatment.likely_hood?.id,
            treatment_status_id: treatment.treatment_status?.id
          }
        } else {
          throw new Error("Risk treatment not found")
        }
      } catch (error) {
        this.fetchError = generateErrorMessage(error, this.$i18n)
      } finally {
        this.loading = false
      }
    },

    async fetchDropdownData() {
      try {
        await Promise.all([
          this.fetchRiskTreatmentStatuses(),
          this.fetchUsers(),
          this.fetchImpacts(),
          this.fetchLikelihoods()
        ])
      } catch (error) {
        console.error("Error fetching dropdown data:", error)
        this.fetchError = generateErrorMessage(error, this.$i18n)
      }
    },

    clearError(field) {
      this.errors[field] = []
    }
  },
  async mounted() {
    await this.fetchDropdownData()
    if (this.editForm) {
      this.fetchRiskTreatment()
    }
  }
}
</script>
