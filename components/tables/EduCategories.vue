<template>
  <v-container>
    <v-card-text class="pt-8">
      <custom-table
        :title="$t('page.position_categories')"
        :headers="headers"
        :tableConfig="tableConfig"
        :propItems="categories"
        :propLoading="loadingCategories"
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
        <template v-slot:item.parent_id="{ item }">
          {{ getParentName(item.parent_id) }}
        </template>
      </custom-table>
    </v-card-text>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { layoutPicker } from "../../helpers/auth"

export default {
  name: "EduCategoriesTable",
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
        itemPath: "/edu-categories",
        createForm: {
          componentPath: "forms/EduCategoryForm",
          props: { itemPath: "position-categories", width: 500 }
        },
        editForm: {
          componentPath: "forms/EduCategoryForm",
          props: { itemPath: "position-categories", editForm: true, width: 500 }
        },
        permissions: {
          create: "create_policy",
          edit: "edit_policy",
          delete: "delete_policy"
        }
      },
      headers: [
        { text: "table.name", value: "name", tooltip: "table.name" },
        { text: "table.parent", value: "parent_id", tooltip: "table.name" },
        { text: "table.code", value: "slug", tooltip: "table.code" },
        { text: "table.actions", value: "actions", tooltip: "table.actions" }
      ],
      filters: {},
      loadingCategories: false
    }
  },

  methods: {
    ...mapActions("settings", ["getCategories", "addCategory", "updateCategory", "deleteCategory"]),
    ...mapActions("drawer", ["openDrawer"]),

    async fetchLookupData() {
      this.loadingCategories = true
      await this.getCategories()
      this.loadingCategories = false
    },
    getParentName(parentId) {
      if (!parentId) return "-" // Return dash or empty string for root categories
      const parent = this.categories.find((category) => category.id === parentId)
      return parent ? parent.name : "-"
    },
    async applyFilters() {}
  },

  computed: {
    ...mapState("settings", ["categories"])
  },

  mounted() {
    this.fetchLookupData()
  }
}
</script>
