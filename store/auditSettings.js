export const state = () => ({
  // categories
  categories: [],
  CrudCategories: []
})

export const mutations = {
  // categories
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  SET_CRUD_CATEGORIES(state, categories) {
    state.CrudCategories = categories
  }
}

export const actions = {
  // Categries
  async getCategories({ commit }, payload) {
    try {
      const response = await this.$axios.get("/audit-evidence-categories", { params: payload })
      commit("SET_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error fetching OSS categories:", error)
      throw error
    }
  },
  async getCrudCategories({ commit }, payload) {
    try {
      const response = await this.$axios.get("/audit-evidence-categories-crud", { params: payload })
      commit("SET_CRUD_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error fetching OSS categories:", error)
      throw error
    }
  },
  async createCategory({ commit }, payload) {
    try {
      const response = await this.$axios.post("/audit-evidence-categories-add", payload)
      commit("SET_CRUD_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error creating OSS category:", error)
      throw error
    }
  },
  async updateCategory({ commit }, { id, payload }) {
    try {
      const response = await this.$axios.put(`/audit-evidence-categories/${id}`, payload)
      commit("SET_CRUD_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error updating OSS category:", error)
      throw error
    }
  },
  async deleteCategory({ commit }, id) {
    try {
      const response = await this.$axios.delete(`/audit-evidence-categories/${id}`)
      commit("SET_CRUD_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error deleting OSS category:", error)
      throw error
    }
  }
}
