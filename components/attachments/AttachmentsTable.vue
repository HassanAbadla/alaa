<!-- AttachmentsTable.vue -->
<template>
  <custom-table-wrapper>
    <custom-table
      :headers="headers"
      :propItems="itemsToDisplay"
      :propLoading="loading"
      :tableConfig="tableConfig"
      :title="title"
      hide-edit
      hide-create
      hide-delete
      showFilter
      @clear-filters="getAttachments"
      :filters.sync="filters"
      :sort-on-load="false"
    >
      <template v-slot:level-filters>
        <v-autocomplete
          v-if="availableFilters.includes('users')"
          v-model="filters.user_ids"
          :items="users"
          item-text="full_name"
          item-value="id"
          :label="$t('page.users')"
          :disabled="loadingUsers"
          :loading="loadingUsers"
          @input="getAttachments"
          multiple
          chips
          clearable
        ></v-autocomplete>
        <custom-dropdown
          v-if="availableFilters.includes('risk')"
          :items="risks"
          item-value="id"
          item-text="name"
          :label="$t('page.risk')"
          v-model="filters.risk_id"
          @input="getAttachments"
          clearable
          :loading="loadingRisks"
          :disabled="loadingRisks"
          :outlined="false"
        />
        <custom-dropdown
          v-if="availableFilters.includes('reviewType')"
          :items="controlReviewTypes"
          item-value="id"
          item-text="name"
          :label="$t('page.document_type')"
          v-model="filters.type_id"
          @input="getAttachments"
          clearable
          :loading="loadingControlReviewTypes"
          :disabled="loadingControlReviewTypes"
          :outlined="false"
        />
        <custom-dropdown
          v-if="availableFilters.includes('reviewPurpose')"
          :items="controlReviewPurposes"
          item-value="id"
          item-text="name"
          :label="$t('page.document_purpose')"
          v-model="filters.purpose_id"
          @input="getAttachments"
          clearable
          :loading="loadingControlReviewPurposes"
          :disabled="loadingControlReviewPurposes"
          :outlined="false"
        />
        <custom-dropdown
          v-if="availableFilters.includes('attachmentType')"
          :items="attachmentTypes"
          item-value="id"
          item-text="name"
          :label="$t('table.type')"
          v-model="filters.attachment_type_id"
          @input="getAttachments"
          clearable
          :loading="loadingControlReviewPurposes"
          :disabled="loadingControlReviewPurposes"
          :outlined="false"
        />

        <!-- NEW: Add slot for additional filters from parent components -->
        <slot name="additional-level-filters"></slot>
      </template>

      <!-- Forward all slots -->
      <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope"></slot>
      </template>

      <!-- Default slots that can be overridden -->
      <template v-slot:item.attachment-name="{ item }" v-if="!$scopedSlots['item.attachment-name']">
        <div class="d-flex align-center">
          <file-preview :file="item" :size="32" />
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div class="mx-2 pa-0 file-name-cell" v-bind="attrs" v-on="on">
                {{ item.name }}
              </div>
            </template>
            <span>{{ item.name }}</span>
          </v-tooltip>
        </div>
      </template>

      <template v-slot:item.file-size="{ item }" v-if="!$scopedSlots['item.file-size']">
        <div>{{ `${roundToDecimalPlaces(item.size, 2)} MB` }}</div>
      </template>

      <template v-slot:item.upload-by="{ item }" v-if="!$scopedSlots['item.upload-by']">
        <div :class="`d-flex align-center`">
          <custom-avatar :name="item?.user?.full_name" :image="item?.user?.avatar" :size="24" />
          <color-label :text="item?.user?.full_name" />
        </div>
      </template>

      <template v-slot:item.compliance_item_control="{ item }" v-if="!$scopedSlots['item.compliance_item_control']">
        <div>
          {{ formatComplianceItemControl(item) }}
        </div>
      </template>

      <template v-slot:item.valid-date="{ item }" v-if="!$scopedSlots['item.valid-date']">
        <formated-date-time hide-time :date="item?.valid_until" :show-expired="true" />
      </template>

      <template v-slot:item.valid="{ item }" v-if="!$scopedSlots['item.valid']">
        <color-label
          :text="item.valid ? $t('page.valid') : $t('page.not_valid')"
          :color="item.valid ? 'success' : 'error'"
        />
      </template>

      <template v-slot:item.delete="{ item }" v-if="!$scopedSlots['item.delete']">
        <v-btn icon small @click="openDeleteConfirmationDialog(item)">
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
      </template>
    </custom-table>

    <confirm-dialog
      v-model="deleteConfirmationDialog"
      :title="$t('page.delete')"
      :message="$t('page.confirm_delete_message', { itemName: itemToDelete?.name })"
      :confirm-button-color="'red'"
      @confirm="deleteItem"
    ></confirm-dialog>
  </custom-table-wrapper>
</template>

