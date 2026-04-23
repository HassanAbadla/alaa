// store/pmwebSafetyForms.js

export const state = () => ({
  safetyForms: [],
  currentSafetyForm: null,
  loading: false,
  error: null
})

export const mutations = {
  SET_SAFETY_FORMS(state, safetyForms) {
    state.safetyForms = safetyForms
  },
  SET_CURRENT_SAFETY_FORM(state, safetyForm) {
    state.currentSafetyForm = safetyForm
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

export const actions = {
  async fetchSafetyForms({ commit }, filters = {}) {
    try {
      commit("SET_LOADING", true)
      commit("SET_SAFETY_FORMS", [])

      // Clean up filters - remove null/undefined values
      const cleanFilters = {}
      for (const key in filters) {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== "") {
          cleanFilters[key] = filters[key]
        }
      }

      // Pass filters as params to API
      const response = await this.$pmwebApi.get("EngineeringForms/SafetyForms.svc/GetSafetyForms", {
        params: cleanFilters
      })

      commit("SET_SAFETY_FORMS", response.data)
      commit("SET_ERROR", null)
    } catch (error) {
      commit("SET_ERROR", error)
      console.error("Error fetching safety forms:", error)
    } finally {
      commit("SET_LOADING", false)
    }
  },

  async fetchSafetyFormById({ commit }, id) {
    try {
      commit("SET_LOADING", true)
      commit("SET_CURRENT_SAFETY_FORM", null)

      // Call the GetSafetyFormById endpoint with numeric ID
      const response = await this.$pmwebApi.get(`EngineeringForms/SafetyForms.svc/GetSafetyFormById/${id}`)

      commit("SET_CURRENT_SAFETY_FORM", response.data)
      commit("SET_ERROR", null)
      return response.data
    } catch (error) {
      commit("SET_ERROR", error)
      console.error(`Error fetching safety form with ID ${id}:`, error)
      throw error
    } finally {
      commit("SET_LOADING", false)
    }
  }
}

export const getters = {
  getSafetyForms: (state) => state.safetyForms,
  getCurrentSafetyForm: (state) => state.currentSafetyForm,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error
}
