<template>
  <div>
    <div v-if="isLoading" class="d-flex justify-center align-center pa-4">
      <circular-loading :show="isLoading" />
    </div>
    <div v-else-if="fields" class="d-flex flex-column pt-2">
      <!-- Header with title and action buttons -->
      <div class="d-flex flex-row justify-space-between mb-4">
        <h2>{{ computedTitle }}</h2>

        <div class="d-flex flex-row" style="gap: 8px">
          <v-can :permission="createAndUpdatePermission">
            <v-btn small color="primary" @click="handleSave" :loading="isSaving" :disabled="!canSave">
              {{ saveButtonText }}
            </v-btn>
          </v-can>
          <v-can :permission="permissions.delete">
            <v-btn
              v-if="!isCreateForm && showDeleteButton"
              small
              color="error"
              @click="openDeleteModal"
              :loading="isDeleting"
            >
              {{ $t("page.delete") }}
            </v-btn>
          </v-can>
        </div>
      </div>

      <!-- Error display -->
      <div v-if="error" class="d-flex flex-column align-center pa-4">
        <v-alert small type="error" class="mb-4">{{ error }}</v-alert>
      </div>

      <!-- Main content slot -->

      <slot
        :fields="fieldsProxy"
        :isCreateForm="isCreateForm"
        :isLoading="isLoading"
        :currentRecord="currentRecord"
        :updateField="updateField"
      ></slot>
    </div>

    <!-- Delete confirmation modal -->
    <custom-dialog v-model="showDeleteModal" :title="$t('table.delete')">
      <delete-items-modal pmweb-table :items="[currentRecord]" :config="deleteConfig" @close="closeDeleteModal" />
    </custom-dialog>
  </div>
</template>

<script>
import { toSnakeCase } from "../../helpers/misc"
import CircularLoading from "../common/CircularLoading.vue"
import DeleteItemsModal from "../custom-table/DeleteItemsModal.vue"
import CustomDialog from "../CustomDialog.vue"

