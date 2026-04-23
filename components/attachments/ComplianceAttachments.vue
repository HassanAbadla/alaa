<template>
  <attachments-table
    :title="$t('page.compliance_documents')"
    :headers="headers"
    :fetch-params="{ model_name: 'review' }"
    :availableFilters="['users', 'reviewType', 'reviewPurpose']"
    :deleteConfig="deleteConfig"
    :propItems="localFilteredAttachments"
    :filterIsActive="hasAnyFiltersActive"
    :filters.sync="serverFilters"
    @clear-filters="handleClearFilters"
  >
    <!-- Add our client-side filters to the additional slot -->
    <template v-slot:additional-level-filters>
      <custom-dropdown
        :items="contractOptions"
        item-value="id"
        item-text="title"
        :label="$t('table.audit_contract')"
        v-model="localFilters.contract_id"
        clearable
        :outlined="false"
      />
      <custom-dropdown
        :items="packageOptions"
        item-value="id"
        item-text="name"
        :label="$t('table.package')"
        v-model="localFilters.package_id"
        clearable
        :outlined="false"
      />
      <custom-dropdown
        :items="roundOptions"
        item-value="name"
        item-text="name"
        :label="$t('table.round')"
        v-model="localFilters.round_name"
        clearable
        :outlined="false"
      />
    </template>

    <template v-slot:item.notes="{ item }">
      <v-can disable-only :permission="'edit_compliance_attachment_note_in_document_managment_system'">
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
import { mapState, mapMutations } from "vuex"
import EditableNoteForm from "../forms/EditableNoteForm.vue"
import AttachmentsTable from "./AttachmentsTable.vue"

export default {
  components: { AttachmentsTable, EditableNoteForm },
  name: "ComplianceAttachments",
  props: { deleteConfig: { type: Object, default: {} } },

  data() {
    return {
      loading: { note: false },
      localFilters: {
        contract_id: null,
        package_id: null,
        round_name: null // Changed from round_id to round_name
      },
      serverFilters: {
        user_ids: [],
        risk_id: null,
        type_id: null,
        purpose_id: null,
        attachment_type_id: null
      }
    }
  },

  computed: {
    ...mapState("allAttachments", ["attachments"]),
    ...mapState(["isRTL"]),

    headers() {
      return [
        { text: "table.file", value: "attachment-name", sortable: true, uncenterBody: true, cellClass: ["no-wrap"] },
        { text: "table.size", value: "file-size", sortable: true, cellClass: ["no-wrap"] },
        { text: "table.audit_contract", value: "subscription.title", sortable: true, uncenterBody: true },
        {
          text: "table.package",
          value: "compliance_package.name",
          sortable: true,
          uncenterBody: true,
          cellClass: ["no-wrap"]
        },
        {
          text: "table.compliance_control",
          value: "compliance_item_control",
          sortable: true,
          uncenterBody: true,
          cellClass: ["no-wrap"]
        },
        { text: "table.round", value: "audit.name", sortable: true, uncenterBody: true, cellClass: ["no-wrap"] },
        { text: "table.type", value: "type.name", sortable: true },
        { text: "table.purpose", value: "attachment_purpose.name", sortable: true },
        { text: "table.upload_by", value: "upload-by", sortable: true },
        { text: "table.notes", value: "notes", sortable: false },
        { text: "table.uploaded_at", value: "created_at", sortable: true, cellClass: ["no-wrap"] },
        { text: "table.valid_until", value: "valid-date", sortable: true, cellClass: ["no-wrap"] },
        { text: "table.validity", value: "valid", sortable: true },
        { text: "table.delete", value: "delete", sortable: false }
      ]
    },

    // Check if any local filters are active
    hasLocalFiltersActive() {
      return Object.values(this.localFilters).some((value) => value !== null)
    },

    // Check if any server-side filters are active
    hasServerFiltersActive() {
      return Object.values(this.serverFilters).some((value) => {
        if (Array.isArray(value)) {
          return value.length > 0
        }
        if (typeof value === "string") {
          return value.trim() !== ""
        }
        return value !== null
      })
    },

    // Combined check for both local and server filters
    hasAnyFiltersActive() {
      return this.hasLocalFiltersActive || this.hasServerFiltersActive
    },

    // Extract unique contracts from attachments data
    contractOptions() {
      const uniqueMap = new Map()

      this.attachments.forEach((att) => {
        const subscription = att.subscription
        if (subscription && subscription.id && !uniqueMap.has(subscription.id)) {
          uniqueMap.set(subscription.id, subscription)
        }
      })

      return Array.from(uniqueMap.values()).sort((a, b) => (a.title || "").localeCompare(b.title || ""))
    },

    // Extract unique packages from attachments data
    packageOptions() {
      const uniqueMap = new Map()

      this.attachments.forEach((att) => {
        const pkg = att.compliance_package
        if (pkg && pkg.id && !uniqueMap.has(pkg.id)) {
          uniqueMap.set(pkg.id, pkg)
        }
      })

      return Array.from(uniqueMap.values()).sort((a, b) => (a.name || "").localeCompare(b.name || ""))
    },

    // Extract unique rounds by NAME (not ID) from attachments data
    roundOptions() {
      const uniqueNames = new Set()

      this.attachments.forEach((att) => {
        const audit = att.audit
        if (audit && audit.name) {
          uniqueNames.add(audit.name)
        }
      })

      // Convert Set to array of objects for the dropdown
      return Array.from(uniqueNames)
        .map((name) => ({ name }))
        .sort((a, b) => a.name.localeCompare(b.name))
    },

    // Apply client-side filters to attachments
    localFilteredAttachments() {
      let filtered = [...this.attachments]

      // Apply oss-orders filter if on that route
      if (this.$route.name === "oss-orders") {
        const userTypeCode = this.$auth?.user?.type?.code
        if (userTypeCode === "owner" || userTypeCode === "b-owner" || userTypeCode === "c-owner") {
          filtered = filtered.filter((att) => att.user_typeCode !== "sm" && !att.user?.user_typeCode?.startsWith("eng"))
        }
      }

      // Filter by contract
      if (this.localFilters.contract_id) {
        filtered = filtered.filter((att) => att.subscription?.id === this.localFilters.contract_id)
      }

      // Filter by package
      if (this.localFilters.package_id) {
        filtered = filtered.filter((att) => att.compliance_package?.id === this.localFilters.package_id)
      }

      // Filter by round NAME (not ID)
      if (this.localFilters.round_name) {
        filtered = filtered.filter((att) => att.audit?.name === this.localFilters.round_name)
      }

      return filtered
    }
  },

  methods: {
    ...mapMutations("allAttachments", ["UPDATE_ATTACHMENT"]),

    // Reset both local and server filters when clear is clicked
    handleClearFilters() {
      // Reset local filters
      this.localFilters = {
        contract_id: null,
        package_id: null,
        round_name: null // Changed from round_id
      }

      // Reset server filters
      this.serverFilters = {
        user_ids: [],
        risk_id: null,
        type_id: null,
        purpose_id: null,
        attachment_type_id: null
      }
    },

    async updateNote(id, payload) {
      try {
        this.loading.note = true
        const res = await this.$axios.put(`review-attachment/${id}`, payload)
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
