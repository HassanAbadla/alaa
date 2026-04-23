export const state = () => ({
  userPositions: [],
  loadingUserPositions: false
})

export const mutations = {
  SET_USER_POSITIONS(state, positions) {
    state.userPositions = positions
  },
  NEW_USER_POSITIONS(state, position) {
    state.userPositions.push(position)
  },
  UPDATE_USER_POSITIONS(state, position) {
    const index = state.userPositions.findIndex((p) => p.id === position.id)
    state.userPositions.splice(index, 1, position)
  },
  SET_LOADING_USER_POSITIONS(state, loading) {
    state.loadingUserPositions = loading
  }
}

export const getters = {
  getUserPositions: (state) => state.userPositions,
  isLoadingUserPositions: (state) => state.loadingUserPositions
}

export const actions = {
  async fetchUserPositions({ commit }, filters = {}) {
    commit("SET_LOADING_USER_POSITIONS", true)
    try {
      const response = await this.$axios.get("/user-positions", { params: filters })
      commit("SET_USER_POSITIONS", response.data.data)
    } catch (error) {
      console.error("Error fetching user positions:", error)
      throw error
    } finally {
      commit("SET_LOADING_USER_POSITIONS", false)
    }
  },

  async addUserPosition({ commit }, payload) {
    try {
      const response = await this.$axios.post("/user-positions", payload)
      commit("NEW_USER_POSITIONS", response.data.data)
      // Fetch updated users list and commit to users store
      // const usersResponse = await this.$axios.get("tenant/users")
      // commit(
      //   "users/setState",
      //   {
      //     name: "users",
      //     value: usersResponse.data.data
      //   },
      //   { root: true }
      // )
    } catch (error) {
      console.error("Error adding user position:", error)
      throw error
    }
  },

  async updateUserPosition({ commit }, { id, payload }) {
    try {
      const response = await this.$axios.put("/user-positions/" + id, payload)
      commit("UPDATE_USER_POSITIONS", response.data.data)
      // Fetch updated users list and commit to users store
      // const usersResponse = await this.$axios.get("tenant/users")
      // commit(
      //   "users/setState",
      //   {
      //     name: "users",
      //     value: usersResponse.data.data
      //   },
      //   { root: true }
      // )
    } catch (error) {
      console.error("Error updating user position:", error)
      throw error
    }
  }
}
