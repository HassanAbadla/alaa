export const state = () => ({
  criticalities: [],
  crudCriticalities: []
})

export const mutations = {
  SET_CRITICALITIES(state, criticalities) {
    state.criticalities = criticalities
  },
  CRUD_ASSETS_CRITICALITIES(state, criticalities) {
    state.crudCriticalities = criticalities
  }
}

export const actions = {
  // criticalities Lookup CRUD
  async createCriticality({ commit }, payload) {
    try {
      const response = await this.$axios.post("asset-criticalities", payload)
      // commit("NEW_MANUFACTURER", response.data.data)
      commit("SET_CRITICALITIES", response.data.data)
    } catch (error) {
      console.error("Error creating Criticality:", error)
      throw error
    }
  },
  async fetchCriticalities({ commit }) {
    try {
      const response = await this.$axios.get("asset-criticalities")
      commit("SET_CRITICALITIES", response.data.data)
    } catch (e) {
      console.error("Error fetching Criticalities:", error)
    }
  },
  async addAssetCriticalities({ commit }, payload) {
    try {
      const response = await this.$axios.post("criticalities", payload)
      commit("CRUD_ASSETS_CRITICALITIES", response.data.data)
    } catch (error) {
      console.error("Error creating Assets criticalities:", error)
      throw error
    }
  },
  async getAssetsCriticalities({ commit }) {
    try {
      const response = await this.$axios.get("criticalities")
      commit("CRUD_ASSETS_CRITICALITIES", response.data.data)
    } catch (e) {
      console.error("Error fetching Assets Statuses:", error)
      throw error
    }
  },
  async updateCriticality({ commit }, { id, payload }) {
    try {
      const response = await this.$axios.put(`criticalities/${id}`, payload)
      commit("CRUD_ASSETS_CRITICALITIES", response.data.data)
    } catch (error) {
      console.error("Error updating Criticality:", error)
      throw error
    }
  },
  async deleteCriticality({ commit }, id) {
    try {
      const response = await this.$axios.delete(`criticalities/${id}`)
      commit("CRUD_ASSETS_CRITICALITIES", response.data.data)
    } catch (error) {
      console.error("Error deleting Criticality:", error)
      throw error
    }
  }
}
