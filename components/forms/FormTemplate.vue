<template>
  <form-wrapper @submit="submitForm" :loading="isAddingOrEditing">
    <!-- Pass formData and getFieldError function to the slot -->
    <circular-loading v-if="isLoading" />

    <slot :formData="formData" :updateField="updateField" :getFieldError="getFieldError"></slot>
  </form-wrapper>
</template>

<script>
import { mapActions } from "vuex"
import CircularLoading from "../common/CircularLoading.vue"
export default {
  components: { CircularLoading },
  name: "FormTemplate",
  props: {
    editForm: {
      type: Boolean,
      default: false
    },
    itemId: { type: Number },
    store: {
      type: String,
      required: true
    },
    singlularEntityName: {
      type: String,
      required: true
    },
    pluralEntityName: {
      type: String,
      required: true
    },
    fields: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formData: {}
    }
  },
  computed: {
    currentItem() {
      const item = this.$store.getters[`${this.store}/getCurrent${this.singlularEntityName}`]
      console.log(`Getting current item from store: ${this.store}/getCurrent${this.singlularEntityName}`, item)
      return item
    },
    isLoading() {
      return this.$store.getters[`${this.store}/isLoading`]
    },
    isAdding() {
      return this.$store.getters[`${this.store}/isAdding${this.singlularEntityName}`]
    },
    isUpdating() {
      return this.$store.getters[`${this.store}/isUpdating${this.singlularEntityName}`]
    },
    isAddingOrEditing() {
      return this.editForm ? this.isUpdating : this.isAdding
    },
    // Get validation errors from store
    validationErrors() {
      const error = this.$store.state[this.store].error
      return error && typeof error === "object" ? error : {}
    }
  },
  watch: {
    currentItem: {
      handler(newItem) {
        if (newItem && this.editForm) {
          console.log("CurrentItem changed:", newItem)
          this.populateFormData()
        }
      },
      immediate: true
    },
    fields: {
      immediate: true,
      handler(newFields) {
        if (!this.editForm || !this.itemId) {
          this.formData = { ...newFields }
          this.$nextTick(() => {
            this.setupFieldWatchers()
          })
        }
      }
    }
  },
  methods: {
    ...mapActions("drawer", ["closeDrawer"]),
    updateField(fieldName, value) {
      this.$set(this.formData, fieldName, value)
      // Clear field error when user starts typing
      this.clearFieldError(fieldName)
    },
    // Method to get field-specific errors
    getFieldError(fieldName) {
      const fieldErrors = this.validationErrors[fieldName]
      return fieldErrors && Array.isArray(fieldErrors) ? fieldErrors : []
    },
    // Method to clear specific field error
    clearFieldError(fieldName) {
      if (this.validationErrors[fieldName]) {
        const updatedErrors = { ...this.validationErrors }
        delete updatedErrors[fieldName]

        // If no errors left, set to null, otherwise update with remaining errors
        const newError = Object.keys(updatedErrors).length === 0 ? null : updatedErrors
        this.$store.commit(`${this.store}/SET_ERROR`, newError)
      }
    },
    // Dynamically set up watchers for all form fields
    setupFieldWatchers() {
      Object.keys(this.formData).forEach((fieldName) => {
        this.$watch(`formData.${fieldName}`, () => {
          this.clearFieldError(fieldName)
        })
      })
    },
    // Method to populate form data
    populateFormData() {
      if (!this.currentItem) return

      console.log("Populating form data...")
      console.log("Current item:", this.currentItem)
      console.log("Fields template:", this.fields)

      // Initialize formData with fields template first
      const newFormData = { ...this.fields }

      // Then populate with current item data
      Object.keys(newFormData).forEach((fieldName) => {
        if (this.currentItem.hasOwnProperty(fieldName)) {
          // Direct match - use the value as is
          newFormData[fieldName] = this.currentItem[fieldName]
          console.log(`Direct mapping ${fieldName}: ${this.currentItem[fieldName]}`)
        } else if (fieldName.endsWith("_id")) {
          // This is likely a relationship field, try to find the nested object
          const relationshipName = fieldName.replace("_id", "")

          // Check for exact match first
          if (this.currentItem.hasOwnProperty(relationshipName) && this.currentItem[relationshipName]?.id) {
            newFormData[fieldName] = this.currentItem[relationshipName].id
            console.log(
              `Relationship mapping ${fieldName}: ${this.currentItem[relationshipName].id} (from ${relationshipName})`
            )
          } else {
            // Try different variations of the relationship name
            const possibleNames = [
              relationshipName,
              relationshipName.replace("s", ""), // Remove plural 's' (e.g., grc_assets -> grc_asset)
              relationshipName + "s" // Add plural 's'
            ]

            for (const possibleName of possibleNames) {
              if (this.currentItem.hasOwnProperty(possibleName) && this.currentItem[possibleName]?.id) {
                newFormData[fieldName] = this.currentItem[possibleName].id
                console.log(
                  `Alternative relationship mapping ${fieldName}: ${this.currentItem[possibleName].id} (from ${possibleName})`
                )
                break
              }
            }
          }
        }
      })

      console.log("New form data:", newFormData)

      // Replace the entire formData object
      this.formData = newFormData

      // Force Vue to update
      this.$forceUpdate()

      console.log("Final formData:", this.formData)
    },
    async fetchCurrentItem(id) {
      console.log(`Fetching ${this.singlularEntityName} with ID:`, id)
      try {
        const result = await this.$store.dispatch(`${this.store}/fetch${this.singlularEntityName}ById`, id)
        console.log("Fetch result:", result)
        console.log("Current item after fetch:", this.currentItem)
        return result
      } catch (error) {
        console.error(`Error fetching ${this.singlularEntityName}:`, error)
        throw error
      }
    },
    async createItem(data) {
      return await this.$store.dispatch(`${this.store}/add${this.singlularEntityName}`, data)
    },
    async updateItem(data) {
      return await this.$store.dispatch(`${this.store}/update${this.singlularEntityName}`, data)
    },
    getFormDataFromItem() {
      if (!this.currentItem) return { ...this.fields }

      const formData = { ...this.fields }

      // Dynamically map all fields from currentItem to formData
      Object.keys(formData).forEach((fieldName) => {
        if (this.currentItem.hasOwnProperty(fieldName)) {
          formData[fieldName] = this.currentItem[fieldName]
        }
      })

      console.log("Current Item:", this.currentItem)
      console.log("Form Data after mapping:", formData)

      return formData
    },
    async submitForm() {
      // Clear all errors before submitting
      this.$store.commit(`${this.store}/SET_ERROR`, null)

      let res
      if (this.editForm) {
        res = await this.updateItem({ ...this.formData, id: this.itemId })
      } else {
        res = await this.createItem(this.formData)
      }
      console.log("res", res)
      if (res && res.success) {
        this.closeDrawer()
      }
    }
  },
  async mounted() {
    console.log("FormTemplate mounted. EditForm:", this.editForm, "ItemId:", this.itemId)
    console.log("Store:", this.store, "Entity:", this.singlularEntityName)

    if (this.editForm && this.itemId) {
      console.log("Fetching current item...")
      try {
        await this.fetchCurrentItem(this.itemId)
        console.log("Current item after fetch in mounted:", this.currentItem)

        if (this.currentItem) {
          this.populateFormData()
        } else {
          console.warn("Current item is still undefined after fetch")
        }
      } catch (error) {
        console.error("Failed to fetch current item:", error)
      }
    } else {
      this.formData = { ...this.fields }
    }

    // Set up field watchers
    this.$nextTick(() => {
      this.setupFieldWatchers()
    })
  }
}
</script>
