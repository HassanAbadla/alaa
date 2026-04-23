// store/pmwebActionItems.js

export const state = () => ({
  actionItems: [],
  currentActionItem: null,
  loading: false,
  error: null
})

export const mutations = {
  SET_ACTION_ITEMS(state, actionItems) {
    state.actionItems = actionItems
  },
  SET_CURRENT_ACTION_ITEM(state, actionItem) {
    state.currentActionItem = actionItem
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

export const actions = {
  async fetchActionItems({ commit }, filters = {}) {
    try {
      commit("SET_LOADING", true)
      commit("SET_ACTION_ITEMS", [])

      // Clean up filters - remove null/undefined values
      const cleanFilters = {}
      for (const key in filters) {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== "") {
          cleanFilters[key] = filters[key]
        }
      }

      // Pass filters as params to API
      const response = await this.$pmwebApi.get("EngineeringForms/ActionItems.svc/GetActionItems", {
        params: cleanFilters
      })

      commit("SET_ACTION_ITEMS", response.data)
      commit("SET_ERROR", null)
    } catch (error) {
      commit("SET_ERROR", error)
      console.error("Error fetching action items:", error)
    } finally {
      commit("SET_LOADING", false)
    }
  },

  async fetchActionItemById({ commit }, id) {
    try {
      commit("SET_LOADING", true)
      commit("SET_CURRENT_ACTION_ITEM", null)

      // Call the GetActionItemById endpoint with numeric ID
      const response = await this.$pmwebApi.get(`EngineeringForms/ActionItems.svc/GetActionItemById/${id}`)

      commit("SET_CURRENT_ACTION_ITEM", response.data)
      commit("SET_ERROR", null)
      return response.data
    } catch (error) {
      commit("SET_ERROR", error)
      console.error(`Error fetching action item with ID ${id}:`, error)
      throw error
    } finally {
      commit("SET_LOADING", false)
    }
  }
}

export const getters = {
  getActionItems: (state) => state.actionItems,
  getCurrentActionItem: (state) => state.currentActionItem,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error
}
