export const state = () => ({
  levelsList: [],
  crudLevelList: []
})

export const mutations = {
  SET_EDU_LEVELS(state, data) {
    state.levelsList = data
  },
  ADD_EDU_LEVEL(state, data) {
    state.levelsList.push(data)
  },
  SET_CRUD_LEVELS(state, data) {
    state.crudLevelList = data
  }
}

export const actions = {
  async getCrudLevelsList({ commit }) {
    const response = await this.$axios.$get("/edu-levels/crud-list")
    commit("SET_CRUD_LEVELS", response.data)
  },
  async fetchEduLevels({ commit }) {
    const response = await this.$axios.$get("/edu-levels")
    console.log(response.data)

    commit("SET_EDU_LEVELS", response.data)
  },
  async addEduLevel({ commit }, data) {
    const response = await this.$axios.$post("/edu-level/store", data)
    commit("ADD_EDU_LEVEL", data)
  },
  async updateEduLevel({ commit }, { id, payload }) {
    const response = await this.$axios.$put(`/edu-level/update/${id}`, payload)
    commit("SET_EDU_LEVELS", response.data)
  },
  async deleteEduLevel({ commit }, id) {
    const response = await this.$axios.$delete(`/edu-level/delete/${id}`)
    commit("SET_EDU_LEVELS", response.data)
  }
}
