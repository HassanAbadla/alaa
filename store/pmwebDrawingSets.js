// store/pmwebDrawingSets.js

export const state = () => ({
  drawingSets: [],
  currentDrawingSet: null,
  loading: false,
  error: null
})

export const mutations = {
  SET_DRAWING_SETS(state, drawingSets) {
    state.drawingSets = drawingSets
  },
  SET_CURRENT_DRAWING_SET(state, drawingSet) {
    state.currentDrawingSet = drawingSet
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

export const actions = {
  async fetchDrawingSets({ commit }, filters = {}) {
    try {
      commit("SET_LOADING", true)
      commit("SET_DRAWING_SETS", [])

      // Clean up filters - remove null/undefined values
      const cleanFilters = {}
      for (const key in filters) {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== "") {
          cleanFilters[key] = filters[key]
        }
      }

      // Pass filters as params to API
      const response = await this.$pmwebApi.get("EngineeringForms/DrawingSets.svc/GetDrawingSets", {
        params: cleanFilters
      })

      commit("SET_DRAWING_SETS", response.data)
      commit("SET_ERROR", null)
    } catch (error) {
      commit("SET_ERROR", error)
      console.error("Error fetching drawing sets:", error)
    } finally {
      commit("SET_LOADING", false)
    }
  },

  async fetchDrawingSetById({ commit }, id) {
    try {
      commit("SET_LOADING", true)
      commit("SET_CURRENT_DRAWING_SET", null)

      // Call the GetDrawingSetById endpoint with numeric ID
      const response = await this.$pmwebApi.get(`EngineeringForms/DrawingSets.svc/GetDrawingSetById/${id}`)

      commit("SET_CURRENT_DRAWING_SET", response.data)
      commit("SET_ERROR", null)
      return response.data
    } catch (error) {
      commit("SET_ERROR", error)
      console.error(`Error fetching drawing set with ID ${id}:`, error)
      throw error
    } finally {
      commit("SET_LOADING", false)
    }
  }
}

export const getters = {
  getDrawingSets: (state) => state.drawingSets,
  getCurrentDrawingSet: (state) => state.currentDrawingSet,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error
}
