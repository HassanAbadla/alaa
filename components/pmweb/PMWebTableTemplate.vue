<template>
  <v-can show-message :permission="permission">
    <v-container fluid>
      <custom-table
        pmweb-table
        :full-page-table="false"
        :title="title"
        :headers="headers"
        :tableConfig="tableConfig"
        :prop-items="items"
        :prop-loading="loading"
        :hideEdit="!showEdit"
        hideView
        :showFilter="!hideFilter"
        :filters.sync="internalFilters"
        @clear-filters="handleClearFilters"
      >
        <template v-for="header in dateHeaders" v-slot:[`item.${header.value}`]="{ item }">
          {{ formatPMISDate(item[header.value]) }}
        </template>

        <!-- Pass through any additional slots from parent -->
        <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </custom-table>
    </v-container>
  </v-can>
</template>

<script>
import CustomTable from "@/components/custom-table/CustomTable.vue"
import { formatPMISDate } from "@/helpers/date-helpers"

export default {
  components: { CustomTable },
  name: "PMWebTableTemplate",
  props: {
    // Table configuration
    title: {
      type: String,
      required: true
    },
    headers: {
      type: Array,
      required: true
    },
    itemPath: {
      type: String,
      required: true
    },
    permission: {
      type: String,
      required: true
    },

    // Store configuration
    storeName: {
      type: String,
      required: true
    },
    gettersName: {
      type: String,
      default: null // Will default to storeName if not provided
    },
    itemsGetterName: {
      type: String,
      required: true
    },
    currentItemGetterName: {
      type: String,
      default: null
    },
    fetchActionName: {
      type: String,
      required: true
    },
    deleteActionName: {
      type: String,
      required: true
    },
    addActionName: {
      type: String,
      default: null
    },

    // Table permissions
    createPermission: {
      type: String,
      required: true
    },
    deletePermission: {
      type: String,
      required: true
    },
    showEdit: {
      type: Boolean,
      default: false
    },
    hideFilter: {
      type: Boolean,
      default: false
    },

    // Additional filters from parent
    propFilters: {
      type: Object,
      default: () => ({})
    },
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      internalFilters: {}
    }
  },
  computed: {
    computedFilters() {
      return {
        ...this.internalFilters,
        ...this.propFilters
      }
    },
    dateHeaders() {
      return this.headers.filter((header) => header.type === "date")
    },
    // Dynamic store mapping
    storeModule() {
      return this.storeName
    },
    gettersModule() {
      return this.gettersName || this.storeName
    },

    // Map state dynamically
    loading() {
      return this.$store.state[this.storeModule].loading
    },
    error() {
      return this.$store.state[this.storeModule].error
    },

    // Map getters dynamically
    items() {
      return this.$store.getters[`${this.gettersModule}/${this.itemsGetterName}`]
    },
    currentItem() {
      if (this.currentItemGetterName) {
        return this.$store.getters[`${this.gettersModule}/${this.currentItemGetterName}`]
      }
      return null
    },

    // Table configuration
    tableConfig() {
      return {
        delete: this.deleteItem,
        itemPath: this.itemPath,
        permissions: {
          create: this.createPermission,
          delete: this.deletePermission,
          edit: this.config.editPermission || null
        },
        ...this.config
      }
    },

    // Check if certain columns exist
    hasCreateDateColumn() {
      return this.headers.some((header) => header.value === "_CreateDate")
    },
    hasNameColumn() {
      return this.headers.some((header) => header.value === "Name")
    }
  },
  methods: {
    formatPMISDate,

    // Dynamic action dispatching
    fetchData() {
      this.$store.dispatch(`${this.storeModule}/${this.fetchActionName}`, this.computedFilters)
    },

    deleteItem(item) {
      return this.$store.dispatch(`${this.storeModule}/${this.deleteActionName}`, item)
    },

    addItem(item) {
      if (this.addActionName) {
        return this.$store.dispatch(`${this.storeModule}/${this.addActionName}`, item)
      }
    },

    handleClearFilters() {
      // Reset internal filters
      this.internalFilters = {}
      // Emit to parent to reset their filters too
      this.$emit("clear-filters")
      // Small delay to ensure parent filters are cleared before fetching
      this.$nextTick(() => {
        this.fetchData()
      })
    }
  },
  watch: {
    internalFilters: {
      handler: function () {
        this.fetchData()
      },
      deep: true
    },
    propFilters: {
      handler: function (newFilters) {
        // Sync propFilters to internalFilters so CustomTable can detect active filters
        this.internalFilters = { ...this.internalFilters, ...newFilters }
        this.fetchData()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>
