export const state = () => ({
  positions: [],
  categories: [],
  levels: [],
  units: [],
  crudUnits: [],
  selectedPosition: [],
  // Loading states
  loadingPositions: false,
  loadingCategories: false,
  loadingLevels: false,
  loadingUnits: false,
  loadingCrudUnits: false,
  loadingSelectedPosition: false
})

export const mutations = {
  SET_POSITIONS(state, positions) {
    state.positions = positions
  },
  NEW_POSITION(state, position) {
    state.positions.push(position)
  },
  POSITION_DETAILS(state, details) {
    state.selectedPosition = details
  },
  UPDATE_POSITION(state, position) {
    const index = state.positions.findIndex((p) => p.id === position.id)
    state.positions.splice(index, 1, position)
    state.selectedPosition = []
  },
  REMOVE_POSITION(state, id) {
    const index = state.positions.findIndex((p) => p.id === id)
    state.positions.splice(index, 1)
  },
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  SET_LEVELS(state, levels) {
    state.levels = levels
  },
  SET_UNITS(state, units) {
    state.units = units
  },
  SET_CRUD_UNITS(state, units) {
    state.crudUnits = units
  },
  SET_UPDATE_UNITS(state, unit) {
    const index = state.crudUnits.findIndex((u) => u.id === unit.id)
    state.crudUnits.splice(index, 1, unit)
  },
  REMOVE_UNIT(state, id) {
    const index = state.crudUnits.findIndex((u) => u.id === id)
    state.crudUnits.splice(index, 1)
  },
  // Loading state mutations
  SET_LOADING_POSITIONS(state, loading) {
    state.loadingPositions = loading
  },
  SET_LOADING_CATEGORIES(state, loading) {
    state.loadingCategories = loading
  },
  SET_LOADING_LEVELS(state, loading) {
    state.loadingLevels = loading
  },
  SET_LOADING_UNITS(state, loading) {
    state.loadingUnits = loading
  },
  SET_LOADING_CRUD_UNITS(state, loading) {
    state.loadingCrudUnits = loading
  },
  SET_LOADING_SELECTED_POSITION(state, loading) {
    state.loadingSelectedPosition = loading
  }
}

export const getters = {
  getPositions: (state) => state.positions,
  getCategories: (state) => state.categories,
  getLevels: (state) => state.levels,
  getUnits: (state) => state.units,
  getCrudUnits: (state) => state.crudUnits,
  getSelectedPosition: (state) => state.selectedPosition,
  // Loading state getters
  isLoadingPositions: (state) => state.loadingPositions,
  isLoadingCategories: (state) => state.loadingCategories,
  isLoadingLevels: (state) => state.loadingLevels,
  isLoadingUnits: (state) => state.loadingUnits,
  isLoadingCrudUnits: (state) => state.loadingCrudUnits,
  isLoadingSelectedPosition: (state) => state.loadingSelectedPosition
}

