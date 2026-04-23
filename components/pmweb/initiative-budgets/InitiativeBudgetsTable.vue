<template>
  <p-m-web-table-template
    :title="$t('page.initiative_budgets')"
    :headers="computedHeaders"
    item-path="/pm-web/initiative-budgets"
    permission="access_pmweb_initiative_budgets"
    store-name="pmwebInitiativeBudgets"
    items-getter-name="getInitiativeBudgets"
    current-item-getter-name="getCurrentInitiativeBudget"
    fetch-action-name="fetchInitiativeBudgets"
    delete-action-name="deleteInitiativeBudget"
    add-action-name="addInitiativeBudget"
    create-permission="create_pmweb_initiative_budget"
    delete-permission="delete_pmweb_initiative_budget"
    :prop-filters="{ ...filters, ...propFilters }"
    @clear-filters="clearLocalFilters"
  >
    <!--  Filters slot -->
    <template v-slot:level-filters>
      <custom-dropdown
        :label="$t('table.program')"
        :items="programsList"
        item-value="Id"
        item-text="Name"
        :loading="loadingProgramsList"
        :disabled="loadingProgramsList"
        v-model="filters.program"
        clearable
      />

      <custom-dropdown
        :label="$t('table.type')"
        :items="projectTypes"
        item-value="Id"
        item-text="Type"
        :loading="loadingProjectTypes"
        :disabled="loadingProjectTypes"
        v-model="filters.type"
        clearable
      />

      <custom-dropdown
        :label="$t('table.priority')"
        :items="priorities"
        item-value="Id"
        item-text="Name"
        :loading="loadingPriorities"
        :disabled="loadingPriorities"
        v-model="filters.priority"
        clearable
      />
    </template>

    <!-- Custom slot for Name column with link -->
    <template v-slot:item.Name="{ item }">
      <link-to-details-page :title="item.Name" :path="`/pm-web/initiative-budgets/${item.Id}`" />
    </template>

    <template v-slot:item.Code="{ item }">
      <link-to-details-page :title="item.Code" :path="`/pm-web/initiative-budgets/${item.Id}`" />
    </template>
    <template v-slot:item.CreatedBy="{ item }">
      <span>{{ `${item.created_by?.FirstName || ""} ${item.created_by?.LastName || ""}` }}</span>
    </template>

    <!-- Auto-formatted slots for date and currency -->
    <template v-for="header in formattedHeaders" v-slot:[`item.${header.value}`]="{ item }">
      <span :key="header.value">{{ formatCellValue(item[header.value], header.type, item) }}</span>
    </template>
  </p-m-web-table-template>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import PMWebTableTemplate from "@/components/pmweb/PMWebTableTemplate.vue"
import LinkToDetailsPage from "../LinkToDetailsPage.vue"
import { tableFormattingMixin } from "@/mixins/tableFormattingMixin"

export default {
  components: { PMWebTableTemplate, LinkToDetailsPage },
  mixins: [tableFormattingMixin],
  name: "PMWEBinitiativeBudgetsTable",

  props: {
    propFilters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      filters: {
        type: null,
        priority: null,
        program: null
      },
      headers: [
        {
          text: "table.record_#",
          value: "Code"
        },
        {
          text: "table.initiative",
          value: "Name"
        },
        {
          text: "table.status",
          value: "status.Status"
        },
        {
          text: "table.priority",
          value: "priority.Name"
        },
        {
          text: "table.revision_#",
          value: "RevisionNumber"
        },
        {
          text: "table.revision_date",
          value: "RevisionDate",
          type: "date"
        },
        {
          text: "table.source",
          value: "funding_source.FundingSource"
        },
        {
          text: "table.funding_year",
          value: "BudgetYear"
        },
        {
          text: "table.start",
          value: "Start",
          type: "date"
        },
        {
          text: "table.finish",
          value: "Finish",
          type: "date"
        },
        {
          text: "table.type",
          value: "type.Type"
        },
        {
          text: "table.program",
          value: "program.Name"
        },
        {
          text: "table.project_manager",
          value: "project_manager.CompanyName"
        },
        {
          text: "table.project_name",
          value: "project.ProjectName"
        },
        {
          text: "table.project_#",
          value: "project.ProjectNumber"
        },
        {
          text: "table.location",
          value: "location.Name"
        },
        {
          text: "table.abbreviation",
          value: "Abbreviation"
        },
        {
          text: "table.sponsor",
          value: "sponsor.CompanyName"
        },
        {
          text: "table.score",
          value: "WeightedScore"
        },
        {
          text: "table.total",
          value: "TotalInitiative",
          type: "currency"
        },
        {
          text: "table.template",
          value: "TemplateId"
        },
        {
          text: "table.created_by",
          value: "CreatedBy"
        },
        {
          text: "table.created_date",
          value: "CreateDate",
          type: "date"
        },
        {
          text: "table.category",
          value: "category.Category"
        },
        {
          text: "table.reference",
          value: "Reference"
        },
        {
          text: "table.currency",
          value: "currency.Name"
        },
        {
          text: "table.pbs",
          value: "pbs.Description"
        },
        {
          text: "table.scope",
          value: "Scope"
        },
        {
          text: "table.inactive",
          value: "IsActive",
          type: "boolean"
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      programsList: "pmwebProgramsList/getPrograms",
      loadingProgramsList: "pmwebProgramsList/isLoading",
      projectTypes: "pmwebProjectTypes/getProjectTypes",
      loadingProjectTypes: "pmwebProjectTypes/isLoading",
      priorities: "pmwebPriorities/getPriorities",
      loadingPriorities: "pmwebPriorities/isLoading"
    })
  },
  methods: {
    ...mapActions({
      fetchProgramsList: "pmwebProgramsList/fetchPrograms",
      fetchProjectTypes: "pmwebProjectTypes/fetchProjectTypes",
      fetchPriorities: "pmwebPriorities/fetchPriorities"
    }),
    clearLocalFilters() {
      this.filters = {
        type: null,
        priority: null,
        program: null
      }
    }
  },
  async mounted() {
    // Fetch initial data
    await Promise.all([this.fetchProgramsList(), this.fetchProjectTypes(), this.fetchPriorities()])
  }

  // All computed properties and methods are now provided by the mixin!
  // No need to define:
  // - computedHeaders
  // - formattedHeaders
  // - formatDate
  // - currencyFormatter
  // - formatCellValue
}
</script>
