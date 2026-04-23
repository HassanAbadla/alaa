<template>
  <v-can show-message :permission="'view_team_status'">
    <div class="table-page-wrapper">
      <div class="px-4">
        <custom-table
          :title="$t('table.status')"
          :headers="headers"
          :tableConfig="tableConfig"
          :propItems="getStatuses"
          :propLoading="loadingStatuses"
          hideView
          :filters.sync="filters"
          @clear-filters="fetchStatuses"
          :sortOnLoad="false"
          hideHeaders
          class="table-fill"
        >
          <template v-slot:progress-bars></template>
          <template v-slot:header="{ props: { headers } }">
            <thead class="p-4">
              <tr>
                <th v-for="(header, i) in headers" :key="i">
                  <v-tooltip v-if="header.tooltip" top>
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on">
                        <v-icon small v-if="header.icon">{{ header.icon }}</v-icon>
                        <span v-if="header.text">
                          {{ header.text }}
                        </span>
                      </div>
                    </template>
                    <span>{{ header.tooltip }}</span>
                  </v-tooltip>
                  <span v-else>{{ header.text }}</span>
                </th>
              </tr>
            </thead>
          </template>
          <template v-slot:item.color="{ item }">
            <div class="d-flex align-center mx-auto" :style="colorDisplay(item.color)"></div>
          </template>
        </custom-table>
      </div>
    </div>
  </v-can>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "BscTeamStatuses",
  components: {},
  middleware: ["auth"],
  layout: "dashboard-layout",
  data() {
    return {
      tableConfig: {
        delete: this.deleteStatus,
        itemPath: "/bsc-team-statuses",
        createForm: {
          componentPath: "forms/BSCTeamStatusForm",
          props: { itemPath: "types", width: 500 }
        },
        editForm: {
          componentPath: "forms/BSCTeamStatusForm",
          props: { itemPath: "types", editForm: true, width: 500 }
        },
        permissions: {
          create: "create_team_status",
          edit: "edit_team_status",
          delete: "delete_team_status"
        }
      },
      headers: [
        { text: "table.name", value: "name", tooltip: "table.name" },
        { text: "table.code", value: "code", tooltip: "table.code" },
        { text: "table.notes", value: "note", tooltip: "table.notes" },
        { text: "table.color", value: "color", tooltip: "table.color" },
        { text: "table.actions", value: "actions", tooltip: "table.actions" }
      ]
    }
  },
  methods: {
    ...mapActions({
      fetchStatuses: "bscTeamStatuses/fetchStatuses",
      deleteStatus: "bscTeamStatuses/deleteStatus"
    }),
    async fetchTypes() {
      await this.fetchStatuses()
    },
    colorDisplay(color) {
      return {
        backgroundColor: color,
        height: "24px",
        width: "24px",
        border: "1px solid #929292",
        borderRadius: "4px"
      }
    }
  },
  computed: {
    ...mapGetters({
      getStatuses: "bscTeamStatuses/getStatuses",
      loadingStatuses: "bscTeamStatuses/isLoading"
    })
  },
  mounted() {
    this.fetchTypes()
  }
}
</script>
<style scoped>
/*  THIS IS THE IMPORTANT PART */
::v-deep(.table-fill .v-data-table) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: none !important;
  border: 1px solid #eaeaea;
}

::v-deep(.table-fill .v-data-table-header th) {
  background-color: #fafafa !important;
  font-weight: 600;
  font-size: 12px;
  color: #9e9e9e;
  border-bottom: 1px solid #eee;
}

::v-deep(.table-fill .v-data-table__wrapper tr) {
  height: 48px !important;
}

::v-deep(.table-fill .v-data-table__wrapper tr:hover) {
  background-color: #fafafa !important;
}

::v-deep(.table-fill td) {
  font-size: 13px;
}
::v-deep(.table-fill thead th) {
  background-color: #fafafa !important;
  font-weight: 600;
  font-size: 12px;
  color: #9e9e9e;
  border-bottom: 1px solid #eee;
}
</style>
