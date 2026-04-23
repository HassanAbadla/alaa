<template>
  <div>
    <!-- Preview Thumbnail -->
    <div @click="togglePreview" style="cursor: pointer">
      <v-img v-if="isImage" :src="file.path" contain :height="size" :width="size"></v-img>
      <v-icon v-else :size="size" :color="iconColor">
        {{ fileIcon }}
      </v-icon>
    </div>

    <!-- Preview Dialog -->
    <custom-dialog v-model="previewDialog" :title="file.name" width="700px">
      <v-card flat>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12">
              <v-sheet class="d-flex justify-center align-center" height="70vh" color="grey lighten-3">
                <!-- Image Preview -->
                <v-img
                  v-if="isImage"
                  :src="file.path"
                  contain
                  max-height="100%"
                  max-width="100%"
                  @error="handlePreviewError"
                ></v-img>

                <!-- Word Document Preview (Client-Side Rendering) -->
                <div v-else-if="isWordDocument" class="position-relative" style="width: 100%; height: 100%">
                  <div
                    ref="wordPreview"
                    class="word-preview pa-4"
                    style="width: 100%; height: 100%; overflow-y: auto; background: white"
                    v-html="renderedWordContent"
                  ></div>

                  <!-- Loading overlay -->
                  <v-overlay :value="isLoading" absolute>
                    <v-progress-circular indeterminate size="64"></v-progress-circular>
                  </v-overlay>

                  <!-- Error message -->
                  <v-alert
                    v-if="error"
                    type="error"
                    class="ma-4 position-absolute"
                    style="top: 0; left: 0; right: 0; z-index: 1"
                  >
                    {{ error }}
                    <v-btn text small color="white" class="ml-2" @click="downloadFile">
                      {{ $t("page.download_instead") }}
                    </v-btn>
                  </v-alert>
                </div>

                <!-- Excel Document Preview (Client-Side Rendering) -->
                <div v-else-if="isExcelDocument" class="position-relative" style="width: 100%; height: 100%">
                  <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: white">
                    <!-- Sheet Tabs -->
                    <v-tabs
                      v-if="excelSheets.length > 0"
                      v-model="activeSheetIndex"
                      background-color="grey lighten-4"
                      height="48"
                      show-arrows
                    >
                      <v-tab v-for="(sheet, index) in excelSheets" :key="index">
                        {{ sheet.name }}
                      </v-tab>
                    </v-tabs>

                    <!-- Sheet Content -->
                    <div style="overflow-y: auto; overflow-x: auto; padding: 16px; min-height: 0">
                      <div v-if="excelSheets.length > 0 && excelSheets[activeSheetIndex]">
                        <!-- Row limit warning -->
                        <v-alert v-if="excelSheets[activeSheetIndex].rowsLimited" type="info" dense class="mb-4">
                          {{
                            $t("page.excel_preview_showing_rows", {
                              displayedRows: excelSheets[activeSheetIndex].displayedRows,
                              totalRows: excelSheets[activeSheetIndex].totalRows
                            })
                          }}
                        </v-alert>

                        <!-- Excel table -->
                        <div class="excel-preview" v-html="excelSheets[activeSheetIndex].html"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Loading overlay -->
                  <v-overlay :value="isLoading" absolute>
                    <v-progress-circular indeterminate size="64"></v-progress-circular>
                  </v-overlay>

                  <!-- Error message -->
                  <v-alert
                    v-if="error"
                    type="error"
                    class="ma-4 position-absolute"
                    style="top: 0; left: 0; right: 0; z-index: 1"
                  >
                    {{ error }}
                    <v-btn text small color="white" class="ml-2" @click="downloadFile">
                      {{ $t("page.download_instead") }}
                    </v-btn>
                  </v-alert>
                </div>

                <!-- Default Document Preview (PDF, etc.) -->
                <iframe
                  v-else
                  :src="file.path"
                  width="100%"
                  height="100%"
                  frameborder="0"
                  @load="handleIframeLoad"
                  @error="handlePreviewError"
                ></iframe>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card-text>

        <!-- Dialog Actions -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="previewDialog = false">{{ $t("page.close") }}</v-btn>
          <v-btn text color="primary" @click="downloadFile">{{ $t("page.download") }}</v-btn>
        </v-card-actions>
      </v-card>
    </custom-dialog>
  </div>
</template>

<script>
import mammoth from "mammoth"
import * as XLSX from "xlsx"

