<template>
  <v-can show-message :permission="'create_policy'">
    <v-card flat class="pt-12">
      <v-card-text class="pt-0">
        <custom-table
          :title="$t('table.status')"
          :headers="headers"
          :tableConfig="tableConfig"
          :propItems="statusesList"
          :propLoading="loadStatuses"
          hideView
          :filters.sync="filters"
          @clear-filters="fetchAssetsStatuses"
          :sortOnLoad="false"
          hideHeaders
          :fullPageTable="false"
          class="table-fill"
        >
          <template v-slot:header="{ props: { headers } }">
            <thead>
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
            <v-can disable-only :permission="'edit_policy'">
              <template #default="{ disabled }">
                <div class="d-flex align-center mx-auto" :style="colorDisplay(item.color)"></div>
              </template>
            </v-can>
          </template>
        </custom-table>
      </v-card-text>
    </v-card>
  </v-can>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { layoutPicker } from "../../helpers/auth"

export default {
  name: "AssetsStatuses",
  //layout: "dashboard-layout",
  layout: "dashboard-layout",
  middleware: ["auth"],

  components: {},

  data() {
    return {
      tableConfig: {
        delete: this.deleteAssetStatus,
        itemPath: "/settings/asset-statuses",
        createForm: {
          componentPath: "forms/LookupForm",
          props: { itemPath: "statuses", width: 500 }
        },
        editForm: {
          componentPath: "forms/LookupForm",
          props: { itemPath: "statuses", editForm: true, width: 500 }
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
        { text: "table.color", value: "color", tooltip: "table.color" },
        { text: "table.notes", value: "note", tooltip: "table.notes" },
        { text: "table.actions", value: "actions", tooltip: "table.actions" }
      ],
      filters: {},
      loadStatuses: false
    }
  },

  methods: {
    ...mapActions("assetsStatuses", ["createAssetStatus", "fetchAssetsStatuses", "deleteAssetStatus"]),
    ...mapActions("drawer", ["openDrawer"]),

    colorDisplay(color) {
      return {
        backgroundColor: color,
        height: "24px",
        width: "24px",
        border: "1px solid #929292",
        borderRadius: "4px"
      }
    },

    async applyFilters() {}
  },

  computed: {
    ...mapState("assetsStatuses", ["statusesList"])
  },

  mounted() {
    this.fetchAssetsStatuses()
  }
}
</script>
<style scoped>
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

::v-deep(.table-fill thead tr th) {
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
</style>
