<!-- ControlReviewAttachmentForm.vue -->
<template>
  <form-wrapper @submit="addAttachment">
    <quill-editor v-model="note" class="mb-4" />
    <custom-dropdown
      v-model="typeId"
      :items="types"
      :label="$t('form.type')"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingTypes"
    />
    <custom-dropdown
      v-model="purposeId"
      :items="purposes"
      :label="$t('form.purpose')"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingPurposes"
    />
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
import { mapActions } from "vuex"
import { getReviewAttachmentTypes, getReviewAttachmentPurposes } from "@/api/audit-api"
import QuillEditor from "../QuillEditor.vue"

export default {
  components: { QuillEditor },
  name: "ControlReviewAttachmentForm",

  props: {
    itemId: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      types: [],
      purposes: [],
      typeId: null,
      purposeId: null,
      file: null,
      note: "",
      validUntilDate: "",
      valid: true,
      loadingTypes: false,
      loadingPurposes: false
    }
  },

  created() {
    this.fetchTypes()
    this.fetchPurposes()
  },

  methods: {
    ...mapActions("controlReviews", ["createReviewAttachment"]),
    fetchTypes() {
      this.loadingTypes = true
      getReviewAttachmentTypes(this.$axios)
        .then((res) => {
          this.types = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching attachment types:", error)
        })
        .finally(() => {
          this.loadingTypes = false
        })
    },

    fetchPurposes() {
      this.loadingPurposes = true
      getReviewAttachmentPurposes(this.$axios)
        .then((res) => {
          this.purposes = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching attachment purposes:", error)
        })
        .finally(() => {
          this.loadingPurposes = false
        })
    },

    handleFileChange(file) {
      this.file = file
    },

    async addAttachment() {
      if (!this.typeId || !this.purposeId || !this.file) {
        this.$toast.error("Please fill all fields")
        return
      }

      const formData = new FormData()
      formData.append("audit_item_review_id", this.itemId)
      formData.append("attachment_type_id", this.typeId)
      formData.append("attachment_purpose_id", this.purposeId)
      formData.append("file", this.file)
      formData.append("note", this.note)
      formData.append("valid_until", this.validUntilDate)
      formData.append("valid", this.valid ? 1 : 0)
      try {
        const res = await this.createReviewAttachment({ payload: formData, parentId: this.itemId })

        this.$emit("attachment-added", {
          attachment: res.data.data,
          reviewId: this.itemId
        })
        this.resetForm()
      } catch (error) {
        console.error(error)
      }

      // await this.createReviewAttachment(formData)
      //   .then((res) => {
      //     this.$emit("attachment-added", {
      //       attachment: res.data.data,
      //       reviewId: this.itemId
      //     })
      //     this.$toast.success("Attachment added successfully")

      //   })
      //   .catch((error) => {
      //     console.error("Error adding attachment:", error)
      //     this.$toast.error("Failed to add attachment")
      //   })
    },

    resetForm() {
      this.typeId = null
      this.purposeId = null
      this.file = null
      this.note = ""
      this.validUntilDate = ""
      this.valid = false
    }
  }
}
</script>
