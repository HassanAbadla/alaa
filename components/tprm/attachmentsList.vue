<template>
  <div class="">
    <div v-if="attachments.length === 0" class="no-attachments">
      <v-icon size="48" color="grey lighten-1">mdi-attachment</v-icon>
      <p class="grey--text mt-2">No attachments found</p>
    </div>

    <v-list v-else class="attachment-items">
      <v-list-item v-for="(attachment, index) in attachments" :key="attachment.id" class="attachment-item">
        <div class="d-flex flex-column justify-center">
          <FilePreview :file="attachment" />
          <small class="font-weight-bold text-center">{{ (attachment.size * 1024).toFixed(2) }} KB</small>
        </div>

        <v-list-item-content class="mx-4">
          <v-list-item-title class="mb-4">{{ attachment.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ attachment.user?.full_name }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item dense @click="downloadAttachment(attachment)">
                <v-list-item-icon>
                  <v-icon small>mdi-download</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ $t("page.download") }}</v-list-item-title>
              </v-list-item>
              <v-list-item dense @click="editAttachment(attachment)">
                <v-list-item-icon small>
                  <v-icon small>mdi-pencil</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ $t("page.edit") }}</v-list-item-title>
              </v-list-item>
              <v-list-item dense @click="deleteItem(attachment, index)">
                <v-list-item-icon small>
                  <v-icon small color="error">mdi-delete</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ $t("page.delete") }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex"
import AttachmentForm from "../forms/TPRMAttachmentForm.vue"
import FilePreview from "../FilePreview.vue"

export default {
  name: "AttachmentList",
  components: {
    FilePreview
  },
  props: {
    // value: {
    //   type: Array,
    //   default: () => []
    // },
    thirdPartyId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      showForm: false,
      selectedAttachment: null,
      // attachments: [...this.value],
      filters: {
        third_party_id: this.thirdPartyId
      },
      value: []
    }
  },
  watch: {
    value(newVal) {
      this.attachments = [...newVal]
    },
    attachments: {
      handler(newVal) {
        this.$emit("input", newVal)
      },
      deep: true
    }
  },
  async mounted() {
    await this.fetchAttachments(this.filters)
    this.value = this.getAttachments
  },
  computed: {
    ...mapGetters({
      getAttachments: "tprmAttachments/getAttachments",
      loadingAttachments: "tprmAttachments/isLoading"
    }),
    attachments() {
      return [...this.value]
    }
  },
  methods: {
    ...mapActions({
      fetchAttachments: "tprmAttachments/fetchAttachments",
      fetchAttachmentTypes: "tprmAttachmentTypes/fetchAttachmentTypes",
      deleteAttachment: "tprmAttachments/deleteAttachment"
    }),
    ...mapMutations({
      decrementAttachmentCount: "tprmThirdParties/DELETE_TPRM_THIRD_PARTY"
    }),
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    showAddForm() {
      this.selectedAttachment = null
      this.showForm = true
    },

    showList() {
      this.showForm = false
      this.selectedAttachment = null
    },

    editAttachment(attachment) {
      this.selectedAttachment = { ...attachment }
      this.showForm = true
      this.openDrawer({
        component: "forms/TPRMAttachmentForm",
        props: { thirdPartyId: this.thirdPartyId, attachment: this.selectedAttachment, isEditing: true },
        title: this.$t("page.attachments"),
        width: 700
      })
    },

    // handleSave(attachmentData) {
    //   if (this.selectedAttachment) {
    //     // Edit existing attachment
    //     const index = this.attachments.findIndex((a) => a.id === this.selectedAttachment.id)
    //     if (index !== -1) {
    //       this.attachments.splice(index, 1, attachmentData)
    //     }
    //   } else {
    //     // Add new attachment
    //     const newAttachment = {
    //       ...attachmentData,
    //       id: Date.now() + Math.random(), // Simple ID generation
    //       created_at: new Date()
    //     }
    //     this.attachments.push(newAttachment)
    //   }
    //   this.showList()
    // },

    async deleteItem(attachment, index) {
      // console.log("Deleting attachment:", attachment)
      const attachmentId = attachment.id
      console.log("Attachment ID:", attachmentId)

      if (attachmentId) {
        await this.deleteAttachment(attachmentId)
        await this.fetchAttachments(this.filters)
        this.value = this.getAttachments
        this.decrementAttachmentCount(this.thirdPartyId)
      }

      // if (confirm("Are you sure you want to delete this attachment?")) {
      //   this.attachments.splice(index, 1)
      // }
    },

    downloadAttachment(attachment) {
      // Implement download logic
      console.log("Downloading:", attachment)
      if (attachment.path) {
        const url = attachment.path
        window.open(url, "_blank")
      } else {
        this.$emit("error", "Download path not available")
      }
    },

    getFileIcon(type) {
      const iconMap = {
        pdf: "mdi-file-pdf-box",
        doc: "mdi-file-word-box",
        docx: "mdi-file-word-box",
        xls: "mdi-file-excel-box",
        xlsx: "mdi-file-excel-box",
        ppt: "mdi-file-powerpoint-box",
        pptx: "mdi-file-powerpoint-box",
        txt: "mdi-file-document-outline",
        jpg: "mdi-file-image",
        jpeg: "mdi-file-image",
        png: "mdi-file-image",
        gif: "mdi-file-image",
        zip: "mdi-folder-zip",
        rar: "mdi-folder-zip"
      }
      return iconMap[type?.toLowerCase()] || "mdi-file"
    },

    getFileIconColor(type) {
      const colorMap = {
        pdf: "red",
        doc: "blue",
        docx: "blue",
        xls: "green",
        xlsx: "green",
        ppt: "orange",
        pptx: "orange",
        txt: "grey",
        jpg: "purple",
        jpeg: "purple",
        png: "purple",
        gif: "purple",
        zip: "amber",
        rar: "amber"
      }
      return colorMap[type?.toLowerCase()] || "grey"
    },

    formatFileSize(bytes) {
      if (!bytes) return "0 Bytes"
      const k = 1024
      const sizes = ["Bytes", "KB", "MB", "GB"]
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    },

    formatDate(date) {
      if (!date) return ""
      return new Date(date).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.attachment-manager {
  width: 100%;
  max-width: 600px;
}

.attachment-list {
  min-height: 200px;
}

.attachment-form {
  min-height: 200px;
}

.no-attachments {
  text-align: center;
  padding: 40px 20px;
}

.attachment-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.attachment-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.add-btn {
  transition: all 0.2s ease;
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Transition Styles */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.attachment-items {
  background: transparent;
}

.v-list-item {
  background: white;
}
</style>
