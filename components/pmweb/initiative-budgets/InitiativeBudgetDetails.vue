<template>
  <p-m-web-details-template
    :title="$t('page.create_initiative_budget')"
    store-module="pmwebInitiativeBudgets"
    :record-id="initiativeBudgetId"
    :initial-fields="defaultFields"
    :required-fields="['Code', 'Name', 'StatusId', 'CurrencyId', 'PriorityId']"
    create-success-path="/pm-web/initiative-budgets/:id"
    delete-redirect-path="/pm-web/initiative-budgets"
  >
    <template #default="{ fields, isCreateForm, updateField }">
      <v-row no-gutters class="justify-start">
        <v-col cols="12" md="auto">
          <section-wrapper>
            <custom-input dense v-model="fields.Code" :label="$t('table.initiative_id')" required />
            <custom-input dense v-model="fields.Name" :label="$t('table.name')" required />

            <custom-dropdown
              :label="$t('table.program')"
              :items="programsList"
              item-value="Id"
              item-text="Name"
              :loading="loadingProgramsList"
              :disabled="loadingProgramsList"
              :value="fields.ProgramId"
              @input="updateField('ProgramId', $event)"
            />
            <custom-dropdown
              :label="$t('table.type')"
              :items="projectTypes"
              item-value="Id"
              item-text="Type"
              :loading="loadingProjectTypes"
              :disabled="loadingProjectTypes"
              :value="fields.TypeId"
              @input="updateField('TypeId', $event)"
            />
            <custom-dropdown
              :label="$t('table.category')"
              :items="projectCategories"
              item-value="Id"
              item-text="Category"
              :loading="loadingProjectCategories"
              :disabled="loadingProjectCategories"
              :value="fields.CategoryId"
              @input="updateField('CategoryId', $event)"
            />
            <custom-input dense v-model="fields.Reference" :label="$t('table.reference')" />
            <custom-input dense v-model="fields.Abbreviation" :label="$t('table.abbreviation')" />

            <row-wrapper>
              <custom-dropdown
                :label="$t('table.status')"
                :items="docStatuses"
                item-value="Id"
                item-text="DocStatusName"
                :loading="loadingDocStatuses"
                disabled
                :value="fields.StatusId"
                @input="updateField('StatusId', $event)"
                required
              />
              <custom-input dense v-model="fields.RevisionNumber" :label="$t('table.revision_#')" disabled />
            </row-wrapper>

            <custom-dropdown
              :label="$t('table.location')"
              :items="locations"
              item-value="Id"
              item-text="CodeName"
              :loading="loadingLocations"
              :disabled="loadingLocations"
              :value="fields.AssetLocationId"
              @input="updateField('AssetLocationId', $event)"
            />
            <custom-input dense v-model="fields.TenantRequestId" :label="$t('table.request_id')" disabled />

            <custom-dropdown
              :label="$t('table.currency')"
              :items="currencies"
              item-value="Id"
              item-text="CurrencyCodeWithName"
              :loading="loadingCurrencies"
              :disabled="loadingCurrencies"
              :value="fields.CurrencyId"
              @input="updateField('CurrencyId', $event)"
              required
            />
            <custom-dropdown
              :label="$t('table.pbs')"
              :items="pbsList"
              item-value="Id"
              item-text="Description"
              :loading="loadingPBSs"
              :disabled="loadingPBSs"
              :value="fields.PBSId"
              @input="updateField('PBSId', $event)"
            />
            <custom-input v-model="fields.BudgetYear" :label="$t('table.funding_year')" type="number" required />
            <custom-dropdown
              :label="$t('table.priority')"
              :items="priorities"
              item-value="Id"
              item-text="Name"
              :loading="loadingPriorities"
              :disabled="loadingPriorities"
              :value="fields.PriorityId"
              @input="updateField('PriorityId', $event)"
              required
            />
          </section-wrapper>
        </v-col>

        <v-col cols="12" md="auto" :class="{ 'ml-6': $vuetify.breakpoint.mdAndUp }">
          <section-wrapper>
            <custom-date-picker v-model="fields.Start" :label="$t('table.target_start')" />
            <custom-date-picker v-model="fields.Finish" :label="$t('table.target_finish')" />

            <custom-dropdown
              :label="$t('table.sponsor')"
              :items="sponsors"
              item-value="Id"
              item-text="CompanyName"
              :loading="loadingSponsors"
              :disabled="loadingSponsors"
              :value="fields.SponsorId"
              @input="updateField('SponsorId', $event)"
            />
            <custom-dropdown
              :label="$t('table.funding_source')"
              :items="fundingSources"
              item-value="Id"
              item-text="FundingSource"
              :loading="loadingFundingSources"
              :disabled="loadingFundingSources"
              :value="fields.FundingSourceId"
              @input="updateField('FundingSourceId', $event)"
            />
            <custom-dropdown
              :label="$t('table.project_manager')"
              :items="projectManagers"
              item-value="Id"
              item-text="dropdownDisplay"
              :loading="loadingProjectManagers"
              :disabled="loadingProjectManagers"
              :value="fields.ProjectManagerId"
              @input="updateField('ProjectManagerId', $event)"
            />
            <custom-text-area v-model="fields.Scope" :label="$t('table.scope')" />
            <custom-dropdown
              :label="$t('table.workflow_calendar')"
              :items="workflowCalenders"
              item-value="Id"
              item-text="Calendar"
              :loading="loadingWorkflowCalenders"
              :disabled="loadingWorkflowCalenders"
              :value="fields.WorkflowCalendarId"
              @input="updateField('WorkflowCalendarId', $event)"
            />
          </section-wrapper>

          <section-wrapper v-if="!isCreateForm" :title="$t('page.totals')">
            <custom-input v-model="fields.ExtCost" :label="$t('table.funding_year')" type="number" disabled />
            <custom-input v-model="fields.TotalInitiative" :label="$t('table.adjustments')" type="number" disabled />
            <custom-input
              v-model="fields.TotalInitiativeDetails"
              :label="$t('table.total_cost')"
              type="number"
              disabled
            />
            <!-- <custom-input v-model="fields.WeightedScore" :label="$t('table.weighted_score')" type="number" disabled /> -->
          </section-wrapper>
        </v-col>
      </v-row>
    </template>
  </p-m-web-details-template>
