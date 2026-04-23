// store/pmwebPunchLists.js

export const state = () => ({
  punchLists: [],
  currentPunchList: null,
  loading: false,
  error: null
})

export const mutations = {
  SET_PUNCH_LISTS(state, punchLists) {
    state.punchLists = punchLists
  },
  SET_CURRENT_PUNCH_LIST(state, punchList) {
    state.currentPunchList = punchList
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

export const actions = {
  async fetchPunchLists({ commit }, filters = {}) {
    try {
      commit("SET_LOADING", true)
      commit("SET_PUNCH_LISTS", [])

      // Clean up filters - remove null/undefined values
      const cleanFilters = {}
      for (const key in filters) {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== "") {
          cleanFilters[key] = filters[key]
        }
      }

      // Pass filters as params to API
      const response = await this.$pmwebApi.get("EngineeringForms/PunchList.svc/GetPunchList", {
        params: cleanFilters
      })

      commit("SET_PUNCH_LISTS", response.data)
      commit("SET_ERROR", null)
    } catch (error) {
      commit("SET_ERROR", error)
      console.error("Error fetching punch lists:", error)
    } finally {
      commit("SET_LOADING", false)
    }
  },

  async fetchPunchListById({ commit }, id) {
    try {
      commit("SET_LOADING", true)
      commit("SET_CURRENT_PUNCH_LIST", null)

      // Call the GetPunchListById endpoint with numeric ID
      const response = await this.$pmwebApi.get(`EngineeringForms/PunchList.svc/GetPunchListById/${id}`)

      commit("SET_CURRENT_PUNCH_LIST", response.data)
      commit("SET_ERROR", null)
      return response.data
    } catch (error) {
      commit("SET_ERROR", error)
      console.error(`Error fetching punch list with ID ${id}:`, error)
      throw error
    } finally {
      commit("SET_LOADING", false)
    }
  }
}

export const getters = {
  getPunchLists: (state) => state.punchLists,
  getCurrentPunchList: (state) => state.currentPunchList,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error
}
