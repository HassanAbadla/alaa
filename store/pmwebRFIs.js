// store/pmwebRFIs.js

export const state = () => ({
  rfis: [],
  currentRFI: null,
  loading: false,
  error: null
})

export const mutations = {
  SET_RFIS(state, rfis) {
    state.rfis = rfis
  },
  SET_CURRENT_RFI(state, rfi) {
    state.currentRFI = rfi
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

export const actions = {
  async fetchRFIs({ commit }, filters = {}) {
    try {
      commit("SET_LOADING", true)
      commit("SET_RFIS", [])

      // Clean up filters - remove null/undefined values
      const cleanFilters = {}
      for (const key in filters) {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== "") {
          cleanFilters[key] = filters[key]
        }
      }

      // Pass filters as params to API
      const response = await this.$pmwebApi.get("EngineeringForms/RFI.svc/GetRFIs", {
        params: cleanFilters
      })

      commit("SET_RFIS", response.data)
      commit("SET_ERROR", null)
    } catch (error) {
      commit("SET_ERROR", error)
      console.error("Error fetching RFIs:", error)
    } finally {
      commit("SET_LOADING", false)
    }
  },

  async fetchRFIById({ commit }, id) {
    try {
      commit("SET_LOADING", true)
      commit("SET_CURRENT_RFI", null)

      // Call the GetRFIById endpoint with numeric ID
      const response = await this.$pmwebApi.get(`EngineeringForms/RFI.svc/GetRFIById/${id}`)

      commit("SET_CURRENT_RFI", response.data)
      commit("SET_ERROR", null)
      return response.data
    } catch (error) {
      commit("SET_ERROR", error)
      console.error(`Error fetching RFI with ID ${id}:`, error)
      throw error
    } finally {
      commit("SET_LOADING", false)
    }
  }
}

export const getters = {
  getRFIs: (state) => state.rfis,
  getCurrentRFI: (state) => state.currentRFI,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error
}
