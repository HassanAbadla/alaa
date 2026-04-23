// Vue component for Excel import
<template>
  <div>
    <v-card-text>
      <v-file-input
        v-model="excelFile"
        :label="$t('page.select_file')"
        accept=".xlsx, .xls"
        prepend-icon="mdi-file-excel"
        @change="onFileChange"
        :error-messages="fileError"
      ></v-file-input>

      <v-alert v-if="importSuccess && importedCount > 0" type="success" dismissible>
        <div>{{ $t("page.import_success", { count: importedCount }) }}</div>
        <div class="mt-2" v-if="importedAssetCodes.length > 0">
          <div>{{ $t("page.successfully_added_assets") }}:</div>
          <ul class="mt-1">
            <li v-for="(code, index) in importedAssetCodes" :key="index">
              {{ code }}
            </li>
          </ul>
        </div>
      </v-alert>

      <v-alert v-if="importSuccess && importedCount === 0 && updatedCount > 0" type="info" dismissible>
        <div>{{ $t("page.no_new_assets_added", { updated: updatedCount }) }}</div>
      </v-alert>

      <v-alert v-if="importErrors.length > 0" type="error" dismissible>
        <div>{{ $t("page.import_errors") }}</div>
        <ul class="mt-2">
          <li v-for="(error, index) in importErrors" :key="index">
            {{ error }}
          </li>
        </ul>
      </v-alert>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" :disabled="!excelFile || isImporting" :loading="isImporting" @click="importExcel">
        {{ $t("page.import") }}
      </v-btn>
      <v-btn text @click="$emit('close')">
        {{ $t("cancel") }}
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import * as XLSX from "xlsx"
import { mapActions, mapState } from "vuex"

