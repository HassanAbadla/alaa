export const state = () => ({
  locationList: []
})

export const mutations = {
  SET_ASSETS_LOCATIONS(state, assetslocations) {
    state.locationList = assetslocations
  }
}

export const actions = {
  async createAssetLocation({ commit }, payload) {
    try {
      const response = await this.$axios.post("assets-locations", payload)
      commit("SET_ASSETS_LOCATIONS", response.data.data)
    } catch (error) {
      console.error("Error creating Assets Locations:", error)
      throw error
    }
  },
  async fetchAssetsLocations({ commit }) {
    try {
      const response = await this.$axios.get("assets-locations")
      commit("SET_ASSETS_LOCATIONS", response.data.data)
    } catch (e) {
      console.error("Error fetching Assets Locations:", error)
    }
  },
  async updateAssetLocation({ commit }, { id, payload }) {
    try {
      const response = await this.$axios.put(`assets-locations/${id}`, payload)
      commit("SET_ASSETS_LOCATIONS", response.data.data)
    } catch (error) {
      console.error("Error updating Assets Locations:", error)
      throw error
    }
  },
  async deleteAssetLocation({ commit }, id) {
    try {
      const response = await this.$axios.delete(`assets-locations/${id}`)
      commit("SET_ASSETS_LOCATIONS", response.data.data)
    } catch (error) {
      console.error("Error deleting Assets Locations:", error)
      throw error
    }
  }
}
