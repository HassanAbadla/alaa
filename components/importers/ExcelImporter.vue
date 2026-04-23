<template>
  <div>
    <v-dialog v-model="dialog" max-width="800px" scrollable>
      <v-card>
        <v-card-title class="headline">{{ mergedTranslations.dialogTitle }}</v-card-title>
        <v-card-text>
          <div v-if="step === 'upload'">
            <p>{{ mergedTranslations.uploadInstructions }}</p>

            <v-file-input
              v-model="excelFile"
              :label="mergedTranslations.selectFileLabel"
              prepend-icon="mdi-file-excel"
              accept=".xlsx, .xls"
              :error-messages="fileError"
              @change="clearFileError"
              outlined
              dense
            ></v-file-input>

            <v-alert v-if="uploadError" type="error" dense>
              {{ uploadError }}
            </v-alert>

            <div class="mt-4">
              <a href="#" @click.prevent="downloadTemplate">
                {{ mergedTranslations.downloadTemplateLabel }}
              </a>
            </div>
          </div>

          <div v-else-if="step === 'mapping'">
            <p>{{ mergedTranslations.mapColumnsInstructions }}</p>

            <v-data-table
              height="300"
              :headers="mappingHeaders"
              :items="internalFieldMappings"
              hide-default-footer
              :items-per-page="-1"
              class="elevation-1"
            >
              <template v-slot:item.excelColumn="{ item }">
                <v-autocomplete v-model="item.excelColumn" :items="excelColumns" outlined dense hide-details></v-autocomplete>
              </template>
            </v-data-table>
          </div>

          <div v-else-if="step === 'preview'">
            <p>{{ mergedTranslations.previewInstructions }}</p>
            <p>{{ mergedTranslations.totalRecordsLabel }}: {{ parsedData.length }}</p>

            <v-data-table
            height="300"
              :headers="previewHeaders"
              :items="previewItems"
              hide-default-footer
              :items-per-page="5"
              class="elevation-1"
            ></v-data-table>

            <v-alert v-if="validationErrors.length > 0" type="warning" class="mt-4">
              <p>{{ mergedTranslations.validationErrorsLabel }}:</p>
              <ul>
                <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
              </ul>
            </v-alert>
          </div>

          <div v-else-if="step === 'processing'">
            <v-progress-linear indeterminate color="primary"></v-progress-linear>
            <p class="text-center mt-4">{{ mergedTranslations.processingLabel }}</p>
            <p class="text-center">{{ processingStatus }}</p>
          </div>

          <div v-else-if="step === 'complete'">
            <v-alert v-if="importedCount > 0" type="success" dense>
              {{ mergedTranslations.importCompleteMessage.replace("{count}", importedCount) }}
            </v-alert>

            <v-alert v-if="importedCount === 0 && importErrors.length > 0" type="error" dense>
              {{ mergedTranslations.importFailedMessage }}
            </v-alert>

            <div v-if="importErrors.length > 0" class="mt-4">
              <v-alert type="warning" dense>
                {{ mergedTranslations.importErrorsMessage.replace("{count}", importErrors.length) }}
              </v-alert>

              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header>{{ mergedTranslations.viewErrorsLabel }}</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-simple-table height="300">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th>{{ mergedTranslations.rowLabel }}</th>
                            <th>{{ mergedTranslations.errorLabel }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(error, index) in importErrors" :key="index">
                            <td>{{ error.row }}</td>
                            <td>{{ error.message }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </div>

          <!-- Reference section for valid IDs -->
          <v-expansion-panels v-if="showRefrences" class="mt-4">
            <v-expansion-panel>
              <v-expansion-panel-header>
                {{ mergedTranslations.availableIdsLabel }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-tabs>
                  <v-tab v-for="field in entityFields" :key="field.field">
                    {{ field.label }}
                  </v-tab>

                  <v-tab-item v-for="field in entityFields" :key="field.field">
                    <v-simple-table dense height="300">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>{{ mergedTranslations.nameLabel }}</th>
                            <th v-if="shouldShowCodeColumn(field)">
                              {{ mergedTranslations.codeLabel }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="entity in getEntitiesForField(field)" :key="entity.id">
                            <td>{{ entity.id }}</td>
                            <td>
                              {{ getDisplayName(entity, field) }}
                            </td>
                            <td v-if="shouldShowCodeColumn(field)">
                              {{ entity.code || "" }}
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-tab-item>
                </v-tabs>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="closeDialog">
            {{ step === "complete" ? mergedTranslations.closeLabel : mergedTranslations.cancelLabel }}
          </v-btn>

          <v-btn v-if="step === 'upload'" color="primary" :disabled="!excelFile" @click="parseExcelFile">
            {{ mergedTranslations.nextLabel }}
          </v-btn>

          <v-btn v-if="step === 'mapping'" text @click="step = 'upload'">
            {{ mergedTranslations.backLabel }}
          </v-btn>

          <v-btn v-if="step === 'mapping'" color="primary" @click="previewData">
            {{ mergedTranslations.previewLabel }}
          </v-btn>

          <v-btn v-if="step === 'preview'" text @click="step = 'mapping'">
            {{ mergedTranslations.backLabel }}
          </v-btn>

          <v-btn
            v-if="step === 'preview'"
            color="primary"
            @click="importData"
            :disabled="parsedData.length === 0 || isImportButtonDisabled"
          >
            {{ mergedTranslations.importLabel }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as XLSX from "xlsx"

export default {
  name: "ExcelImporter",
  props: {
    showRefrences: { type: Boolean, default: true },
    value: {
      type: Boolean,
      default: false
    },
    fieldMappings: {
      type: Array,
      required: true,
      validator: (mappings) => {
        return mappings.every((mapping) => mapping.field && mapping.label && typeof mapping.required === "boolean")
      }
    },
    apiMethods: {
      type: Object,
      required: true,
      validator: (methods) => {
        return (
          methods.create &&
          methods.fetchAll &&
          methods.reference &&
          typeof methods.create === "function" &&
          typeof methods.fetchAll === "function" &&
          typeof methods.reference === "object"
        )
      }
    },
    translations: {
      type: Object,
      default: () => ({})
    },
    entityConfig: {
      type: Object,
      default: () => ({
        templateFilename: "import_template.xlsx",
        entityName: "record",
        entityNamePlural: "records"
      })
    },
    // NEW: Prop to enable bulk import
    useBulkImport: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false,
      step: "upload",
      excelFile: null,
      fileError: "",
      uploadError: "",
      excelColumns: [],
      parsedData: [],
      validationErrors: [],
      importErrors: [],
      processingStatus: "",
      importedCount: 0,
      isImportButtonDisabled: false,
      internalFieldMappings: [],
      referenceData: {}
    }
  },
  computed: {
    mappingHeaders() {
      return [
        { text: "Field Name", value: "label" },
        { text: "Excel Column", value: "excelColumn" },
        { text: "Required", value: "required", align: "center" }
      ]
    },

    entityFields() {
      return this.internalFieldMappings.filter((field) => field.entityMapping)
    },

    previewHeaders() {
      return this.internalFieldMappings
        .filter((field) => field.excelColumn)
        .map((field) => ({
          text: field.label,
          value: field.field,
          sortable: false
        }))
    },

    previewItems() {
      return this.parsedData.slice(0, 5)
    },

    // Merge default translations with passed translations
    mergedTranslations() {
      const defaults = {
        dialogTitle: "Import Data",
        uploadInstructions: "Please select an Excel file to import.",
        selectFileLabel: "Select Excel File",
        downloadTemplateLabel: "Download Template",
        mapColumnsInstructions: "Map the Excel columns to the appropriate fields.",
        previewInstructions: "Preview the data before importing.",
        totalRecordsLabel: "Total Records",
        validationErrorsLabel: "Validation Errors",
        processingLabel: "Processing data...",
        importCompleteMessage: this.$t("message.excel_import_complete"),
        importErrorsMessage: this.$t("message.excel_import_errors"),
        importFailedMessage: this.$t("message.excel_import_failed"),
        viewErrorsLabel: "View Errors",
        availableIdsLabel: "Available IDs Reference",
        nameLabel: "Name",
        codeLabel: "Code",
        rowLabel: "Row",
        errorLabel: "Error",
        closeLabel: "Close",
        cancelLabel: "Cancel",
        nextLabel: "Next",
        backLabel: "Back",
        previewLabel: "Preview",
        importLabel: "Import"
      }

      return { ...defaults, ...this.translations }
    }
  },

  watch: {
    value(val) {
      this.dialog = val
    },
    dialog(val) {
      this.$emit("input", val)
      if (!val) {
        this.resetForm()
      }
    },
    fieldMappings: {
      immediate: true,
      handler(newMappings) {
        this.internalFieldMappings = newMappings.map((mapping) => ({
          ...mapping,
          excelColumn: ""
        }))
      }
    }
  },

  methods: {
    async fetchReferenceData() {
      try {
        // Get all unique entity mappings
        const entityMappings = [
          ...new Set(this.fieldMappings.filter((field) => field.entityMapping).map((field) => field.entityMapping))
        ]

        console.log("Fetching reference data for:", entityMappings)

        // Fetch reference data for each entity mapping
        for (const entityMapping of entityMappings) {
          if (this.apiMethods.reference[entityMapping]) {
            console.log(`Fetching ${entityMapping}...`)
            try {
              const result = await this.apiMethods.reference[entityMapping]()
              this.referenceData[entityMapping] = result || []
              console.log(`Fetched ${entityMapping}:`, this.referenceData[entityMapping])
            } catch (error) {
              console.error(`Error fetching ${entityMapping}:`, error)
              this.referenceData[entityMapping] = []
            }
          } else {
            console.warn(`No fetch method provided for ${entityMapping}`)
            this.referenceData[entityMapping] = []
          }
        }
      } catch (error) {
        console.error("Error fetching reference data:", error)
        this.uploadError = "Failed to fetch reference data"
      }
    },

    getEntitiesForField(field) {
      if (!field.entityMapping) return []
      return this.referenceData[field.entityMapping] || []
    },

    shouldShowCodeColumn(field) {
      const entities = this.getEntitiesForField(field)
      return entities.some((entity) => entity.code)
    },

    getDisplayName(entity, field) {
      // Smart display name logic
      if (field.entityMapping === "users") {
        return entity.full_name || entity.name || entity.email || ""
      }
      return entity.name || ""
    },

    resetForm() {
      this.step = "upload"
      this.excelFile = null
      this.fileError = ""
      this.uploadError = ""
      this.excelColumns = []
      this.parsedData = []
      this.validationErrors = []
      this.importErrors = []
      this.processingStatus = ""
      this.importedCount = 0
      this.isImportButtonDisabled = false

      // Reset mapping
      this.internalFieldMappings.forEach((field) => {
        field.excelColumn = ""
      })
    },

    clearFileError() {
      this.fileError = ""
      this.uploadError = ""
    },

    closeDialog() {
      this.dialog = false
    },

    async parseExcelFile() {
      if (!this.excelFile) {
        this.fileError = "No file selected"
        return
      }

      try {
        const fileReader = new FileReader()

        fileReader.onload = (e) => {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: "array" })

          // Get the first sheet
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]

          // Get column headers
          const range = XLSX.utils.decode_range(firstSheet["!ref"])
          this.excelColumns = []

          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col })
            const cell = firstSheet[cellAddress]

            if (cell && cell.v) {
              this.excelColumns.push(cell.v.toString())
            }
          }

          // Auto-map columns
          this.autoMapColumns()

          this.step = "mapping"
        }

        fileReader.onerror = () => {
          this.uploadError = "Error reading file"
        }

        fileReader.readAsArrayBuffer(this.excelFile)
      } catch (error) {
        console.error("Error parsing Excel file:", error)
        this.uploadError = "Error parsing file"
      }
    },

    autoMapColumns() {
      this.internalFieldMappings.forEach((field) => {
        const matchingColumn = this.excelColumns.find((col) => {
          if (!col) return false

          const colLower = typeof col === "string" ? col.toLowerCase() : String(col).toLowerCase()
          const fieldLabelLower = field.label ? field.label.toLowerCase() : ""
          const fieldNameLower = field.field ? field.field.toLowerCase() : ""

          return colLower === fieldLabelLower || colLower === fieldNameLower
        })

        if (matchingColumn) {
          field.excelColumn = matchingColumn
        }
      })
    },

    previewData() {
      this.parsedData = []
      this.validationErrors = []

      // Check if required mappings are set
      const missingMappings = this.internalFieldMappings.filter((field) => field.required && !field.excelColumn)

      if (missingMappings.length > 0) {
        this.validationErrors.push(`Missing required mappings: ${missingMappings.map((f) => f.label).join(", ")}`)
        return
      }

      try {
        const fileReader = new FileReader()

        fileReader.onload = (e) => {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: "array" })
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
          const headers = jsonData[0]

          // Process each row (skip header row)
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i]

            // Skip empty rows
            if (row.length === 0 || row.every((cell) => !cell && cell !== 0)) {
              continue
            }

            const record = {}

            // Map columns based on user mappings
            this.internalFieldMappings.forEach((field) => {
              if (field.excelColumn) {
                const columnIndex = headers.indexOf(field.excelColumn)

                if (columnIndex !== -1 && columnIndex < row.length) {
                  const value = row[columnIndex]

                  if (field.entityMapping) {
                    // Store raw value for error reporting
                    record[`_${field.field}_raw`] = value
                    // Map to entity ID
                    record[field.field] = this.mapToEntityId(value, field)
                  } else {
                    record[field.field] = value
                  }
                }
              }
            })

            record._rowIndex = i + 1
            this.parsedData.push(record)
          }

          this.validateData()
          this.step = "preview"
        }

        fileReader.onerror = () => {
          this.uploadError = "Error reading file"
        }

        fileReader.readAsArrayBuffer(this.excelFile)
      } catch (error) {
        console.error("Error processing Excel data:", error)
        this.uploadError = "Error processing file"
      }
    },

    mapToEntityId(value, field) {
      try {
        const entities = this.getEntitiesForField(field)

        if (!entities || entities.length === 0) {
          console.warn(`No entities found for field mapping: ${field.entityMapping}`)
          return null
        }

        // First try to match by ID if the value is numeric
        if (value !== null && value !== undefined && !isNaN(value)) {
          const numericId = Number(value)
          const entityById = entities.find((e) => e.id === numericId)
          if (entityById) return entityById.id
        }

        // Then try string matching
        const stringValue = value != null ? String(value).toLowerCase() : ""

        if (field.entityMapping === "users") {
          const user = entities.find((u) => {
            try {
              return (
                (u.full_name && typeof u.full_name === "string" && u.full_name.toLowerCase() === stringValue) ||
                (u.name && typeof u.name === "string" && u.name.toLowerCase() === stringValue) ||
                (u.email && typeof u.email === "string" && u.email.toLowerCase() === stringValue)
              )
            } catch (err) {
              console.error("Error comparing user:", u, err)
              return false
            }
          })
          return user ? user.id : null
        } else {
          const entity = entities.find((e) => {
            try {
              return (
                (e.name && typeof e.name === "string" && e.name.toLowerCase() === stringValue) ||
                (e.code && typeof e.code === "string" && String(e.code).toLowerCase() === stringValue)
              )
            } catch (err) {
              console.error("Error comparing entity:", e, "field:", field.entityMapping, err)
              return false
            }
          })
          return entity ? entity.id : null
        }
      } catch (error) {
        console.error("Error in mapToEntityId:", error, "value:", value, "field:", field)
        return null
      }
    },

    validateData() {
      this.validationErrors = []
      let rowValidationErrors = []

      this.parsedData.forEach((record, index) => {
        const rowErrors = []

        this.internalFieldMappings.forEach((field) => {
          if (field.required) {
            if (field.entityMapping) {
              if (!record[field.field]) {
                const rawValue = record[`_${field.field}_raw`]
                const displayValue = rawValue !== undefined && rawValue !== null ? rawValue : "empty value"
                rowErrors.push(`Invalid ${field.label}: ${displayValue}`)
              }
            } else if (!record[field.field]) {
              rowErrors.push(`Missing required field: ${field.label}`)
            }
          }

          // Custom validation
          if (field.validate && typeof field.validate === "function") {
            const validationResult = field.validate(record[field.field])
            if (validationResult !== true && typeof validationResult === "string") {
              rowErrors.push(validationResult)
            }
          }
        })

        if (rowErrors.length > 0) {
          rowValidationErrors.push({
            row: record._rowIndex || index + 1,
            errors: rowErrors
          })
        }
      })

      if (rowValidationErrors.length > 0) {
        this.validationErrors.push(`${rowValidationErrors.length} rows have errors`)

        rowValidationErrors.slice(0, 5).forEach((rowError) => {
          this.validationErrors.push(`Row ${rowError.row}: ${rowError.errors.join(", ")}`)
        })

        if (rowValidationErrors.length > 5) {
          this.validationErrors.push(`...and ${rowValidationErrors.length - 5} more errors`)
        }
      }

      this.isImportButtonDisabled = rowValidationErrors.length === this.parsedData.length && this.parsedData.length > 0
    },

    async importData() {
      if (this.useBulkImport) {
        await this.importDataBulk()
      } else {
        await this.importDataOneByOne()
      }
    },

    async importDataBulk() {
      try {
        this.step = "processing"
        this.importErrors = []
        this.importedCount = 0
        this.processingStatus = `Processing ${this.parsedData.length} records in bulk...`

        // Prepare all records for bulk import
        const recordsToImport = this.parsedData.map((record) => {
          const payload = { ...record }

          // Remove helper properties
          delete payload._rowIndex
          this.internalFieldMappings.forEach((field) => {
            if (field.entityMapping) {
              delete payload[`_${field.field}_raw`]
            }
          })

          // Convert certain fields to strings if needed
          if (payload.code !== undefined && payload.code !== null) {
            payload.code = String(payload.code)
          }

          return payload
        })

        // Call the bulk create method
        const result = await this.apiMethods.bulkCreate(recordsToImport)

        this.importedCount = result.created || recordsToImport.length
        if (result.errors && result.errors.length > 0) {
          this.parseBulkErrors(result.errors)
        }

        // Refresh the data
        await this.apiMethods.fetchAll()

        this.step = "complete"
        this.$emit("import-completed", {
          imported: this.importedCount,
          errors: this.importErrors.length
        })
      } catch (error) {
        const data = error.response?.data
        if (data && data.success === false && Array.isArray(data.errors)) {
          this.importedCount = data.created || 0
          this.parseBulkErrors(data.errors)
          this.step = "complete"
          this.$emit("import-completed", {
            imported: this.importedCount,
            errors: this.importErrors.length
          })
        } else {
          console.error("Error during bulk import:", error)
          this.uploadError = "Bulk import failed"
          this.step = "upload"
        }
      }
    },

    parseBulkErrors(errors) {
      errors.forEach((errorEntry) => {
        // row is 0-based index; +2 accounts for header row and 1-based display
        const excelRow = errorEntry.row + 2
        const fields = errorEntry.fields || {}
        Object.keys(fields).forEach((fieldName) => {
          const messages = Array.isArray(fields[fieldName]) ? fields[fieldName] : [fields[fieldName]]
          messages.forEach((message) => {
            this.importErrors.push({ row: excelRow, message: `${fieldName}: ${message}` })
          })
        })
      })
    },

    async importDataOneByOne() {
      try {
        this.step = "processing"
        this.importErrors = []
        this.importedCount = 0

        for (let i = 0; i < this.parsedData.length; i++) {
          const record = this.parsedData[i]

          this.processingStatus = `Processing record ${i + 1} of ${this.parsedData.length}`

          try {
            const payload = { ...record }

            // Remove helper properties
            delete payload._rowIndex
            this.internalFieldMappings.forEach((field) => {
              if (field.entityMapping) {
                delete payload[`_${field.field}_raw`]
              }
            })

            // Convert certain fields to strings if needed
            if (payload.code !== undefined && payload.code !== null) {
              payload.code = String(payload.code)
            }

            await this.apiMethods.create(payload)
            this.importedCount++

            // Small delay to prevent overwhelming the server
            await new Promise((resolve) => setTimeout(resolve, 100))
          } catch (error) {
            console.error(`Error importing row ${record._rowIndex}:`, error)

            let errorMessage = error.response?.data?.message || error.message || "Unknown error"

            this.importErrors.push({
              row: record._rowIndex,
              message: errorMessage
            })
          }
        }

        // Refresh the data
        await this.apiMethods.fetchAll()

        this.step = "complete"
        this.$emit("import-completed", {
          imported: this.importedCount,
          errors: this.importErrors.length
        })
      } catch (error) {
        console.error("Error during import process:", error)
        this.uploadError = "Import process failed"
        this.step = "upload"
      }
    },

    downloadTemplate() {
      try {
        const wb = XLSX.utils.book_new()

        // Create headers from mapping fields
        const headers = this.internalFieldMappings.map((field) => field.label || field.field)

        // Create example values using actual reference data
        const exampleValues = this.internalFieldMappings.map((field) => {
          if (!field.entityMapping) {
            // Use provided examples or defaults for non-entity fields
            return field.example || this.getDefaultExample(field.field)
          } else {
            // Use actual entity data for entity mapping fields
            const entities = this.getEntitiesForField(field)
            const sampleEntity = entities.length > 0 ? entities[0] : null

            if (sampleEntity) {
              // Return the actual ID from your reference data
              return sampleEntity.id || ""
            } else {
              // Fallback if no entities are loaded
              console.warn(`No reference data found for ${field.entityMapping}`)
              return "1"
            }
          }
        })

        const sampleData = [headers, exampleValues]
        const ws = XLSX.utils.aoa_to_sheet(sampleData)

        // Apply column widths
        const colWidths = headers.map(() => ({ width: 20 }))
        ws["!cols"] = colWidths

        XLSX.utils.book_append_sheet(wb, ws, "Template")
        XLSX.writeFile(wb, this.entityConfig.templateFilename)
      } catch (error) {
        console.error("Error generating template:", error)
        this.$emit("error", "Failed to generate template")
      }
    },

    getDefaultExample(fieldName) {
      const examples = {
        name: "Sample Name",
        code: "CODE001",
        description: "Sample Description",
        date: "2023-01-01",
        identification_date: "2023-01-01"
      }
      return examples[fieldName] || "Sample Value"
    }
  },

  async mounted() {
    await this.fetchReferenceData()
  }
}
</script>

<style scoped>
.v-data-table ::v-deep th {
  white-space: nowrap;
}
</style>
