// store/pmwebOnlineSubmittals.js

export const state = () => ({
  onlineSubmittals: [],
  currentOnlineSubmittal: null,
  loading: false,
  error: null
})

export const mutations = {
  SET_ONLINE_SUBMITTALS(state, onlineSubmittals) {
    state.onlineSubmittals = onlineSubmittals
  },
  SET_CURRENT_ONLINE_SUBMITTAL(state, onlineSubmittal) {
    state.currentOnlineSubmittal = onlineSubmittal
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

export const actions = {
  async fetchOnlineSubmittals({ commit }, filters = {}) {
    try {
      commit("SET_LOADING", true)
      commit("SET_ONLINE_SUBMITTALS", [])

      // Clean up filters - remove null/undefined values
      const cleanFilters = {}
      for (const key in filters) {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== "") {
          cleanFilters[key] = filters[key]
        }
      }

      // Pass filters as params to API
      const response = await this.$pmwebApi.get("EngineeringForms/OnlineSubmittals.svc/GetOnlineSubmittals", {
        params: cleanFilters
      })

      commit("SET_ONLINE_SUBMITTALS", response.data)
      commit("SET_ERROR", null)
    } catch (error) {
      commit("SET_ERROR", error)
      console.error("Error fetching online submittals:", error)
    } finally {
      commit("SET_LOADING", false)
    }
  },

  async fetchOnlineSubmittalById({ commit }, id) {
    try {
      commit("SET_LOADING", true)
      commit("SET_CURRENT_ONLINE_SUBMITTAL", null)

      // Call the GetOnlineSubmittalById endpoint with numeric ID
      const response = await this.$pmwebApi.get(`EngineeringForms/OnlineSubmittals.svc/GetOnlineSubmittalById/${id}`)

      commit("SET_CURRENT_ONLINE_SUBMITTAL", response.data)
      commit("SET_ERROR", null)
      return response.data
    } catch (error) {
      commit("SET_ERROR", error)
      console.error(`Error fetching online submittal with ID ${id}:`, error)
      throw error
    } finally {
      commit("SET_LOADING", false)
    }
  }
}

export const getters = {
  getOnlineSubmittals: (state) => state.onlineSubmittals,
  getCurrentOnlineSubmittal: (state) => state.currentOnlineSubmittal,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error
}
