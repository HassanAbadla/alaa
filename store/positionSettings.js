export const state = () => ({
  categories: [],
  crudCategories: [],
  levels: [],
  crudLevels: []
})

export const mutations = {
  // Categoris
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  SET_CRUD_CATEGORIES(state, categories) {
    state.crudCategories = categories
  },

  // Levels
  SET_LEVELS(state, levels) {
    state.levels = levels
  },
  SET_CRUD_LEVELS(state, levels) {
    state.crudLevels = levels
  }
}

export const actions = {
  // Categoris
  async fetchPositionCategories({ commit }) {
    try {
      const response = await this.$axios.get("position-categories")
      commit("SET_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      throw error
    }
  },
  async getPositionCategories({ commit }) {
    try {
      const response = await this.$axios.get("settings/position-categories")
      commit("SET_CRUD_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      throw error
    }
  },
  async createPositionCategory({ commit }, payload) {
    try {
      const response = await this.$axios.post("settings/position-categories", payload)
      commit("SET_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error creating category:", error)
      throw error
    }
  },
  async updatePositionCategory({ commit }, { id, payload }) {
    try {
      const response = await this.$axios.put(`settings/position-categories/${id}`, payload)
      commit("SET_CRUD_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error updating category:", error)
      throw error
    }
  },
  async deletePositionCategory({ commit }, id) {
    try {
      const response = await this.$axios.delete(`settings/position-categories/${id}`)
      commit("SET_CRUD_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error deleting category:", error)
      throw error
    }
  },

  // Levels
  async fetchPositionLevels({ commit }) {
    try {
      const response = await this.$axios.get("position-levels")
      commit("SET_LEVELS", response.data.data)
    } catch (error) {
      console.error("Error fetching levels:", error)
      throw error
    }
  },
  async getPositionLevels({ commit }) {
    try {
      const response = await this.$axios.get("settings/position-levels")
      commit("SET_CRUD_LEVELS", response.data.data)
    } catch (error) {
      console.error("Error fetching levels:", error)
      throw error
    }
  },
  async createPositionLevel({ commit }, payload) {
    try {
      const response = await this.$axios.post("settings/position-levels", payload)
      commit("SET_LEVELS", response.data.data)
    } catch (error) {
      console.error("Error creating level:", error)
      throw error
    }
  },
  async updatePositionLevel({ commit }, { id, payload }) {
    try {
      const response = await this.$axios.put(`settings/position-levels/${id}`, payload)
      commit("SET_CRUD_LEVELS", response.data.data)
    } catch (error) {
      console.error("Error updating level:", error)
      throw error
    }
  },
  async deletePositionLevel({ commit }, id) {
    try {
      const response = await this.$axios.delete(`settings/position-levels/${id}`)
      commit("SET_CRUD_LEVELS", response.data.data)
    } catch (error) {
      console.error("Error deleting level:", error)
      throw error
    }
  }
}
