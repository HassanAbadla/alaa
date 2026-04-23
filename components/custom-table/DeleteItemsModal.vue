<template>
  <div>
    <v-card-text>{{ deleteMessage }}</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="red darken-1" text @click="confirmDelete" :disabled="isDeleting">
        {{ $t("table.delete") }}
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
export default {
  name: "DeleteItemsModal",
  props: {
    idKey: {
      type: String,
      default: "id"
    },
    value: {
      type: Boolean,
      required: true
    },
    items: {
      type: Array,
      default: () => []
    },
    config: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isDeleting: false
    }
  },
  computed: {
    showModal: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      }
    },
    isMultipleDelete() {
      return this.items.length > 1
    },
    computedName() {
      if (this.isMultipleDelete || this.items.length === 0) return ""
      const item = this.items[0]
      return item ? item[this.config?.itemNameKey] || item.full_name || item.name || item.code || item.id : ""
    },
    deleteMessage() {
      if (this.isMultipleDelete) {
        return this.$t("table.delete_selected_message", { count: this.items.length })
      }
      return this.$t("table.delete_message", { name: this.computedName })
    }
  },
  methods: {
    handleClose() {
      this.$emit("input", false)
      this.$emit("close")
    },
    async confirmDelete() {
      this.isDeleting = true
      let idsToRemove
      try {
        if (this.isMultipleDelete) {
          await Promise.all(this.items.map((item) => this.config.delete(item[this.idKey])))

          idsToRemove = this.items.map((item) => item[this.idKey])
        } else if (this.items.length === 1) {
          console.log("Deleting item with ID:", this.items[0][this.idKey])
          await this.config.delete(this.items[0][this.idKey])
          if (!this.pmwebTable) {
            idsToRemove = this.items[0][this.idKey]
          }
        }
        this.$emit("items-deleted", idsToRemove)
        this.handleClose()

        if (this.config?.path && !this.isMultipleDelete && this.items.length === 1) {
          console.log("Redirecting to:", this.localePath(this.config.path))
          this.$router.push(this.localePath(this.config.path))
        }
      } catch (error) {
        console.error("Error deleting item(s):", error)
      } finally {
        this.isDeleting = false
      }
    }
  }
}
</script>
