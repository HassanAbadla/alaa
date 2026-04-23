export const state = () => ({
  portfolios: [],
  portfoliosLoading: false,
  programs: [],
  programsLoading: false,
  projects: [],
  projectsLoading: false,
  contracts: [],
  contractsLoading: false
})

export const mutations = {
  SET_STATE(state, { name, value }) {
    state[name] = value
  }
}
export const actions = {
  async fetchData({ commit }, name) {
    commit("SET_STATE", { name: `${name}Loading`, value: true })
    try {
      const res = await this.$axios.get(`${name}-estimated-cost`)
      commit("SET_STATE", { name: name, value: res.data.data })
    } catch (error) {
      console.error(`There was a problem fetching ${name}`, error)
    } finally {
      commit("SET_STATE", { name: `${name}Loading`, value: false })
    }
  }
}
