export const state = () => ({
  studentsList: []
  // crudLevelList: []
})

export const mutations = {
  // SET_STUDENTS(state, data) {
  //   state.studentsList = data
  // },
  SET_STUDENTS(state, data) {
    state.studentsList = data.filter((item) => item?.type?.code === "student")
  },
  ADD_STUDENT(state, data) {
    state.studentsList.push(data)
  },
  UPDATE_STUDENT(state, data) {
    const index = state.studentsList.findIndex((item) => item.id === data.id)
    state.studentsList.splice(index, 1, data)
  },
  DELETE_STUDENT(state, id) {
    const index = state.studentsList.findIndex((item) => item.id === id)
    state.studentsList.splice(index, 1)
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
  async fetchStudents({ commit }, filters = {}) {
    const response = await this.$axios.$get("/edu-students", { params: filters })
    commit("SET_STUDENTS", response.data)
  },
  async addStudent({ commit }, data) {
    const response = await this.$axios.$post("/edu-student/store", data)
    commit("ADD_STUDENT", data)
  },
  async updateStudent({ commit }, { id, payload }) {
    const response = await this.$axios.$put(`/edu-student/update/${id}`, payload)
    commit("UPDATE_STUDENT", response.data)
  },
  async deleteStudent({ commit }, id) {
    const response = await this.$axios.$delete(`/edu-student/delete/${id}`)
    commit("DELETE_STUDENT", id)
  }
}
