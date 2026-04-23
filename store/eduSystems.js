export const state = () => ({
  systemsList: [],
  crudSystemsList: []
})

export const mutations = {
  SET_EDU_SYSTEMS(state, eduSystems) {
    state.systemsList = eduSystems
  },
  ADD_EDU_SYSTEM(state, eduSystem) {
    state.systemsList.push(eduSystem)
  },
  SET_CRUD_SYSTEMS(state, systems) {
    state.crudSystemsList = systems
  }
}

export const actions = {
  async getCrudList({ commit }) {
    const response = await this.$axios.$get("/edu-systems/crud-list")
    commit("SET_CRUD_SYSTEMS", response.data)
  },
  async fetchEduSystems({ commit }) {
    const response = await this.$axios.$get("/edu-systems")
    console.log(response.data)

    commit("SET_EDU_SYSTEMS", response.data)
  },
  async addEduSystem({ commit }, eduSystem) {
    const response = await this.$axios.$post("/edu-system/store", eduSystem)
    commit("ADD_EDU_SYSTEM", eduSystem)
  },
  async updateEduSystem({ commit }, { id, payload }) {
    const response = await this.$axios.$put(`/edu-system/update/${id}`, payload)
    commit("SET_EDU_SYSTEMS", response.data)
  },
  async deleteEduSystem({ commit }, eduSystemId) {
    const response = await this.$axios.$delete(`/edu-system/delete/${eduSystemId}`)
    commit("SET_EDU_SYSTEMS", response.data)
  }
}