</template>

<script>
import PMWebDetailsTemplate from "@/components/pmweb/PMWebDetailsTemplate.vue"
import SectionWrapper from "@/components/page-layout/SectionWrapper.vue"
import RowWrapper from "@/components/page-layout/RowWrapper.vue"
import { mapActions, mapGetters } from "vuex"

export default {
  name: "PMWEBInitiativeBudgetDetails",
  components: {
    SectionWrapper,
    RowWrapper,
    PMWebDetailsTemplate
  },
  props: {
    initiativeBudgetId: {
      type: String,
      required: false,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      programsList: "pmwebProgramsList/getPrograms",
      loadingPrograms: "pmwebProgramsList/isLoading",
      projectTypes: "pmwebProjectTypes/getProjectTypes",
      loadingProjectTypes: "pmwebProjectTypes/isLoading",
      docStatuses: "pmwebDocStatuses/getDocStatuses",
      defaultDocStatus: "pmwebDocStatuses/getDefaultDocStatus",
      loadingDocStatuses: "pmwebDocStatuses/isLoading",
      projectCategories: "pmwebProjectCategories/getProjectCategories",
      loadingProjectCategories: "pmwebProjectCategories/isLoading",
      currencies: "pmwebCurrencies/getCurrencies",
      defaultCurrency: "pmwebCurrencies/getDefaultCurrency",
      loadingCurrencies: "pmwebCurrencies/isLoading",
      countries: "pmwebCountries/getCountries",
      loadingCountries: "pmwebCountries/isLoading",
      priorities: "pmwebPriorities/getPriorities",
      defaultPriority: "pmwebPriorities/getDefaultPriority",
      loadingPriorities: "pmwebPriorities/isLoading",
      locations: "pmwebLocations/getLocations",
      loadingLocations: "pmwebLocations/isLoading",
      pbsList: "pmwebPBSs/getPBSs",
      loadingPBSs: "pmwebPBSs/isLoading",
      sponsors: "pmwebSponsors/getSponsors",
      loadingSponsors: "pmwebSponsors/isLoading",
      fundingSources: "pmwebFundingSources/getFundingSources",
      loadingFundingSources: "pmwebFundingSources/isLoading",
      projectManagers: "pmwebProjectManagers/getProjectManagers",
      loadingProjectManagers: "pmwebProjectManagers/isLoading",
      workflowCalenders: "pmwebWorkflowCalenders/getWorkflowCalenders",
      loadingWorkflowCalenders: "pmwebWorkflowCalenders/isLoading"
    }),
    defaultFields() {
      return {
        // ProjectId: "12",
        ProgramId: 0,
        Code: "",
        Name: "",
        TypeId: null,
        CategoryId: 0,
        Reference: "",
        Abbreviation: "",
        // Plan: "",
        StatusId: this.defaultDocStatus ? this.defaultDocStatus.Id : null,
        TenantRequestId: null,
        CurrencyId: this.defaultCurrency ? this.defaultCurrency.Id : null,
        BudgetYear: new Date().getFullYear(),
        PriorityId: this.defaultPriority ? this.defaultPriority.Id : null,
        Start: new Date(),
        Finish: new Date(),
        RevisionNumber: 0,
        AssetLocationId: 0,
        WorkflowCalendarId: 0,
        IsActive: 1,
        Scope: "",
        ExtCost: null,
        TotalInitiative: null,
        TotalInitiativeDetails: null,
        // WeightedScore: null,
        AssetLocationId: null,
        PBSId: null,
        SponsorId: null,
        FundingSourceId: null,
        ProjectManagerId: null,
        WorkflowCalendarId: null
      }
    }
  },
  methods: {
    ...mapActions({
      fetchProgramsList: "pmwebProgramsList/fetchPrograms",
      fetchProjectTypes: "pmwebProjectTypes/fetchProjectTypes",
      fetchDocStatuses: "pmwebDocStatuses/fetchDocStatuses",
      fetchProjectCategories: "pmwebProjectCategories/fetchProjectCategories",
      fetchCurrencies: "pmwebCurrencies/fetchCurrencies",
      fetchCoutries: "pmwebCountries/fetchCountries",
      fetchPriorities: "pmwebPriorities/fetchPriorities",
      fetchLocations: "pmwebLocations/fetchLocations",
      fetchPBSs: "pmwebPBSs/fetchPBSs",
      fetchSponsors: "pmwebSponsors/fetchSponsors",
      fetchFundingSources: "pmwebFundingSources/fetchFundingSources",
      fetchProjectManagers: "pmwebProjectManagers/fetchProjectManagers",
      fetchWorkflowCalenders: "pmwebWorkflowCalenders/fetchWorkflowCalenders"
    })
  },
  async mounted() {
    await Promise.all([
      this.fetchProgramsList(),
      this.fetchProjectTypes(),
      this.fetchDocStatuses(),
      this.fetchProjectCategories(),
      this.fetchCurrencies(),
      this.fetchCoutries(),
      this.fetchPriorities(),
      this.fetchLocations(),
      this.fetchPBSs(),
      this.fetchSponsors(),
      this.fetchFundingSources(),
      this.fetchProjectManagers(),
      this.fetchWorkflowCalenders()
    ])
  }
}
</script>

<style></style>
