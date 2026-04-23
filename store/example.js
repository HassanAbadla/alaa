export const state = () => ({
  example: {},
  loading: false
})

export const mutations = {
  setState(state, { name, value }) {
    state[name] = value
  }
}

export const actions = {
  async fetchData({ commit }) {
    commit("setState", { name: "loading", value: true })
    try {
      const res = await this.$axios.get("example" + example_id, {})
      commit("setState", { name: "example", value: res.data.data })
    } catch (error) {
      console.error(error)
    } finally {
      commit("setState", { name: "loading", value: false })
    }
  }
}
