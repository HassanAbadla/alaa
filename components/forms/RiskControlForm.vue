<template>
  <div>
    <form-wrapper v-if="!fetchError && !loading" :title="title" @submit="submitRiskControl" :loading="isSubmitting">
      <custom-input
        :label="$t('form.name')"
        v-model="fields.name"
        :required="true"
        :errors="errors.name"
        @clear-errors="clearError('name')"
      />
      <custom-input
        :label="$t('form.short_name')"
        v-model="fields.code"
        :required="true"
        :errors="errors.code"
        @clear-errors="clearError('code')"
      />
      <custom-input
        :label="$t('form.impact_reputation')"
        v-model="fields.impact_reputation"
        :required="true"
        :errors="errors.impact_reputation"
        @clear-errors="clearError('impact_reputation')"
      />
      <custom-input
        :label="$t('form.impact_financial_min')"
        v-model="fields.impact_financial_min"
        :required="true"
        type="number"
        non-negative
        icon="mdi-cash-multiple"
        :errors="errors.impact_financial_min"
        @clear-errors="clearError('impact_financial_min')"
      />
      <custom-input
        :label="$t('form.impact_financial_max')"
        v-model="fields.impact_financial_max"
        :required="true"
        non-negative="true"
        type="number"
        icon="mdi-cash-multiple"
        :errors="errors.impact_financial_max"
        @clear-errors="clearError('impact_financial_max')"
      />
      <custom-dropdown
        :items="riskControlTypes"
        item-value="id"
        item-text="name"
        :required="true"
        :label="$t('form.risk_control_type')"
        v-model="fields.risk_control_type_id"
        :errors="errors.risk_control_type_id"
        @clear-errors="clearError('risk_control_type_id')"
        :loading="loadingLookups.riskControlTypes"
      />
      <custom-dropdown
        :items="riskControlEffectiveness"
        item-value="id"
        item-text="name"
        :required="true"
        :label="$t('form.risk_control_effectiveness')"
        v-model="fields.risk_control_effectiveness_id"
        :errors="errors.risk_control_effectiveness_id"
        @clear-errors="clearError('risk_control_effectiveness_id')"
        :loading="loadingLookups.riskControlEffectiveness"
      />
      <custom-dropdown
        :items="operationalImpacts"
        item-value="id"
        item-text="name"
        :required="true"
        :label="$t('form.operational_impact')"
        v-model="fields.operational_impact_id"
        :errors="errors.operational_impact_id"
        @clear-errors="clearError('operational_impact_id')"
        :loading="loadingLookups.operationalImpacts"
      />
      <quill-editor v-model="fields.note" class="mb-4" />
    </form-wrapper>
    <message-display
      v-if="fetchError"
      :messageTitle="fetchError.title"
      :messageText="fetchError.text"
      :code="fetchError.code"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex"
import { generateErrorMessage } from "@/helpers/error-helpers"
import MessageDisplay from "../MessageDisplay.vue"
import QuillEditor from "@/components/QuillEditor.vue"

export default {
  name: "RiskControlForm",
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
        risk_control_type_id: "",
        risk_control_effectiveness_id: "",
        operational_impact_id: "",
        impact_reputation: "",
        impact_financial_min: "",
        impact_financial_max: ""
      },
      errors: {},
      fetchError: null,
      loading: false,
      isSubmitting: false
    }
  },
  computed: {
    ...mapState("riskControls", [
      "riskControlTypes",
      "riskControlEffectiveness",
      "operationalImpacts",
      "loadingLookups"
    ]),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("form.risk_control")}`
    }
  },
  methods: {
    ...mapActions("drawer", ["closeDrawer"]),
    ...mapActions("riskControls", [
      "createRiskControl",
      "updateRiskControl",
      "fetchRiskControlTypes",
      "fetchRiskControlEffectiveness",
      "fetchOperationalImpacts"
    ]),
    async submitRiskControl() {
      this.isSubmitting = true
      this.errors = {}
      try {
        if (this.editForm) {
          await this.updateRiskControl({ id: this.itemId, payload: this.fields })
        } else {
          await this.createRiskControl(this.fields)
        }
        this.closeDrawer()
      } catch (error) {
        if (error?.response?.data) {
          this.errors = error.response.data.errors || {}
        } else {
          console.error(`Error ${this.editForm ? "editing" : "creating"} risk control:`, error)
        }
      } finally {
        this.isSubmitting = false
      }
    },
    async fetchRiskControl() {
      this.loading = true
      try {
        const control = await this.$store.getters["riskControls/getRiskControlById"](this.itemId)
        if (control) {
          this.fields = { ...control }
        } else {
          throw new Error("Risk control not found")
        }
      } catch (error) {
        this.fetchError = generateErrorMessage(error, this.$i18n)
      } finally {
        this.loading = false
      }
    },
    clearError(field) {
      this.errors[field] = []
    }
  },
  async mounted() {
    await Promise.all([
      this.fetchRiskControlTypes(),
      this.fetchRiskControlEffectiveness(),
      this.fetchOperationalImpacts()
    ])
    if (this.editForm) {
      this.fetchRiskControl()
    }
  }
}
</script>
