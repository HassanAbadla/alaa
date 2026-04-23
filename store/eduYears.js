export const state = () => ({
  yearsList: [],
  crudYearsList: []
})

export const mutations = {
  SET_EDU_YEARS(state, data) {
    state.yearsList = data
  },
  ADD_EDU_YEAR(state, data) {
    state.yearsList.push(data)
  },
  SET_CRUD_YEARS(state, data) {
    state.crudYearsList = data
  }
}

export const actions = {
  async getCrudYearsList({ commit }) {
    const response = await this.$axios.$get("/edu-years/crud-list")
    commit("SET_CRUD_YEARS", response.data)
  },
  async fetchEduYears({ commit }) {
    const response = await this.$axios.$get("/edu-years")
    console.log(response.data)

    commit("SET_EDU_YEARS", response.data)
  },
  async addEduYear({ commit }, data) {
    const response = await this.$axios.$post("/edu-year/store", data)
    commit("ADD_EDU_YEAR", data)
  },
  async updateEduYear({ commit }, { id, payload }) {
    const response = await this.$axios.$put(`/edu-year/update/${id}`, payload)
    commit("SET_EDU_YEARS", response.data)
  },
  async deleteEduYear({ commit }, id) {
    const response = await this.$axios.$delete(`/edu-year/delete/${id}`)
    commit("SET_EDU_YEARS", response.data)
  }
}
