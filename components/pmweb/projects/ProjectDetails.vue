<template>
  <p-m-web-details-template
    store-module="pmwebProjects"
    :record-id="projectId"
    :initial-fields="defaultFields"
    :required-fields="[
      'ProjectName',
      'ProjectNumber',
      'CurrencyId',
      'StatusId',
      'TargetBudget',
      'TargetRevenue',
      'TargetDuration',
      'TargetStart',
      'TargetFinish'
    ]"
    create-success-path="/pm-web/projects/:id"
    delete-redirect-path="/pm-web/projects"
  >
    <template #default="{ fields, isCreateForm, updateField }">
      <div class="d-flex flex-row" style="gap: 12px">
        <!-- information -->
        <section-wrapper :title="$t('page.information')" style="width: 32%">
          <custom-input v-model="fields.ProjectName" :label="$t('table.name')" required />
          <custom-input v-model="fields.ProjectNumber" :label="$t('table.project_#')" required />
          <custom-dropdown
            :label="$t('table.project_status')"
            :items="projectStatuses"
            item-value="Id"
            item-text="Status"
            :loading="loadingProjectStatuses"
            :disabled="loadingProjectStatuses"
            :value="fields.StatusId"
            required
            @input="updateField('StatusId', $event)"
          />
          <custom-dropdown
            :label="$t('table.project_type')"
            :items="projectTypes"
            item-value="Id"
            item-text="Type"
            :loading="loadingProjectTypes"
            :disabled="loadingProjectTypes"
            :value="fields.TypeId"
            @input="updateField('TypeId', $event)"
          />
          <row-wrapper>
            <custom-dropdown
              :label="$t('table.status')"
              :items="docStatuses"
              item-value="Id"
              item-text="DocStatusName"
              :loading="loadingDocStatuses"
              :disabled="loadingDocStatuses"
              :value="fields.DocStatusId"
              @input="updateField('DocStatusId', $event)"
              required
            />
            <custom-input v-model="fields.RevisionNumber" :label="$t('table.revision_#')" disabled />
          </row-wrapper>

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
          <custom-input v-model="fields.TargetBudget" :label="$t('table.target_budget')" type="number" />
          <custom-input v-model="fields.TargetRevenue" :label="$t('table.target_revenue')" type="number" />
          <row-wrapper>
            <custom-input v-model="fields.TargetDuration" :label="$t('table.target_duration')" type="number" />
            <custom-input v-model="fields.UOMId" :label="$t('table.uom')" />
          </row-wrapper>
          <custom-date-picker v-model="fields.TargetStart" :label="$t('table.target_start')" required />
          <custom-date-picker v-model="fields.TargetFinish" :label="$t('table.target_finish')" required />
          <custom-input v-model="fields.Scope" :label="$t('table.scope')" />
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
        </section-wrapper>

        <div class="d-flex flex-column">
          <!-- address -->
          <section-wrapper :title="$t('page.address')">
            <custom-input v-model="fields.Address1" :label="$t('table.address_1')" />
            <custom-input v-model="fields.Address2" :label="$t('table.address_2')" />
            <custom-input v-model="fields.City" :label="$t('table.city')" />
            <row-wrapper>
              <custom-input v-model="fields.State" :label="$t('table.state')" />
              <custom-input v-model="fields.Zip" :label="$t('table.zip')" />
            </row-wrapper>

            <custom-dropdown
              :label="$t('table.country')"
              :items="countries"
              item-value="Id"
              item-text="Country"
              :loading="loadingCountries"
              :disabled="loadingCountries"
              :value="fields.CountryId"
              @input="updateField('CountryId', $event)"
            />

            <custom-input v-model="fields.GoogleAddress" :label="$t('table.google_address')" />
          </section-wrapper>
        </div>
        <!-- personnel -->
        <section-wrapper :title="$t('page.personnel')" style="width: 32%">
          <custom-input v-model="fields.Executive" :label="$t('table.executive')" />
          <custom-input v-model="fields.Manager" :label="$t('table.manager')" />
          <custom-input v-model="fields.Superintendents" :label="$t('table.superintendent')" />
        </section-wrapper>
      </div>
    </template>
  </p-m-web-details-template>
</template>
<script>
import PMWebDetailsTemplate from "@/components/pmweb/PMWebDetailsTemplate.vue"
import SectionWrapper from "@/components/page-layout/SectionWrapper.vue"
import RowWrapper from "@/components/page-layout/RowWrapper.vue"
import { mapActions, mapGetters } from "vuex"

export default {
  name: "ProjectDetails",
  components: {
    SectionWrapper,
    RowWrapper,
    PMWebDetailsTemplate
  },
  props: {
    projectId: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      projectTypes: "pmwebProjectTypes/getProjectTypes",
      loadingProjectTypes: "pmwebProjectTypes/isLoading",
      projectStatuses: "pmwebProjectStatuses/getProjectStatuses",
      loadingProjectStatuses: "pmwebProjectStatuses/isLoading",
      docStatuses: "pmwebDocStatuses/getDocStatuses",
      loadingDocStatuses: "pmwebDocStatuses/isLoading",
      projectCategories: "pmwebProjectCategories/getProjectCategories",
      loadingProjectCategories: "pmwebProjectCategories/isLoading",
      currencies: "pmwebCurrencies/getCurrencies",
      defaultCurrency: "pmwebCurrencies/getDefaultCurrency",
      loadingCurrencies: "pmwebCurrencies/isLoading",
      countries: "pmwebCountries/getCountries",
      loadingCountries: "pmwebCountries/isLoading"
    }),
    defaultFields() {
      return {
        ProjectName: "",
        ProjectNumber: "",
        StatusId: "",
        TypeId: "",
        DocStatusId: "",
        RevisionNumber: 0,
        CurrencyId: this.defaultCurrency ? this.defaultCurrency.Id : null,
        TargetBudget: 0,
        TargetRevenue: 0,
        TargetDuration: 0,
        UOMId: null,
        TargetStart: "",
        TargetFinish: "",
        Scope: "",
        CategoryId: "",
        Address1: "",
        Address2: "",
        City: "",
        StateId: null,
        Zip: "",
        CountryId: "",
        GoogleAddress: "",
        Executive: "",
        Manager: "",
        Superintendents: "",
        IsActive: true,

        // needed for api but not required by us
        Phone: "",
        Fax: "",
        Longitude: "",
        Latitude: "",
        Elevation: ""
      }
    }
  },

  methods: {
    ...mapActions({
      fetchProjectTypes: "pmwebProjectTypes/fetchProjectTypes",
      fetchProjectStatuses: "pmwebProjectStatuses/fetchProjectStatuses",
      fetchDocStatuses: "pmwebDocStatuses/fetchDocStatuses",
      fetchProjectCategories: "pmwebProjectCategories/fetchProjectCategories",
      fetchCurrencies: "pmwebCurrencies/fetchCurrencies",
      fetchCoutries: "pmwebCountries/fetchCountries"
    })
  },
  async mounted() {
    await Promise.all([
      this.fetchProjectTypes(),
      this.fetchProjectStatuses(),
      this.fetchDocStatuses(),
      this.fetchProjectCategories(),
      this.fetchCurrencies(),
      this.fetchCoutries()
    ])
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
