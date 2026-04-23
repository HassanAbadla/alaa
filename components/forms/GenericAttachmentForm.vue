<!-- components/forms/GenericAttachmentForm.vue -->
<template>
  <form-wrapper @submit="addAttachment" :loading="loading">
    <!-- Note field -->
    <quill-editor v-model="formData.note" :label="$t('table.note')" class="mb-4" />

    <!-- File input -->
    <v-file-input
      v-model="formData.file"
      :label="$t('form.file')"
      outlined
      dense
      :rules="fileRules"
      @change="handleFileChange"
    />

    <!-- Optional: Additional fields can be passed via slot -->
    <slot name="additional-fields" :formData="formData"></slot>
  </form-wrapper>
</template>

<script>
import QuillEditor from "../QuillEditor.vue"

export default {
  name: "GenericAttachmentForm",
  components: { QuillEditor },

  props: {
    // Required props
    itemId: {
      type: Number,
      required: true
    },
    parentIdField: {
      type: String,
      required: true
      // e.g., 'bcm_threats_id', 'bcm_risks_id'
    },
    storeName: {
      type: String,
      required: true
      // e.g., 'threatAttachments', 'riskAttachments'
    },

    // Optional props for customization
    maxFileSize: {
      type: Number,
      default: 10 * 1024 * 1024 // 10MB
    },
    allowedTypes: {
      type: Array,
      default: () => [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/jpeg",
        "image/png",
        "image/gif",
        "text/plain"
      ]
    },
    additionalFields: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      formData: {
        file: null,
        note: "",
        [this.parentIdField]: this.itemId,
        ...this.additionalFields
      }
    }
  },

  computed: {
    loading() {
      return this.$store.state[this.storeName]?.loading || false
    },

    fileRules() {
      return [
        (v) => !!v || this.$t("validation.file_required"),
        (v) => !v || v.size < this.maxFileSize || this.$t("validation.file_too_large"),
        (v) => !v || this.allowedTypes.includes(v.type) || this.$t("validation.invalid_file_type")
      ]
    }
  },

  methods: {
    handleFileChange(file) {
      this.formData.file = file
    },

    async addAttachment() {
      try {
        const formData = new FormData()

        // Add all form fields to FormData
        Object.keys(this.formData).forEach((key) => {
          if (this.formData[key] !== null && this.formData[key] !== undefined) {
            formData.append(key, this.formData[key])
          }
        })

        // Debug logging
        console.log("=== GENERIC ATTACHMENT FORM SUBMISSION ===")
        console.log("Store name:", this.storeName)
        console.log("Parent ID field:", this.parentIdField)
        console.log("Item ID:", this.itemId)

        const result = await this.$store.dispatch(`${this.storeName}/addAttachment`, formData)

        if (result && result.success) {
          this.$emit("attachment-added", {
            attachment: result.data,
            parentId: this.itemId,
            [this.parentIdField]: this.itemId
          })
          this.resetForm()
        } else {
          throw new Error(result?.message || "Failed to add attachment")
        }
      } catch (error) {
        console.error("Error adding attachment:", error)
        this.$emit("error", error.message || "Failed to add attachment")
      }
    },

    resetForm() {
      this.formData = {
        file: null,
        note: "",
        [this.parentIdField]: this.itemId,
        ...this.additionalFields
      }
    }
  },

  watch: {
    // Update form data if additionalFields change
    additionalFields: {
      handler(newFields) {
        this.formData = {
          ...this.formData,
          ...newFields
        }
      },
      deep: true
    }
  }
}
</script>