export default {
  name: "PMWebDetailsTemplate",
  components: {
    CustomDialog,
    DeleteItemsModal,
    CircularLoading
  },
  props: {
    permissions: {
      type: Object
    },

    // Store configuration
    storeModule: {
      type: String,
      required: true // e.g., 'pmwebCommitments'
    },

    // Record identification
    recordId: {
      type: [String, Number],
      default: null
    },

    // UI Configuration
    title: {
      type: String,
      default: ""
    },
    showDeleteButton: {
      type: Boolean,
      default: true
    },
    deleteRedirectPath: {
      type: String,
      default: "" // Where to redirect after delete
    },

    // Form fields - can be passed in or will be populated from store
    initialFields: {
      type: Object,
      default: () => ({})
    },

    // Field validation
    requiredFields: {
      type: Array,
      default: () => []
    },

    // Custom field transformations before save
    transformFields: {
      type: Function,
      default: (fields) => fields
    },

    // Success redirect paths
    createSuccessPath: {
      type: String,
      default: "" // Where to redirect after successful create
    },
    updateSuccessPath: {
      type: String,
      default: "" // Where to redirect after successful update
    }
  },

  data() {
    return {
      fields: { ...this.initialFields },
      error: null,
      showDeleteModal: false
    }
  },

  computed: {
    entityName() {
      return this.storeModule.replace("pmweb", "")
    },
    singularEntity() {
      return this.entityName.endsWith("s") ? this.entityName.slice(0, -1) : this.entityName
    },
    snakeCaseEntity() {
      return toSnakeCase(this.singularEntity)
    },
    permissions() {
      return {
        create: `create_pmweb_${this.snakeCaseEntity}`,
        update: `update_pmweb_${this.snakeCaseEntity}`,
        delete: `delete_pmweb_${this.snakeCaseEntity}`
      }
    },

    isCreateForm() {
      return !this.recordId
    },

    computedTitle() {
      return this.isCreateForm
        ? this.title
          ? this.title
          : this.$t(`page.create_${this.singularEntity.toLowerCase()}`)
        : ""
    },
    createAndUpdatePermission() {
      return this.isCreateForm ? this.permissions.create : this.permissions.update
    },

    // Store getters - dynamically mapped based on storeModule prop
    currentRecord() {
      const getterName = this.getStoreGetterName("getCurrent")
      return this.$store.getters[`${this.storeModule}/${getterName}`]
    },

    isLoading() {
      return this.$store.getters[`${this.storeModule}/isLoading`]
    },

    isAdding() {
      const getterName = this.getStoreGetterName("isAdding")
      return this.$store.getters[`${this.storeModule}/${getterName}`]
    },

    isUpdating() {
      const getterName = this.getStoreGetterName("isUpdating")
      return this.$store.getters[`${this.storeModule}/${getterName}`]
    },

    isDeleting() {
      const getterName = this.getStoreGetterName("isDeleting")
      return this.$store.getters[`${this.storeModule}/${getterName}`]
    },

    isSaving() {
      return this.isCreateForm ? this.isAdding : this.isUpdating
    },

    saveButtonText() {
      return this.isCreateForm ? this.$t("page.save") : this.$t("page.update")
    },

    canSave() {
      // Check if all required fields are filled
      return this.requiredFields.every((field) => {
        const value = this.fields[field]
        return value !== null && value !== undefined && value !== ""
      })
    },

    fieldsProxy() {
      // Create a proxy object that handles v-model binding
      const proxy = {}
      const self = this

      Object.keys(this.fields).forEach((key) => {
        Object.defineProperty(proxy, key, {
          get() {
            return self.fields[key]
          },
          set(value) {
            self.updateField(key, value)
          },
          enumerable: true,
          configurable: true
        })
      })

      return proxy
    },

    deleteConfig() {
      return {
        delete: this.handleDelete,
        path: this.deleteRedirectPath
      }
    }
  },

  watch: {
    recordId: {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.loadRecord()
        }
      }
    },

    currentRecord: {
      immediate: true,
      handler(newRecord) {
        if (newRecord && !this.isCreateForm) {
          // Only update existing keys in this.fields with values from newRecord
          Object.keys(this.fields).forEach((key) => {
            if (newRecord.hasOwnProperty(key)) {
              this.$set(this.fields, key, newRecord[key])
            }
          })

          // Always add the Id from newRecord
          if (newRecord.hasOwnProperty("Id")) {
            this.$set(this.fields, "Id", newRecord.Id)
          }
        }
      }
    },

    initialFields: {
      immediate: true,
      deep: true,
      handler(newFields) {
        if (this.isCreateForm && Object.keys(newFields).length > 0) {
          this.fields = { ...newFields }
        }
      }
    }
  },

  methods: {
    // Helper to get correct getter/action names based on entity
    getStoreGetterName(prefix) {
      if (prefix === "getCurrent") {
        return `getCurrent${this.singularEntity}`
      } else if (prefix === "isAdding") {
        return `isAdding${this.singularEntity}`
      } else if (prefix === "isUpdating") {
        return `isUpdating${this.singularEntity}`
      } else if (prefix === "isDeleting") {
        return `isDeleting${this.singularEntity}`
      }

      return prefix
    },
    getStoreActionName(action) {
      // For pmwebCommitments, we want to get "Commitments" not "Commitment"
      const moduleWithoutPmweb = this.storeModule.replace("pmweb", "") // "Commitments"
      const singular = moduleWithoutPmweb.endsWith("s") ? moduleWithoutPmweb.slice(0, -1) : moduleWithoutPmweb

      if (action === "fetchById") {
        console.log("ACTION NAME", `fetch${this.singularEntity}ById`)
        return `fetch${this.singularEntity}ById`
      } else if (action === "add") {
        return `add${this.singularEntity}`
      } else if (action === "update") {
        return `update${this.singularEntity}`
      } else if (action === "delete") {
        return `delete${this.singularEntity}`
      }

      return action
    },

    async loadRecord() {
      if (!this.recordId) return

      this.error = null

      try {
        const actionName = this.getStoreActionName("fetchById")
        await this.$store.dispatch(`${this.storeModule}/${actionName}`, this.recordId)
      } catch (error) {
        console.error(`Failed to load record:`, error)
        this.error = error.message || this.$t("error.failed_to_load")
        this.$emit("load-error", error)
      }
    },

    updateField(fieldName, value) {
      this.$set(this.fields, fieldName, value)
      this.$emit("field-change", { field: fieldName, value, allFields: this.fields })
    },

    async handleSave() {
      this.error = null

      try {
        // Transform fields if needed
        const fieldsToSave = this.transformFields({ ...this.fields })

        // Emit before-save event for custom validation
        this.$emit("before-save", fieldsToSave)

        let result
        if (this.isCreateForm) {
          const actionName = this.getStoreActionName("add")
          console.log("Calling store action:", `${this.storeModule}/${actionName}`)
          console.log("With data:", fieldsToSave)
          result = await this.$store.dispatch(`${this.storeModule}/${actionName}`, fieldsToSave)
        } else {
          const actionName = this.getStoreActionName("update")
          console.log("Calling store action:", `${this.storeModule}/${actionName}`)
          console.log("With data:", fieldsToSave)
          result = await this.$store.dispatch(`${this.storeModule}/${actionName}`, fieldsToSave)
        }

        console.log("Store action result:", result)

        if (result && result.success) {
          this.$emit("save-success", result)

          // Handle redirect
          if (this.isCreateForm && this.createSuccessPath) {
            console.log("RESULT", result)
            // Replace :id in path with actual ID
            const path = this.createSuccessPath.replace(":id", result.data.Id)
            this.$router.push(this.localePath(path))
          } else if (!this.isCreateForm && this.updateSuccessPath) {
            this.$router.push(this.localePath(this.updateSuccessPath))
          }
        } else {
          this.error = result ? result.message : `Failed to ${this.isCreateForm ? "create" : "update"} record`
          this.$emit("save-error", { error: this.error, result })
        }
      } catch (error) {
        console.error(`Error saving record:`, error)
        this.error = error.message || `Failed to ${this.isCreateForm ? "create" : "update"} record`
        this.$emit("save-error", { error: this.error, exception: error })
      }
    },

    async handleDelete() {
      if (!this.recordId) return

      try {
        const actionName = this.getStoreActionName("delete")
        const result = await this.$store.dispatch(`${this.storeModule}/${actionName}`, this.recordId)

        if (result && result.success) {
          this.$emit("delete-success", result)

          if (this.deleteRedirectPath) {
            this.$router.push(this.localePath(this.deleteRedirectPath))
          }
        } else {
          this.$emit("delete-error", result)
        }
      } catch (error) {
        console.error("Error deleting record:", error)
        this.$emit("delete-error", { error: error.message, exception: error })
      }
    },

    openDeleteModal() {
      this.showDeleteModal = true
    },

    closeDeleteModal() {
      this.showDeleteModal = false
    },

    resetFields() {
      this.fields = { ...this.initialFields }
      this.error = null
      this.$emit("fields-reset")
    }
  }
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
