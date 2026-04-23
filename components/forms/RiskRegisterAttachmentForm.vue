<template>
  <form-wrapper @submit="addAttachment" :loading="loading.riskAttachments">
    <quill-editor v-model="note" class="mb-4" />

    <v-file-input
      v-model="file"
      :label="$t('form.file')"
      outlined
      dense
      :rules="[(v) => !!v || 'File is required']"
      @change="handleFileChange"
    ></v-file-input>
    <custom-date-picker v-model="validUntilDate" required :label="$t('table.valid_until')" class="mb-4" />

    <custom-checkbox v-model="valid" :label="$t('table.valid')" class="mb-4" />
  </form-wrapper>
</template>

<script>
import { mapState, mapActions } from "vuex"
// import { createRiskAttachment } from "../../api/risk-api"
import QuillEditor from "../QuillEditor.vue"
export default {
  components: { QuillEditor },
  name: "RiskRegisterAttachmentForm",

  data() {
    return {
      file: null,
      note: "",
      validUntilDate: "",
      valid: true
    }
  },
  props: {
    itemId: {
      type: Number,
      required: true
    }
  },
  computed: { ...mapState("risk", ["loading"]) },
  methods: {
    ...mapActions("risk", ["createRiskAttachment"]),
    handleFileChange(file) {
      this.file = file
    },

    addAttachment() {
      const formData = new FormData()
      formData.append("risk_id", this.itemId)
      formData.append("file", this.file)
      formData.append("note", this.note)
      formData.append("valid_until", this.validUntilDate)
      formData.append("valid", this.valid ? 1 : 0)

      this.createRiskAttachment({ formData, riskId: this.itemId })
        .then((data) => {
          this.$emit("attachment-added", {
            attachment: data,
            riskId: this.itemId
          })
          this.$toast.success("Attachment added successfully")
          this.resetForm()
        })
        .catch((error) => {
          console.error("Error adding attachment:", error)
          this.$toast.error("Failed to add attachment")
        })
    },

    resetForm() {
      this.file = null
      this.note = ""
      this.validUntilDate = ""
      this.valid = false
    }
  }
}
</script>

<style></style>
