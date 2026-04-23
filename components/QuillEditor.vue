<template>
  <div>
    <div class="d-flex align-center">
      <v-card-text class="px-0 py-2 font-weight-bold">{{ computedLabel }}:</v-card-text>
      <v-btn v-if="fieldInfoText" icon small class="ml-2" @click="openInfoDialog">
        <v-icon small>mdi-information-outline</v-icon>
      </v-btn>
    </div>
    <div :dir="direction">
      <div v-show="isEditorReady" ref="editor"></div>
    </div>

    <!-- Hidden field for Vuetify form validation integration -->
    <v-text-field
      v-model="validationValue"
      :rules="getRules()"
      style="display: none !important; height: 0; overflow: hidden; position: absolute; left: -9999px"
      tabindex="-1"
      aria-hidden="true"
    ></v-text-field>

    <!-- Error messages display -->
    <div v-if="allErrors.length > 0" class="v-messages theme--light error--text" role="alert">
      <div class="v-messages__wrapper">
        <div class="v-messages__message">{{ $t(allErrors[0]) }}</div>
      </div>
    </div>

    <custom-dialog v-model="showInfoDialog" :title="computedInfoLabel" width="400px">
      <div class="pa-4" v-html="fieldInfoText"></div>
    </custom-dialog>
  </div>
</template>

