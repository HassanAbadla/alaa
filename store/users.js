export const state = () => ({
  users: [],
  loading: false
})

export const mutations = {
  setState(state, { name, value }) {
    state[name] = value
  }
}

export const getters = {
  users: (state) => state.users,
  loading: (state) => state.loading
}

const baseUrl = "tenant/users"

export const actions = {
  async fetchUsers({ commit }) {
    commit("setState", { name: "users", value: [] })
    commit("setState", { name: "loading", value: true })
    try {
      const res = await this.$axios.get(baseUrl)
      commit("setState", { name: "users", value: res.data.data })
    } catch (error) {
      console.error(error)
    } finally {
      commit("setState", { name: "loading", value: false })
    }
  }
}
