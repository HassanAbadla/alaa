<template>
  <div v-if="!loading">
    <v-card-text v-if="attachments?.length > 0">
      <v-list two-line>
        <v-list-item v-for="attachment in attachments" :key="attachment.id">
          <v-list-item-avatar tile size="64" class="mr-3">
            <file-preview :file="attachment" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ attachment.name }}</v-list-item-title>
            <v-list-item-subtitle v-if="attachment.attachment_type">
              {{ $t("form.type") }}: {{ attachment.attachment_type.name }} | {{ $t("form.purpose") }}:
              {{ attachment.attachment_purpose.name }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              {{ `${$t("form.user")}: ${attachment.user ? attachment.user.full_name : $t("page.unknown")}` }}
            </v-list-item-subtitle>
            <v-list-item-subtitle dense class="mt-1 d-flex align-center">
              <v-can disable-only :permission="permissions?.edit">
                <template #default="{ disabled }">
                  <v-chip
                    small
                    :color="chipColor(attachment)"
                    text-color="white"
                    class="mr-2"
                    @click="openValidityConfirmDialog(attachment)"
                    :ripple="!attachment.isLoading"
                    :style="{ cursor: attachment.isLoading ? 'wait' : 'pointer' }"
                    :disabled="attachment.isLoading || disabled"
                  >
                    <v-icon left small>
                      {{ attachment.valid ? "mdi-check-circle" : "mdi-close-circle" }}
                    </v-icon>
                    {{ attachment.valid ? $t("page.valid") : $t("page.not_valid") }}
                    <v-progress-circular
                      v-if="attachment.isLoading"
                      indeterminate
                      size="16"
                      width="2"
                      color="white"
                      class="ml-2"
                    />
                  </v-chip>
                </template>
              </v-can>
              <span v-if="attachment.valid_until" class="text-caption">
                {{ $t("table.valid_until") }}: {{ formatDate(attachment.valid_until).date }}
              </span>
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action class="d-flex flex-row align-center">
            <v-can :permission="permissions?.viewNote">
              <editable-note-form
                v-if="showNotes"
                :loading="attachment?.isLoading"
                :note="attachment.note"
                :itemId="attachment.id"
                :iconSize="'default'"
                :disable-edit="disableNoteEdit"
                @update-item="updateAttachment"
              />
            </v-can>
            <v-icon @click.stop="downloadAttachment(attachment)" class="mx-1">mdi-download</v-icon>
            <v-can :permission="permissions?.delete">
              <v-icon v-if="showDelete" @click.stop="openDeleteConfirmDialog(attachment)">mdi-delete</v-icon>
            </v-can>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
    <no-posts-message v-else :title="$t('page.no_attachments_title')" :subtitle="$t('page.no_attachments_subtitle')" />

    <!-- Validity Confirm Dialog -->
    <confirm-dialog
      v-model="showValidityConfirmDialog"
      :title="$t('page.confirm_validity_change')"
      :message="confirmMessage"
      :confirm-button-text="$t('page.confirm')"
      :confirm-button-color="confirmButtonColor"
      :cancel-button-text="$t('page.cancel')"
      :show-cancel-button="true"
      @confirm="handleValidityConfirm"
      @cancel="handleCancel"
    />

    <!-- Delete Confirm Dialog -->
    <confirm-dialog
      v-model="showDeleteConfirmDialog"
      :title="$t('page.confirm_delete')"
      :message="deleteConfirmMessage"
      :confirm-button-text="$t('page.delete')"
      :confirm-button-color="'error'"
      :cancel-button-text="$t('page.cancel')"
      :show-cancel-button="true"
      @confirm="handleDeleteConfirm"
      @cancel="handleCancel"
    />
  </div>
  <div v-else>
    <v-card-text>
      <v-skeleton-loader v-for="n in 4" :key="n" v-bind="attrs" type="list-item-avatar"></v-skeleton-loader>
    </v-card-text>
  </div>
</template>

<script>
import EditableNoteForm from "../forms/EditableNoteForm.vue"
import NoPostsMessage from "../CANS/NoPostsMessage.vue"
import FilePreview from "../FilePreview.vue"
import ConfirmDialog from "../ConfirmDialog.vue"
import { formatDate } from "../../helpers/misc"
import VCan from "../VCan.vue"
import { mapActions } from "vuex"

export default {
  components: {
    EditableNoteForm,
    NoPostsMessage,
    FilePreview,
    ConfirmDialog,
    VCan
  },
  name: "DocumentList",
  props: {
    attachments: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    showNotes: {
      type: Boolean,
      default: false
    },
    disableNoteEdit: {
      type: Boolean,
      default: false
    },
    showDelete: {
      type: Boolean,
      default: true
    },
    permissions: { type: Object, required: true }
  },
  data() {
    return {
      attrs: {
        class: "mb-6",
        boilerplate: true,
        elevation: 2
      },
      showValidityConfirmDialog: false,
      showDeleteConfirmDialog: false,
      selectedAttachment: null,
      confirmMessage: "",
      deleteConfirmMessage: "",
      confirmButtonColor: "primary"
    }
  },
  methods: {
    ...mapActions("policy", ["deleteDocument"]),
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    formatDate,
    chipColor(attachment) {
      if (attachment.isLoading) return "grey"
      return attachment.valid ? "success" : "error"
    },
    chipText(attachment) {
      if (attachment.isLoading) return this.$t("page.updating")
      return attachment.valid ? this.$t("page.valid") : this.$t("page.not_valid")
    },
    downloadAttachment(attachment) {
      if (attachment.path) {
        const url = attachment.path
        window.open(url, "_blank")
      } else {
        this.$emit("error", "Download path not available")
      }
    },
    async deleteAttachment(attachmentId) {
      // this.$emit("delete-attachment", attachmentId)
      await this.deleteDocument(attachmentId, this.$axios)
      this.closeDrawer()
    },
    updateAttachment(attachmentId, payload) {
      this.$emit("update-attachment", attachmentId, payload)
    },
    openValidityConfirmDialog(attachment) {
      this.selectedAttachment = attachment
      this.confirmButtonColor = attachment.valid ? "error" : "success"
      this.confirmMessage = attachment.valid
        ? this.$t("page.confirm_invalidate_attachment", { name: attachment.name })
        : this.$t("page.confirm_validate_attachment", { name: attachment.name })
      this.showValidityConfirmDialog = true
    },
    openDeleteConfirmDialog(attachment) {
      this.selectedAttachment = attachment
      this.deleteConfirmMessage = this.$t("page.confirm_delete_attachment", { name: attachment.name })
      this.showDeleteConfirmDialog = true
    },
    handleValidityConfirm() {
      if (this.selectedAttachment) {
        this.updateAttachment(this.selectedAttachment.id, {
          valid: !this.selectedAttachment.valid
        })
      }
      this.resetDialog()
    },
    handleDeleteConfirm() {
      if (this.selectedAttachment) {
        this.deleteAttachment(this.selectedAttachment.id)
      }
      this.resetDialog()
    },
    handleCancel() {
      this.resetDialog()
    },
    resetDialog() {
      this.showValidityConfirmDialog = false
      this.showDeleteConfirmDialog = false
      this.selectedAttachment = null
      this.confirmMessage = ""
      this.deleteConfirmMessage = ""
      this.confirmButtonColor = "primary"
    }
  }
}
</script>
