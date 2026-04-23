// store/modules.js
import { createCrudStore } from "~/utils/storeFactory"

const STORAGE_KEY = "selected_module"

// Helper functions for localStorage (with error handling)
const storage = {
  get(key) {
    try {
      if (process.client) {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
      }
    } catch (error) {
      console.warn("Error reading from localStorage:", error)
      return null
    }
  },

  set(key, value) {
    try {
      if (process.client) {
        localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.warn("Error writing to localStorage:", error)
    }
  },

  remove(key) {
    try {
      if (process.client) {
        localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn("Error removing from localStorage:", error)
    }
  }
}

const config = {
  endpoint: "modules",
  entityName: "module",
  entityNamePlural: "modules",
  numericFields: [],
  primaryKey: "id",
  apiPlugin: "$axios",
  transformRequest: (data) => data,
  transformResponse: (data) => {
    return data.map((module) => {
      // Ensure each module has an icon, defaulting to "mdi-view-dashboard" if not
      return { ...module, icon: module.icon || "mdi-view-dashboard" }
    })
  },

  // Custom state
  customState: {
    showModules: true,
    selectedModule: null,
    persistedModuleId: null // Track what we tried to restore
  },

  // Custom mutations
  customMutations: {
    SET_SHOW_MODULES(state, value) {
      state.showModules = value
    },
    TOGGLE_SHOW_MODULES(state) {
      state.showModules = !state.showModules
    },
    SET_SELECTED_MODULE(state, module) {
      state.selectedModule = module

      // Persist to localStorage
      if (module) {
        storage.set(STORAGE_KEY, {
          id: module.id,
          name: module.name, // For debugging/logging
          timestamp: Date.now()
        })
      } else {
        storage.remove(STORAGE_KEY)
      }
    },
    CLEAR_SELECTED_MODULE(state) {
      state.selectedModule = null
      storage.remove(STORAGE_KEY)
    },
    SET_PERSISTED_MODULE_ID(state, id) {
      state.persistedModuleId = id
    }
  },

  // Custom actions
  customActions: {
    setShowModules({ commit }, value) {
      commit("SET_SHOW_MODULES", value)
    },

    toggleShowModules({ commit }) {
      commit("TOGGLE_SHOW_MODULES")
    },

    setSelectedModule({ commit, state, dispatch }, module) {
      // Toggle behavior: if clicking the same module, deselect it
      if (state.selectedModule && state.selectedModule.id === module.id) {
        commit("CLEAR_SELECTED_MODULE")
        // Close sidebar drawer when unselecting - dispatch to sidebarDrawer store
        this.dispatch("sidebarDrawer/close")
      } else {
        commit("SET_SELECTED_MODULE", module)
        // Open sidebar drawer when selecting - dispatch to sidebarDrawer store
        this.dispatch("sidebarDrawer/open")

        // Handle navigation if module has default_sub_module with link
        dispatch("handleModuleNavigation", module)
      }
    },

    clearSelectedModule({ commit }) {
      commit("CLEAR_SELECTED_MODULE")
      // Close sidebar drawer when clearing selection - dispatch to sidebarDrawer store
      this.dispatch("sidebarDrawer/close")
    },

    // New action to handle module navigation
    handleModuleNavigation({ rootState }, module) {
      if (module && module.default_sub_module && module.default_sub_module.link) {
        const link = module.default_sub_module.link

        // Check if link starts with "/"
        if (link.startsWith("/")) {
          // Navigate to the route using the app instance
          this.app.router.push(link)
          console.log(`Navigating to: ${link}`)
        } else {
          console.log(`Link doesn't start with '/': ${link}`)
        }
      } else {
        console.log("No default_sub_module link found for module:", module?.name)
      }
    },

    // New action to restore persisted module
    restorePersistedModule({ commit, state }) {
      const persistedData = storage.get(STORAGE_KEY)

      if (!persistedData || !persistedData.id) {
        return false
      }

      // Check if the persisted data is not too old (optional - 30 days)
      const maxAge = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
      if (persistedData.timestamp && Date.now() - persistedData.timestamp > maxAge) {
        storage.remove(STORAGE_KEY)
        return false
      }

      // Find the module in current state
      const module = state.modules.find((m) => m.id === persistedData.id)

      if (module) {
        commit("SET_SELECTED_MODULE", module)
        // Open sidebar drawer for restored module - dispatch to sidebarDrawer store
        this.dispatch("sidebarDrawer/open")
        console.log("Restored selected module:", module.name)

        // DON'T handle navigation for restored module - only for user clicks
        // dispatch("handleModuleNavigation", module) // REMOVED THIS LINE
        return true
      } else {
        // Module doesn't exist anymore, clean up storage
        storage.remove(STORAGE_KEY)
        commit("SET_PERSISTED_MODULE_ID", persistedData.id)
        console.warn("Previously selected module no longer exists:", persistedData.name)
        return false
      }
    }
  },

  // Custom getters
  customGetters: {
    isShowingModules: (state) => state.showModules,
    getSelectedModule: (state) => state.selectedModule,
    getPersistedModuleId: (state) => state.persistedModuleId,
    getGroupedSubModules: (state) => {
      if (!state.selectedModule || !state.selectedModule.sub_modules) {
        return []
      }

      // Group sub-modules by their sub_module_group
      const groups = {}

      state.selectedModule.sub_modules.forEach((subModule) => {
        const groupId = subModule.sub_module_group?.id || "ungrouped"
        const groupName = subModule.sub_module_group?.name || "Ungrouped"

        if (!groups[groupId]) {
          groups[groupId] = {
            groupId,
            groupName,
            subModules: []
          }
        }

        groups[groupId].subModules.push(subModule)
      })

      return Object.values(groups)
    }
  }
}

// Override the default fetchModules action to include restoration logic
config.customActions.fetchModules = async function ({ commit, dispatch }, filters = {}) {
  try {
    commit("SET_LOADING", true)
    commit("SET_MODULES", [])

    // Clean up filters
    const cleanFilters = {}
    for (const key in filters) {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== "") {
        cleanFilters[key] = filters[key]
      }
    }

    const response = await this.$axios.get("modules", {
      params: cleanFilters
    })

    const responseCleanup = response.data?.data || []
    const transformedData = responseCleanup.map((module) => {
      return { ...module, icon: module.icon || "mdi-view-dashboard" }
    })

    commit("SET_MODULES", transformedData)
    commit("SET_ERROR", null)

    // After modules are loaded, try to restore persisted selection
    await dispatch("restorePersistedModule")
  } catch (error) {
    commit("SET_ERROR", error)
    console.error("Error fetching modules:", error)
  } finally {
    commit("SET_LOADING", false)
  }
}

export default createCrudStore(config)
