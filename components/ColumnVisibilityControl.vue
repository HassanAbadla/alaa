<!-- ColumnVisibilityControl.vue -->
<template>
  <div>
    <v-menu offset-y :close-on-content-click="false" max-height="80%">
      <template v-slot:activator="{ on, attrs }">
        <v-btn small class="mx-1" color="primary" v-bind="attrs" v-on="on">
          <v-icon left>mdi-cog</v-icon>
          {{ $t("table.columns") }}
        </v-btn>
      </template>

      <v-card min-width="300">
        <v-card-title>{{ $t("table.manage_columns") }}</v-card-title>
        <v-divider></v-divider>

        <v-card-text class="pt-4">
          <v-checkbox
            v-for="header in headers"
            :key="header.value"
            v-model="visibleColumns"
            :label="$t(header.text || header.tooltip)"
            :value="header.value"
            :disabled="header.value === 'actions'"
            @change="updateColumnVisibility"
            hide-details
            class="mb-2"
          ></v-checkbox>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="resetToDefault">
            {{ $t("table.reset_columns") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "ColumnVisibilityControl",

  props: {
    headers: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      visibleColumns: []
    }
  },

  created() {
    this.loadSavedColumns()
  },
  computed: {
    storageKey() {
      const basePath = this.$route.path.replace(/\//g, "-")
      return `pmis-table-columns-${basePath}`.toLowerCase()
    }
  },

  methods: {
    loadSavedColumns() {
      const savedColumns = localStorage.getItem(this.storageKey)
      if (savedColumns) {
        const parsed = JSON.parse(savedColumns)
        // Migrate old saved preferences that predate 'actions' being included — ensure it's always present
        this.visibleColumns = parsed.includes("actions") ? parsed : [...parsed, "actions"]
      } else {
        // Default to all columns visible except 'actions'
        this.visibleColumns = this.headers.map((header) => header.value)
      }
      this.$emit("update:columns", this.visibleColumns)
    },

    updateColumnVisibility() {
      localStorage.setItem(this.storageKey, JSON.stringify(this.visibleColumns))
      this.$emit("update:columns", this.visibleColumns)
    },

    resetToDefault() {
      this.visibleColumns = this.headers.map((header) => header.value)
      this.updateColumnVisibility()
    }
  }
}
</script>
