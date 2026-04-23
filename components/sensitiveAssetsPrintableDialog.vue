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
                :items="[
                  { id: null, name: $t('page.all') },
                  { id: true, name: $t('page.yes') },
                  { id: false, name: $t('page.no') }
                ]"
                item-value="id"
                item-text="name"
                :label="$t('table.is_sensitive')"
                v-model="filters.is_sensitive"
                @input="applyFilters"
                :loading="loadingOrders"
                clearable
              />
            </v-col>
            <v-col cols="12" sm="6" md="4" class="pa-0">
              <custom-dropdown
                :items="systemSegments"
                item-value="id"
                item-text="name"
                :label="$t('table.segment')"
                v-model="filters.system_segment_id"
                @input="applyFilters"
                :loading="loadingOrders"
                clearable
              />
            </v-col>
            <v-col cols="12" sm="6" md="4" class="pa-0">
              <custom-dropdown
                :items="assetSubSectors"
                item-value="id"
                item-text="name"
                :label="$t('table.sub_sector')"
                v-model="filters.asset_sub_sector_id"
                @input="applyFilters"
                :loading="loadingOrders"
                clearable
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
              delepage-chips
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
            <h2>{{ reportTitle || title || $t("page.report") }}</h2>
            <p>{{ $t("page.generated_on") }}: {{ new Date().toLocaleDateString() }}</p>
          </div>
          <div>
            <v-img width="128px" :src="tenant.logo" v-if="tenant">{{ tenant.company_name }}</v-img>
          </div>
        </div>
        <table class="print-table" :dir="isRTL ? 'rtl' : 'ltr'">
          <thead>
            <tr>
              <!-- Static columns -->
              <th v-if="selectedColumns.includes('name')" class="nowrap-cell" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ $t("table.name") }}
              </th>
              <th v-if="selectedColumns.includes('entity_name')" class="nowrap-cell" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ $t("table.entity_name") }}
              </th>
              <th v-if="selectedColumns.includes('code')" :dir="isRTL ? 'rtl' : 'ltr'">{{ $t("table.code") }}</th>

              <!-- Dynamic standard columns -->
              <th
                v-for="standardName in allStandardNames"
                :key="standardName"
                :dir="isRTL ? 'rtl' : 'ltr'"
                class="standards-cols"
              >
                {{ standardName }}
              </th>

              <!-- Other columns -->
              <th v-if="selectedColumns.includes('asset_system_qty')" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ $t("table.asset_system_qty") }}
              </th>
              <th v-if="selectedColumns.includes('asset_system_types')" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ $t("table.asset_system_types") }}
              </th>
              <th v-if="selectedColumns.includes('asset_system_types_qty')" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ $t("table.asset_system_types_qty") }}
              </th>
              <th v-if="selectedColumns.includes('is_sensitive')" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ $t("table.is_sensitive") }}
              </th>
              <th v-if="selectedColumns.includes('score')" :dir="isRTL ? 'rtl' : 'ltr'">{{ $t("table.score") }}</th>
              <th v-if="selectedColumns.includes('score_percentage')" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ $t("table.score_percentage") }}
              </th>
              <th v-if="selectedColumns.includes('sub_sector.sector.name')" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ $t("table.sector") }}
              </th>
              <th v-if="selectedColumns.includes('sub_sector.name')" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ $t("table.sub_sector") }}
              </th>
              <th v-if="selectedColumns.includes('system_segment.name')" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ $t("table.segment") }}
              </th>
              <th v-if="selectedColumns.includes('note')" :dir="isRTL ? 'rtl' : 'ltr'">{{ $t("table.notes") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, itemIndex) in page" :key="item[itemKey] || itemIndex">
              <!-- Static columns -->
              <td v-if="selectedColumns.includes('name')" class="nowrap-cell" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ item.name }}
              </td>
              <td v-if="selectedColumns.includes('entity_name')" class="nowrap-cell" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ item.entity_name }}
              </td>
              <td v-if="selectedColumns.includes('code')" :dir="isRTL ? 'rtl' : 'ltr'">{{ item.code }}</td>

              <!-- Dynamic standard columns -->
              <td
                v-for="standardName in allStandardNames"
                :key="standardName"
                class="standards-cols"
                :dir="isRTL ? 'rtl' : 'ltr'"
              >
                <template v-if="item.standard_values">
                  <div
                    v-for="sv in getStandardValuesByName(item.standard_values, standardName)"
                    :key="sv.id"
                    class="text--center standards-cols"
                  >
                    {{ sv.applicable ? $t("page.yes") : $t("page.no") }} | {{ $t("table.value") }}:
                    {{ sv.value || "-" }}
                  </div>
                </template>
                <template v-else>-</template>
              </td>

              <!-- Other columns -->
              <td v-if="selectedColumns.includes('asset_system_qty')" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ item.asset_system_qty || "-" }}
              </td>
              <td v-if="selectedColumns.includes('asset_system_types')" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ item.asset_system_types || "-" }}
              </td>
              <td v-if="selectedColumns.includes('asset_system_types_qty')" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ item.asset_system_types_qty || "-" }}
              </td>
              <td v-if="selectedColumns.includes('is_sensitive')" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ item.is_sensitive ? $t("page.yes") : $t("page.no") }}
              </td>
              <td v-if="selectedColumns.includes('score')" :dir="isRTL ? 'rtl' : 'ltr'">{{ item.score || "-" }}</td>
              <td v-if="selectedColumns.includes('score_percentage')" :dir="isRTL ? 'rtl' : 'ltr'">
                <v-progress-linear
                  height="20"
                  :color="getComplianceColor(item.score_percentage)"
                  :value="item.score_percentage"
                  disabled
                >
                  <strong>{{ item.score_percentage }}%</strong>
                </v-progress-linear>
              </td>
              <td v-if="selectedColumns.includes('sub_sector.sector.name')" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ item.sub_sector?.sector?.name || "-" }}
              </td>
              <td v-if="selectedColumns.includes('sub_sector.name')" class="nowrap-cell" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ item.sub_sector?.name || "-" }}
              </td>
              <td v-if="selectedColumns.includes('system_segment.name')" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ item.system_segment?.name || "-" }}
              </td>
              <td v-if="selectedColumns.includes('note')" :dir="isRTL ? 'rtl' : 'ltr'">
                {{ stripHtml(item.note) || "-" }}
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
import { mapActions, mapGetters, mapState } from "vuex"
export default {
  name: "sensitiveAssetsPrintableDialog",
  props: {
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
    },
    itemKey: {
      type: String,
      default: "id"
    },
    title: {
      type: String,
      default: null
    },
    reportTitle: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      items: [],
      selectedColumns: [],
      pageSize: this.defaultPageSize,
      orientation: "landscape", // Changed default to landscape for better fit
      orientations: ["portrait", "landscape"],
      headers: [
        { text: "table.name", value: "name", tooltip: "table.name" },
        { text: "table.entity_name", value: "entity_name", tooltip: "table.entity_name" },
        { text: "table.code", value: "code", tooltip: "table.code" },
        { text: "table.asset_system_qty", value: "asset_system_qty", tooltip: "table.asset_system_qty" },
        { text: "table.asset_system_types", value: "asset_system_types", tooltip: "table.asset_system_types" },
        {
          text: "table.asset_system_types_qty",
          value: "asset_system_types_qty",
          tooltip: "table.asset_system_types_qty"
        },
        { text: "table.is_sensitive", value: "is_sensitive", tooltip: "table.is_sensitive" },
        { text: "table.score", value: "score", tooltip: "table.score" },
        { text: "table.score_percentage", value: "score_percentage", tooltip: "table.score_percentage" },
        { text: "table.sector", value: "sub_sector.sector.name", tooltip: "table.sector" },
        { text: "table.sub_sector", value: "sub_sector.name", tooltip: "table.sub_sector" },
        { text: "table.segment", value: "system_segment.name", tooltip: "table.segment" },
        { text: "table.notes", value: "note", tooltip: "table.notes" }
      ],
      defaultColumns: [
        "name",
        "entity_name",
        "code",
        "is_sensitive",
        "sub_sector.sector.name",
        "sub_sector.name",
        "system_segment.name",
        "asset_system_qty",
        "asset_system_types",
        "asset_system_types_qty",
        "score",
        "score_percentage"
      ],
      filters: {
        system_segment_id: null,
        asset_sub_sector_id: null,
        is_sensitive: null
      }
    }
  },
  computed: {
    ...mapGetters({
      getSensitiveAssets: "sensitiveAssets/getSensitiveAssets",
      loadingSensitiveAssets: "sensitiveAssets/isLoading",
      systemSegments: "assetSegments/getSegments",
      assetSubSectors: "assetSubSectors/getSubSectors"
    }),
    ...mapState(["isRTL"]),
    allStandardNames() {
      const names = new Set()
      this.items.forEach((item) => {
        ;(item.standard_values || []).forEach((sv) => {
          if (sv.asset_standard?.name) names.add(sv.asset_standard.name)
        })
      })
      return Array.from(names).sort()
    },
    availableColumns() {
      return this.headers.map((header) => ({
        text: header.text.startsWith("table.") ? this.$t(header.text) : header.text,
        value: header.value
      }))
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
      return this.$auth.user.tenant || ""
    }
  },
  methods: {
    ...mapActions({
      fetchSensitiveAssets: "sensitiveAssets/fetchSensitiveAssets",
      deleteSensitiveAsset: "sensitiveAssets/deleteSensitiveAsset",
      updateSensitiveAsset: "sensitiveAssets/updateSensitiveAsset",
      fetchSegments: "assetSegments/fetchSegments",
      fetchSubSectors: "assetSubSectors/fetchSubSectors"
    }),
    getStandardValuesByName(standardValues, standardName) {
      return (standardValues || []).filter((sv) => sv.asset_standard?.name === standardName)
    },
    getComplianceColor(percentage) {
      if (percentage >= 85) return "green"
      if (percentage >= 65) return "amber"
      if (percentage >= 35) return "orange"
      return "red"
    },
    async fetchData() {
      await this.fetchSensitiveAssets(this.filters)
      this.items = this.getSensitiveAssets
    },
    applyFilters() {
      this.fetchData()
    },
    stripHtml(html) {
      if (!html) return ""
      const temp = document.createElement("div")
      temp.innerHTML = html
      return temp.textContent || temp.innerText || ""
    },
    generateReport() {
      const style = document.createElement("style")
      style.innerHTML = this.getPrintStyles()
      document.head.appendChild(style)

      const printContent = this.$refs.printSection.innerHTML
      const printWindow = window.open("", "_blank")
      printWindow.document.write(`
        <html>
          <head>
            <title>${this.reportTitle || this.title || this.$t("page.sensitive_assets_reports")}</title>
            <style>${this.getPrintStyles()}</style>
          </head>
          <body>${printContent}</body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
      printWindow.close()

      document.head.removeChild(style)
      this.$emit("close")
    },
    // getPrintStyles() {
    //   return `
    //     @media print {
    //       body {
    //         font-family: Arial, sans-serif;
    //         font-size: 10px;
    //       }
    //       .print-page {
    //         page-break-after: always;
    //         padding: 20px;
    //       }
    //       .print-table {
    //         width: 100%;
    //         border-collapse: collapse;
    //         margin: 20px 0;
    //         font-size: 9px;
    //       }
    //       .print-table th,
    //       .print-table td {
    //         border: 1px solid #000;
    //         padding: 4px 6px;
    //         text-align: left;
    //         vertical-align: top;
    //         word-wrap: break-word;
    //       }
    //       .print-table th {
    //         background-color: #f5f5f5;
    //         font-weight: bold;
    //         text-align: center;
    //       }
    //       .page-footer {
    //         position: fixed;
    //         bottom: 20px;
    //         right: 20px;
    //         font-size: 10px;
    //       }
    //       h2 {
    //         margin: 0 0 10px 0;
    //       }
    //       p {
    //         margin: 5px 0;
    //       }
    //       @page {
    //         size: ${this.orientation};
    //         margin: 0.5cm;
    //       }
    //     }
    //   `
    // }
    getPrintStyles() {
      return `
    @media print {
      body {
        font-family: Arial, sans-serif;
        font-size: 10px;
      }
      .print-page {
        page-break-after: always;
        padding: 20px;
      }
      .print-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        font-size: 9px;
        direction: ${this.isRTL ? "rtl" : "ltr"};
      }
      .print-table th,
      .print-table td {
        border: 1px solid #ddd;
        padding: 4px;
        text-align: ${this.isRTL ? "right" : "left"};
        vertical-align: top;
        word-wrap: break-word;
      }
      .print-table th {
        background-color: #f5f5f5;
        font-weight: bold;
        text-align: center;
      }
      .nowrap-cell {
        white-space: nowrap;
      }
      .page-footer {
        position: fixed;
        bottom: 20px;
        ${this.isRTL ? "left" : "right"}: 20px;
        font-size: 10px;
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
      @page {
        size: ${this.orientation};
        margin: 0.5cm;
      }
    }
  `
    }
  },
  created() {
    this.selectedColumns = this.defaultColumns.length
      ? this.defaultColumns
      : this.headers.slice(0, 4).map((h) => h.value)
  },
  async mounted() {
    await this.fetchData()
  }
}
</script>

<style scoped>
.d-none {
  display: none;
}
.nowrap-cell {
  white-space: nowrap;
}
.standards-cols {
  width: 220px;
}
</style>
