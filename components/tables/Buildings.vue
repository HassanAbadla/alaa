<template>
  <v-can show-message :permission="'view_buildings'">
    <v-card flat class="pt-12">
      <v-card-text class="pt-0">
        <custom-table
          :title="$t('page.buildings')"
          :headers="headers"
          :tableConfig="tableConfig"
          :propItems="getBuildings"
          :propLoading="loadBuildings"
          hideView
          :filters.sync="filters"
          @clear-filters="fetchBuildings"
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
        </custom-table>
      </v-card-text>
    </v-card>
  </v-can>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "BuildingsTable",
  middleware: ["auth"],
  layout: "dashboard-layout",

  components: {},

  data() {
    return {
      selectedPolicy: null,
      // policies: [],
      tableConfig: {
        delete: this.deleteBuilding,
        itemPath: "/geo-buildings",
        createForm: {
          componentPath: "forms/BuildingsForm",
          props: { width: 880 }
        },
        editForm: {
          componentPath: "forms/BuildingsForm",
          props: { editForm: true, width: 880 }
        },
        permissions: {
          create: "create_buildings",
          edit: "edit_buildings",
          delete: "delete_buildings"
        }
      },
      headers: [
        { text: "table.name", value: "name", tooltip: "table.name" },
        { text: "table.code", value: "code", tooltip: "table.code" },
        { text: "table.notes", value: "note", tooltip: "table.notes" },
        { text: "table.actions", value: "actions", tooltip: "table.actions" }
      ],
      filters: { tenant_id: this.$route.params.id || null },
      loadingTypes: false
    }
  },

  methods: {
    ...mapActions({
      fetchBuildings: "buildings/fetchBuildings",
      deleteBuilding: "buildings/deleteBuilding"
    }),
    async fetchData() {
      await this.fetchBuildings(this.filters)
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
      getBuildings: "buildings/getBuildings",
      loadBuildings: "buildings/isLoading"
    })
  },
  mounted() {
    this.fetchData()
  }
}
</script>
