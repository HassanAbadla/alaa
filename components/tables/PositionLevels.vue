<template>
  <v-container>
    <v-card-text class="pt-8">
      <custom-table
        :title="$t('page.position_levels')"
        :headers="headers"
        :tableConfig="tableConfig"
        :propItems="levels"
        :propLoading="loadingLevels"
        hideView
        :filters.sync="filters"
        @clear-filters="fetchTypes"
        :sortOnLoad="false"
        hideHeaders
        :fullPageTable="false"
        class="table-fill"
      >
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
    </v-card-text>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { layoutPicker } from "../../helpers/auth"

export default {
  name: "PositionLevels",
  //layout: "dashboard-layout",
  layout: "dashboard-layout",
  middleware: ["auth"],

  components: {},

  data() {
    return {
      selectedPolicy: null,
      // policies: [],
      tableConfig: {
        delete: this.deletePositionLevel,
        itemPath: "/settings/position-levels",
        createForm: {
          componentPath: "forms/LookupForm",
          props: { itemPath: "position-levels", width: 500 }
        },
        editForm: {
          componentPath: "forms/LookupForm",
          props: { itemPath: "position-levels", editForm: true, width: 500 }
        },
        permissions: {
          create: "create_policy",
          edit: "edit_policy",
          delete: "delete_policy"
        }
      },
      headers: [
        { text: "table.name", value: "name", tooltip: "table.name" },
        { text: "table.code", value: "code", tooltip: "table.code" },
        { text: "table.notes", value: "note", tooltip: "table.notes" },
        { text: "table.actions", value: "actions", tooltip: "table.actions" }
      ],
      filters: {},
      loadingLevels: false
    }
  },

  methods: {
    ...mapActions("positionSettings", ["fetchPositionLevels", "deletePositionLevel"]),
    ...mapActions("drawer", ["openDrawer"]),

    async fetchLookupData() {
      this.loadingLevels = true
      await this.fetchPositionLevels()
      this.loadingLevels = false
    },
    async applyFilters() {}
  },

  computed: {
    ...mapState("positionSettings", ["levels"])
  },

  mounted() {
    this.fetchLookupData()
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
