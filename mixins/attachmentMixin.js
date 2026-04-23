// mixins/attachmentMixin.js

export const attachmentMixin = {
  data() {
    return {
      attachmentListDialog: {
        show: false,
        item: null,
        title: ""
      },
      attachmentFormDialog: {
        show: false,
        itemId: null
      }
    }
  },

  methods: {
    /**
     * Open the attachment list dialog for a specific item
     * @param {Object} item - The parent item (risk, threat, etc.)
     */
    openAttachmentListDialog(item) {
      this.attachmentListDialog.item = item
      this.attachmentListDialog.title =
        item.name || item.description || item.code || item.threat_name || `${this.entityDisplayName} ${item.id}`
      this.attachmentListDialog.show = true

      // Fetch attachments for this item using fetchAttachmentById
      this.fetchAttachments(item.id)
    },

    /**
     * Open the attachment form dialog for adding new attachment
     * @param {Object} item - The parent item
     */
    openAttachmentFormDialog(item) {
      this.attachmentFormDialog.item = item
      this.attachmentFormDialog.itemId = item.id
      this.attachmentFormDialog.show = true
    },

    /**
     * Fetch attachments for a specific item
     * @param {Number} itemId - The parent item ID
     */
    async fetchAttachments(itemId) {
      try {
        // Pass the parent ID as a parameter (e.g., bcm_threats_id for threats)
        const params = {
          [this.parentIdField]: itemId
        }
        await this.$store.dispatch(this.fetchAttachmentsAction, params)
      } catch (error) {
        console.error(`Error fetching ${this.entityName} attachments:`, error)
        this.handleAttachmentError(error?.message || "Failed to fetch attachments")
      }
    },

    /**
     * Handle attachment added event
     * @param {Object} data - Contains attachment and parent ID
     */
    handleAttachmentAdded(data) {
      this.attachmentFormDialog.show = false

      // Update attachment count using store mutation
      const itemId = data.parentId || data[this.parentIdField]
      this.updateParentAttachmentCount(itemId, "increment")

      // Show success message
      this.$toast.showMessage({
        message: this.$t("message.attachment_added_successfully"),
        status: "success"
      })

      // Refresh the attachment list if dialog is open
      if (this.attachmentListDialog.show && this.attachmentListDialog.item?.id === itemId) {
        this.fetchAttachments(itemId)
      }
    },

    /**
     * Handle attachment update
     * @param {Number} attachmentId - ID of attachment to update
     * @param {Object} payload - Update payload
     */
    async handleUpdateAttachment(attachmentId, payload) {
      try {
        await this.$store.dispatch(this.updateAttachmentAction, {
          id: attachmentId,
          payload,
          parentId: this.attachmentListDialog.item?.id
        })

        this.$toast.showMessage({
          message: this.$t("message.attachment_updated_successfully"),
          status: "success"
        })
      } catch (error) {
        console.error("Error updating attachment:", error)
        this.handleAttachmentError(error?.message || "Failed to update attachment")
      }
    },

    /**
     * Handle attachment deletion
     * @param {Number} attachmentId - ID of attachment to delete
     */
    // In your attachmentMixin.js
    async handleDeleteAttachment(attachmentId) {
      try {
        // Pass just the ID directly, not wrapped in an object
        await this.$store.dispatch(this.deleteAttachmentAction, attachmentId)

        // Update attachment count using store mutation
        this.updateParentAttachmentCount(this.attachmentListDialog.item?.id, "decrement")

        this.$toast.showMessage({
          message: this.$t("message.attachment_deleted_successfully"),
          status: "success"
        })
      } catch (error) {
        console.error("Error deleting attachment:", error)
        this.handleAttachmentError(error?.message || "Failed to delete attachment")
      }
    },

    /**
     * Update parent entity attachment count via store mutation
     * @param {Number} itemId - Parent item ID
     * @param {String} operation - 'increment' or 'decrement'
     */
    updateParentAttachmentCount(itemId, operation) {
      if (!itemId || !this.parentStoreName) {
        console.warn("Missing itemId or parentStoreName for attachment count update")
        return
      }

      try {
        console.log(`Updating ${this.parentStoreName} attachment count for item ${itemId}: ${operation}`)
        this.$store.commit(`${this.parentStoreName}/UPDATE_ATTACHMENT_COUNT`, {
          itemId,
          operation,
          countField: this.attachmentCountField
        })
      } catch (error) {
        console.warn("Could not update parent attachment count via store mutation:", error)
        // Fallback to direct item update
        this.updateAttachmentCount(itemId, operation === "increment" ? 1 : -1)
      }
    },

    /**
     * Update attachment count for an item (fallback method)
     * @param {Number} itemId - Parent item ID
     * @param {Number} change - Change in count (+1 or -1)
     */
    updateAttachmentCount(itemId, change) {
      if (!this.attachmentCountField || !this.items) return

      const item = this.items.find((item) => item.id === itemId)
      if (item && this.attachmentCountField in item) {
        const currentCount = item[this.attachmentCountField] || 0
        item[this.attachmentCountField] = Math.max(0, currentCount + change)
        console.log(`Direct update: ${this.attachmentCountField} = ${item[this.attachmentCountField]}`)
      }
    },

    /**
     * Get attachment URL for download/view
     * @param {Object} attachment - Attachment object
     * @returns {String} - Full URL to attachment
     */
    getAttachmentUrl(attachment) {
      // Customize this based on your API structure
      return `https://api.ordonsoft.com/storage/${attachment.path}`
    },

    /**
     * Handle attachment-related errors
     * @param {String} message - Error message
     */
    handleAttachmentError(message) {
      this.$toast.showMessage({
        message: message,
        status: "error"
      })
    }
  },

  computed: {
    /**
     * Get attachments from the store
     */
    attachments() {
      if (!this.attachmentStoreName) return []
      return this.$store.getters[`${this.attachmentStoreName}/getAttachments`] || []
    },

    /**
     * Get attachment loading state
     */
    attachmentLoading() {
      if (!this.attachmentStoreName) return false
      return this.$store.getters[`${this.attachmentStoreName}/isLoading`] || false
    }
  }
}
