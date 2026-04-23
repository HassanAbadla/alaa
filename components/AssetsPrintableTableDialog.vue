<template>
  <v-card dense flat>
    <v-card-title>{{ title || $t("page.print_report") }}</v-card-title>
    <v-card-text>
      <v-container>
        <!-- Filters -->
        <v-card class="mb-4 pa-4" flat dense>
          <v-card-text class="mb-2 pa-0 pb-2">{{ $t("page.filters") }}</v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="4" class="pa-0">
              <custom-dropdown
                :items="typesList"
                item-value="id"
                item-text="name"
                :label="$t('table.type')"
                v-model="filters.grc_assets_types_id"
                @input="applyFilters"
                clearable
                :loading="loadingFilters"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4" class="pa-0">
              <custom-dropdown
                :items="categoriesList"
                item-value="id"
                item-text="name"
                :label="$t('table.category')"
                v-model="filters.grc_assets_categories_id"
                @input="applyFilters"
                clearable
                :loading="loadingFilters"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4" class="pa-0">
              <custom-dropdown
                :items="statusesList"
                item-value="id"
                item-text="name"
                :label="$t('table.status')"
                v-model="filters.asset_status_id"
                @input="applyFilters"
                clearable
                :loading="loadingFilters"
              />
            </v-col>
          </v-row>
        </v-card>
        <!-- Column selection -->
        <v-row>
          <v-col cols="12">
            <v-select
              v-model="selectedColumns"
              :items="availableColumns"
              item-text="text"
              item-value="value"
              :label="$t('page.select_columns')"
              multiple
              chips
              deletable-chips
              small-chips
            />
          </v-col>
        </v-row>

        <!-- Page setup -->
        <v-row>
          <v-col cols="6">
            <v-select v-model="pageSize" :items="pageSizes" :label="$t('page.items_per_page')" />
          </v-col>
          <v-col cols="6">
            <v-select v-model="orientation" :items="orientations" :label="$t('page.page_orientation')" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn text @click="$emit('close')">
        {{ $t("action.cancel") }}
      </v-btn>
      <v-btn color="primary" @click="generateReport">
        {{ $t("page.generate_report") }}
      </v-btn>
    </v-card-actions>

    <!-- Hidden print section -->
    <div ref="printSection" class="d-none" :dir="isRTL ? 'rtl' : 'ltr'">
      <div v-for="(page, pageIndex) in paginatedData" :key="pageIndex" class="print-page" :dir="isRTL ? 'rtl' : 'ltr'">
        <div class="d-flex align-start justify-space-between" :dir="isRTL ? 'rtl' : 'ltr'">
          <div>
            <h2>{{ reportTitle || title || $t("page.assets_reports") }}</h2>
            <p>{{ $t("page.generated_on") }}: {{ new Date().toLocaleDateString() }}</p>
          </div>
          <div>
            <v-img width="128px" :src="tenant.logo" v-if="tenant">{{ tenant.company_name }}</v-img>
          </div>
        </div>
        <table class="print-table" :dir="isRTL ? 'rtl' : 'ltr'">
          <thead>
            <tr>
              <th v-for="header in selectedHeaders" :key="header.value" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ $t(header.text) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, itemIndex) in page" :key="item[itemKey] || itemIndex">
              <td v-for="header in selectedHeaders" :key="header.value" :dir="isRTL ? 'rtl' : 'ltr'">
                <slot :name="`cell-${header.value}`" :item="item" :header="header" :value="getCellValue(item, header)">
                  {{ formatCellValue(item, header) }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="page-footer">{{ $t("page.page") }} {{ pageIndex + 1 }} {{ $t("page.of") }} {{ totalPages }}</div>
      </div>
    </div>
  </v-card>
</template>

<script>
import { getUsers } from "@/api/tenent-api"
import { mapState, mapActions, mapGetters } from "vuex"
export default {
  name: "AssetsPrintableTableDialog",
  props: {
    // Custom value getter
    valueGetter: {
      type: Function,
      default: null
    },
    defaultPageSize: {
      type: Number,
      default: 25
    },
    pageSizes: {
      type: Array,
      default: () => [10, 25, 50, 100]
    }
  },
  data() {
    return {
      items: [],
      selectedColumns: [],
      pageSize: this.defaultPageSize,
      orientation: "portrait",
      orientations: ["portrait", "landscape"],
      headers: [
        { text: "table.assetId", value: "code", tooltip: "table.asset_id", export: { key: "code" } },
        { text: "table.asset_type", value: "type.name", tooltip: "table.asset_type", export: { key: "type.name" } },
        { text: "table.name", value: "name", tooltip: "table.asset_name", export: { key: "name" } },
        // { text: "table.manufacturer", value: "manufacturer.name", tooltip: "table.asset_manufacturer" },
        {
          text: "table.business_purpose",
          value: "business_purpose",
          tooltip: "table.business_purpose",
          export: { key: "business_purpose" }
        },
        { text: "table.owner", value: "owner", tooltip: "table.owner", export: { key: "owner" } },
        {
          text: "table.asset_custodian",
          value: "custodian",
          tooltip: "table.asset_custodian",
          export: { key: "custodian" }
        },
        {
          text: "table.locations",
          value: "location.name",
          tooltip: "table.asset_location_desc",
          export: { key: "location.name" }
        },
        {
          text: "table.apps_supported",
          value: "apps_supported",
          tooltip: "table.apps_supported",
          export: { key: "apps_supported" }
        },
        // { text: "table.system_apps", value: "system_apps", tooltip: "table.system_apps" },
        // { text: "table.criticality", value: "criticality.name", tooltip: "table.criticality" },
        {
          text: "table.compliance_standard",
          value: "complianceStandard",
          tooltip: "table.compliance_standard",
          export: { key: "complianceStandard" }
        },
        { text: "table.status", value: "status.name", tooltip: "table.status", export: { key: "status.name" } },
        {
          text: "table.asset_model",
          value: "asset_model",
          tooltip: "table.asset_model",
          export: { key: "asset_model" }
        },
        { text: "table.unit", value: "unit.name", tooltip: "table.unit", export: { key: "unit.name" } },
        { text: "table.asset_cost", value: "asset_cost", tooltip: "table.asset_cost", export: { key: "asset_cost" } },
        { text: "table.notes", value: "note", tooltip: "table.notes", export: { key: "note" } },
        { text: "table.category", value: "category.name", tooltip: "table.category", export: { key: "category.name" } },
        {
          text: "table.asset_mac_address",
          value: "asset_mac_address",
          tooltip: "table.asset_mac_address",
          export: { key: "asset_mac_address" }
        },
        {
          text: "table.asset_network_address",
          value: "asset_network_address",
          tooltip: "table.asset_network_address",
          export: { key: "asset_network_address" }
        },
        {
          text: "table.asset_active_port",
          value: "asset_active_port",
          tooltip: "table.asset_active_port",
          export: { key: "asset_active_port" }
        },
        {
          text: "table.expiration_date",
          value: "expiration_date",
          tooltip: "table.expiration_date",
          export: { key: "expiration_date" }
        },
        {
          text: "table.version",
          value: "version",
          tooltip: "table.version",
          export: { key: "version" }
        },
        {
          text: "table.serial_number",
          value: "asset_serial",
          tooltip: "table.serial_number",
          export: { key: "asset_serial" }
        },
        {
          text: "table.asset_user",
          value: "asset_user",
          tooltip: "table.asset_user",
          export: { key: "asset_user" }
        },
        {
          text: "table.asset_user_system",
          value: "asset_user_system",
          tooltip: "table.asset_user_system",
          export: { key: "asset_user_system" }
        },
        {
          text: "table.asset_user_phone",
          value: "asset_user_phone",
          tooltip: "table.asset_user_phone",
          export: { key: "asset_user_phone" }
        },
        {
          text: "table.asset_user_email",
          value: "asset_user_email",
          tooltip: "table.asset_user_email",
          export: { key: "asset_user_email" }
        },
        {
          text: "table.asset_confidentiality",
          value: "asset_confidentiality",
          tooltip: "table.asset_confidentiality",
          export: { key: "asset_confidentiality" }
        },
        {
          text: "table.asset_integrity",
          value: "asset_integrity",
          tooltip: "table.asset_integrity",
          export: { key: "asset_integrity" }
        },
        {
          text: "table.asset_availability",
          value: "asset_availability",
          tooltip: "table.asset_availability",
          export: { key: "asset_availability" }
        },
        {
          text: "table.asset_value_qualitive",
          value: "asset_value_qualitive",
          tooltip: "table.asset_value_qualitive",
          export: { key: "asset_value_qualitive" }
        },
        {
          text: "table.asset_siem",
          value: "asset_siem",
          tooltip: "table.asset_siem",
          export: { key: "asset_siem" }
        },
        {
          text: "table.asset_edr",
          value: "asset_edr",
          tooltip: "table.asset_edr",
          export: { key: "asset_edr" }
        },
        {
          text: "table.asset_ndr",
          value: "asset_ndr",
          tooltip: "table.asset_ndr",
          export: { key: "asset_ndr" }
        },
        {
          text: "table.asset_qty",
          value: "asset_qty",
          tooltip: "table.asset_qty",
          export: { key: "asset_qty" }
        },
        {
          text: "table.asset_product_number",
          value: "asset_product_number",
          tooltip: "table.asset_product_number",
          export: { key: "asset_product_number" }
        },
        {
          text: "table.asset_license_no",
          value: "asset_license_no",
          tooltip: "table.asset_license_no",
          export: { key: "asset_license_no" }
        },
        {
          text: "table.asset_license_date",
          value: "asset_license_date",
          tooltip: "table.asset_license_date",
          export: { key: "asset_license_date" }
        },
        {
          text: "table.asset_building",
          value: "asset_building",
          tooltip: "table.asset_building",
          export: { key: "asset_building" }
        },
        {
          text: "table.asset_room",
          value: "asset_room",
          tooltip: "table.asset_room",
          export: { key: "asset_room" }
        },
        {
          text: "table.asset_usage",
          value: "asset_usage",
          tooltip: "table.asset_usage",
          export: { key: "asset_usage" }
        },
        {
          text: "table.asset_card_number",
          value: "asset_card_number",
          tooltip: "table.asset_card_number",
          export: { key: "asset_card_number" }
        },

        { text: "table.actions", value: "actions", tooltip: "table.actions" }
      ],
      defaultColumns: [
        "code",
        "name",
        "type.name",
        "business_purpose",
        "custodian",
        "location.name",
        "version",
        "asset_serial",
        "asset_user",
        "asset_confidentiality",
        "asset_integrity",
        "asset_availability",
        "asset_product_number"
      ],
      filters: {
        grc_assets_types_id: null,
        grc_assets_categories_id: null,
        asset_status_id: null
      },
      loadingFilters: false
    }
  },
  computed: {
    ...mapState("assets", ["assets", "assetsChart", "assetsCategories"]),
    ...mapState("assetsTypes", ["typesList"]),
    ...mapState("assetsCategories", ["categoriesList"]),
    ...mapState("assetsStatuses", ["statusesList"]),
    ...mapState(["isRTL"]),
    availableColumns() {
      return this.headers.map((header) => ({
        text: header.text.startsWith("table.") ? this.$t(header.text) : header.text,
        value: header.value
      }))
    },
    selectedHeaders() {
      return this.headers.filter((header) => this.selectedColumns.includes(header.value))
    },
    paginatedData() {
      const pages = []
      const items = [...this.items]

      while (items.length) {
        pages.push(items.splice(0, this.pageSize))
      }

      return pages
    },
    totalPages() {
      return this.paginatedData.length
    },
    tenant() {
      // Assuming the logo URL is stored in Vuex state under 'tenant/logoUrl'
      return this.$auth.user.tenant || ""
    }
  },
  methods: {
    ...mapActions("assets", ["fetchAssets", "fetchTypes", "updateAsset", "deleteAsset"]),
    ...mapActions("assetsTypes", ["fetchAssetsType"]),
    ...mapActions("assetsCategories", ["fetchCategories"]),
    ...mapActions("assetsStatuses", ["fetchAssetsStatuses"]),
    async fetchData() {
      // this.$emit("fetch-data", this.filters)
      await this.fetchAssets(this.filters)
      this.items = this.assets
    },
    applyFilters() {
      this.fetchData(this.filters)
    },
    async fetchAllDropdownData() {
      try {
        await Promise.all([
          this.fetchAssets(),
          this.fetchAssetsType(),
          this.fetchCategories(),
          this.fetchAssetsStatuses()
        ])
      } catch (err) {
        console.log("Error fetching dropdown data:", err)
        this.handleError(err?.message || "Failed to fetch dropdown data")
      }
    },
    getCellValue(item, header) {
      // Use custom value getter if provided
      if (this.valueGetter) {
        return this.valueGetter(item, header)
      }

      // Default: handle nested properties using dot notation
      const value = header.value.split(".").reduce((obj, key) => obj?.[key], item)
      return value
    },
    cellFormatter(item, header) {
      switch (header.value) {
        case "risk_description":
          return item.name || ""
        case "likely_hood":
          return item.likely_hood?.code || ""
        case "impact":
          return item.impact?.code || ""
        case "rating":
          return item.risk_rating?.name || ""
        case "overall_rating":
          return item.overall_residual_rating?.name || ""
        case "onset_speed":
          return item.onset_speed?.name || ""
        case "owner":
          return item.owner?.full_name || ""
        case "asset":
          return item.asset?.name || ""
        case "notes":
          return this.stripHtml(item.note) || ""
        case "risk_status":
          return item.risk_status?.name || ""
        default:
          return undefined // Let default formatter handle it
      }
    },
    stripHtml(html) {
      if (!html) return ""
      const temp = document.createElement("div")
      temp.innerHTML = html
      return temp.textContent || temp.innerText || ""
    },
    formatCellValue(item, header) {
      try {
        // Use custom formatter if provided
        if (this.cellFormatter) {
          const formatted = this.cellFormatter(item, header)
          if (formatted !== undefined) return formatted
        }

        const value = this.getCellValue(item, header)

        if (value === null || value === undefined) return ""

        // Default date formatting
        if (value instanceof Date) {
          return value.toLocaleDateString()
        }

        // Check if it's a date string
        if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
          return new Date(value).toLocaleDateString()
        }

        return value.toString()
      } catch (error) {
        console.error(`Error formatting cell value for ${header.value}:`, error)
        return ""
      }
    },
    generateReport() {
      // Apply print styles
      const style = document.createElement("style")
      style.innerHTML = this.getPrintStyles()
      document.head.appendChild(style)

      // Print the report
      const printContent = this.$refs.printSection.innerHTML
      const printWindow = window.open("", "_blank")
      printWindow.document.write(`
        <html>
          <head>
            <title>${this.reportTitle || this.title || this.$t("page.report")}</title>
            <style>${this.getPrintStyles()}</style>
          </head>
          <body>${printContent}</body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
      printWindow.close()

      // Clean up
      document.head.removeChild(style)
      this.$emit("close")
    },
    getPrintStyles() {
      return `
        @media print {
          .print-page {
            page-break-after: always;
            padding: 20px;
          }
          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            direction: ${this.isRTL ? "rtl" : "ltr"};
          }
          .print-table th,
          .print-table td {
            border: 1px solid #ddd;
            padding: 4px;
            text-align: ${this.isRTL ? "right" : "left"};
          }
          .print-table th {
            background-color: #f5f5f5;
          }
          .page-footer {
            position: fixed;
            bottom: 20px;
            font-size: 10px;
            ${this.isRTL ? "left" : "right"}: 20px;
          }
          @page {
            size: ${this.orientation};
            margin: 1cm;
          }
            h2 {
        margin: 0 0 10px 0;
        text-align: ${this.isRTL ? "right" : "left"};
      }
      p {
        margin: 5px 0;
        text-align: ${this.isRTL ? "right" : "left"};
      }
      [dir="rtl"] {
        direction: rtl;
        text-align: right;
      }
      [dir="ltr"] {
        direction: ltr;
        text-align: left;
      }
        }
      `
    },
    stripHtml(html) {
      if (!html) return ""
      const temp = document.createElement("div")
      temp.innerHTML = html
      return temp.textContent || temp.innerText || ""
    }
  },
  created() {
    // Set default selected columns
    this.selectedColumns = this.defaultColumns.length
      ? this.defaultColumns
      : this.headers.slice(0, 4).map((h) => h.value)
  },
  async mounted() {
    await this.applyFilters()
    await this.fetchAllDropdownData()
  }
}
</script>

<style scoped>
.d-none {
  display: none;
}
</style>
