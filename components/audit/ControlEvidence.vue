<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <FormWrapper title="Add Attachment" @submit="addAttachment">
        <CustomDropdown
          v-model="typeId"
          :items="types"
          label="Attachment Type"
          item-text="name"
          item-value="id"
          :required="true"
          :loading="loadingTypes"
        />
        <CustomDropdown
          v-model="purposeId"
          :items="purposes"
          label="Attachment Purpose"
          item-text="name"
          item-value="id"
          :required="true"
          :loading="loadingPurposes"
        />
        <v-file-input
          v-model="file"
          label="Upload File"
          outlined
          dense
          :rules="[(v) => !!v || 'File is required']"
          @change="handleFileChange"
        ></v-file-input>
      </FormWrapper>

      <v-list>
        <v-list-item v-for="attachment in attachments" :key="attachment.id">
          <v-list-item-content>
            <v-list-item-title>{{ attachment.name }}</v-list-item-title>
            <v-list-item-subtitle>
              Type: {{ attachment.attachment_type.name }} | Purpose: {{ attachment.attachment_purpose.name }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              Added by: {{ attachment.user ? attachment.user.full_name : "Unknown" }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action class="d-flex flex-row">
            <v-btn icon @click="downloadAttachment(attachment)" class="mr-2">
              <v-icon>mdi-download</v-icon>
            </v-btn>
            <v-btn icon @click="deleteAttachment(attachment.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  getReviewAttachmentTypes,
  getReviewAttachmentPurposes,
  createReviewAttachment,
  deleteReviewAttachment,
  getReviewAttachments
} from "@/api/audit-api"

export default {
  name: "ControlEvidence",

  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      types: [],
      purposes: [],
      attachments: [],
      typeId: null,
      purposeId: null,
      file: null,
      loadingTypes: false,
      loadingPurposes: false,
      loadingAttachments: false
    }
  },
  computed: {
    title() {
      return this.item?.description + " Evidence"
    }
  },
  watch: {
    item: {
      immediate: true,
      handler() {
        this.resetComponent()
      }
    }
  },
  methods: {
    resetComponent() {
      this.types = []
      this.purposes = []
      this.attachments = []
      this.typeId = null
      this.purposeId = null
      this.file = null
      this.loadingTypes = false
      this.loadingPurposes = false
      this.loadingAttachments = false

      this.fetchTypes()
      this.fetchPurposes()
      this.fetchAttachments()
    },
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
    fetchAttachments() {
      this.loadingAttachments = true
      getReviewAttachments(this.item.id, this.$axios)
        .then((res) => {
          this.attachments = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching attachments:", error)
        })
        .finally(() => {
          this.loadingAttachments = false
        })
    },
    handleFileChange(file) {
      this.file = file
    },
    addAttachment() {
      if (!this.typeId || !this.purposeId || !this.file) {
        this.$toast.error("Please fill all fields")
        return
      }

      const formData = new FormData()
      formData.append("audit_item_review_id", this.item.id)
      formData.append("attachment_type_id", this.typeId)
      formData.append("attachment_purpose_id", this.purposeId)
      formData.append("file", this.file)

      createReviewAttachment(formData, this.$axios)
        .then((res) => {
          this.attachments.push(res.data.data)
          this.$toast.success("Attachment added successfully")
          this.resetForm()
        })
        .catch((error) => {
          console.error("Error adding attachment:", error)
          this.$toast.error("Failed to add attachment")
        })
    },
    deleteAttachment(attachmentId) {
      deleteReviewAttachment(attachmentId, this.$axios)
        .then(() => {
          this.attachments = this.attachments.filter((a) => a.id !== attachmentId)
          this.$toast.success("Attachment deleted successfully")
        })
        .catch((error) => {
          console.error("Error deleting attachment:", error)
          this.$toast.error("Failed to delete attachment")
        })
    },
    downloadAttachment(attachment) {
      if (attachment.path) {
        const url = "https://api.ordonsoft.com/storage/" + attachment.path
        window.open(url, "_blank")
      } else {
        this.$toast.error("Download path not available")
      }
    },
    resetForm() {
      this.typeId = null
      this.purposeId = null
      this.file = null
    },
    close() {
      this.$emit("close")
    }
  }
}
</script>
