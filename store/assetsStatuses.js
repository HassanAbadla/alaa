export const state = () => ({
  statusesList: [],
  crudStatusesList: []
})

export const mutations = {
  SET_ASSETS_STATUSES(state, statuses) {
    state.statusesList = statuses
  },
  CRUD_ASSETS_STATUSES(state, statuses) {
    state.crudStatusesList = statuses
  }
}

export const actions = {
  async createAssetStatus({ commit }, payload) {
    try {
      const response = await this.$axios.post("asset-statuses", payload)
      commit("SET_ASSETS_STATUSES", response.data.data)
    } catch (error) {
      console.error("Error creating Assets Statuses:", error)
      throw error
    }
  },
  async fetchAssetsStatuses({ commit }) {
    try {
      const response = await this.$axios.get("asset-statuses")
      commit("SET_ASSETS_STATUSES", response.data.data)
    } catch (e) {
      console.error("Error fetching Assets Statuses:", error)
    }
  },

  // Settings page
  async addAssetStatus({ commit }, payload) {
    try {
      const response = await this.$axios.post("settings/asset-statuses", payload)
      commit("CRUD_ASSETS_STATUSES", response.data.data)
    } catch (error) {
      console.error("Error creating Assets Statuses:", error)
      throw error
    }
  },
  async getAssetsStatuses({ commit }) {
    try {
      const response = await this.$axios.get("settings/asset-statuses")
      commit("CRUD_ASSETS_STATUSES", response.data.data)
    } catch (e) {
      console.error("Error fetching Assets Statuses:", error)
      throw error
    }
  },
  async updateAssetStatus({ commit }, { id, payload }) {
    try {
      const response = await this.$axios.put(`settings/asset-statuses/${id}`, payload)
      commit("CRUD_ASSETS_STATUSES", response.data.data)
    } catch (error) {
      console.error("Error updating Assets Statuses:", error)
      throw error
    }
  },
  async deleteAssetStatus({ commit }, id) {
    try {
      const response = await this.$axios.delete(`settings/asset-statuses/${id}`)
      commit("CRUD_ASSETS_STATUSES", response.data.data)
    } catch (error) {
      console.error("Error deleting Assets Statuses:", error)
      throw error
    }
  }
}
