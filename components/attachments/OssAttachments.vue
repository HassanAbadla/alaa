<template>
  <attachments-table
    :title="$t('page.oss_documents')"
    :headers="headers"
    :fetch-params="{ model_name: 'oss' }"
    :availableFilters="['users', 'attachmentType']"
  />
</template>

<script>
import AttachmentsTable from "./AttachmentsTable.vue"
export default {
  components: { AttachmentsTable },

  name: "OssAttachments",
  data() {
    return {}
  },
  computed: {
    headers() {
      if (this.$route.name === "oss-orders")
        return [
          { text: "table.file", value: "attachment-name", sortable: true },
          { text: "table.extension", value: "extension", sortable: true },
          { text: "table.size", value: "file-size", sortable: true },
          { text: "table.code", value: "order.code", sortable: true },
          { text: "table.order", value: "order.name", sortable: true },
          { text: "table.upload_by", value: "upload-by", sortable: true },
          { text: "table.notes", value: "notes", sortable: false },
          { text: "table.uploaded_at", value: "created_at", sortable: true }
        ]
      return [
        { text: "table.file", value: "attachment-name", sortable: true },
        { text: "table.extension", value: "extension", sortable: true },
        { text: "table.size", value: "file-size", sortable: true },
        { text: "table.risk_id", value: "risk.id", sortable: true },
        { text: "table.risk", value: "risk.name", sortable: true },
        { text: "table.upload_by", value: "upload-by", sortable: true },
        { text: "table.notes", value: "notes", sortable: false },
        { text: "table.uploaded_at", value: "created_at", sortable: true }
      ]
    }
  }
}
</script>

<style></style>