export default {
  name: "FilePreview",

  props: {
    file: {
      type: Object,
      required: true,
      validator: (value) => {
        return value.hasOwnProperty("path") && value.hasOwnProperty("name")
      }
    },
    size: {
      type: [Number, String],
      default: 64
    },
    isEvidence: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      previewDialog: false,
      isLoading: false,
      error: null,
      previewTimeout: null,
      renderedWordContent: "", // stores rendered HTML from Word doc
      excelSheets: [], // stores parsed Excel sheets data
      activeSheetIndex: 0 // active tab index for Excel preview
    }
  },

  computed: {
    isImage() {
      const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"]
      const extension = this.getFileExtension()
      return imageExtensions.includes(extension)
    },

    isWordDocument() {
      const wordExtensions = ["doc", "docx"]
      const extension = this.getFileExtension()
      return wordExtensions.includes(extension)
    },

    isExcelDocument() {
      const excelExtensions = ["xls", "xlsx"]
      const extension = this.getFileExtension()
      return excelExtensions.includes(extension)
    },

    fileIcon() {
      const extension = this.getFileExtension()
      switch (extension) {
        case "pdf":
          return "mdi-file-pdf-box"
        case "doc":
        case "docx":
          return "mdi-file-word"
        case "xls":
        case "xlsx":
          return "mdi-file-excel"
        case "ppt":
        case "pptx":
          return "mdi-file-powerpoint"
        case "dwg":
        case "dxf":
          return "mdi-file-cad"
        case "rvt":
          return "mdi-vector-square-plus"
        default:
          return "mdi-file-document-outline"
      }
    },

    iconColor() {
      const extension = this.getFileExtension()
      switch (extension) {
        case "pdf":
          return "red"
        case "doc":
        case "docx":
          return "blue"
        case "xls":
        case "xlsx":
          return "green"
        case "ppt":
        case "pptx":
          return "orange"
        case "dwg":
        case "dxf":
          return "red"
        default:
          return "grey"
      }
    }
  },

  methods: {
    getFileExtension() {
      return !this.isEvidence
        ? this.file.name.split(".").pop().toLowerCase()
        : this.file.path.split(".").pop().toLowerCase()
    },

    async togglePreview() {
      this.previewDialog = true

      // Handle Word documents with client-side rendering
      if (this.isWordDocument) {
        await this.renderWordDocument()
      }

      // Handle Excel documents with client-side rendering
      if (this.isExcelDocument) {
        await this.renderExcelDocument()
      }
    },

    // Render Word document using mammoth.js
    async renderWordDocument() {
      this.isLoading = true
      this.error = null
      this.renderedWordContent = ""

      try {
        // Use the axios baseURL to construct the proxy endpoint URL
        const baseURL = this.$axios.defaults.baseURL
        const proxyUrl = `${baseURL}/proxy-docx?url=${encodeURIComponent(this.file.path)}`

        const response = await fetch(proxyUrl)

        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.statusText}`)
        }

        const arrayBuffer = await response.arrayBuffer()

        // Convert to HTML using mammoth
        const result = await mammoth.convertToHtml({ arrayBuffer })
        this.renderedWordContent = result.value

        // Log any messages (warnings, etc.)
        if (result.messages.length > 0) {
          console.warn("Mammoth conversion messages:", result.messages)
        }
      } catch (error) {
        console.error("Error rendering Word document:", error)
        this.error =
          this.$t("page.download_instead_message") || "Unable to preview this document. Please download it instead."
      } finally {
        this.isLoading = false
      }
    },

    // Render Excel document using SheetJS
    async renderExcelDocument() {
      this.isLoading = true
      this.error = null
      this.excelSheets = []
      this.activeSheetIndex = 0

      try {
        const baseURL = this.$axios.defaults.baseURL
        const proxyUrl = `${baseURL}/proxy-docx?url=${encodeURIComponent(this.file.path)}`
        const response = await fetch(proxyUrl)

        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.statusText}`)
        }

        const arrayBuffer = await response.arrayBuffer()

        // Parse the Excel file
        const workbook = XLSX.read(arrayBuffer, { type: "array", cellStyles: true })

        const MAX_ROWS = 1000

        // Process each sheet
        this.excelSheets = workbook.SheetNames.map((sheetName) => {
          const worksheet = workbook.Sheets[sheetName]

          // Get the range of the sheet
          const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1")
          const totalRows = range.e.r + 1

          // Limit rows if needed
          let limitedWorksheet = worksheet
          let rowsLimited = false

          if (totalRows > MAX_ROWS) {
            rowsLimited = true
            // Create a new limited range
            const limitedRange = {
              s: range.s,
              e: { r: MAX_ROWS - 1, c: range.e.c }
            }
            limitedWorksheet = {}
            limitedWorksheet["!ref"] = XLSX.utils.encode_range(limitedRange)

            // Copy cells within the limited range
            for (let R = limitedRange.s.r; R <= limitedRange.e.r; ++R) {
              for (let C = limitedRange.s.c; C <= limitedRange.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
                if (worksheet[cellAddress]) {
                  limitedWorksheet[cellAddress] = worksheet[cellAddress]
                }
              }
            }

            // Copy column widths if they exist
            if (worksheet["!cols"]) {
              limitedWorksheet["!cols"] = worksheet["!cols"]
            }
          }

          // Convert to HTML with styling
          const html = XLSX.utils.sheet_to_html(limitedWorksheet, { editable: false })

          return {
            name: sheetName,
            html: html,
            totalRows: totalRows,
            displayedRows: rowsLimited ? MAX_ROWS : totalRows,
            rowsLimited: rowsLimited
          }
        })
      } catch (error) {
        console.error("Error rendering Excel document:", error)
        this.error =
          this.$t("page.download_instead_message") || "Unable to preview this document. Please download it instead."
      } finally {
        this.isLoading = false
      }
    },

    handleIframeLoad() {
      this.isLoading = false
      this.error = null
      if (this.previewTimeout) {
        clearTimeout(this.previewTimeout)
        this.previewTimeout = null
      }
    },

    handlePreviewError(error) {
      this.isLoading = false
      this.error = this.$t("page.download_instead_message") || "Unable to preview this document."
      console.error("Preview error:", error)
      if (this.previewTimeout) {
        clearTimeout(this.previewTimeout)
        this.previewTimeout = null
      }
    },

    downloadFile() {
      if (this.file.path) {
        window.open(this.file.path, "_blank")
      }
    }
  },

  beforeDestroy() {
    if (this.previewTimeout) {
      clearTimeout(this.previewTimeout)
    }
  }
}
</script>
<style scoped>
.position-absolute {
  position: absolute;
}

