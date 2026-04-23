<template>
  <div class="mt-2">
    <v-can :permission="'add_stage_document'">
      <input type="file" @change="onFileChange" ref="fileInput" style="display: none" />
      <v-btn @click="$refs.fileInput.click()" :disabled="isSubmitting" color="primary" small>
        {{ $t("page.select_file") }}
      </v-btn>
      <v-btn @click="submitFile" :disabled="!file || isSubmitting" color="success" class="ml-2" small>
        {{ $t("page.upload") }}
      </v-btn>
    </v-can>
    <v-progress-circular v-if="isSubmitting" indeterminate color="primary" class="ml-2"></v-progress-circular>
    <div v-if="file" class="mt-2 caption">{{ $t("page.selected_file") }}: {{ file.name }}</div>
    <v-alert v-if="error" type="error" class="mt-2">{{ error }}</v-alert>
  </div>
</template>

<script>
import { uploadAttachment } from "../../../api/checklists-api"
import VCan from "../../VCan.vue"

export default {
  components: { VCan },
  name: "AttachmentUploader",
  props: {
    projectChecklistId: { type: Number, required: true }
  },
  data() {
    return {
      file: null,
      isSubmitting: false,
      error: null
    }
  },
  methods: {
    onFileChange(e) {
      this.file = e.target.files[0]
      this.error = null
    },
    submitFile() {
      if (!this.file) return

      this.isSubmitting = true
      this.error = null
      const formData = new FormData()
      formData.append("project_checklist_id", this.projectChecklistId)
      formData.append("file", this.file)

      uploadAttachment(formData, this.$axios)
        .then(() => {
          this.file = null
          this.$emit("upload-success")
        })
        .catch((error) => {
          if (error.response?.data?.errors) {
            const errors = error.response.data.errors
            this.error = Object.values(errors).flat().join(", ")
          } else {
            this.error = this.$t("page.error_uploading_file")
          }
        })
        .finally(() => {
          this.isSubmitting = false
        })
    }
  }
}
</script>
