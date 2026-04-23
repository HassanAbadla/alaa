export const state = () => ({
  studentYearsList: []
  // crudLevelList: []
})

export const mutations = {
  SET_STUDENT_YEARS(state, data) {
    state.studentYearsList = data
  },
  ADD_STUDENT_YEAR(state, data) {
    state.studentYearsList.push(data)
  },
  UPDATE_STUDENT_YEAR(state, data) {
    const index = state.studentYearsList.findIndex((item) => item.id === data.id)
    state.studentYearsList.splice(index, 1, data)
  },
  DELETE_STUDENT_YEAR(state, id) {
    const index = state.studentYearsList.findIndex((item) => item.id === id)
    state.studentYearsList.splice(index, 1)
  }
  // SET_CRUD_GRADES(state, data) {
  //   state.crudLevelList = data
  // }
}

export const actions = {
  // async getCrudLevelsList({ commit }) {
  //   const response = await this.$axios.$get("/edu-grades/crud-list")
  //   commit("SET_CRUD_GRADES", response.data)
  // },
  async fetchStudentYears({ commit }) {
    const response = await this.$axios.$get("/edu-student-years")
    commit("SET_STUDENT_YEARS", response.data)
  },
  async addStudentYear({ commit }, data) {
    const response = await this.$axios.$post("/edu-student-year/store", data)
    commit("ADD_STUDENT_YEAR", data)
  },
  async updateStudentyear({ commit }, { id, payload }) {
    const response = await this.$axios.$put(`/edu-student-year/update/${id}`, payload)
    commit("UPDATE_STUDENT_YEAR", response.data)
  },
  async deleteStudentYear({ commit }, id) {
    const response = await this.$axios.$delete(`/edu-student-year/delete/${id}`)
    commit("DELETE_STUDENT_YEAR", id)
  }
}