.v-alert {
  margin-bottom: 0 !important;
}

/* Word document styling */
.word-preview {
  font-family: "Calibri", "Arial", sans-serif;
  line-height: 1.6;
  text-align: left;
}

.word-preview >>> p {
  margin-bottom: 1em;
}

.word-preview >>> h1,
.word-preview >>> h2,
.word-preview >>> h3,
.word-preview >>> h4,
.word-preview >>> h5,
.word-preview >>> h6 {
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-weight: bold;
}

.word-preview >>> h1 {
  font-size: 2em;
}

.word-preview >>> h2 {
  font-size: 1.5em;
}

.word-preview >>> h3 {
  font-size: 1.17em;
}

.word-preview >>> table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.word-preview >>> td,
.word-preview >>> th {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.word-preview >>> th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.word-preview >>> tr:nth-child(even) {
  background-color: #f9f9f9;
}

.word-preview >>> ul,
.word-preview >>> ol {
  margin: 1em 0;
  padding-left: 2em;
}

.word-preview >>> li {
  margin-bottom: 0.5em;
}

.word-preview >>> img {
  max-width: 100%;
  height: auto;
}

.word-preview >>> strong,
.word-preview >>> b {
  font-weight: bold;
}

.word-preview >>> em,
.word-preview >>> i {
  font-style: italic;
}

.word-preview >>> u {
  text-decoration: underline;
}

/* Excel document styling */
.excel-preview {
  overflow-x: auto;
  font-family: "Calibri", "Arial", sans-serif;
}

.excel-preview >>> table {
  border-collapse: collapse;
  font-size: 13px;
  width: auto;
  min-width: 100%;
}

.excel-preview >>> td,
.excel-preview >>> th {
  border: 1px solid #d0d0d0;
  padding: 4px 8px;
  text-align: left;
  white-space: nowrap;
  min-width: 50px;
}

.excel-preview >>> th {
  background-color: #f0f0f0;
  font-weight: bold;
  text-align: center;
}

.excel-preview >>> tr:hover {
  background-color: #f5f5f5;
}
</style>
