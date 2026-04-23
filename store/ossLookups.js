export const state = () => ({
  // types
  types: [],
  CrudTypes: [],

  // categories
  categories: [],
  CrudCategories: [],

  // priorities
  priorities: [],
  CrudPriorities: []
})

export const mutations = {
  // types
  SET_TYPES(state, types) {
    state.types = types
  },
  SET_CRUD_TYPES(state, types) {
    state.CrudTypes = types
  },
  // categories
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  SET_CRUD_CATEGORIES(state, categories) {
    state.CrudCategories = categories
  },
  // priorities
  SET_PRIORITIES(state, priorities) {
    state.priorities = priorities
  },
  SET_CRUD_PRIORITIES(state, priorities) {
    state.CrudPriorities = priorities
  }
}

export const actions = {
  // types
  async getTypes({ commit }, payload) {
    try {
      const response = await this.$axios.get("/types", { params: payload })
      commit("SET_TYPES", response.data.data)
    } catch (error) {
      console.error("Error fetching OSS types:", error)
      throw error
    }
  },
  async getCrudTypes({ commit }, payload) {
    try {
      const response = await this.$axios.get("/types-crud", { params: payload })
      commit("SET_CRUD_TYPES", response.data.data)
    } catch (error) {
      console.error("Error fetching OSS types:", error)
      throw error
    }
  },
  async createType({ commit }, payload) {
    try {
      const response = await this.$axios.post("/types-add", payload)
      commit("SET_CRUD_TYPES", response.data.data)
    } catch (error) {
      console.error("Error creating OSS type:", error)
      throw error
    }
  },
  async updateType({ commit }, { id, payload }) {
    try {
      const response = await this.$axios.put(`/types/${id}`, payload)
      commit("SET_CRUD_TYPES", response.data.data)
    } catch (error) {
      console.error("Error updating OSS type:", error)
      throw error
    }
  },
  async deleteType({ commit }, id) {
    try {
      const response = await this.$axios.delete(`/types/${id}`)
      commit("SET_CRUD_TYPES", response.data.data)
    } catch (error) {
      console.error("Error deleting OSS type:", error)
      throw error
    }
  },

  // Categries
  async getCategories({ commit }, payload) {
    try {
      const response = await this.$axios.get("/orders-categories", { params: payload })
      commit("SET_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error fetching OSS categories:", error)
      throw error
    }
  },
  async getCrudCategories({ commit }, payload) {
    try {
      const response = await this.$axios.get("/orders-categories-crud", { params: payload })
      commit("SET_CRUD_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error fetching OSS categories:", error)
      throw error
    }
  },
  async createCategory({ commit }, payload) {
    try {
      const response = await this.$axios.post("/orders-categories-add", payload)
      commit("SET_CRUD_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error creating OSS category:", error)
      throw error
    }
  },
  async updateCategory({ commit }, { id, payload }) {
    try {
      const response = await this.$axios.put(`/orders-categories/${id}`, payload)
      commit("SET_CRUD_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error updating OSS category:", error)
      throw error
    }
  },
  async deleteCategory({ commit }, id) {
    try {
      const response = await this.$axios.delete(`/orders-categories/${id}`)
      commit("SET_CRUD_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error deleting OSS category:", error)
      throw error
    }
  },

  // Priorities
  async getPriorities({ commit }, payload) {
    try {
      const response = await this.$axios.get("/priorities", { params: payload })
      commit("SET_PRIORITIES", response.data.data)
    } catch (error) {
      console.error("Error fetching OSS priorities:", error)
      throw error
    }
  },
  async getCrudPriorities({ commit }, payload) {
    try {
      const response = await this.$axios.get("/priorities-crud", { params: payload })
      commit("SET_CRUD_PRIORITIES", response.data.data)
    } catch (error) {
      console.error("Error fetching OSS priorities:", error)
      throw error
    }
  },
  async createPriority({ commit }, payload) {
    try {
      const response = await this.$axios.post("/priorities-add", payload)
      commit("SET_CRUD_PRIORITIES", response.data.data)
    } catch (error) {
      console.error("Error creating OSS priority:", error)
      throw error
    }
  },
  async updatePriority({ commit }, { id, payload }) {
    try {
      const response = await this.$axios.put(`/priorities/${id}`, payload)
      commit("SET_CRUD_PRIORITIES", response.data.data)
    } catch (error) {
      console.error("Error updating OSS priority:", error)
      throw error
    }
  },
  async deletePriority({ commit }, id) {
    try {
      const response = await this.$axios.delete(`/priorities/${id}`)
      commit("SET_CRUD_PRIORITIES", response.data.data)
    } catch (error) {
      console.error("Error deleting OSS priority:", error)
      throw error
    }
  }
}
