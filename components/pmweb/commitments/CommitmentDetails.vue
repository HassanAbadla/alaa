<template>
  <p-m-web-details-template
    store-module="pmwebCommitments"
    :record-id="commitmentId"
    :initial-fields="defaultFields"
    :required-fields="['ProjectNumber', 'CommitmentID', 'EffectiveDate', 'DueDate', 'ScheduledDeliveryDate']"
    :transform-fields="transformCommitmentFields"
    create-success-path="/pm-web/commitments/:id"
    delete-redirect-path="/pm-web/commitments"
    @save-success="onSaveSuccess"
    @save-error="onSaveError"
    @field-change="onFieldChange"
    @before-save="onBeforeSave"
  >
    <template #default="{ fields, isCreateForm, updateField }">
      <!-- Information Section -->
      <section-wrapper :title="$t('page.information')" style="width: 32%">
        <custom-input
          :value="fields._ProjectName"
          @input="updateField('_ProjectName', $event)"
          :label="$t('table.project')"
          required
          :disabled="!isCreateForm"
          class="mb-2"
          v-if="!isCreateForm || fields._ProjectName"
        />

        <custom-dropdown
          v-if="isCreateForm"
          :label="$t('table.project_name')"
          item-value="ProjectNumber"
          item-text="ProjectCodeWithName"
          :loading="loadingProjects"
          :disabled="loadingProjects"
          :items="getProjects"
          :value="fields.ProjectNumber"
          @input="updateField('ProjectNumber', $event)"
          required
        />

        <custom-input
          :value="fields.CommitmentID"
          @input="updateField('CommitmentID', $event)"
          :label="$t('table.id')"
          required
          class="mb-2"
        />

        <custom-input
          :value="fields._CompanyName"
          @input="updateField('_CompanyName', $event)"
          :label="$t('table.company')"
          class="mb-2"
          v-if="!isCreateForm || fields._CompanyName"
        />

        <custom-input
          :value="fields.CompanyCode"
          @input="updateField('CompanyCode', $event)"
          :label="$t('table.company_code')"
          class="mb-2"
          v-if="isCreateForm"
        />

        <custom-input
          :value="fields.Description"
          @input="updateField('Description', $event)"
          :label="$t('table.description')"
          class="mb-2"
        />

        <custom-input
          :value="fields.Type"
          @input="updateField('Type', $event)"
          :label="$t('table.type')"
          class="mb-2"
        />

        <custom-input
          :value="fields.Category"
          @input="updateField('Category', $event)"
          :label="$t('table.category')"
          class="mb-2"
        />

        <row-wrapper>
          <custom-input :value="fields.Status" @input="updateField('Status', $event)" :label="$t('table.status')" />
          <custom-input
            :value="fields.Revision"
            @input="updateField('Revision', $event)"
            :label="$t('table.revision_#')"
          />
        </row-wrapper>

        <custom-date-picker
          :isPMWEB="true"
          :value="fields.EffectiveDate"
          @input="updateField('EffectiveDate', $event)"
          :label="$t('table.expiration_date')"
          class="mb-2"
          required
        />

        <custom-input
          :value="fields._ApprovedChangesDays"
          :label="$t('table.approved_changes_days')"
          class="mb-2"
          disabled
          v-if="!isCreateForm"
        />

        <custom-input
          :value="fields._ProcurementNumber"
          :label="$t('table.procurement_#')"
          class="mb-2"
          v-if="!isCreateForm || fields._ProcurementNumber"
        />
      </section-wrapper>

      <!-- Middle Column with Billing and Recap -->
      <div style="width: 32%">
        <!-- Billing Section -->
        <section-wrapper :title="$t('page.billing')" class="mb-3">
          <custom-input
            :value="fields.BillingTerms"
            @input="updateField('BillingTerms', $event)"
            :label="$t('table.billing_terms')"
            class="mb-2"
          />

          <custom-input
            :value="fields.RetentionOnServices"
            @input="updateField('RetentionOnServices', $event)"
            :label="$t('table.retention_on_services')"
            class="mb-2"
          />

          <custom-input
            :value="fields.RetentionOnStoredMaterials"
            @input="updateField('RetentionOnStoredMaterials', $event)"
            :label="$t('table.retention_on_stored_materials')"
            class="mb-2"
          />
        </section-wrapper>

        <!-- Recap Section - Only shown in view mode -->
        <section-wrapper :title="$t('page.recap')" v-if="!isCreateForm">
          <row-wrapper>
            <custom-input :value="fields._OriginalValue" :label="$t('table.original_value')" disabled />
            <custom-input :value="fields._OriginalValueDays" :label="$t('table.days')" disabled />
          </row-wrapper>

          <row-wrapper>
            <custom-input :value="fields._ApprovedChanges" :label="$t('table.approved_changes')" disabled />
            <custom-input :value="fields._ApprovedChangesDays" :label="$t('table.days')" disabled />
          </row-wrapper>

          <row-wrapper>
            <custom-input :value="fields._RevisedValue" :label="$t('table.revised_value')" disabled />
            <custom-input :value="fields._RevisedValueDays" :label="$t('table.days')" disabled />
          </row-wrapper>

          <custom-input :value="fields._Billed" :label="$t('table.billed')" disabled class="mb-2" />
          <custom-input :value="fields._Retained" :label="$t('table.retained')" disabled class="mb-2" />
          <custom-input :value="fields._BalanceDue" :label="$t('table.balance_due')" disabled class="mb-2" />
          <custom-input :value="fields._PaymentsApplied" :label="$t('table.payments_applied')" disabled class="mb-2" />
          <custom-input :value="fields._OpenBalance" :label="$t('table.open_balance')" disabled class="mb-2" />
          <custom-input :value="fields._Unbilled" :label="$t('table.unbilled')" disabled class="mb-2" />

          <row-wrapper>
            <custom-input :value="fields._PendingChanges" :label="$t('table.pending_changes')" disabled />
            <custom-input :value="fields._PendingChangesDays" :label="$t('table.days')" disabled />
          </row-wrapper>
        </section-wrapper>
      </div>

      <!-- Delivery Section -->
      <section-wrapper :title="$t('page.delivery')" style="width: 32%">
        <custom-date-picker
          :isPMWEB="true"
          :value="fields.DueDate"
          @input="updateField('DueDate', $event)"
          :label="$t('table.due_date')"
          class="mb-2"
          required
        />

        <custom-date-picker
          :isPMWEB="true"
          :value="fields.ScheduledDeliveryDate"
          @input="updateField('ScheduledDeliveryDate', $event)"
          :label="$t('table.scheduled_delivery_date')"
          class="mb-2"
          required
        />

        <custom-input
          :value="fields.ShipTo"
          @input="updateField('ShipTo', $event)"
          :label="$t('table.ship_to')"
          class="mb-2"
        />

        <custom-input
          :value="fields.Reference"
          @input="updateField('Reference', $event)"
          :label="$t('table.reference')"
          class="mb-2"
        />
      </section-wrapper>
    </template>
  </p-m-web-details-template>
