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
  </form-wrapper>
</template>

<script>
import { mapState } from "vuex"
import QuillEditor from "../QuillEditor.vue"

export default {
  name: "ThreatAttachmentForm",
  components: { QuillEditor },

  props: {
    itemId: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      formData: {
        file: null,
        note: "",

        bcm_threats_id: this.itemId
      }
    }
  },

  computed: {
    loading() {
      return this.$store.state.threatAttachments?.loading || false
    },

    fileRules() {
      const maxFileSize = 10 * 1024 * 1024 // 10MB
      const allowedTypes = [
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

      return [
        (v) => !!v || this.$t("validation.file_required"),
        (v) => !v || v.size < maxFileSize || this.$t("validation.file_too_large"),
        (v) => !v || allowedTypes.includes(v.type) || this.$t("validation.invalid_file_type")
      ]
    },

    userIdRules() {
      return [
        (v) => !!v || this.$t("validation.user_id_required"),
        (v) => v > 0 || this.$t("validation.user_id_must_be_positive")
      ]
    }
  },

  methods: {
    handleFileChange(file) {
      this.formData.file = file
    },

    async addAttachment() {
      try {
        console.log("=== DEBUGGING FORM SUBMISSION ===")
        console.log("itemId:", this.itemId)
        console.log("file:", this.formData.file)
        console.log("note:", this.formData.note)

        const formData = new FormData()
        formData.append("bcm_threats_id", this.itemId)
        formData.append("file", this.formData.file)
        formData.append("note", this.formData.note)

        // More detailed FormData logging
        console.log("FormData entries:")
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`${key}:`, {
              name: value.name,
              size: value.size,
              type: value.type,
              lastModified: value.lastModified
            })
          } else {
            console.log(`${key}:`, value)
          }
        }

        const result = await this.$store.dispatch("threatAttachments/addAttachment", formData)

        if (result && result.success) {
          this.$emit("attachment-added", {
            attachment: result.data,
            parentId: this.itemId,
            bcm_threats_id: this.itemId
          })

          this.resetForm()
        } else {
          throw new Error(result?.message || "Failed to add attachment")
        }
      } catch (error) {
        console.error("Error adding threat attachment:", error)
        this.$emit("error", error.message || "Failed to add attachment")
      }
    },

    resetForm() {
      this.formData = {
        file: null,
        note: "",

        bcm_threats_id: this.itemId
      }
    }
  }
}
</script>
