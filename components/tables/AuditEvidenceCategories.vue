<template>
  <v-container>
    <v-card-text class="pt-8">
      <custom-table
        :title="$t('table.evidence_categories')"
        :headers="headers"
        :tableConfig="tableConfig"
        :propItems="categories"
        :propLoading="loading"
        hideView
        :filters.sync="filters"
        @clear-filters="fetchTypes"
        :sortOnLoad="false"
        hideHeaders
        :fullPageTable="false"
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
          <v-can disable-only :permission="'access_users'">
            <template #default="{ disabled }">
              <div class="d-flex align-center mx-auto" :style="colorDisplay(item.color)"></div>
            </template>
          </v-can>
        </template>
      </custom-table>
    </v-card-text>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { layoutPicker } from "../../helpers/auth"

export default {
  name: "EvidenceCategories",
  //layout: "dashboard-layout",
  layout: "dashboard-layout",
  middleware: ["auth"],

  components: {},

  data() {
    return {
      selectedPolicy: null,
      // policies: [],
      tableConfig: {
        delete: this.deleteCategory,
        itemPath: "/audit-evidence-categories",
        createForm: {
          componentPath: "forms/EvidenceCategoryForm",
          props: { itemPath: "categories", width: 500 }
        },
        editForm: {
          componentPath: "forms/EvidenceCategoryForm",
          props: { itemPath: "categories", editForm: true, width: 500 }
        },
        permissions: {
          create: "create_policy",
          edit: "edit_policy",
          delete: "delete_policy"
        }
      },
      headers: [
        { text: "table.name", value: "name", tooltip: "table.name" },
        { text: "table.color", value: "color", tooltip: "table.color" },
        { text: "table.code", value: "code", tooltip: "table.code" },
        { text: "table.notes", value: "note", tooltip: "table.notes" },
        { text: "table.actions", value: "actions", tooltip: "table.actions" }
      ],
      filters: {},
      loading: false
    }
  },

  methods: {
    ...mapActions("auditSettings", ["getCategories", "deleteCategory"]),
    ...mapActions("drawer", ["openDrawer"]),

    async fetchLookupData() {
      this.loading = true
      await this.getCategories()
      this.loading = false
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
    ...mapState("auditSettings", ["categories"])
  },

  mounted() {
    this.fetchLookupData()
  }
}
</script>
