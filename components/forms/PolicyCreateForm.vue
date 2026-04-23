<template>
  <div :class="{ 'px-8': !editForm }" :style="{ width: editForm ? '100%' : '70%', margin: 'auto' }">
    <form-wrapper :submitText="$t('form.save')" :loading="isSubmitting" @submit="handleSubmit">
      <v-card-text>
        <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
        <v-alert v-if="error" type="error" dismissible>
          {{ error }}
        </v-alert>
        <v-row>
          <v-col>
            <custom-input
              v-model="name"
              :label="$t('form.name')"
              :required="true"
              :field-info-text="$t('field_info.policy_name')"
            />
            <custom-input
              v-model="code"
              :label="$t('form.code')"
              :required="true"
              :field-info-text="$t('field_info.policy_id')"
            />
            <custom-input
              v-model="version"
              :label="$t('table.version')"
              :required="true"
              :field-info-text="$t('field_info.policy_version')"
            />
            <custom-input
              type="date"
              v-model="date"
              :label="$t('table.effictive_date')"
              :required="true"
              :field-info-text="$t('field_info.policy_effictive_date')"
            />
            <custom-dropdown
              :items="users"
              item-value="id"
              item-text="full_name"
              :label="$t('table.owner')"
              v-model="policy_owner_id"
              :required="true"
              :field-info-text="$t('field_info.policy_owner')"
            />
            <custom-dropdown
              :items="users"
              item-value="id"
              item-text="full_name"
              :label="$t('table.approver')"
              v-model="policy_approver_id"
              :required="true"
              :field-info-text="$t('field_info.policy_approver')"
            />
          </v-col>
          <v-col>
            <custom-dropdown
              :items="policyCategories"
              item-value="id"
              item-text="name"
              :label="$t('page.category')"
              v-model="policyCategory"
              :required="true"
              :field-info-text="$t('field_info.policy_category')"
            />
            <custom-dropdown
              :items="policyUsages"
              item-value="id"
              item-text="name"
              :label="$t('table.usage')"
              v-model="policyUsage"
              :required="true"
              :field-info-text="$t('field_info.policy_usage')"
            />
            <custom-dropdown
              :items="this.policyStatuses"
              item-value="id"
              item-text="name"
              :label="$t('table.status')"
              v-model="policyStatus"
              :required="true"
              :field-info-text="$t('field_info.policy_status')"
            />
            <!-- <custom-dropdown
              :items="policyDisciplines"
              item-value="id"
              item-text="name"
              :label="$t('table.discipline')"
              v-model="policyDiscipline"
              :required="true"
              :field-info-text="$t('field_info.policy_discipline')"
            /> -->
            <!-- <custom-dropdown
              :items="users"
              item-value="id"
              item-text="full_name"
              :label="$t('table.reviewer')"
              v-model="policy_reviewer_id"
              :required="true"
              :field-info-text="$t('field_info.policy_reviewer')"
            /> -->
            <user-selector
              v-model="selected_reviewers"
              :label="$t('table.reviewers')"
              :available-users="users"
              :required="true"
              :field-info-text="$t('field_info.policy_reviewer')"
            />
            <custom-input
              type="date"
              v-model="valid_until"
              :label="$t('form.valid_until')"
              :required="true"
              :field-info-text="$t('field_info.policy_valid_until')"
            />
            <!-- <v-btn
              :loading="false"
              :disabled="false"
              @click="openUnitDialog"
              color="primary"
              prepend-icon="mdi-file-document-outline"
            >
              {{ $t("form.select_units") }}
            </v-btn> -->
          </v-col>
        </v-row>
        <!-- Hidden file input -->
        <div class="mb-4 w-100">
          <input type="file" ref="fileInput" accept=".docx,.doc" @change="handleFileChange" style="display: none" />
          <!-- Vuetify button -->
          <v-btn
            :loading="processing"
            :disabled="processing"
            @click="$refs.fileInput.click()"
            color="primary"
            prepend-icon="mdi-file-document-outline"
          >
            {{ $t("form.use_template") }}
          </v-btn>
          <text-editor v-model="details" :min-height="400" outlined />
          <!-- <quill-editor
            v-model="details"
            :label="$t('table.details')"
            :field-info-text="$t('field_info.policy_details')"
            :required="true"
          /> -->
        </div>
      </v-card-text>
    </form-wrapper>

    <!-- Units selection Dialog -->
    <custom-dialog v-model="showUnitDialog" :title="$t('page.units')" width="580px">
      <UnitsTreeSelection
        :items="units"
        @selection-change="handleSelectionChange"
        @send-selected="handleSendSelected"
      />
    </custom-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import mammoth from "mammoth"