export default {
  name: "AssetImport",
  props: {
    headers: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      excelFile: null,
      fileError: null,
      isImporting: false,
      importSuccess: false,
      importedCount: 0,
      importErrors: [],
      importedAssetCodes: [],
      updatedAssetCodes: [],
      categories: [],
      statuses: [],
      types: [],
      locations: [],
      units: []
    }
  },
  created() {
    // Fetch necessary reference data when component is created
    this.fetchReferenceData()
  },
  methods: {
    ...mapActions("assetsCategories", ["getAssetsCategories", "addAssetCategories"]),
    ...mapActions("assetsStatuses", ["getAssetsStatuses", "addAssetStatus"]),
    ...mapActions("assetsTypes", ["getAssetsType", "addAssetType"]),
    ...mapActions("assetsLocations", ["fetchAssetsLocations", "createAssetLocation"]),
    ...mapActions("positions", ["fetchUnits"]),
    ...mapActions("assets", ["importAssets"]),

    onFileChange() {
      // Reset states
      this.fileError = null
      this.importSuccess = false
      this.importErrors = []
      this.importedCount = 0
      this.updatedCount = 0
      this.importedAssetCodes = []
      this.updatedAssetCodes = []
    },

    async fetchReferenceData() {
      try {
        // Fetch all needed reference data in parallel
        const [categoriesResponse, statusesResponse, typesResponse, locationsResponse, unitsResponse] =
          await Promise.all([
            this.getAssetsCategories(),
            this.getAssetsStatuses(),
            this.getAssetsType(),
            this.fetchAssetsLocations(),
            this.fetchUnits()
          ])

        this.categories = this.categoriesCrudList || []
        this.statuses = this.crudStatusesList || []
        this.types = this.crudTypesList || []
        this.locations = this.locationList || []
        this.units = this.units || []
      } catch (error) {
        console.error("Error fetching reference data:", error)
        this.$store.dispatch("snackbar/showSnackbar", {
          text: this.$t("errors.reference_data_fetch_failed"),
          color: "error"
        })
      }
    },

    async importExcel() {
      if (!this.excelFile) {
        this.fileError = this.$t("validation.file_required")
        return
      }

      this.isImporting = true
      this.importErrors = []
      this.importedCount = 0
      this.updatedCount = 0
      this.importedAssetCodes = []
      this.updatedAssetCodes = []

      try {
        const data = await this.readExcelFile(this.excelFile)
        if (!data || data.length === 0) {
          this.fileError = this.$t("validation.file_empty")
          this.isImporting = false
          return
        }

        // Process and send data to API
        const processedData = await this.processExcelData(data)
        await this.saveImportedAssets(processedData)
      } catch (error) {
        console.error("Import error:", error)
        this.importErrors.push(this.$t("errors.import_failed"))
      } finally {
        this.isImporting = false
      }
    },

    async readExcelFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
          try {
            const data = e.target.result
            const workbook = XLSX.read(data, { type: "binary" })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

            // Extract headers and data
            const headers = json[0]
            const rows = json.slice(1)

            // Map rows to objects with header keys
            const formattedData = rows.map((row) => {
              const obj = {}
              headers.forEach((header, index) => {
                obj[header] = row[index]
              })
              return obj
            })

            resolve(formattedData)
          } catch (error) {
            reject(error)
          }
        }

        reader.onerror = (error) => {
          reject(error)
        }

        reader.readAsBinaryString(file)
      })
    },

    // async processExcelData(data) {
    //   // Map Excel column names to API field names
    //   const fieldMap = {
    //     "Asset ID": "code",
    //     Name: "name",
    //     "Asset Type": "grc_assets_types_id",
    //     "Business Purpose": "asset_business_purpose",
    //     "Asset Custodian": "owner",
    //     Location: "asset_location_id",
    //     "Apps Supported": "apps_supported",
    //     "Compliance Standard": "compliance_standard",
    //     Status: "asset_status_id",
    //     "Asset Model": "asset_model",
    //     Unit: "asset_unit_id",
    //     "Asset Cost": "asset_cost",
    //     Notes: "note",
    //     Category: "grc_assets_categories_id",
    //     "MAC Address": "asset_mac_address",
    //     "Network Address": "asset_network_address",
    //     "Active Port": "asset_active_port",
    //     "Expiration Date": "expiration_date"
    //   }

    //   const processedData = []

    //   for (let i = 0; i < data.length; i++) {
    //     const row = data[i]
    //     const assetData = {}

    //     // Standard fields
    //     Object.keys(fieldMap).forEach((excelField) => {
    //       if (row[excelField] !== undefined) {
    //         assetData[fieldMap[excelField]] = row[excelField]
    //       }
    //     })

    //     // Process lookup values (type, status, category, location, unit)
    //     try {
    //       // // Handle Unit
    //       if (row["Unit"]) {
    //         const unitId = parseInt(row["Unit"])
    //         assetData.asset_unit_id = isNaN(unitId) ? null : unitId
    //       }

    //       // Format date if needed
    //       if (assetData.expiration_date) {
    //         // Excel dates are often stored as numbers
    //         if (typeof assetData.expiration_date === "number") {
    //           // Convert Excel date to JavaScript date
    //           const excelDate = XLSX.SSF.parse_date_code(assetData.expiration_date)
    //           assetData.expiration_date = `${excelDate.y}-${String(excelDate.m).padStart(2, "0")}-${String(
    //             excelDate.d
    //           ).padStart(2, "0")}`
    //         }
    //       }

    //       processedData.push(assetData)
    //     } catch (error) {
    //       console.error("Error processing row", i + 1, error)
    //       this.importErrors.push(`Row ${i + 1}: Processing error - ${error.message}`)
    //     }
    //   }

    //   return processedData
    // },
    // async processExcelData(data) {
    //   // Map Excel column names to API field names
    //   const fieldMap = this.headers.map((item) => this.$t(item.text))
    //   // const fieldMap = {
    //   //   "Asset ID": "code",
    //   //   "Asset Type": "grc_assets_types_id",
    //   //   Name: "name",
    //   //   "Business Purpose": "business_purpose",
    //   //   Owner: "owner",
    //   //   "Asset Custodian": "custodian",
    //   //   Location: "asset_location_id",
    //   //   "Apps Supported": "apps_supported",
    //   //   "Compliance Standard": "complianceStandard",
    //   //   Status: "asset_status_id",
    //   //   "Asset Model": "asset_model",
    //   //   Unit: "asset_unit_id",
    //   //   "Asset Cost": "asset_cost",
    //   //   Notes: "note",
    //   //   Category: "grc_assets_categories_id",
    //   //   "MAC Address": "asset_mac_address",
    //   //   "Network Address": "asset_network_address",
    //   //   "Active Port": "asset_active_port",
    //   //   "Expiration Date": "expiration_date",
    //   //   Version: "version",
    //   //   "Serial Number": "asset_serial",
    //   //   "Asset User": "asset_user",
    //   //   "Asset User System": "asset_user_system",
    //   //   "Asset User Phone": "asset_user_phone",
    //   //   "Asset User Email": "asset_user_email",
    //   //   "Asset Confidentiality": "asset_confidentiality",
    //   //   "Asset Integrity": "asset_integrity",
    //   //   "Asset Availability": "asset_availability",
    //   //   "Asset Value Qualitative": "asset_value_qualitive",
    //   //   "Asset SIEM": "asset_siem",
    //   //   "Asset EDR": "asset_edr",
    //   //   "Asset NDR": "asset_ndr",
    //   //   "Asset Qty": "asset_qty",
    //   //   "Asset Product Number": "asset_product_number",
    //   //   "Asset License No": "asset_license_no",
    //   //   "Asset License Date": "asset_license_date",
    //   //   "Asset Building": "asset_building",
    //   //   "Asset Room": "asset_room",
    //   //   "Asset Usage": "asset_usage",
    //   //   "Asset Card Number": "asset_card_number"
    //   // }

    //   const processedData = []

    //   for (let i = 0; i < data.length; i++) {
    //     const row = data[i]
    //     const assetData = {}

    //     // Log the row to see what keys are actually present
    //     if (i === 0) {
    //       console.log("First row keys:", Object.keys(row))
    //       console.log("First row data:", row)
    //     }

    //     // Standard fields - map from Excel columns to API fields
    //     Object.keys(row).forEach((excelField) => {
    //       // Check if this Excel field is in our mapping
    //       if (fieldMap[excelField]) {
    //         const value = row[excelField]
    //         // Only include non-empty values
    //         if (value !== undefined && value !== null && value !== "") {
    //           assetData[fieldMap[excelField]] = value
    //         }
    //       }
    //     })

    //     // Process lookup values (type, status, category, location, unit)
    //     try {
    //       // Handle Unit
    //       if (row["Unit"]) {
    //         const unitId = parseInt(row["Unit"])
    //         assetData.asset_unit_id = isNaN(unitId) ? null : unitId
    //       }
    //       if (row["Asset License No"]) {
    //         const licenseNo = parseInt(row["Asset License No"])
    //         assetData.asset_license_no = isNaN(unitId) ? null : licenseNo
    //       }

    //       // Format expiration_date if needed
    //       if (assetData.expiration_date) {
    //         // Excel dates are often stored as numbers
    //         if (typeof assetData.expiration_date === "number") {
    //           // Convert Excel date to JavaScript date
    //           const excelDate = XLSX.SSF.parse_date_code(assetData.expiration_date)
    //           assetData.expiration_date = `${excelDate.y}-${String(excelDate.m).padStart(2, "0")}-${String(
    //             excelDate.d
    //           ).padStart(2, "0")}`
    //         }
    //       }

    //       // Format asset_license_date if needed
    //       if (assetData.asset_license_date) {
    //         // Excel dates are often stored as numbers
    //         if (typeof assetData.asset_license_date === "number") {
    //           // Convert Excel date to JavaScript date
    //           const excelDate = XLSX.SSF.parse_date_code(assetData.asset_license_date)
    //           assetData.asset_license_date = `${excelDate.y}-${String(excelDate.m).padStart(2, "0")}-${String(
    //             excelDate.d
    //           ).padStart(2, "0")}`
    //         }
    //       }

    //       processedData.push(assetData)
    //     } catch (error) {
    //       console.error("Error processing row", i + 1, error)
    //       this.importErrors.push(`Row ${i + 1}: Processing error - ${error.message}`)
    //     }
    //   }

    //   console.log("Processed data:", processedData)
    //   return processedData
    // },
    async processExcelData(data) {
      // Create fieldMap from headers prop
      // Map translated header text to the API field value
      const fieldMap = {}

      this.headers.forEach((header) => {
        if (header.value && header.value !== "actions") {
          // Get the translated text for this header
          const translatedText = this.$t(header.text)

          // Handle nested values like "type.name" -> use the base field
          let apiField = header.value

          // For nested fields, we need to map to the ID field
          if (header.value.includes(".")) {
            const baseField = header.value.split(".")[0]
            // Map relation fields to their ID equivalents
            if (baseField === "type") apiField = "grc_assets_types_id"
            else if (baseField === "status") apiField = "asset_status_id"
            else if (baseField === "category") apiField = "grc_assets_categories_id"
            else if (baseField === "location") apiField = "asset_location_id"
            else if (baseField === "unit") apiField = "asset_unit_id"
          }

          fieldMap[translatedText] = apiField
        }
      })

      console.log("Field Map:", fieldMap)

      const processedData = []

      for (let i = 0; i < data.length; i++) {
        const row = data[i]
        const assetData = {}

        // Log the row to see what keys are actually present
        if (i === 0) {
          console.log("First row keys:", Object.keys(row))
          console.log("First row data:", row)
        }

        // Standard fields - map from Excel columns to API fields
        Object.keys(row).forEach((excelField) => {
          // Check if this Excel field is in our mapping
          if (fieldMap[excelField]) {
            const value = row[excelField]
            // Only include non-empty values
            if (value !== undefined && value !== null && value !== "") {
              assetData[fieldMap[excelField]] = value
            }
          }
        })

        // Process lookup values (type, status, category, location, unit)
        try {
          // Handle Unit
          if (assetData.asset_unit_id) {
            const unitId = parseInt(assetData.asset_unit_id)
            assetData.asset_unit_id = isNaN(unitId) ? assetData.asset_unit_id : unitId
          }

          // Format expiration_date if needed
          if (assetData.expiration_date) {
            // Excel dates are often stored as numbers
            if (typeof assetData.expiration_date === "number") {
              // Convert Excel date to JavaScript date
              const excelDate = XLSX.SSF.parse_date_code(assetData.expiration_date)
              assetData.expiration_date = `${excelDate.y}-${String(excelDate.m).padStart(2, "0")}-${String(
                excelDate.d
              ).padStart(2, "0")}`
            }
          }

          // Format asset_license_date if needed
          if (assetData.asset_license_date) {
            // Excel dates are often stored as numbers
            if (typeof assetData.asset_license_date === "number") {
              // Convert Excel date to JavaScript date
              const excelDate = XLSX.SSF.parse_date_code(assetData.asset_license_date)
              assetData.asset_license_date = `${excelDate.y}-${String(excelDate.m).padStart(2, "0")}-${String(
                excelDate.d
              ).padStart(2, "0")}`
            }
          }

          processedData.push(assetData)
        } catch (error) {
          console.error("Error processing row", i + 1, error)
          this.importErrors.push(`Row ${i + 1}: Processing error - ${error.message}`)
        }
      }

      console.log("Processed data:", processedData)
      return processedData
    },

    async saveImportedAssets(assets) {
      try {
        // Filter out assets with validation errors
        const validAssets = assets.filter((asset) => {
          return asset.code && asset.name // Add minimum validation requirements
        })

        if (validAssets.length === 0) {
          this.importErrors.push(this.$t("errors.no_valid_records"))
          return
        }

        // Send assets to API for bulk import
        const response = await this.importAssets({
          assets: validAssets
        })

        this.importedCount = response.data.imported_count || 0
        this.updatedCount = response.data.updated_count || 0
        this.importSuccess = true

        // Store the imported asset codes from the API response
        if (response.data.imported_asset_codes && response.data.imported_asset_codes.length > 0) {
          this.importedAssetCodes = response.data.imported_asset_codes
        }
        // Store the updated asset codes from the API response
        if (response.data.updated_asset_codes && response.data.updated_asset_codes.length > 0) {
          this.updatedAssetCodes = response.data.updated_asset_codes
        }

        // Refresh the assets list
        this.$emit("refresh")

        // If there are warnings in the response
        if (response.data.warnings && response.data.warnings.length > 0) {
          this.importErrors = [...this.importErrors, ...response.data.warnings]
        }
      } catch (error) {
        console.error("Save error:", error)
        if (error.response && error.response.data && error.response.data.errors) {
          // Handle validation errors from API
          const errors = error.response.data.errors
          Object.keys(errors).forEach((key) => {
            this.importErrors.push(errors[key][0])
          })
        } else {
          this.importErrors.push(this.$t("errors.save_failed"))
        }
      }
    }
  },

  computed: {
    ...mapState("assetsCategories", ["categoriesCrudList"]),
    ...mapState("assetsStatuses", ["crudStatusesList"]),
    ...mapState("assetsTypes", ["crudTypesList"]),
    ...mapState("assetsLocations", ["locationList"]),
    ...mapState("positions", ["units"])
  }
}
</script>
