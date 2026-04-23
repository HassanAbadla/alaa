<template>
  <v-can show-message :permission="'create_perspective'">
    <div class="table-page-wrapper">
      <div class="px-4">
        <custom-table
          :title="$t('table.perspective')"
          :headers="headers"
          :tableConfig="tableConfig"
          :propItems="getPerspectives"
          :propLoading="loadingPerspectives"
          hideView
          :filters.sync="filters"
          @clear-filters="fetchTypes"
          :sortOnLoad="false"
          hideHeaders
          class="table-fill"
        >
          <template v-slot:progress-bars></template>
          <template v-slot:header="{ props: { headers } }">
            <thead class="custom-header">
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
        </custom-table>
      </div>
    </div>
  </v-can>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { layoutPicker } from "../../helpers/auth"

export default {
  name: "StrategyPerspectives",
  //layout: "dashboard-layout",
  middleware: ["auth"],
  layout: "dashboard-layout",

  components: {},

  data() {
    return {
      selectedPolicy: null,
      // policies: [],
      tableConfig: {
        delete: this.deletePerspective,
        itemPath: "/bsc-perspectives",
        createForm: {
          componentPath: "forms/BSCPerspectiveForm",
          props: { itemPath: "types", width: 500 }
        },
        editForm: {
          componentPath: "forms/BSCPerspectiveForm",
          props: { itemPath: "types", editForm: true, width: 500 }
        },
        permissions: {
          create: "create_perspective",
          edit: "edit_perspective",
          delete: "delete_perspective"
        }
      },
      headers: [
        { text: "table.name", value: "name", tooltip: "table.name" },
        { text: "table.code", value: "code", tooltip: "table.code" },
        { text: "table.notes", value: "note", tooltip: "table.notes" },
        { text: "table.actions", value: "actions", tooltip: "table.actions" }
      ],
      filters: {},
      loadingTypes: false
    }
  },

  methods: {
    ...mapActions({
      fetchPerspectives: "bscPerspectives/fetchPerspectives",
      deletePerspective: "bscPerspectives/deletePerspective"
    }),
    ...mapActions("drawer", ["openDrawer"]),

    async fetchTypes() {
      this.loadingTypes = true
      await this.fetchAssetsType()
      this.loadingTypes = false
    },
    async applyFilters() {}
  },

  computed: {
    ...mapGetters({
      getPerspectives: "bscPerspectives/getPerspectives",
      loadingPerspectives: "bscPerspectives/isLoading"
    })
  },

  mounted() {
    this.fetchPerspectives()
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
::v-deep(.table-fill .custom-header th) {
  background-color: #fafafa !important;
  font-weight: 600;
  font-size: 12px;
  color: #9e9e9e;
  border-bottom: 1px solid #eee;
}
</style>