</template>

<script>
import SectionWrapper from "@/components/page-layout/SectionWrapper.vue"
import RowWrapper from "@/components/page-layout/RowWrapper.vue"
import PMWebDetailsTemplate from "@/components/pmweb/PMWebDetailsTemplate.vue"
import { mapActions, mapGetters } from "vuex"

export default {
  name: "CommitmentDetails",
  components: {
    SectionWrapper,
    RowWrapper,
    PMWebDetailsTemplate
  },
  props: {
    commitmentId: {
      type: String,
      required: false,
      default: null
    },
    projectNumber: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters("pmwebProjects", {
      getProjects: "getProjects",
      loadingProjects: "isLoading"
    }),

    defaultFields() {
      const baseFields = {
        ProjectNumber: "",
        CommitmentID: "",
        CompanyCode: "",
        Description: "",
        Type: "Purchase Order",
        Category: "",
        Status: "Draft",
        Revision: 0,
        EffectiveDate: "",
        DueDate: "",
        ScheduledDeliveryDate: "",
        BillingTerms: "",
        RetentionOnServices: 0,
        RetentionOnStoredMaterials: 0,
        ShipTo: "",
        Reference: "",
        CurrencyCode: ""
      }

      return baseFields
    }
  },

  methods: {
    ...mapActions({
      fetchProjects: "pmwebProjects/fetchProjects"
    }),

    transformCommitmentFields(fields) {
      // Any field transformations before saving
      const transformed = { ...fields }

      // Ensure numeric fields are numbers
      if (transformed.Revision !== undefined) {
        transformed.Revision = Number(transformed.Revision) || 0
      }
      if (transformed.RetentionOnServices !== undefined) {
        transformed.RetentionOnServices = Number(transformed.RetentionOnServices) || 0
      }
      if (transformed.RetentionOnStoredMaterials !== undefined) {
        transformed.RetentionOnStoredMaterials = Number(transformed.RetentionOnStoredMaterials) || 0
      }

      return transformed
    },

    onSaveSuccess(result) {
      console.log("Commitment saved successfully:", result)
      // You can add custom success handling here
    },

    onSaveError({ error, result }) {
      console.error("Failed to save commitment:", error)
      // You can add custom error handling here
    },

    onFieldChange({ field, value, allFields }) {
      // React to field changes if needed
      console.log(`Field ${field} changed to:`, value)
    },

    onBeforeSave(fieldsToSave) {
      // Last chance to modify or validate before save
      console.log("About to save:", fieldsToSave)
    }
  },

  async mounted() {
    // Load projects for dropdown
    await this.fetchProjects()
  }
}
</script>

<style scoped>
.row-wrapper {
  display: flex;
  width: 100%;
  gap: 8px;
  margin-bottom: 8px;
}

.row-wrapper > * {
  flex: 1;
}
</style>
