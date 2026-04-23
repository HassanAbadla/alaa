export const state = () => ({
  gradesList: []
  // crudLevelList: []
})

export const mutations = {
  SET_EDU_GRADES(state, data) {
    state.gradesList = data
  },
  ADD_EDU_GRADE(state, data) {
    state.gradesList.push(data)
  },
  UPDATE_EDU_GRADE(state, data) {
    const index = state.gradesList.findIndex((item) => item.id === data.id)
    state.gradesList.splice(index, 1, data)
  },
  DELETE_EDU_GRADE(state, id) {
    const index = state.gradesList.findIndex((item) => item.id === id)
    state.gradesList.splice(index, 1)
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
  async fetchEduGrades({ commit }) {
    const response = await this.$axios.$get("/edu-grades")
    console.log(response.data)

    commit("SET_EDU_GRADES", response.data)
  },
  async addEduGrade({ commit }, data) {
    const response = await this.$axios.$post("/edu-grade/store", data)
    commit("ADD_EDU_GRADE", data)
  },
  async updateEduGrade({ commit }, { id, payload }) {
    const response = await this.$axios.$put(`/edu-grade/update/${id}`, payload)
    commit("UPDATE_EDU_GRADE", response.data)
  },
  async deleteEduGrade({ commit }, id) {
    const response = await this.$axios.$delete(`/edu-grade/delete/${id}`)
    commit("DELETE_EDU_GRADE", id)
  }
}
