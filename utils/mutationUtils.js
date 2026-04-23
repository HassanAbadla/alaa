// utils/mutationUtils.js

/**
 * Creates a generic attachment count update mutation
 * @param {string} itemsStateKey - The key in state that contains the items array (e.g., 'threats', 'risks')
 * @param {string} primaryKey - The primary key field name (usually 'id')
 * @param {string} countField - The attachment count field name (usually 'attachments_count')
 * @returns {Function} - The mutation function
 */
export const createAttachmentCountMutation = (itemsStateKey, primaryKey = "id", countField = "attachments_count") => {
  return (state, { itemId, operation }) => {
    const item = state[itemsStateKey].find((item) => item[primaryKey] === itemId)
    if (item) {
      const currentCount = item[countField] || 0
      if (operation === "increment") {
        item[countField] = currentCount + 1
      } else if (operation === "decrement") {
        item[countField] = Math.max(0, currentCount - 1)
      }
    }
  }
}

/**
 * Common mutations that can be reused across stores
 */
export const commonMutations = {
  /**
   * Generic attachment count updater - auto-detects the items array
   */
  UPDATE_ATTACHMENT_COUNT: (state, { itemId, operation, countField = "attachments_count", primaryKey = "id" }) => {
    // Find the items array in state (look for array properties)
    const itemsArray = Object.values(state).find((val) => Array.isArray(val))
    if (itemsArray) {
      const item = itemsArray.find((item) => item[primaryKey] === itemId)
      if (item) {
        const currentCount = item[countField] || 0
        if (operation === "increment") {
          item[countField] = currentCount + 1
        } else if (operation === "decrement") {
          item[countField] = Math.max(0, currentCount - 1)
        }
      }
    }
  }
}

/**
 * Creates common store extensions for entities that support attachments
 */
export const createAttachmentStoreMixin = (itemsStateKey, primaryKey = "id") => ({
  mutations: {
    UPDATE_ATTACHMENT_COUNT: createAttachmentCountMutation(itemsStateKey, primaryKey)
  }
})
