// store/pmwebDrawingLists.js

export const state = () => ({
  drawingLists: [],
  currentDrawingList: null,
  loading: false,
  error: null
})

export const mutations = {
  SET_DRAWING_LISTS(state, drawingLists) {
    state.drawingLists = drawingLists
  },
  SET_CURRENT_DRAWING_LIST(state, drawingList) {
    state.currentDrawingList = drawingList
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

export const actions = {
  async fetchDrawingLists({ commit }, filters = {}) {
    try {
      commit("SET_LOADING", true)
      commit("SET_DRAWING_LISTS", [])

      // Clean up filters - remove null/undefined values
      const cleanFilters = {}
      for (const key in filters) {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== "") {
          cleanFilters[key] = filters[key]
        }
      }

      // Pass filters as params to API
      const response = await this.$pmwebApi.get("EngineeringForms/DrawingLists.svc/GetDrawingLists", {
        params: cleanFilters
      })

      commit("SET_DRAWING_LISTS", response.data)
      commit("SET_ERROR", null)
    } catch (error) {
      commit("SET_ERROR", error)
      console.error("Error fetching drawing lists:", error)
    } finally {
      commit("SET_LOADING", false)
    }
  },

  async fetchDrawingListById({ commit }, id) {
    try {
      commit("SET_LOADING", true)
      commit("SET_CURRENT_DRAWING_LIST", null)

      // Call the GetDrawingListById endpoint with numeric ID
      const response = await this.$pmwebApi.get(`EngineeringForms/DrawingLists.svc/GetDrawingListById/${id}`)

      commit("SET_CURRENT_DRAWING_LIST", response.data)
      commit("SET_ERROR", null)
      return response.data
    } catch (error) {
      commit("SET_ERROR", error)
      console.error(`Error fetching drawing list with ID ${id}:`, error)
      throw error
    } finally {
      commit("SET_LOADING", false)
    }
  }
}

export const getters = {
  getDrawingLists: (state) => state.drawingLists,
  getCurrentDrawingList: (state) => state.currentDrawingList,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error
}