export const actions = {
  async fetchPositions({ commit }, filters = {}) {
    commit("SET_LOADING_POSITIONS", true)
    try {
      console.log("Fetching positions with filters:", filters)

      const response = await this.$axios.get("positions", { params: filters })
      commit("SET_POSITIONS", response.data.data)
    } catch (error) {
      console.error("Error fetching positions:", error)
      throw error
    } finally {
      commit("SET_LOADING_POSITIONS", false)
    }
  },

  async addPosition({ commit }, payload) {
    commit("SET_LOADING_POSITIONS", true)
    try {
      const response = await this.$axios.post("positions", payload)
      commit("NEW_POSITION", response.data.data)
    } catch (error) {
      console.error("Error adding position:", error)
      throw error
    } finally {
      commit("SET_LOADING_POSITIONS", false)
    }
  },

  async positionDetails({ commit }, id) {
    commit("SET_LOADING_SELECTED_POSITION", true)
    try {
      const response = await this.$axios.get("positions/" + id)
      commit("POSITION_DETAILS", response.data.data)
    } catch (error) {
      console.error("Error fetching position details:", error)
      throw error
    } finally {
      commit("SET_LOADING_SELECTED_POSITION", false)
    }
  },

  async updatePosition({ commit }, { id, payload }) {
    commit("SET_LOADING_POSITIONS", true)
    try {
      const response = await this.$axios.put("positions/" + id, payload)
      commit("UPDATE_POSITION", response.data.data)
    } catch (error) {
      console.error("Error updating position:", error)
      throw error
    } finally {
      commit("SET_LOADING_POSITIONS", false)
    }
  },
  async removePosition({ commit }, id) {
    commit("SET_LOADING_POSITIONS", true)
    try {
      const response = await this.$axios.delete("positions/" + id)
      commit("REMOVE_POSITION", response.data.data)
    } catch (error) {
      console.error("Error removing position:", error)
      throw error
    } finally {
      commit("SET_LOADING_POSITIONS", false)
    }
  },

  async fetchCategories({ commit }) {
    commit("SET_LOADING_CATEGORIES", true)
    try {
      const response = await this.$axios.get("position-categories")
      commit("SET_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      throw error
    } finally {
      commit("SET_LOADING_CATEGORIES", false)
    }
  },

  async addCategory({ commit }, payload) {
    commit("SET_LOADING_CATEGORIES", true)
    try {
      const response = await this.$axios.post("position-categories", payload)
      commit("SET_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error adding category:", error)
      throw error
    } finally {
      commit("SET_LOADING_CATEGORIES", false)
    }
  },

  async fetchLevels({ commit }) {
    commit("SET_LOADING_LEVELS", true)
    try {
      const response = await this.$axios.get("position-levels")
      commit("SET_LEVELS", response.data.data)
    } catch (error) {
      console.error("Error fetching levels:", error)
      throw error
    } finally {
      commit("SET_LOADING_LEVELS", false)
    }
  },

  async addLevel({ commit }, payload) {
    commit("SET_LOADING_LEVELS", true)
    try {
      const response = await this.$axios.post("position-levels", payload)
      commit("SET_LEVELS", response.data.data)
    } catch (error) {
      console.error("Error adding level:", error)
      throw error
    } finally {
      commit("SET_LOADING_LEVELS", false)
    }
  },

  async fetchUnits({ commit }) {
    commit("SET_LOADING_UNITS", true)
    try {
      const response = await this.$axios.get("user-units")
      commit("SET_UNITS", response.data.data)
    } catch (error) {
      console.error("Error fetching units:", error)
      throw error
    } finally {
      commit("SET_LOADING_UNITS", false)
    }
  },

  async getCrudUnits({ commit }) {
    commit("SET_LOADING_CRUD_UNITS", true)
    try {
      const response = await this.$axios.get("user-units-crud")
      commit("SET_CRUD_UNITS", response.data.data)
    } catch (error) {
      console.error("Error fetching CRUD units:", error)
      throw error
    } finally {
      commit("SET_LOADING_CRUD_UNITS", false)
    }
  },

  async updateUnit({ commit }, { id, payload }) {
    commit("SET_LOADING_CRUD_UNITS", true)
    try {
      const response = await this.$axios.put("user-units/" + id, payload)
      commit("SET_UPDATE_UNITS", payload)
    } catch (error) {
      console.error("Error updating unit:", error)
      throw error
    } finally {
      commit("SET_LOADING_CRUD_UNITS", false)
    }
  },

  async removeUnit({ commit }, id) {
    commit("SET_LOADING_CRUD_UNITS", true)
    try {
      const response = await this.$axios.delete("user-units/remove/" + id)
      commit("REMOVE_UNIT", id)
    } catch (error) {
      console.error("Error removing unit:", error)
      throw error
    } finally {
      commit("SET_LOADING_CRUD_UNITS", false)
    }
  }
}
