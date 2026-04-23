<template>
  <div>
    <v-list v-if="attachments.length > 0" class="mt-4" dense>
      <v-list-item v-for="attachment in attachments" :key="attachment.id" class="py-1">
        <v-list-item-avatar tile size="40" class="mr-3">
          <v-img v-if="isImage(attachment.name)" :src="attachment.path" contain></v-img>
          <v-icon v-else>{{ getFileIcon(attachment.name) }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="caption">{{ attachment.name }}</v-list-item-title>
          <v-list-item-subtitle class="caption">{{ attachment.size }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon small @click="downloadAttachment(attachment)">
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </v-list-item-action>
        <v-list-item-action>
          <v-can :permission="'delete_stage_document'">
            <v-btn icon small @click="deleteAttachment(attachment.id)" :loading="deletingId === attachment.id">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-can>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-alert v-else-if="!isFetching" type="info" class="mt-4 caption">
      {{ $t("page.no_attachments") }}
    </v-alert>
  </div>
</template>

<script>
import { removeAttachment } from "../../../api/checklists-api"
import VCan from "../../VCan.vue"

export default {
  components: { VCan },
  name: "AttachmentList",
  props: {
    attachments: { type: Array, required: true },
    isFetching: { type: Boolean, default: false }
  },
  data() {
    return {
      deletingId: null
    }
  },
  methods: {
    deleteAttachment(id) {
      this.deletingId = id
      removeAttachment(id, this.$axios)
        .then(() => {
          this.$emit("attachment-deleted")
        })
        .catch((error) => {
          console.error("Error deleting attachment:", error)
          // You might want to show an error message to the user here
        })
        .finally(() => {
          this.deletingId = null
        })
    },
    downloadAttachment(attachment) {
      const link = document.createElement("a")
      link.href = attachment.path
      link.download = attachment.name
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    isImage(fileName) {
      const extension = fileName.split(".").pop().toLowerCase()
      return ["jpg", "jpeg", "png", "gif", "bmp"].includes(extension)
    },
    // use function in helper misc
    getFileIcon(fileName) {
      const extension = fileName.split(".").pop().toLowerCase()
      switch (extension) {
        case "pdf":
          return "mdi-file-pdf-box"
        case "doc":
        case "docx":
          return "mdi-file-word-box"
        case "xls":
        case "xlsx":
          return "mdi-file-excel-box"
        case "ppt":
        case "pptx":
          return "mdi-file-powerpoint-box"
        case "zip":
        case "rar":
          return "mdi-zip-box"
        default:
          return "mdi-file-outline"
      }
    }
  }
}
</script>
