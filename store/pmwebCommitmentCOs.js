// store/pmwebCommitmentCOs.js

export const state = () => ({
  commitmentCOs: [],
  currentCommitmentCO: null,
  loading: false,
  error: null
})

export const mutations = {
  SET_COMMITMENT_COS(state, commitmentCOs) {
    state.commitmentCOs = commitmentCOs
  },
  SET_CURRENT_COMMITMENT_CO(state, commitmentCO) {
    state.currentCommitmentCO = commitmentCO
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

export const actions = {
  async fetchCommitmentCOs({ commit }, filters = {}) {
    try {
      commit("SET_LOADING", true)
      commit("SET_COMMITMENT_COS", [])

      // Clean up filters - remove null/undefined values
      const cleanFilters = {}
      for (const key in filters) {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== "") {
          cleanFilters[key] = filters[key]
        }
      }

      // Pass filters as params to API
      const response = await this.$pmwebApi.get("CostManagement/CommitmentCO.svc/GetCommitmentCOs", {
        params: cleanFilters
      })

      commit("SET_COMMITMENT_COS", response.data)
      commit("SET_ERROR", null)
    } catch (error) {
      commit("SET_ERROR", error)
      console.error("Error fetching commitment COs:", error)
    } finally {
      commit("SET_LOADING", false)
    }
  },

  async fetchCommitmentCOById({ commit }, id) {
    try {
      commit("SET_LOADING", true)
      commit("SET_CURRENT_COMMITMENT_CO", null)

      // Call the GetCommitmentCOById endpoint with numeric ID
      const response = await this.$pmwebApi.get(`CostManagement/CommitmentCO.svc/GetCommitmentCOById/${id}`)

      commit("SET_CURRENT_COMMITMENT_CO", response.data)
      commit("SET_ERROR", null)
      return response.data
    } catch (error) {
      commit("SET_ERROR", error)
      console.error(`Error fetching commitment CO with ID ${id}:`, error)
      throw error
    } finally {
      commit("SET_LOADING", false)
    }
  }
}

export const getters = {
  getCommitmentCOs: (state) => state.commitmentCOs,
  getCurrentCommitmentCO: (state) => state.currentCommitmentCO,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error
}
