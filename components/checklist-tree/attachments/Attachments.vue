<template>
  <div>
    <v-can disable-only :permission="'view_stage_attachments'">
      <template #default="{ disabled }">
        <v-btn :loading="isFetching" :disabled="disabled" @click="toggleAttachments" color="primary" small>
          {{ showAttachments ? $t("page.hide_attachments") : $t("page.attachments") }}
        </v-btn>
      </template>
    </v-can>

    <v-expand-transition>
      <div v-if="showAttachments">
        <attachment-uploader :project-checklist-id="projectChecklistId" @upload-success="fetchAttachments" />
        <attachment-list :attachments="attachments" :is-fetching="isFetching" @attachment-deleted="fetchAttachments" />
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import { getAttachments } from "../../../api/checklists-api"
import VCan from "../../VCan.vue"
import AttachmentList from "./AttachmentList.vue"
import AttachmentUploader from "./AttachmentUploader.vue"

export default {
  name: "Attachments",
  components: { AttachmentUploader, AttachmentList, VCan },
  props: {
    projectChecklistId: { type: Number, required: true },
    dialogOpen: { type: Boolean, default: false }
  },
  data() {
    return {
      isFetching: false,
      attachments: [],
      showAttachments: false
    }
  },
  watch: {
    dialogOpen(newValue) {
      if (!newValue) {
        this.showAttachments = false
      }
    }
  },
  methods: {
    toggleAttachments() {
      if (!this.showAttachments) {
        this.fetchAttachments()
      } else {
        this.showAttachments = false
      }
    },
    fetchAttachments() {
      this.isFetching = true
      getAttachments(this.projectChecklistId, this.$axios)
        .then((res) => {
          this.attachments = res.data.data
          this.showAttachments = true
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.isFetching = false
        })
    },
    resetShowAttachments() {
      this.showAttachments = false
    }
  }
}
</script>
