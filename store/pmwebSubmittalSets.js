// store/pmwebSubmittalSets.js

export const state = () => ({
  submittalSets: [],
  currentSubmittalSet: null,
  loading: false,
  error: null
})

export const mutations = {
  SET_SUBMITTAL_SETS(state, submittalSets) {
    state.submittalSets = submittalSets
  },
  SET_CURRENT_SUBMITTAL_SET(state, submittalSet) {
    state.currentSubmittalSet = submittalSet
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

export const actions = {
  async fetchSubmittalSets({ commit }, filters = {}) {
    try {
      commit("SET_LOADING", true)
      commit("SET_SUBMITTAL_SETS", [])

      // Clean up filters - remove null/undefined values
      const cleanFilters = {}
      for (const key in filters) {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== "") {
          cleanFilters[key] = filters[key]
        }
      }

      // Pass filters as params to API
      const response = await this.$pmwebApi.get("EngineeringForms/SubmittalSets.svc/GetSubmittalSets", {
        params: cleanFilters
      })

      commit("SET_SUBMITTAL_SETS", response.data)
      commit("SET_ERROR", null)
    } catch (error) {
      commit("SET_ERROR", error)
      console.error("Error fetching submittal sets:", error)
    } finally {
      commit("SET_LOADING", false)
    }
  },

  async fetchSubmittalSetById({ commit }, id) {
    try {
      commit("SET_LOADING", true)
      commit("SET_CURRENT_SUBMITTAL_SET", null)

      // Call the GetSubmittalSetById endpoint with numeric ID
      const response = await this.$pmwebApi.get(`EngineeringForms/SubmittalSets.svc/GetSubmittalSetById/${id}`)

      commit("SET_CURRENT_SUBMITTAL_SET", response.data)
      commit("SET_ERROR", null)
      return response.data
    } catch (error) {
      commit("SET_ERROR", error)
      console.error(`Error fetching submittal set with ID ${id}:`, error)
      throw error
    } finally {
      commit("SET_LOADING", false)
    }
  }
}

export const getters = {
  getSubmittalSets: (state) => state.submittalSets,
  getCurrentSubmittalSet: (state) => state.currentSubmittalSet,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error
}
