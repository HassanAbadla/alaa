<template>
  <v-can show-message :permission="'access_oss_settings'">
    <v-card flat class="pt-12">
      <v-card-text class="pt-0">
        <custom-table
          :title="$t('table.types')"
          :headers="headers"
          :tableConfig="tableConfig"
          :propItems="types"
          :propLoading="loadingTypes"
          hideView
          :filters.sync="filters"
          @clear-filters="fetchTypes"
          :sortOnLoad="false"
          hideHeaders
          :fullPageTable="false"
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
            <v-can disable-only :permission="'access_oss_settings'">
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
  name: "OrdersTypes",
  //layout: "dashboard-layout",
  middleware: ["auth"],
  layout: "dashboard-layout",

  components: {},

  data() {
    return {
      tableConfig: {
        delete: this.deleteType,
        itemPath: "/types",
        createForm: {
          componentPath: "forms/OssLookupsForm",
          props: { itemPath: "types", width: 500 }
        },
        editForm: {
          componentPath: "forms/OssLookupsForm",
          props: { itemPath: "types", editForm: true, width: 500 }
        },
        permissions: {
          create: "access_oss_settings",
          edit: "access_oss_settings",
          delete: "access_oss_settings"
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
      loadingTypes: false
    }
  },

  methods: {
    ...mapActions("ossLookups", ["getTypes", "deleteType", "createType"]),
    ...mapActions("drawer", ["openDrawer"]),

    async fetchTypes() {
      this.loadingTypes = true
      await this.getTypes()
      this.loadingTypes = false
    },
    async applyFilters() {},
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
    ...mapState("ossLookups", ["types"])
  },

  mounted() {
    this.fetchTypes()
  }
}
</script>
