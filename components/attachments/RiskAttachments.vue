<!-- RiskAttachments.vue -->
<template>
  <attachments-table
    :title="$t('page.risk_register_documents')"
    :headers="headers"
    :fetch-params="{ model_name: 'risk' }"
    :availableFilters="['users', 'risk']"
    :deleteConfig="deleteConfig"
  >
    <template v-slot:item.notes="{ item }">
      <v-can disable-only :permission="'edit_risk_attachment_note_in_document_managment_system'">
        <template #default="{ disabled }">
          <editable-note-form
            :note="item.note"
            :title="item.name || `id: ${item.id}`"
            :item-id="item.id"
            @update-item="updateNote"
            :loading="loading.note"
            :disable-edit="disabled"
            :disable-icon="false"
            iconSize="large"
          />
        </template>
      </v-can>
    </template>
  </attachments-table>
</template>

<script>
import { mapMutations } from "vuex"
import AttachmentsTable from "./AttachmentsTable.vue"
import EditableNoteForm from "../forms/EditableNoteForm.vue"
import { updateRiskAttachment } from "../../api/risk-api"

export default {
  components: {
    AttachmentsTable,
    EditableNoteForm
  },
  name: "RiskAttachments",
  props: {
    deleteConfig: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: { note: false }
    }
  },
  computed: {
    headers() {
      return [
        { text: "table.file", value: "attachment-name", sortable: true, uncenterBody: true, cellClass: ["no-wrap"] },
        { text: "table.extension", value: "extension", sortable: true, cellClass: ["no-wrap"] },
        { text: "table.size", value: "file-size", sortable: true, cellClass: ["no-wrap"] },
        { text: "table.risk_id", value: "risk.id", sortable: true },
        { text: "table.risk", value: "risk.name", sortable: true, uncenterBody: true, cellClass: ["no-wrap"] },
        { text: "table.upload_by", value: "upload-by", sortable: true, cellClass: ["no-wrap"] },
        { text: "table.notes", value: "notes", sortable: false, cellClass: ["no-wrap"] },
        { text: "table.uploaded_at", value: "created_at", sortable: true, cellClass: ["no-wrap"] },
        { text: "table.valid_until", value: "valid-date", sortable: true, cellClass: ["no-wrap"] },
        { text: "table.validity", value: "valid", sortable: true },
        { text: "table.delete", value: "delete", sortable: false }
      ]
    }
  },
  methods: {
    ...mapMutations("allAttachments", ["UPDATE_ATTACHMENT"]),
    async updateNote(id, payload) {
      try {
        this.loading.note = true
        const res = await updateRiskAttachment(id, payload, this.$axios)
        const updatedAttachment = res.data.data
        if (updatedAttachment) {
          this.UPDATE_ATTACHMENT(updatedAttachment)
        }
      } catch (error) {
        console.error("Error updating note:", error)
      } finally {
        this.loading.note = false
      }
    }
  }
}
</script>

<style></style>