<script>
import Quill from "quill"
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"
import CustomDialog from "./CustomDialog.vue"

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [{ header: 1 }, { header: 2 }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
  [{ size: ["small", false, "large", "huge"] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ["image"],
  ["clean"]
]

export default {
  name: "QuillEditor",
  components: {
    CustomDialog
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    isRTL: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ""
    },
    fieldInfoText: {
      type: String,
      default: ""
    },
    required: {
      type: Boolean,
      default: false
    },
    errors: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      editor: null,
      content: "",
      isEditorReady: false,
      showInfoDialog: false,
      internalErrors: [],
      validationValue: null, // This will be used by the hidden v-text-field
      hasBeenFocused: true, // Track if user has interacted with the field
      showValidationErrors: true // Control when to show validation errors
    }
  },
  computed: {
    direction() {
      return this.isRTL ? "rtl" : "ltr"
    },
    computedInfoLabel() {
      return this.$t("page.info_for", { itemName: this.label || this.$t("page.note") })
    },
    computedLabel() {
      const baseLabel = this.label || this.$t("page.note")
      return this.required ? `${baseLabel} *` : baseLabel
    },
    allErrors() {
      return [...this.errors, ...this.internalErrors]
    },
    isEmpty() {
      if (!this.content) return true
      // Check if content is only empty HTML tags or whitespace
      const textContent = this.content.replace(/<[^>]*>/g, "").trim()
      return textContent === ""
    }
  },
  mounted() {
    window.requestAnimationFrame(() => {
      this.initializeQuill()
    })
  },
  methods: {
    openInfoDialog() {
      if (this.fieldInfoText) {
        this.showInfoDialog = true
      }
    },
    getRules() {
      const rules = []
      const requiredField = (v) => {
        // Only show validation errors after user interaction
        if (!this.showValidationErrors) return true

        // Check if the content is empty (similar to isEmpty computed property)
        if (!this.content) return this.$t("validation.required")
        const textContent = this.content.replace(/<[^>]*>/g, "").trim()
        return textContent !== "" || this.$t("validation.required")
      }

      if (this.required) {
        rules.push(requiredField)
      }

      return rules
    },
    updateValidationValue() {
      // Update the validation value to trigger Vuetify's form validation
      // Use a simple text representation for validation
      if (!this.content) {
        this.validationValue = ""
      } else {
        const textContent = this.content.replace(/<[^>]*>/g, "").trim()
        this.validationValue = textContent
      }

      // Force validation update
      this.$nextTick(() => {
        // Trigger validation update by updating the validationValue
        const temp = this.validationValue
        this.validationValue = ""
        this.$nextTick(() => {
          this.validationValue = temp
        })
      })
    },
    onFocus() {
      this.hasBeenFocused = true
      this.clearErrors()
    },
    onBlur() {
      if (this.hasBeenFocused) {
        this.showValidationErrors = true
        this.updateValidationValue()
      }
    },
    clearErrors() {
      this.$emit("clear-errors")
      this.internalErrors = []
      this.showValidationErrors = false
    },
    initializeQuill() {
      const options = {
        modules: {
          toolbar: toolbarOptions,
          history: {
            userOnly: true
          }
        },
        theme: "snow",
        formats: [
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "code-block",
          "header",
          "list",
          "script",
          "indent",
          "direction",
          "size",
          "color",
          "background",
          "font",
          "align",
          "image"
        ],
        placeholder: "",
        bounds: document.body
      }

      this.editor = new Quill(this.$refs.editor, options)

      if (this.value) {
        this.editor.root.innerHTML = this.value
      }

      this.editor.on("text-change", (delta, oldContents, source) => {
        if (source === "user") {
          this.content = this.editor.root.innerHTML
          this.$emit("input", this.content)
          this.validateInput()

          // Show validation errors if user has typed and then deleted content
          if (this.hasBeenFocused) {
            this.showValidationErrors = true
          }

          this.updateValidationValue() // Update validation value for Vuetify
        }
      })

      // Add focus and blur event listeners
      this.editor.root.addEventListener("focus", this.onFocus)
      this.editor.root.addEventListener("blur", this.onBlur)

      // Set initial content for validation
      this.content = this.value || ""
      this.updateValidationValue() // Initial validation value setup

      setTimeout(() => {
        this.setTextDirection()
        this.isEditorReady = true
        this.validateInput() // Initial validation
      }, 0)
    },
    setTextDirection() {
      if (this.editor) {
        this.editor.format("direction", this.isRTL ? "rtl" : "ltr")
        this.editor.format("align", this.isRTL ? "right" : "left")
      }
    },
    validateInput() {
      this.internalErrors = []

      // Only show internal errors after user interaction
      if (this.showValidationErrors && this.required && this.isEmpty) {
        this.internalErrors.push("validation.required")
      }

      this.$emit("update:errors", this.allErrors)
    },
    clearErrors() {
      this.$emit("clear-errors")
      this.internalErrors = []
      this.showValidationErrors = false
    }
  },
  watch: {
    value(newVal) {
      if (this.editor && newVal !== this.content) {
        this.editor.root.innerHTML = newVal || ""
        this.content = newVal || ""
        this.validateInput()
        this.updateValidationValue()
      }
    },
    isRTL() {
      this.setTextDirection()
    }
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.off("text-change")
      // Clean up event listeners
      if (this.editor.root) {
        this.editor.root.removeEventListener("focus", this.onFocus)
        this.editor.root.removeEventListener("blur", this.onBlur)
      }
    }
  }
}
</script>

<style>
.ql-editor {
  min-height: 200px;
}

.ql-container {
  border: 1px solid #ccc;
  border-top: 0;
}

.ql-toolbar {
  border: 1px solid #ccc;
}

/* Error state styling */
.ql-error .ql-container {
  border-color: #ff5252 !important;
}

.ql-error .ql-toolbar {
  border-color: #ff5252 !important;
}

[dir="rtl"] .ql-editor {
  text-align: right;
}

[dir="rtl"] .ql-editor li:not(.ql-direction-rtl)::before {
  margin-left: 0.3em;
  margin-right: -1.5em;
  text-align: left;
}

[dir="rtl"] .ql-editor li.ql-direction-rtl::before {
  margin-left: -1.5em;
  margin-right: 0.3em;
  text-align: right;
}

/* Vuetify-style error messages */
.v-messages {
  flex: 1 1 auto;
  font-size: 12px;
  min-height: 14px;
  min-width: 1px;
  position: relative;
}

.v-messages__wrapper {
  overflow: hidden;
}

.v-messages__message {
  line-height: 12px;
  word-break: break-word;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.error--text .v-messages__message {
  color: #ff5252;
}
</style>