<script>
import { mapState, mapActions } from "vuex"
import CustomTable from "../custom-table/CustomTable.vue"
import FilePreview from "../FilePreview.vue"
import { roundToDecimalPlaces } from "../../helpers/misc"
import CustomAvatar from "../profile/CustomAvatar.vue"
import ColorLabel from "../custom-table/ColorLabel.vue"
import CustomTableWrapper from "../custom-table/CustomTableWrapper.vue"

export default {
  components: {
    CustomTable,
    FilePreview,
    CustomAvatar,
    ColorLabel,
    CustomTableWrapper
  },
  name: "AttachmentsTable",
  props: {
    title: { type: String, required: true },
    headers: { type: Array, required: true },
    fetchParams: { type: Object, required: true },
    deleteConfig: { type: Object, default: () => ({}) },
    availableFilters: {
      type: Array,
      default: () => ["users", "risk", "reviewType", "reviewPurpose"],
      validator: (value) => {
        const allowedFilters = ["users", "risk", "reviewType", "reviewPurpose", "attachmentType"]
        return value.every((filter) => allowedFilters.includes(filter))
      }
    },
    // NEW: Add prop to allow parent to pass filtered items
    propItems: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      deleteConfirmationDialog: false,
      itemToDelete: null,
      tableConfig: {},
      filters: {
        user_ids: [],
        risk_id: null,
        type_id: null,
        purpose_id: null,
        attachment_type_id: null
      }
    }
  },
  computed: {
    ...mapState("allAttachments", [
      "attachments",
      "loading",
      "controlReviewTypes",
      "loadingControlReviewTypes",
      "controlReviewPurposes",
      "loadingControlReviewPurposes"
    ]),
    ...mapState("oss", ["attachmentTypes"]),
    ...mapState("users", { users: "users", loadingUsers: "loading" }),
    ...mapState("risk", { risks: "risks", loadingRisks: "loading.risks" }),
    ...mapState(["isRTL"]),
    isRTLClass() {
      return this.isRTL ? "flex-row-reverse justify-end" : ""
    },
    filteredAttachments() {
      if (this.$route.name === "oss-orders") {
        const userTypeCode = this.$auth.user.type.code
        if (userTypeCode === "owner" || userTypeCode === "b-owner" || userTypeCode === "c-owner") {
          return this.attachments.filter(
            (attachment) => attachment.user_typeCode !== "sm" && !attachment.user.user_typeCode.startsWith("eng")
          )
        }
      }
      return this.attachments
    },
    // NEW: Use propItems if provided, otherwise use filteredAttachments
    itemsToDisplay() {
      return this.propItems !== null ? this.propItems : this.filteredAttachments
    }
  },
  methods: {
    ...mapActions("allAttachments", [
      "fetchAttachments",
      "fetchControlReviewTypes",
      "fetchControlReviewPurposes",
      "removeAttachmentFromList"
    ]),
    ...mapActions("oss", ["getAttachmentTypes", "createOrderAttachment"]),
    ...mapActions("users", ["fetchUsers"]),
    ...mapActions("risk", { fetchRisks: "fetchRisks" }),
    roundToDecimalPlaces,
    openDeleteConfirmationDialog(item) {
      this.deleteConfirmationDialog = true
      this.itemToDelete = item
    },
    async deleteItem() {
      try {
        await this.deleteConfig.deleteFunc({
          attachmentId: this.itemToDelete?.id,
          parentId: this.itemToDelete[this.deleteConfig?.parentKey]?.id
        })
        this.removeAttachmentFromList(this.itemToDelete.id)
      } catch (error) {
        console.log(error)
      }
    },
    async getAttachments() {
      const payload = { ...this.fetchParams, ...this.filters }
      await this.fetchAttachments(payload)
    },
    formatComplianceItemControl(item) {
      const packageName = item.compliance_package.short_name
      const code = item?.audit_item_review?.audit_item?.compliance_item?.code

      // Remove first 'a' character if it exists
      const formattedCode = code && code.startsWith("a") ? code.substring(1) : code

      return `${packageName}-${formattedCode}`
    }
  },
  async mounted() {
    try {
      await this.getAttachments()

      const fetchPromises = []

      if (this.availableFilters.includes("users")) {
        fetchPromises.push(this.fetchUsers())
      }
      if (this.availableFilters.includes("risk")) {
        fetchPromises.push(this.fetchRisks())
      }
      if (this.availableFilters.includes("reviewType")) {
        fetchPromises.push(this.fetchControlReviewTypes())
      }
      if (this.availableFilters.includes("reviewPurpose")) {
        fetchPromises.push(this.fetchControlReviewPurposes())
      }
      if (this.availableFilters.includes("attachmentType")) {
        fetchPromises.push(this.getAttachmentTypes())
      }

      await Promise.all(fetchPromises)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }
}
</script>

<style scoped>
.file-name-cell {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* cursor: pointer; */
}
</style>
