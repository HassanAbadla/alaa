// store/pmwebTransmittals.js

export const state = () => ({
  transmittals: [],
  currentTransmittal: null,
  loading: false,
  error: null
})

export const mutations = {
  SET_TRANSMITTALS(state, transmittals) {
    state.transmittals = transmittals
  },
  SET_CURRENT_TRANSMITTAL(state, transmittal) {
    state.currentTransmittal = transmittal
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

export const actions = {
  async fetchTransmittals({ commit }, filters = {}) {
    try {
      commit("SET_LOADING", true)
      commit("SET_TRANSMITTALS", [])

      // Clean up filters - remove null/undefined values
      const cleanFilters = {}
      for (const key in filters) {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== "") {
          cleanFilters[key] = filters[key]
        }
      }

      // Pass filters as params to API
      const response = await this.$pmwebApi.get("EngineeringForms/Transmittals.svc/GetTransmittals", {
        params: cleanFilters
      })

      commit("SET_TRANSMITTALS", response.data)
      commit("SET_ERROR", null)
    } catch (error) {
      commit("SET_ERROR", error)
      console.error("Error fetching transmittals:", error)
    } finally {
      commit("SET_LOADING", false)
    }
  },

  async fetchTransmittalById({ commit }, id) {
    try {
      commit("SET_LOADING", true)
      commit("SET_CURRENT_TRANSMITTAL", null)

      // Call the GetTransmittalById endpoint with numeric ID
      const response = await this.$pmwebApi.get(`EngineeringForms/Transmittals.svc/GetTransmittalById/${id}`)

      commit("SET_CURRENT_TRANSMITTAL", response.data)
      commit("SET_ERROR", null)
      return response.data
    } catch (error) {
      commit("SET_ERROR", error)
      console.error(`Error fetching transmittal with ID ${id}:`, error)
      throw error
    } finally {
      commit("SET_LOADING", false)
    }
  }
}

export const getters = {
  getTransmittals: (state) => state.transmittals,
  getCurrentTransmittal: (state) => state.currentTransmittal,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error
}
