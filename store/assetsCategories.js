export const state = () => ({
  categoriesList: [],
  categoriesCrudList: []
})

export const mutations = {
  SET_ASSETS_CATEGORIES(state, categories) {
    state.categoriesList = categories
  },
  SET_CRUD_CATEGORIES(state, categories) {
    state.categoriesCrudList = categories
  }
}

export const actions = {
  // Assets Categories For Assets Form
  async createAssetCategory({ commit }, payload) {
    try {
      const response = await this.$axios.post("grc-asset-categories", payload)
      commit("SET_ASSETS_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error creating Assets Categories:", error)
      throw error
    }
  },
  async fetchCategories({ commit }) {
    try {
      const response = await this.$axios.get("grc-asset-categories")
      commit("SET_ASSETS_CATEGORIES", response.data.data)
    } catch (e) {
      console.error("Error fetching Assets Categories:", error)
    }
  },

  // Assets categories CRUD
  async addAssetCategories({ commit }, payload) {
    try {
      const response = await this.$axios.post("settings/asset-categories", payload)
      commit("SET_CRUD_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error creating Assets Type:", error)
      throw error
    }
  },
  async getAssetsCategories({ commit }) {
    try {
      const response = await this.$axios.get("settings/asset-categories")
      commit("SET_CRUD_CATEGORIES", response.data.data)
    } catch (e) {
      console.error("Error fetching Assets Types:", error)
      throw error
    }
  },
  async updateAssetCategories({ commit }, { id, payload }) {
    try {
      const response = await this.$axios.put(`settings/asset-categories/${id}`, payload)
      commit("SET_CRUD_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error updating Assets Categories:", error)
      throw error
    }
  },
  async deleteAssetCategories({ commit }, id) {
    try {
      const response = await this.$axios.delete(`settings/asset-categories/${id}`)
      commit("SET_CRUD_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error deleting Assets Categories:", error)
      throw error
    }
  }
}
