<template>
  <v-can show-message :permission="'access_pmis_main_dashboard'">
    <v-container fluid>
      <v-row justify="start" align-content="center" class="mb-4">
        <entity-wrapper
          :permission="'access_portfolios'"
          :title="$t('page.portfolios')"
          :path="'/portfolios'"
          :count="portfolios.length"
        >
          <template v-slot:progress>
            <hierarchical-pie-chart
              :items="portfolios"
              :loading="portfoliosLoading"
              children-key="programs"
              children-value-display-name="page.estimated_cost_display"
              children-value-key="estimated_cost"
              isCost
              :item-type="$t('page.portfolios')"
              :children-type="$t('page.programs')"
            />
          </template>
        </entity-wrapper>

        <entity-wrapper
          :permission="'access_programs'"
          :title="$t('page.programs')"
          :path="'/programs'"
          :count="programs.length"
        >
          <template v-slot:progress>
            <hierarchical-pie-chart
              :items="programs"
              :loading="porogramsLoading"
              children-key="projects"
              children-value-display-name="page.estimated_cost_display"
              children-value-key="estimated_cost"
              isCost
              :item-type="$t('page.programs')"
              :children-type="$t('page.projects')"
            />
          </template>
        </entity-wrapper>

        <entity-wrapper
          :permission="'access_projects'"
          :title="$t('page.projects')"
          :path="'/projects'"
          :count="projects.length"
        >
          <template v-slot:progress>
            <hierarchical-pie-chart
              :items="projects"
              :loading="porjectsLoading"
              children-key="contracts"
              children-value-display-name="page.estimated_cost_display"
              children-value-key="estimated_cost"
              isCost
              :item-type="$t('page.projects')"
              :children-type="$t('page.contracts')"
            />
          </template>
        </entity-wrapper>

        <entity-wrapper
          :permission="'access_contracts'"
          :title="$t('page.contracts')"
          :path="'/contracts'"
          :count="getTotalContracts"
        >
          <template v-slot:progress>
            <hierarchical-pie-chart
              :items="contracts"
              children-key="types"
              children-value-display-name="page.contract_count"
              children-value-key="contract_count"
              :item-type="$t('page.contracts')"
              :children-type="$t('page.contracts')"
            />
          </template>
        </entity-wrapper>
      </v-row>
    </v-container>
  </v-can>
</template>

<script>
import { mapState, mapActions } from "vuex"
import EntityWrapper from "../../components/pmis-dashboard/EntityWrapper.vue"
import HierarchicalPieChart from "../../components/pmis-dashboard/HierarchicalPieChart.vue"

export default {
  components: { EntityWrapper, HierarchicalPieChart },
  name: "Dashboard",
  layout: "dashboard-layout",
  middleware: ["auth", "is-pmis"],

  data() {
    return {
      // contract_lookups: [
      //   {
      //     name: "Disiplines",
      //     types: [
      //       { name: "Disipline 1", contract_count: 50 },
      //       { name: "Disipline 2", contract_count: 12 },
      //       { name: "Disipline 3", contract_count: 8 }
      //     ]
      //   },
      //   {
      //     name: "Types",
      //     types: [
      //       { name: "Type 1", contract_count: 25 },
      //       { name: "Type 2", contract_count: 33 },
      //       { name: "Type 3", contract_count: 12 }
      //     ]
      //   },
      //   {
      //     name: "Statuses",
      //     types: [
      //       { name: "Status 1", contract_count: 43 },
      //       { name: "Status 2", contract_count: 22 },
      //       { name: "Status 3", contract_count: 2 }
      //     ]
      //   }
      // ]
    }
  },
  watch: {
    "$nuxt.layoutName": {
      immediate: true,
      handler(newLayout) {
        console.log("Layout changed to:", newLayout)
      }
    }
  },

  computed: {
    // Calculate total number of contracts across all projects
    ...mapState("pmisDashboard", [
      "portfolios",
      "portfoliosLoading",
      "programs",
      "programsLoading",
      "projects",
      "projectsLoading",
      "contracts",
      "contractsLoading"
    ]),

    getTotalContracts() {
      return this.projects.reduce((total, project) => {
        return total + (project.contracts?.length || 0)
      }, 0)
    }
  },
  methods: {
    ...mapActions("pmisDashboard", ["fetchData"])
  },
  async mounted() {
    await Promise.allSettled([
      this.fetchData("portfolios"),
      this.fetchData("programs"),
      this.fetchData("projects"),
      this.fetchData("contracts")
    ])
  }
}
</script>