import UnitsTreeSelection from "../UnitsTreeSelection.vue"
import UserSelector from "@/components/UserSelector.vue"
import TextEditor from "../TextEditor.vue"

export default {
  name: "PolicyCreateForm",
  components: {
    UnitsTreeSelection,
    UserSelector,
    TextEditor
  },

  props: {
    editForm: {
      type: Boolean,
      default: false
    },
    item: { type: Object, default: null },
    itemId: { type: Number }
  },

  data() {
    return {
      name: "",
      code: "",
      version: "",
      date: "",
      details: "",
      targeted_units_ids: [],
      policy_owner_id: "",
      policy_approver_id: "",
      selected_reviewers: [],
      valid_until: "",
      policyCategory: null,
      policyUsage: "",
      policyStatus: "",
      policyDiscipline: "",
      selectedFile: null,
      isSubmitting: false,
      loading: false,
      processing: false,
      error: null,
      showUnitDialog: false
    }
  },

  watch: {
    policyCategory: {
      handler(newCategoryId) {
        // Only auto-generate for new policies, not when editing
        if (newCategoryId) {
          const selectedCategory = this.categories.find((cat) => cat.id === newCategoryId)
          if (selectedCategory && selectedCategory.code) {
            // Get first 3 characters of category code
            const prefix = selectedCategory.code.substring(0, 3).toUpperCase()
            const nextNumber = this.getNextNumber(prefix)
            this.code = `${prefix}/${nextNumber}`
          }
        }
      },
      immediate: false
    }
  },

  methods: {
    ...mapActions("policy", [
      "createPolicy",
      "updatePolicy",
      "fetchPolicies",
      "fetchCategories",
      "fetchUsages",
      "fetchStatuses",
      "fetchDisciplines",
      "uploadTemplate"
    ]),
    ...mapActions("users", ["fetchUsers"]),
    ...mapActions("positions", ["fetchUnits"]),
    ...mapActions("drawer", ["closeDrawer"]),

    getNextNumber(prefix) {
      // Filter policies that have codes starting with the prefix
      const existingCodes = this.policies
        .map((policy) => policy.code)
        .filter((code) => code && code.startsWith(`${prefix}/`))

      let maxNumber = 0

      existingCodes.forEach((code) => {
        // Extract the number part after the "/"
        const parts = code.split("/")
        if (parts.length === 2) {
          const numberPart = parts[1]
          const number = parseInt(numberPart, 10)
          if (!isNaN(number)) {
            maxNumber = Math.max(maxNumber, number)
          }
        }
      })

      // Increment and pad with zeros to 3 digits
      const nextNumber = (maxNumber + 1).toString().padStart(3, "0")
      return nextNumber
    },
    handleChange(data) {
      console.log("Content changed:", data)
    },
    onEditorReady(editor) {
      console.log("Editor is ready!", editor)
    },
    async saveContent() {
      const data = await this.$refs.editor.save()
      console.log("Saved:", data)
    },
    clearEditor() {
      this.$refs.editor.clear()
    },

    async fetchLookups() {
      try {
        await this.fetchUnits()
        await this.fetchCategories()
        await this.fetchUsages()
        await this.fetchStatuses()
        await this.fetchDisciplines()
        await this.fetchPolicies() // Make sure to fetch policies for code generation
      } catch (error) {
        this.error = error
      }
    },

    async handleSubmit() {
      this.isLoading = true
      this.error = null
      this.isSubmitting = true

      const data = {
        name: this.name,
        code: this.code,
        version: this.version,
        date: this.date,
        details: JSON.stringify(this.details),
        policy_category_id: this.policyCategory,
        policy_usage_id: this.policyUsage,
        policy_status_id: this.policyStatus,
        policy_descipline_id: this.policyDiscipline,
        policy_owner_id: this.policy_owner_id,
        policy_approver_id: this.policy_approver_id,
        selected_reviewers: this.selected_reviewers,
        valid_until: this.valid_until
      }
      if (this.editForm) {
        await this.updatePolicy({ id: this.itemId, payload: data })
      } else {
        await this.createPolicy(data)
      }
      this.closeDrawer()
      this.isLoading = false
      this.isSubmitting = false
    },

    async loadPolicyData() {
      if (this.editForm) {
        const policy = this.policies.find((policy) => policy.id === this.itemId)

        if (policy) {
          this.name = policy.name
          this.code = policy.code
          this.version = policy.version
          this.date = new Date(policy.date).toISOString().split("T")[0] // Remove time from policy.date
          this.details = policy.details
          this.policyCategory = policy.category.id
          this.policyUsage = policy.usage.id
          this.policyStatus = policy.status.id
          this.policy_owner_id = policy.owner.id
          this.policy_approver_id = policy.approver.id
          this.selected_reviewers = policy.reviewers.map((reviewer) => reviewer.id)
          this.valid_until = new Date(policy.valid_until).toISOString().split("T")[0] // Remove time from policy.valid_until
        }
      }
    },

    openUnitDialog() {
      this.showUnitDialog = true
    },

    // async handleFileChange(event) {
    //   const file = event.target.files[0]
    //   if (!file) return

    //   this.processing = true
    //   try {
    //     let content = ""

    //     // Check file type
    //     const fileType = file.type
    //     if (fileType !== "application/msword" || file.name.toLowerCase().endsWith(".docx")) {
    //       // Handle .doc files with mammoth
    //       const arrayBuffer = await file.arrayBuffer()
    //       const result = await mammoth.convertToHtml({
    //         arrayBuffer,
    //         convertImage: mammoth.images.imgElement((image) => {
    //           return image.read("base64").then((imageBuffer) => ({
    //             src: `data:${image.contentType};base64,${imageBuffer}`
    //           }))
    //         }),
    //         ignoreEmptyParagraphs: false,
    //         preserveNumbering: true,
    //         styleMap: [
    //           "table => table.ql-table",
    //           "tr => tr.ql-table-row",
    //           "td => td.ql-table-cell",
    //           "th => th",
    //           "p[style-name='Heading 1'] => h1:fresh",
    //           "p[style-name='Heading 2'] => h2:fresh",
    //           "b => strong",
    //           "i => em",
    //           "u => u",
    //           "strike => s",
    //           "p[style-name='Quote'] => blockquote:fresh",
    //           "code => pre:fresh"
    //         ]
    //       })
    //       content = result.value
    //     } else {
    //       // Handle .docx files with DOMParser
    //       const text = await file.text()
    //       const parser = new DOMParser()
    //       const doc = parser.parseFromString(text, "text/html")
    //       content = doc.body.innerHTML
    //     }

    //     // Apply common cleanup
    //     this.details = content.replace(/<table/g, '<table class="ql-table"')
    //   } catch (error) {
    //     console.error("Error converting document:", error)
    //   } finally {
    //     this.processing = false
    //     this.$refs.fileInput.value = ""
    //   }
    // },
    async handleFileChange(event) {
      const file = event.target.files[0]
      if (!file) return

      this.processing = true

      try {
        // Only import mammoth on client-side
        const mammoth = (await import("mammoth")).default

        // Read the file as ArrayBuffer
        const arrayBuffer = await this.readFileAsArrayBuffer(file)

        // Extract document structure including headers/footers
        const JSZip = (await import("jszip")).default
        const zip = await JSZip.loadAsync(arrayBuffer)

        // Try to extract headers and footers from the document
        let headerContent = ""
        let footerContent = ""

        try {
          // Check for header files
          const headerFiles = Object.keys(zip.files).filter((name) => name.includes("header"))
          for (const headerFile of headerFiles) {
            const content = await zip.file(headerFile).async("string")
            headerContent += this.extractTextFromXml(content)
          }

          // Check for footer files
          const footerFiles = Object.keys(zip.files).filter((name) => name.includes("footer"))
          for (const footerFile of footerFiles) {
            const content = await zip.file(footerFile).async("string")
            footerContent += this.extractTextFromXml(content)
          }
        } catch (error) {
          console.log("Could not extract headers/footers:", error)
        }

        // Convert .docx to HTML with images
        const result = await mammoth.convertToHtml(
          { arrayBuffer },
          {
            convertImage: mammoth.images.imgElement(function (image) {
              return image.read("base64").then(function (imageBuffer) {
                return {
                  src: "data:" + image.contentType + ";base64," + imageBuffer
                }
              })
            })
          }
        )
        const html = result.value

        // Convert HTML to Editor.js blocks
        const editorData = this.convertHtmlToEditorJs(html, headerContent, footerContent)

        // Set the editor data
        this.details = editorData

        // Show success message
        // this.$toast?.success("Document imported successfully")
      } catch (error) {
        console.error("Error importing document:", error)
        // this.$toast?.error("Failed to import document")
      } finally {
        this.processing = false
        // Reset file input
        this.$refs.fileInput.value = ""
      }
    },

    readFileAsArrayBuffer(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
      })
    },

    extractTextFromXml(xml) {
      // Extract text from Word XML format
      const textMatches = xml.match(/<w:t[^>]*>([^<]*)<\/w:t>/g)
      if (!textMatches) return ""

      return textMatches
        .map((match) => {
          const text = match.replace(/<[^>]*>/g, "")
          return text
        })
        .join(" ")
        .trim()
    },

    convertHtmlToEditorJs(html, headerContent = "", footerContent = "") {
      // Parse HTML string
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")
      const blocks = []

      // Add header if exists
      if (headerContent) {
        blocks.push({
          type: "warning",
          data: {
            title: "Document Header",
            message: headerContent
          }
        })
        blocks.push({
          type: "delimiter",
          data: {}
        })
      }

      // Get all elements from body
      const elements = doc.body.children

      for (let element of elements) {
        const tagName = element.tagName.toLowerCase()

        // Check if element contains images
        const images = element.querySelectorAll("img")
        if (images.length > 0 && tagName !== "img") {
          // Extract images first
          images.forEach((img) => {
            const src = img.getAttribute("src")
            const alt = img.getAttribute("alt") || ""

            if (src) {
              blocks.push({
                type: "image",
                data: {
                  file: {
                    url: src
                  },
                  caption: alt,
                  withBorder: false,
                  stretched: false,
                  withBackground: false
                }
              })
            }
          })

          // Remove images from element for text processing
          images.forEach((img) => img.remove())
        }

        const text = element.textContent.trim()

        if (!text && tagName !== "img" && tagName !== "hr") continue // Skip empty elements

        // Handle different HTML elements
        if (tagName.match(/^h[1-6]$/)) {
          // Headers
          const level = parseInt(tagName.charAt(1))
          blocks.push({
            type: "header",
            data: {
              text: text,
              level: level
            }
          })
        } else if (tagName === "ul") {
          // Unordered lists
          const items = Array.from(element.querySelectorAll("li")).map((li) => li.textContent.trim())
          blocks.push({
            type: "list",
            data: {
              style: "unordered",
              items: items
            }
          })
        } else if (tagName === "ol") {
          // Ordered lists
          const items = Array.from(element.querySelectorAll("li")).map((li) => li.textContent.trim())
          blocks.push({
            type: "list",
            data: {
              style: "ordered",
              items: items
            }
          })
        } else if (tagName === "blockquote") {
          // Quotes
          blocks.push({
            type: "quote",
            data: {
              text: text,
              caption: "",
              alignment: "left"
            }
          })
        } else if (tagName === "pre" || tagName === "code") {
          // Code blocks
          blocks.push({
            type: "code",
            data: {
              code: text
            }
          })
        } else if (tagName === "table") {
          // Tables
          try {
            const rows = Array.from(element.querySelectorAll("tr"))
            const hasHeader = element.querySelector("thead") !== null || element.querySelector("th") !== null

            // Extract table data
            const content = rows.map((row) => {
              const cells = Array.from(row.querySelectorAll("td, th"))
              return cells.map((cell) => cell.textContent.trim() || "")
            })

            // Filter out empty rows
            const filteredContent = content.filter((row) => row.some((cell) => cell.length > 0))

            if (filteredContent.length > 0) {
              // Ensure all rows have the same number of columns
              const maxCols = Math.max(...filteredContent.map((row) => row.length))
              const normalizedContent = filteredContent.map((row) => {
                while (row.length < maxCols) {
                  row.push("")
                }
                return row
              })

              // Validate table has at least 2 rows and 2 columns
              if (normalizedContent.length >= 1 && maxCols >= 1) {
                blocks.push({
                  type: "table",
                  data: {
                    withHeadings: hasHeader,
                    content: normalizedContent
                  }
                })
              }
            }
          } catch (tableError) {
            console.warn("Failed to parse table, using raw HTML:", tableError)
            // Fallback: use raw HTML block
            blocks.push({
              type: "raw",
              data: {
                html: element.outerHTML
              }
            })
          }
        } else if (tagName === "img") {
          // Images
          const src = element.getAttribute("src")
          const alt = element.getAttribute("alt") || ""

          blocks.push({
            type: "image",
            data: {
              file: {
                url: src
              },
              caption: alt,
              withBorder: false,
              stretched: false,
              withBackground: false
            }
          })
        } else if (tagName === "hr") {
          // Delimiter
          blocks.push({
            type: "delimiter",
            data: {}
          })
        } else {
          // Default paragraph with formatting
          const innerHTML = element.innerHTML
          blocks.push({
            type: "paragraph",
            data: {
              text: innerHTML
            }
          })
        }
      }

      // Add footer if exists
      if (footerContent) {
        blocks.push({
          type: "delimiter",
          data: {}
        })
        blocks.push({
          type: "warning",
          data: {
            title: "Document Footer",
            message: footerContent
          }
        })
      }

      return {
        time: new Date().getTime(),
        blocks: blocks,
        version: "2.28.0"
      }
    },

    handleSelectionChange(selectedIds) {
      console.log("Selection changed:", selectedIds)
      this.targeted_units_ids = selectedIds
    },

    handleSendSelected(selectedIds) {
      console.log("Sending selected ids:", selectedIds)
      this.targeted_units_ids = selectedIds
    }
  },

  computed: {
    ...mapState("policy", ["policies", "categories", "usages", "statuses", "disciplines", "documents"]),
    ...mapState("users", ["users"]),
    ...mapState("positions", ["units"]),

    policyStatuses() {
      return this.statuses.map((status) => ({ id: status.id, name: status.name }))
    },

    policyCategories() {
      return this.categories.map((category) => ({ id: category.id, name: category.name }))
    },

    policyUsages() {
      return this.usages.map((usage) => ({ id: usage.id, name: usage.name }))
    },

    policyDisciplines() {
      return this.disciplines.map((discipline) => ({
        id: discipline.id,
        name: discipline.name
      }))
    }
  },

  mounted() {
    this.fetchLookups()
    this.fetchUsers()
    if (this.editForm) {
      this.loadPolicyData()
    }
  }
}
</script>
