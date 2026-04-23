// mixins/treeValidationMixin.js
export const treeValidationMixin = {
  props: {
    // Tree configuration props that can be passed to any form using this mixin
    treeConfig: {
      type: Object,
      default: () => ({
        parentField: null, // e.g., 'bcm_plan_id'
        childrenField: "children", // usually 'children'
        itemsGetter: null, // e.g., 'bcmPlans/getPlans'
        primaryKey: "id" // usually 'id'
      })
    }
  },

  computed: {
    // Get the tree items from the store using the configured getter
    treeItems() {
      if (!this.treeConfig.itemsGetter) {
        console.warn("treeConfig.itemsGetter is required for tree validation")
        return []
      }
      const items = this.$store.getters[this.treeConfig.itemsGetter] || []
      return Array.isArray(items) ? items : []
    },

    // Filter out items that would create circular references
    availableParentItems() {
      // Always return tree items if they're not loaded yet or empty
      if (!this.treeItems || this.treeItems.length === 0) {
        return []
      }

      // For create mode or when parentField is not configured, all items are available
      if (!this.editForm || !this.itemId || !this.treeConfig.parentField) {
        return this.treeItems
      }

      // Ensure itemId is a number for proper comparison
      const currentItemId = typeof this.itemId === "string" ? parseInt(this.itemId) : this.itemId

      // For edit mode, filter out invalid parent options
      return this.treeItems.filter((item) => {
        const itemId = item[this.treeConfig.primaryKey]

        // Can't be parent of itself
        if (itemId === currentItemId) {
          return false
        }

        // Can't be parent if it would create circular reference
        if (this.wouldCreateCircularReference(itemId)) {
          return false
        }

        return true
      })
    }
  },

  methods: {
    // Helper method to check for circular references
    wouldCreateCircularReference(potentialParentId) {
      if (!potentialParentId || !this.itemId || !this.treeConfig.parentField) {
        return false
      }

      // Check if the potential parent is actually a descendant of the current item
      return this.isDescendant(this.itemId, potentialParentId, this.treeItems)
    },

    // Check if targetId is a descendant of ancestorId
    isDescendant(ancestorId, targetId, items, visited = new Set()) {
      const primaryKey = this.treeConfig.primaryKey
      const childrenField = this.treeConfig.childrenField

      // Prevent infinite loops
      if (visited.has(ancestorId)) {
        return false
      }
      visited.add(ancestorId)

      for (const item of items) {
        if (item[primaryKey] === ancestorId) {
          // Found the ancestor, now check its children
          if (item[childrenField]) {
            for (const child of item[childrenField]) {
              if (child[primaryKey] === targetId) {
                return true // Direct child
              }
              if (this.isDescendant(child[primaryKey], targetId, items, new Set(visited))) {
                return true // Descendant of child
              }
            }
          }
          break
        }
      }

      return false
    },

    // Validate parent selection (can be called from form validation)
    validateParentSelection(selectedParentId) {
      if (!selectedParentId || !this.treeConfig.parentField) {
        return { valid: true }
      }

      if (this.editForm && selectedParentId === this.itemId) {
        return {
          valid: false,
          message: "An item cannot be its own parent"
        }
      }

      if (this.editForm && this.wouldCreateCircularReference(selectedParentId)) {
        return {
          valid: false,
          message: "This selection would create a circular reference"
        }
      }

      return { valid: true }
    }
  }
}
