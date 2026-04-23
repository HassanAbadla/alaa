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
                :items="riskCategories"
                item-value="id"
                item-text="name"
                :label="$t('table.risk_area')"
                v-model="filters.risk_category_id"
                @input="applyFilters"
                clearable
                :loading="loadingRiskCategories"
              />
              <custom-dropdown
                :items="users"
                item-value="id"
                item-text="name"
                :label="$t('form.owner')"
                v-model="filters.owner_id"
                @input="applyFilters"
                clearable
                :loading="loading.users"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4" class="pa-0">
              <custom-dropdown
                :items="assets"
                item-value="id"
                item-text="name"
                :label="$t('table.asset')"
                v-model="filters.grc_asset_id"
                @input="applyFilters"
                clearable
              />

              <custom-dropdown
                :items="impacts"
                item-value="id"
                item-text="name"
                :label="$t('form.impact')"
                v-model="filters.impact_id"
                @input="applyFilters"
                clearable
                :loading="loadingImpacts"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4" class="pa-0">
              <custom-dropdown
                :items="likelihoods"
                item-value="id"
                item-text="name"
                :label="$t('form.likelihood')"
                v-model="filters.likely_hood_id"
                @input="applyFilters"
                clearable
                :loading="loadingLikelihoods"
              />
              <custom-dropdown
                :items="riskPriorities"
                item-value="id"
                item-text="name"
                :label="$t('table.overall_inherent_risk_rating')"
                v-model="filters.inherent_risk_rating_id"
                @input="applyFilters"
                clearable
                :loading="loadingRiskPriorities"
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
            <h2>{{ reportTitle || title || $t("page.assets_risks_reports") }}</h2>
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
  name: "AssetsRisksPrintableDialog",
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
        { text: "table.id", value: "tenant_risk_id", sortable: false },
        {
          text: "table.risk_description",
          value: "risk_description",
          sortable: false,
          cellClass: ["no-wrap"]
        },

        {
          text: "table.risk_area",
          value: "risk_category.name",
          sortable: false,
          cellClass: ["no-wrap"],
          uncenterBody: true
        },
        { text: "table.threat", value: "risk_type.name", sortable: false, cellClass: ["no-wrap"], uncenterBody: true },
        { text: "table.likelihood", value: "likely_hood", sortable: false },
        { text: "table.impact", value: "impact", sortable: false },
        { text: "table.overall_inherent_risk_rating", value: "rating", sortable: false },
        { text: "table.overall_residual_risk_rating", value: "overall_rating", sortable: false },
        { text: "table.onset_speed", value: "onset_speed", sortable: false },
        { text: "table.identification_date", value: "identification_date", sortable: false, cellClass: ["no-wrap"] },
        {
          text: "table.analysis_evaluation_date",
          value: "analysis_evaluation_date",
          sortable: false,
          cellClass: ["no-wrap"]
        },
        { text: "table.owner", value: "owner", sortable: false },
        { text: "table.asset", value: "asset", sortable: false, cellClass: ["no-wrap"], uncenterBody: true },
        { text: "table.cost", value: "asset_cost", sortable: false, cellClass: ["no-wrap"] },
        { text: "table.probability_loss", value: "asset_probability_loss", sortable: false, cellClass: ["no-wrap"] },
        { text: "table.loss_value", value: "asset_loss_value", sortable: false, cellClass: ["no-wrap"] },
        { text: "table.bcm_threat", value: "bcm_threat.threat_name", sortable: false, cellClass: ["no-wrap"] },
        { text: "table.compliance_reference", value: "compliance_ref", sortable: false, cellClass: ["no-wrap"] },
        { text: "table.status", value: "risk_status", sortable: false },
        { text: "table.notes", value: "note", sortable: false },
        { text: "table.unit", value: "unit.name", sortable: false },
        { text: "table.attachments", value: "attachments", sortable: false },
        { text: "", icon: "mdi-arrow-expand-all", value: "consequences", tooltip: "table.consequences" },
        { text: "", icon: "mdi-source-branch", value: "causes", tooltip: "table.causes" },
        { text: "", icon: "mdi-shield-outline", value: "control", tooltip: "table.controls" },
        { text: "", icon: "mdi-flask", value: "treatment", tooltip: "table.treatments" },
        { text: "table.associated_threats", value: "associated_threats", uncenterBody: false },
        { text: "table.tasks", value: "tasks", tooltip: "table.tasks" },
        { text: "table.actions", value: "actions", sortable: false }
      ],
      defaultColumns: [
        "asset",
        "asset_cost",
        "business_purpose",
        "asset_probability_loss",
        "asset_loss_value",
        "note"
        // "asset_serial",
        // "asset_user",
        // "asset_confidentiality",
        // "asset_integrity",
        // "asset_availability",
        // "asset_product_number"
      ],
      filters: {
        risk_priority_id: null,
        risk_type_id: null,
        risk_category_id: null,
        risk_status_id: null,
        impact_id: null,
        likely_hood_id: null,
        inherent_risk_rating_id: null,
        residual_risk_rating_id: null,
        onset_speed_id: null,
        owner_id: null,
        grc_asset_id: null
      },
      loadingFilters: false
    }
  },
  computed: {
    ...mapState("assets", ["assets", "assetsChart", "assetsCategories"]),
    ...mapState("risk", [
      "risks",
      "stats",
      "riskPriorities",
      "riskTypes",
      "riskCategories",
      "riskStatuses",
      "impacts",
      "likelihoods",
      "onsetSpeeds",
      "loading",
      "errors",
      "riskAttachments"
    ]),
    ...mapGetters("risk", ["users"]),
    //
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
    ...mapActions("risk", [
      "fetchRisks",
      "fetchRiskPriorities",
      "fetchRiskTypes",
      "fetchRiskCategories",
      "fetchRiskStatuses",
      "fetchImpacts",
      "fetchLikelihoods",
      "fetchOnsetSpeeds",
      "fetchUsers"
    ]),
    ...mapActions("assetsTypes", ["fetchAssetsType"]),
    ...mapActions("assetsCategories", ["fetchCategories"]),
    ...mapActions("assetsStatuses", ["fetchAssetsStatuses"]),
    async fetchData() {
      // this.$emit("fetch-data", this.filters)
      await this.fetchRisks(this.filters)
      // this.items = this.risks
      this.items = this.risks.filter((risk) => risk.asset != null)
    },
    applyFilters() {
      this.fetchData(this.filters)
    },
    async fetchAllDropdownData() {
      try {
        await Promise.all([
          this.fetchRisks(),
          this.fetchRiskPriorities(),
          this.fetchRiskTypes(),
          this.fetchRiskCategories(),
          this.fetchRiskStatuses(),
          this.fetchImpacts()
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
      // const value = header.value.split(".").reduce((obj, key) => obj?.[key], item)
      // Default: handle nested properties using dot notation
      let value = header.value.split(".").reduce((obj, key) => obj?.[key], item)

      // Strip HTML tags if value is a string with HTML
      if (typeof value === "string" && value.includes("<")) {
        value = this.stripHtml(value)
      }
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
