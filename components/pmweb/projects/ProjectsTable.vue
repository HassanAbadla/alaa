<template>
  <v-can show-message :permission="'access_pmweb_projects'">
    <v-container fluid>
      <custom-table
        pmweb-table
        :full-page-table="false"
        :title="$t('page.projects')"
        :headers="headers"
        :tableConfig="tableConfig"
        :prop-items="projects"
        :prop-loading="loading"
        hideEdit
        hideView
        showFilter
        :filters.sync="filters"
        @clear-filters="fetchData"
      >
        <template v-slot:level-filters>
          <custom-input v-model="filters.ProjectStatus" :label="$t('table.project_status')" />
          <custom-input v-model="filters.Type" :label="$t('table.type')" />
          <custom-input v-model="filters.Category" :label="$t('table.category')" />
        </template>
        <template v-slot:item.show_commitments="{ item }">
          <v-icon small @click="openCommitmentsDialog(item)">mdi-eye</v-icon>
        </template>
        <template v-slot:item._CreateDate="{ item }">
          {{ formatPMISDate(item._CreateDate) }}
        </template>
        <template v-slot:item.RevisionDate="{ item }">
          {{ formatPMISDate(item.RevisionDate) }}
        </template>
        <template v-slot:item.TargetStart="{ item }">
          {{ formatPMISDate(item.TargetStart) }}
        </template>
        <template v-slot:item.TargetFinish="{ item }">
          {{ formatPMISDate(item.TargetFinish) }}
        </template>
        <template v-slot:item.ProjectName="{ item }">
          <link-to-details-page :title="item.ProjectName" :path="`/pm-web/projects/${item.Id}`" />
        </template>
      </custom-table>
      <custom-dialog
        v-model="commitmentsDialogIsOpen"
        :title="$t('page.commitments_belonging_to', { itemName: selectedProject?.ProjectName })"
      >
        <data-list :dataArray="commitments" dataKey="Description" :loading="loadingCommitments"></data-list>
      </custom-dialog>
    </v-container>
  </v-can>
</template>

<script>
import CustomTable from "@/components/custom-table/CustomTable.vue"
import CustomDialog from "@/components/CustomDialog.vue"
import DataList from "@/components/DataList.vue"
import { formatPMISDate } from "@/helpers/date-helpers"
import { mapState, mapActions, mapGetters } from "vuex"
import LinkToDetailsPage from "../LinkToDetailsPage.vue"

export default {
  components: { CustomTable, CustomDialog, DataList, LinkToDetailsPage },
  name: "PMWEBProjectsTable",
  props: {
    propFilters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      commitmentsDialogIsOpen: false,
      headers: [
        {
          text: "table.name",
          value: "ProjectName"
        },
        { text: "table.show_commitments", value: "show_commitments" },
        {
          text: "table.record_#",
          value: "ProjectNumber"
        },
        {
          text: "table.project_status",
          value: "ProjectStatus"
        },
        {
          text: "table.status",
          value: "Status"
        },
        {
          text: "table.program",
          value: "_ProgramName"
        },
        {
          text: "table.type",
          value: "ProjectType"
        },
        {
          text: "table.category",
          value: "Category"
        },
        {
          text: "table.pbs",
          value: "PBSCode"
        },
        {
          text: "table.program_wbs",
          value: "_ProgramWBSCode"
        },
        {
          text: "table.location",
          value: "_LocationName"
        },
        {
          text: "table.address_1",
          value: "Address1"
        },
        {
          text: "table.address_2",
          value: "Address2"
        },
        {
          text: "table.client",
          value: "_ClientName"
        },
        {
          text: "table.gc",
          value: "_GCName"
        },
        {
          text: "table.architect",
          value: "_ArchitectName"
        },
        {
          text: "table.executive",
          value: "Executive"
        },
        {
          text: "table.manager",
          value: "Manager"
        },
        {
          text: "table.superintendent",
          value: "Superintendent"
        },
        {
          text: "table.country",
          value: "Country"
        },
        {
          text: "table.city",
          value: "City"
        },
        {
          text: "table.state",
          value: "State"
        },
        {
          text: "table.phone",
          value: "Phone"
        },
        {
          text: "table.zip",
          value: "Zip"
        },
        {
          text: "table.fax",
          value: "Fax"
        },
        {
          text: "table.revision_#",
          value: "Revision"
        },
        {
          text: "table.revision_date",
          value: "RevisionDate"
        },
        {
          text: "table.target_budget",
          value: "TargetBudget"
        },
        {
          text: "table.target_revenue",
          value: "TargetRevenue"
        },
        {
          text: "table.target_duration",
          value: "TargetDuration"
        },
        {
          text: "table.target_start",
          value: "TargetStart"
        },
        {
          text: "table.target_finish",
          value: "TargetFinish"
        },
        {
          text: "table.uom",
          value: "UOM"
        },
        {
          text: "table.percent_complete",
          value: "PercentComplete"
        },
        {
          text: "table.scope",
          value: "Scope"
        },
        {
          text: "table.inactive",
          value: "IsActive"
        },
        {
          text: "table.created_by",
          value: "_LastUpdateBy"
        },
        {
          text: "table.created_date",
          value: "_CreateDate"
        }
      ],
      tableConfig: {
        itemPath: "/pm-web/projects",
        permissions: {
          create: "create_pmweb_project",
          delete: "delete_pmweb_project"
        }
      },
      filters: {
        ProjectStatus: "",
        Type: "",
        Category: ""
      }
    }
  },
  computed: {
    ...mapState("pmwebProjects", ["loading", "error", "loadingCommitments"]),
    ...mapGetters("pmwebProjects", ["getProjects", "getSelectedProject", "getCommitments"]),
    projects() {
      return this.getProjects
    },
    selectedProject() {
      return this.getSelectedProject
    },
    commitments() {
      return this.getCommitments
    }
  },
  methods: {
    formatPMISDate,
    ...mapActions("pmwebProjects", ["fetchProjects", "fetchProjectCommitments", "setSelectedProject", "addProject"]),

    fetchData() {
      this.fetchProjects({ ...this.filters, ...this.propFilters })
    },

    async openCommitmentsDialog(item) {
      this.setSelectedProject(item)
      this.commitmentsDialogIsOpen = true
      await this.fetchProjectCommitments(item.ProjectNumber)
    }
  },
  watch: {
    filters: {
      handler: function () {
        this.fetchData()
      },
      deep: true
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>
