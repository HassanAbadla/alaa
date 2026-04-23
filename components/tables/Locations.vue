<template>
  <v-can show-message :permission="'create_policy'">
    <v-card flat class="pt-12">
      <v-card-text class="pt-0">
        <custom-table
          :title="$t('page.locations')"
          :headers="headers"
          :tableConfig="tableConfig"
          :propItems="getLocations"
          :propLoading="loadLocations"
          hideView
          :filters.sync="filters"
          @clear-filters="fetchLocations"
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
  name: "LocationsTable",
  middleware: ["auth"],
  layout: "dashboard-layout",

  components: {},

  data() {
    return {
      selectedPolicy: null,
      // policies: [],
      tableConfig: {
        delete: this.deleteLocation,
        itemPath: "/geo-locations",
        createForm: {
          componentPath: "forms/LocationsForm",
          props: { width: 500 }
        },
        editForm: {
          componentPath: "forms/LocationsForm",
          props: { editForm: true, width: 500 }
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
      loadingTypes: false
    }
  },

  methods: {
    ...mapActions({
      fetchLocations: "locations/fetchLocations",
      deleteLocation: "locations/deleteLocation"
    }),
    async fetchData() {
      await this.fetchLocations()
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
      getLocations: "locations/getLocations",
      loadLocations: "locations/isLoading"
    })
  },
  mounted() {
    this.fetchData()
  }
}
</script>
