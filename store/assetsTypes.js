export const state = () => ({
  typesList: [],
  crudTypesList: []
})

export const mutations = {
  SET_ASSETS_TYPES(state, types) {
    state.typesList = types
  },
  SET_CRUD_TYPES(state, types) {
    state.crudTypesList = types
  }
}

export const actions = {
  // Lookups for Assets Form
  async createAssetType({ commit }, payload) {
    try {
      const response = await this.$axios.post("grc-asset-types", payload)
      commit("SET_ASSETS_TYPES", response.data.data)
    } catch (error) {
      console.error("Error creating Assets Type:", error)
      throw error
    }
  },
  async fetchAssetsType({ commit }) {
    try {
      const response = await this.$axios.get("grc-asset-types")
      commit("SET_ASSETS_TYPES", response.data.data)
    } catch (e) {
      console.error("Error fetching Assets Types:", error)
    }
  },

  // Assets types CRUD
  async addAssetType({ commit }, payload) {
    try {
      const response = await this.$axios.post("settings/asset-types", payload)
      commit("SET_CRUD_TYPES", response.data.data)
    } catch (error) {
      console.error("Error creating Assets Type:", error)
      throw error
    }
  },
  async getAssetsType({ commit }) {
    try {
      const response = await this.$axios.get("settings/asset-types")
      commit("SET_CRUD_TYPES", response.data.data)
    } catch (e) {
      console.error("Error fetching Assets Types:", error)
      throw error
    }
  },
  async updateAssetType({ commit }, { id, payload }) {
    try {
      const response = await this.$axios.put(`settings/asset-types/${id}`, payload)
      commit("SET_CRUD_TYPES", response.data.data)
    } catch (error) {
      console.error("Error updating Assets Types:", error)
      throw error
    }
  },
  async deleteAssetType({ commit }, id) {
    try {
      const response = await this.$axios.delete(`settings/asset-types/${id}`)
      commit("SET_CRUD_TYPES", response.data.data)
    } catch (error) {
      console.error("Error deleting Assets Types:", error)
      throw error
    }
  }
}
