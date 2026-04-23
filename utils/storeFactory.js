// utils/storeFactory.js

export function createCrudStore(config) {
  const {
    // Main endpoint - used for all CRUD operations unless overridden
    endpoint,
    // Specific endpoint overrides
    endpoints = {},
    // Entity names (singular and plural)
    entityName = "item", // e.g., 'commitment'
    entityNamePlural = "items", // e.g., 'commitments'
    // Fields that need numeric sanitization
    numericFields = [],
    // Primary key field name
    primaryKey = "Id",
    // API plugin name
    apiPlugin = "$orsApi",
    // Custom data transformations
    transformRequest = (data) => data,
    transformResponse = (data) => data,
    // Custom getters that can override or extend defaults
    customGetters = {},
    // NEW: Headers configuration
    headers = {},
    // NEW: Custom extensions
    customState = {},
    customMutations = {},
    customActions = {},
    // NEW: Tree configuration
    treeConfig = null
  } = config

  // Build final endpoints object with main endpoint as default
  const finalEndpoints = {
    getAll: endpoint,
    getById: endpoint,
    create: endpoint,
    update: endpoint,
    delete: endpoint,
    bulkCreate: `${endpoint}/bulk`,
    // Override with any specific endpoints provided
    ...endpoints
  }

  // Helper function to get headers for a specific operation
  const getHeaders = (operation) => {
    const defaultHeaders = headers.default || {}
    const operationHeaders = headers[operation] || {}
    return { ...defaultHeaders, ...operationHeaders }
  }

  // Helper function to create axios config with headers
  const createAxiosConfig = (operation, additionalConfig = {}) => {
    const operationHeaders = getHeaders(operation)
    return {
      ...additionalConfig,
      headers: {
        ...operationHeaders,
        ...(additionalConfig.headers || {})
      }
    }
  }

  // Helper functions for consistent naming
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)
  const toUpperCase = (str) => str.toUpperCase()

  // Helper function to extract data based on API plugin
  const extractResponseData = (response) => {
    // Handle your API structure for both success and error responses

    if (response.data?.status === "success") {
      return response.data.data
    } else if (response.data?.status === "error") {
      // For errors, we want to return the response structure so we can handle it properly
      return response.data
    }
    // Fallback to original structure
    return response.data?.data || []
  }

  // Computed names used throughout the store
  const names = {
    entity: entityName,
    entityPlural: entityNamePlural,
    Entity: capitalize(entityName),
    EntityPlural: capitalize(entityNamePlural),
    ENTITY: toUpperCase(entityName),
    ENTITY_PLURAL: toUpperCase(entityNamePlural)
  }

  // State property names
  const stateProps = {
    items: names.entityPlural,
    currentItem: `current${names.Entity}`,
    adding: `adding${names.Entity}`,
    updating: `updating${names.Entity}`,
    deleting: `deleting${names.Entity}`
  }

  // Mutation names
  const mutations = {
    SET_ITEMS: `SET_${names.ENTITY_PLURAL}`,
    SET_CURRENT: `SET_CURRENT_${names.ENTITY}`,
    SET_ADDING: `SET_ADDING_${names.ENTITY}`,
    SET_UPDATING: `SET_UPDATING_${names.ENTITY}`,
    SET_DELETING: `SET_DELETING_${names.ENTITY}`,
    REMOVE_ITEM: `REMOVE_${names.ENTITY}`,
    UPDATE_ITEM: `UPDATE_${names.ENTITY}`,
    ADD_ITEM: `ADD_${names.ENTITY}`
  }

  // Action names
  const actions = {
    fetchItems: `fetch${names.EntityPlural}`,
    fetchById: `fetch${names.Entity}ById`,
    addItem: `add${names.Entity}`,
    updateItem: `update${names.Entity}`,
    deleteItem: `delete${names.Entity}`,
    bulkAddItems: `bulkAdd${names.EntityPlural}`
  }

  // Getter names
  const getters = {
    getItems: `get${names.EntityPlural}`,
    getCurrentItem: `getCurrent${names.Entity}`,
    isAdding: `isAdding${names.Entity}`,
    isUpdating: `isUpdating${names.Entity}`,
    isDeleting: `isDeleting${names.Entity}`
  }

  // Helper function to sanitize numeric fields
  const sanitizeNumericFields = (data) => {
    const sanitized = { ...data }
    numericFields.forEach((field) => {
      if (field in sanitized && sanitized[field] !== null && sanitized[field] !== undefined) {
        sanitized[field] = Number(sanitized[field])
      }
    })
    return sanitized
  }

  // Enhanced helper functions for tree operations (only if treeConfig is provided)
  const treeHelpers = treeConfig
    ? {
        // Find an item in a nested tree structure
        findItemInTree(items, targetId, childrenField = "children") {
          for (const item of items) {
            if (item[primaryKey] === targetId) {
              return item
            }
            if (item[childrenField] && item[childrenField].length > 0) {
              const found = this.findItemInTree(item[childrenField], targetId, childrenField)
              if (found) return found
            }
          }
          return null
        },

        // Check if setting a new parent would create a circular reference
        wouldCreateCircularReference(
          items,
          itemId,
          newParentId,
          childrenField = "children",
          parentField = "parent_id"
        ) {
          if (!newParentId || itemId === newParentId) {
            return itemId === newParentId // Self-reference is circular
          }

          // Traverse up the parent chain from newParentId
          let currentParentId = newParentId
          const visitedIds = new Set([itemId]) // Track visited IDs to prevent infinite loops

          while (currentParentId) {
            if (visitedIds.has(currentParentId)) {
              return true // Found a cycle
            }

            visitedIds.add(currentParentId)

            // Find the parent item
            const parentItem = this.findItemInTree(items, currentParentId, childrenField)

            if (!parentItem) {
              break // Parent not found, no cycle possible
            }

            currentParentId = parentItem[parentField]
          }

          return false
        },

        // Get all descendant IDs of an item
        getAllDescendantIds(items, parentId, childrenField = "children") {
          const descendants = new Set()

          const collectDescendants = (currentItems) => {
            for (const item of currentItems) {
              if (item[primaryKey] === parentId) {
                if (item[childrenField]) {
                  this.addAllDescendantsToSet(item[childrenField], descendants, childrenField)
                }
                break
              }
              if (item[childrenField]) {
                collectDescendants(item[childrenField])
              }
            }
          }

          collectDescendants(items)
          return descendants
        },

        // Helper to recursively add all descendants to a set
        addAllDescendantsToSet(items, descendants, childrenField = "children") {
          for (const item of items) {
            descendants.add(item[primaryKey])
            if (item[childrenField]) {
              this.addAllDescendantsToSet(item[childrenField], descendants, childrenField)
            }
          }
        },

        // Add child to parent's children array
        addChildToParent(items, parentId, childItem, childrenField = "children") {
          const parent = this.findItemInTree(items, parentId, childrenField)
          if (parent) {
            if (!parent[childrenField]) {
              parent[childrenField] = []
            }
            // Check if child already exists to avoid duplicates
            const existingIndex = parent[childrenField].findIndex(
              (child) => child[primaryKey] === childItem[primaryKey]
            )
            if (existingIndex === -1) {
              parent[childrenField].push(childItem)
              return true
            }
          }
          return false
        },

        // Remove child from parent's children array
        removeChildFromParent(items, parentId, childId, childrenField = "children") {
          const parent = this.findItemInTree(items, parentId, childrenField)
          if (parent && parent[childrenField]) {
            const childIndex = parent[childrenField].findIndex((child) => child[primaryKey] === childId)
            if (childIndex !== -1) {
              parent[childrenField].splice(childIndex, 1)
              return true
            }
          }
          return false
        },

        // Remove item from tree (could be at any level)
        removeItemFromTree(items, targetId, childrenField = "children") {
          for (let i = 0; i < items.length; i++) {
            if (items[i][primaryKey] === targetId) {
              items.splice(i, 1)
              return true
            }
            if (items[i][childrenField] && items[i][childrenField].length > 0) {
              const removed = this.removeItemFromTree(items[i][childrenField], targetId, childrenField)
              if (removed) return true
            }
          }
          return false
        },

        // Update item in tree (updates ALL instances)
        updateItemInTree(items, updatedItem, childrenField = "children") {
          let foundAny = false

          for (let i = 0; i < items.length; i++) {
            if (items[i][primaryKey] === updatedItem[primaryKey]) {
              // Preserve children array when updating
              const existingChildren = items[i][childrenField] || []
              items[i] = { ...updatedItem, [childrenField]: existingChildren }
              foundAny = true
              // Continue searching for other instances
            }

            if (items[i][childrenField] && items[i][childrenField].length > 0) {
              const updated = this.updateItemInTree(items[i][childrenField], updatedItem, childrenField)
              if (updated) foundAny = true
            }
          }

          return foundAny
        }
      }
    : {}

  // Helper function to handle API responses consistently
  const handleApiResponse = async (response, operation, dispatch, commit, fallbackId = null) => {
    const responseData = extractResponseData(response)

    if (response.status >= 200 && response.status < 300) {
      // Success case
      if (responseData && responseData.status !== "error") {
        const itemId = responseData[primaryKey] || fallbackId

        // For create and update operations, try to use the returned data
        if (operation === "create" || operation === "update") {
          // Check if we have actual item data (not just success message)
          if (responseData && typeof responseData === "object" && responseData[primaryKey]) {
            try {
              // Apply the same transformation as other data flows
              const transformedItem = transformResponse(responseData)

              if (operation === "create") {
                commit(mutations.ADD_ITEM, transformedItem)
              } else if (operation === "update") {
                commit(mutations.UPDATE_ITEM, transformedItem)
              }

              return {
                success: true,
                data: { [primaryKey]: itemId },
                message: `${names.Entity} ${operation}d successfully`
              }
            } catch (transformError) {
              console.warn(`${operation}d ${names.entity} but couldn't transform response data:`, transformError)
            }
          }

          // Fallback: fetch by ID if we don't have complete data
          if (itemId && dispatch) {
            try {
              const fetchedItem = await dispatch(actions.fetchById, itemId)
              if (fetchedItem) {
                if (operation === "create") {
                  commit(mutations.ADD_ITEM, fetchedItem)
                } else if (operation === "update") {
                  commit(mutations.UPDATE_ITEM, fetchedItem)
                }
              }
            } catch (fetchError) {
              console.warn(`${operation}d ${names.entity} but couldn't fetch details:`, fetchError)
            }
          }
        }

        return {
          success: true,
          data: { [primaryKey]: itemId },
          message: `${names.Entity} ${operation}d successfully`
        }
      } else {
        return {
          success: true,
          data: fallbackId ? { [primaryKey]: fallbackId } : {},
          message: `${names.Entity} ${operation}d successfully`
        }
      }
    } else {
      // Error case - handle your API error structure
      if (responseData && responseData.status === "error") {
        // Extract error message from your API structure
        let errorMessage = `Failed to ${operation} ${names.entity}`

        if (responseData.message) {
          if (typeof responseData.message === "object") {
            // Handle validation errors (object with field names as keys)
            const firstError = Object.values(responseData.message)[0]
            errorMessage = Array.isArray(firstError) ? firstError[0] : firstError
          } else {
            // Handle simple string messages
            errorMessage = responseData.message
          }
        }

        throw new Error(errorMessage)
      } else {
        throw new Error(`Failed to ${operation} ${names.entity}`)
      }
    }
  }

  // Helper function to handle delete responses
  const handleDeleteResponse = (response, idsToDelete, commit) => {
    const responseData = extractResponseData(response)

    if (response.status >= 200 && response.status < 300) {
      // Handle your current API format: {"status": "success"}
      if (responseData && responseData.status === "success") {
        const deletedIds = Array.isArray(idsToDelete) ? idsToDelete : [idsToDelete]

        // Remove each item from the store
        deletedIds.forEach((id) => {
          commit(mutations.REMOVE_ITEM, id)
        })

        return {
          success: true,
          data: deletedIds,
          message: `${deletedIds.length} ${names.entity}(s) deleted successfully`
        }
      } else {
        // If we have a successful HTTP status but unexpected response, still remove items
        const deletedIds = Array.isArray(idsToDelete) ? idsToDelete : [idsToDelete]

        deletedIds.forEach((id) => {
          commit(mutations.REMOVE_ITEM, id)
        })

        return {
          success: true,
          data: deletedIds,
          message: `${deletedIds.length} ${names.entity}(s) deleted successfully`
        }
      }
    } else {
      // Error case
      throw new Error(`Failed to delete ${names.entityPlural}`)
    }
  }

  // Create default getters
  const defaultGetters = {
    [getters.getItems]: (state) => state[stateProps.items],
    [getters.getCurrentItem]: (state) => state[stateProps.currentItem],
    isLoading: (state) => state.loading,
    hasError: (state) => state.error,
    [getters.isAdding]: (state) => state[stateProps.adding],
    [getters.isUpdating]: (state) => state[stateProps.updating],
    [getters.isDeleting]: (state) => state[stateProps.deleting]
  }

  // Merge custom getters with defaults (custom getters can override defaults)
  const finalGetters = { ...defaultGetters, ...customGetters }

  // Create default state
  const defaultState = {
    [stateProps.items]: [],
    [stateProps.currentItem]: null,
    loading: false,
    error: null,
    [stateProps.adding]: false,
    [stateProps.updating]: false,
    [stateProps.deleting]: false
  }

  // Create default mutations
  const defaultMutations = {
    [mutations.SET_ITEMS](state, items) {
      state[stateProps.items] = items
    },
    [mutations.SET_CURRENT](state, item) {
      state[stateProps.currentItem] = item
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    [mutations.SET_ADDING](state, isAdding) {
      state[stateProps.adding] = isAdding
    },
    [mutations.SET_UPDATING](state, isUpdating) {
      state[stateProps.updating] = isUpdating
    },
    [mutations.SET_DELETING](state, isDeleting) {
      state[stateProps.deleting] = isDeleting
    },
    [mutations.REMOVE_ITEM](state, id) {
      if (treeConfig) {
        // For tree structures, remove from anywhere in the tree
        treeHelpers.removeItemFromTree(state[stateProps.items], id, treeConfig.childrenField || "children")
      } else {
        // For flat structures, remove from main array
        state[stateProps.items] = state[stateProps.items].filter((item) => item[primaryKey] !== id)
      }

      if (state[stateProps.currentItem] && state[stateProps.currentItem][primaryKey] === id) {
        state[stateProps.currentItem] = null
      }
    },
    [mutations.UPDATE_ITEM](state, updatedItem) {
      if (treeConfig) {
        const parentField = treeConfig.parentField
        const childrenField = treeConfig.childrenField || "children"

        // First, find the existing item to get its current parent
        const existingItem = treeHelpers.findItemInTree(state[stateProps.items], updatedItem[primaryKey], childrenField)

        if (existingItem) {
          const oldParentId = existingItem[parentField]
          const newParentId = updatedItem[parentField]

          // Validate against circular references
          if (
            newParentId &&
            treeHelpers.wouldCreateCircularReference(
              state[stateProps.items],
              updatedItem[primaryKey],
              newParentId,
              childrenField,
              parentField
            )
          ) {
            console.warn(`Cannot update ${names.entity}: would create circular reference`)
            return
          }

          // Check if parent has changed
          if (oldParentId !== newParentId) {
            // Parent has changed - need to move the item

            // First, update the item data
            treeHelpers.updateItemInTree(state[stateProps.items], updatedItem, childrenField)

            // Then move it to the new parent location
            if (oldParentId) {
              // Remove from old parent's children
              treeHelpers.removeChildFromParent(
                state[stateProps.items],
                oldParentId,
                updatedItem[primaryKey],
                childrenField
              )
            } else {
              // Remove from root level
              const rootIndex = state[stateProps.items].findIndex(
                (rootItem) => rootItem[primaryKey] === updatedItem[primaryKey]
              )
              if (rootIndex !== -1) {
                state[stateProps.items].splice(rootIndex, 1)
              }
            }

            // Add to new parent location
            if (newParentId) {
              // Add to new parent's children
              const added = treeHelpers.addChildToParent(
                state[stateProps.items],
                newParentId,
                updatedItem,
                childrenField
              )

              // If parent not found, add to root level as fallback
              if (!added) {
                const existingIndex = state[stateProps.items].findIndex(
                  (item) => item[primaryKey] === updatedItem[primaryKey]
                )
                if (existingIndex === -1) {
                  state[stateProps.items].push(updatedItem)
                }
              }
            } else {
              // Add to root level (newParentId is null)
              const existingIndex = state[stateProps.items].findIndex(
                (item) => item[primaryKey] === updatedItem[primaryKey]
              )
              if (existingIndex === -1) {
                state[stateProps.items].push(updatedItem)
              }
            }
          } else {
            // Parent hasn't changed - just update the item data
            treeHelpers.updateItemInTree(state[stateProps.items], updatedItem, childrenField)
          }

          // Force Vue reactivity by replacing the array reference
          state[stateProps.items] = [...state[stateProps.items]]
        }
      } else {
        // For flat structures, update in main array
        const index = state[stateProps.items].findIndex((item) => item[primaryKey] === updatedItem[primaryKey])
        if (index !== -1) {
          state[stateProps.items].splice(index, 1, updatedItem)
        }
      }
    },
    [mutations.ADD_ITEM](state, newItem) {
      if (treeConfig && newItem[treeConfig.parentField]) {
        // If item has a parent, add it to parent's children
        const parentId = newItem[treeConfig.parentField]
        const added = treeHelpers.addChildToParent(
          state[stateProps.items],
          parentId,
          newItem,
          treeConfig.childrenField || "children"
        )

        // If parent not found, add to root level
        if (!added) {
          const existingIndex = state[stateProps.items].findIndex((item) => item[primaryKey] === newItem[primaryKey])
          if (existingIndex === -1) {
            state[stateProps.items].push(newItem)
          }
        }
      } else {
        // No parent or no tree config, add to root level
        const existingIndex = state[stateProps.items].findIndex((item) => item[primaryKey] === newItem[primaryKey])
        if (existingIndex === -1) {
          state[stateProps.items].push(newItem)
        }
      }
    },

    // Generic mutation for updating attachment counts
    UPDATE_ATTACHMENT_COUNT(state, { itemId, operation, countField = "attachments_count" }) {
      const findAndUpdateCount = (items, targetId) => {
        for (const item of items) {
          if (item[primaryKey] === targetId) {
            const currentCount = item[countField] || 0
            if (operation === "increment") {
              item[countField] = currentCount + 1
            } else if (operation === "decrement") {
              item[countField] = Math.max(0, currentCount - 1)
            }
            return true
          }
          if (treeConfig && item[treeConfig.childrenField || "children"]) {
            const found = findAndUpdateCount(item[treeConfig.childrenField || "children"], targetId)
            if (found) return true
          }
        }
        return false
      }

      findAndUpdateCount(state[stateProps.items], itemId)
    },

    // Tree-specific mutations (only added if treeConfig exists)
    ...(treeConfig
      ? {
          ADD_CHILD_TO_PARENT(state, { parentId, childItem }) {
            treeHelpers.addChildToParent(
              state[stateProps.items],
              parentId,
              childItem,
              treeConfig.childrenField || "children"
            )
          },

          REMOVE_CHILD_FROM_PARENT(state, { parentId, childId }) {
            treeHelpers.removeChildFromParent(
              state[stateProps.items],
              parentId,
              childId,
              treeConfig.childrenField || "children"
            )
          },

          MOVE_ITEM_TO_PARENT(state, { itemId, oldParentId, newParentId }) {
            const childrenField = treeConfig.childrenField || "children"

            // Find the item first
            const item = treeHelpers.findItemInTree(state[stateProps.items], itemId, childrenField)
            if (!item) return

            // Remove from old location
            if (oldParentId) {
              treeHelpers.removeChildFromParent(state[stateProps.items], oldParentId, itemId, childrenField)
            } else {
              // Remove from root level
              const rootIndex = state[stateProps.items].findIndex((rootItem) => rootItem[primaryKey] === itemId)
              if (rootIndex !== -1) {
                state[stateProps.items].splice(rootIndex, 1)
              }
            }

            // Add to new location
            if (newParentId) {
              treeHelpers.addChildToParent(state[stateProps.items], newParentId, item, childrenField)
            } else {
              // Add to root level
              state[stateProps.items].push(item)
            }
          }
        }
      : {})
  }

  // Create default actions
  const defaultActions = {
    async [actions.fetchItems]({ commit }, filters = {}) {
      try {
        commit("SET_LOADING", true)
        commit(mutations.SET_ITEMS, [])

        // Clean up filters
        const cleanFilters = {}
        for (const key in filters) {
          if (filters[key] !== null && filters[key] !== undefined && filters[key] !== "") {
            cleanFilters[key] = filters[key]
          }
        }

        const axiosConfig = createAxiosConfig("getAll", {
          params: cleanFilters
        })

        const response = await this[apiPlugin].get(finalEndpoints.getAll, axiosConfig)

        const responseCleanup = extractResponseData(response)
        const transformedData = transformResponse(responseCleanup)
        commit(mutations.SET_ITEMS, transformedData)
        commit("SET_ERROR", null)
      } catch (error) {
        commit("SET_ERROR", error)
        console.error(`Error fetching ${names.entityPlural}:`, error)
      } finally {
        commit("SET_LOADING", false)
      }
    },

    async [actions.fetchById]({ commit }, id) {
      try {
        commit("SET_LOADING", true)
        commit(mutations.SET_CURRENT, null)

        const axiosConfig = createAxiosConfig("getById")
        const response = await this[apiPlugin].get(`${finalEndpoints.getById}/${id}`, axiosConfig)

        const responseData = extractResponseData(response)
        const transformedData = transformResponse(responseData)

        commit(mutations.SET_CURRENT, transformedData)
        commit("SET_ERROR", null)
        return transformedData
      } catch (error) {
        commit("SET_ERROR", error)
        console.error(`Error fetching ${names.entity} with ID ${id}:`, error)
        throw error
      } finally {
        commit("SET_LOADING", false)
      }
    },

    async [actions.addItem]({ commit, dispatch }, itemData) {
      try {
        commit(mutations.SET_ADDING, true)
        commit("SET_ERROR", null)

        const sanitizedData = sanitizeNumericFields(itemData)
        // Don't transform FormData objects - they need to stay as FormData for file uploads
        const transformedData = itemData instanceof FormData ? itemData : transformRequest(sanitizedData)

        const axiosConfig = createAxiosConfig("create")

        const response = await this[apiPlugin].post(finalEndpoints.create, transformedData, axiosConfig)

        const result = await handleApiResponse(response, "create", dispatch, commit)

        // Update parent entity attachment count if successful
        if (result.success && config.updateParentCount) {
          await config.updateParentCount(dispatch, sanitizedData, "increment")
        }

        return result
      } catch (error) {
        console.error(`Error adding ${names.entity}:`, error)

        // Extract proper error message from your API response
        let errorMessage = error.message || `An error occurred while creating the ${names.entity}`

        // Check if this is an HTTP error with response data
        if (error.response && error.response.data) {
          if (error.response.data.status === "error" && error.response.data.message) {
            const apiErrorMessage = error.response.data.message

            if (typeof apiErrorMessage === "object") {
              // Store the entire validation errors object
              commit("SET_ERROR", apiErrorMessage)
              return {
                success: false,
                data: null,
                message: "Validation errors occurred",
                errors: apiErrorMessage
              }
            } else {
              // Handle simple string messages
              errorMessage = apiErrorMessage
            }
          }
        }

        commit("SET_ERROR", errorMessage)
        return {
          success: false,
          data: null,
          message: errorMessage
        }
      } finally {
        commit(mutations.SET_ADDING, false)
      }
    },

    async [actions.updateItem]({ commit, dispatch }, itemData) {
      try {
        commit(mutations.SET_UPDATING, true)
        commit("SET_ERROR", null)

        if (!itemData[primaryKey]) {
          throw new Error(`${primaryKey} is required to update a ${names.entity}`)
        }

        const sanitizedData = sanitizeNumericFields(itemData)
        const transformedData = transformRequest(sanitizedData)

        const axiosConfig = createAxiosConfig("update")
        const response = await this[apiPlugin].put(
          finalEndpoints.update + `/${transformedData[primaryKey]}`,
          transformedData,
          axiosConfig
        )

        const result = await handleApiResponse(response, "update", dispatch, commit, sanitizedData[primaryKey])

        return result
      } catch (error) {
        console.error(`Error updating ${names.entity}:`, error)
        commit("SET_ERROR", error)
        return {
          success: false,
          data: null,
          message: error.message || `An error occurred while updating the ${names.entity}`
        }
      } finally {
        commit(mutations.SET_UPDATING, false)
      }
    },

    async [actions.deleteItem]({ commit }, idToDelete) {
      try {
        commit(mutations.SET_DELETING, true)
        commit("SET_ERROR", null)

        if (!idToDelete) {
          throw new Error(`${names.entity} ID must be provided`)
        }

        const axiosConfig = createAxiosConfig("delete")
        const response = await this[apiPlugin].delete(`${finalEndpoints.delete}/${idToDelete}`, axiosConfig)

        const result = handleDeleteResponse(response, idToDelete, commit)

        // Update parent entity attachment count if successful
        if (result.success && config.updateParentCount) {
          // We need to get the parent ID from the deleted item
          const deletedItem = state[stateProps.items].find((item) => item[primaryKey] === idToDelete)
          if (deletedItem) {
            await config.updateParentCount(dispatch, deletedItem, "decrement")
          }
        }

        return result
      } catch (error) {
        console.error(`Error deleting ${names.entity}:`, error)
        commit("SET_ERROR", error)
        return {
          success: false,
          data: null,
          message: error.message || `An error occurred while deleting the ${names.entity}(s)`
        }
      } finally {
        commit(mutations.SET_DELETING, false)
      }
    },

    async [actions.bulkAddItems]({ commit, dispatch }, itemsArray) {
      try {
        commit(mutations.SET_ADDING, true)
        commit("SET_ERROR", null)

        if (!Array.isArray(itemsArray) || itemsArray.length === 0) {
          throw new Error(`An array of ${names.entityPlural} must be provided`)
        }

        // Sanitize numeric fields for each item
        const sanitizedItems = itemsArray.map((item) => sanitizeNumericFields(item))

        // Transform each item
        const transformedItems = sanitizedItems.map((item) => transformRequest(item))

        // Wrap in the entity plural name
        const payload = {
          [names.entityPlural]: transformedItems
        }

        const axiosConfig = createAxiosConfig("create")
        const response = await this[apiPlugin].post(finalEndpoints.bulkCreate, payload, axiosConfig)

        // Handle success response
        if (response.status >= 200 && response.status < 300) {
          const responseData = response.data

          if (responseData.status === "success") {
            // Extract the created items from response
            const createdItems = responseData.data?.[names.entityPlural] || []

            // Transform and add each item to the store
            const transformedCreatedItems = createdItems.map((item) => transformResponse(item))
            transformedCreatedItems.forEach((item) => {
              commit(mutations.ADD_ITEM, item)
            })

            return {
              success: true,
              data: transformedCreatedItems,
              message: responseData.message || `${createdItems.length} ${names.entityPlural} created successfully`,
              count: createdItems.length
            }
          }
        }

        // Handle error response
        if (response.data?.status === "error") {
          throw {
            message: response.data.message || `Failed to create ${names.entityPlural}`,
            errors: response.data.errors || {},
            isBulkError: true
          }
        }

        throw new Error(`Failed to create ${names.entityPlural}`)
      } catch (error) {
        console.error(`Error bulk adding ${names.entityPlural}:`, error)

        // Handle bulk validation errors
        if (error.isBulkError || error.response?.data?.status === "error") {
          const errorData = error.errors || error.response?.data?.errors || {}

          commit("SET_ERROR", errorData)
          return {
            success: false,
            data: null,
            message: error.message || `Validation errors occurred while creating ${names.entityPlural}`,
            errors: errorData
          }
        }

        // Handle other errors
        const errorMessage = error.message || `An error occurred while creating ${names.entityPlural}`
        commit("SET_ERROR", errorMessage)
        return {
          success: false,
          data: null,
          message: errorMessage
        }
      } finally {
        commit(mutations.SET_ADDING, false)
      }
    }
  }

  return {
    state: () => ({
      ...defaultState,
      ...customState
    }),

    mutations: {
      ...defaultMutations,
      ...customMutations
    },

    actions: {
      ...defaultActions,
      ...customActions
    },

    getters: finalGetters
  }
}
