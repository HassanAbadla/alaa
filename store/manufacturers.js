export const state = () => ({
  manufacturers: []
})

export const mutations = {
  SET_MANUFACTURERS(state, manufacturers) {
    state.manufacturers = manufacturers
  },
  NEW_MANUFACTURER(state, manufacturer) {
    state.manufacturers.push(manufacturer)
  }
}

export const actions = {
  // Manufacturers Lookup CRUD
  async createManufacturer({ commit }, payload) {
    try {
      const response = await this.$axios.post("manufacturers", payload)
      // commit("NEW_MANUFACTURER", response.data.data)
      commit("SET_MANUFACTURERS", response.data.data)
    } catch (error) {
      console.error("Error creating manufacturer:", error)
      throw error
    }
  },
  async fetchManufacturers({ commit }) {
    try {
      const response = await this.$axios.get("manufacturers")
      commit("SET_MANUFACTURERS", response.data.data)
    } catch (e) {
      console.error("Error fetching manufacturers:", error)
    }
  },
  async updateManufacturer({ commit }, { id, payload }) {
    try {
      const response = await this.$axios.put(`manufacturers/${id}`, payload)
      commit("SET_MANUFACTURERS", response.data.data)
    } catch (error) {
      console.error("Error updating manufacturer:", error)
      throw error
    }
  },
  async deleteManufacturer({ commit }, id) {
    try {
      const response = await this.$axios.delete(`manufacturers/${id}`)
      commit("SET_MANUFACTURERS", response.data.data)
    } catch (error) {
      console.error("Error deleting manufacturer:", error)
      throw error
    }
  }
}
