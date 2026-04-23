<template>
  <v-can show-message :permission="'access_assets_standards'">
    <v-card flat class="pt-12">
      <v-card-text class="pt-0">
        <custom-table
          :title="$t('table.standards')"
          :headers="headers"
          :tableConfig="tableConfig"
          :propItems="getStandards"
          :propLoading="loadingStandards"
          hideView
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
        </custom-table>
      </v-card-text>
    </v-card>
  </v-can>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "AssetStandards",
  layout: "dashboard-layout",
  middleware: ["auth"],

  components: {},

  data() {
    return {
      tableConfig: {
        delete: this.deleteStandard,
        itemPath: "/asset-standards",
        createForm: {
          componentPath: "forms/AssetStandardForm",
          props: { width: 500 }
        },
        editForm: {
          componentPath: "forms/AssetStandardForm",
          props: { editForm: true, width: 500 }
        },
        permissions: {
          create: "create_assets_standards",
          edit: "edit_assets_standards",
          delete: "delete_assets_standards"
        }
      },
      headers: [
        { text: "table.name", value: "name", tooltip: "table.name" },
        { text: "table.code", value: "code", tooltip: "table.code" },
        { text: "table.notes", value: "note", tooltip: "table.notes" },
        { text: "table.actions", value: "actions", tooltip: "table.actions" }
      ],
      filters: {}
    }
  },

  methods: {
    ...mapActions({
      fetchStandards: "assetStandards/fetchStandards",
      deleteStandard: "assetStandards/deleteStandard",
      updateStandard: "assetStandards/updateStandard"
    }),
    ...mapActions("drawer", ["openDrawer"]),

    async applyFilters() {}
  },

  computed: {
    ...mapGetters({
      getStandards: "assetStandards/getStandards",
      loadingStandards: "assetStandards/isLoading"
    })
  },

  async mounted() {
    await this.fetchStandards()
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
