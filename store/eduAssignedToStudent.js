export const state = () => ({
  assignedToStudentList: []
  // crudLevelList: []
})

export const mutations = {
  SET_ASSIGNED(state, data) {
    state.assignedToStudentList = data
  },
  ADD_ASSIGNED(state, data) {
    state.assignedToStudentList.push(data)
  },
  UPDATE_ASSIGNED(state, data) {
    const index = state.assignedToStudentList.findIndex((item) => item.id === data.id)
    state.assignedToStudentList.splice(index, 1, data)
  },
  DELETE_ASSIGNED(state, id) {
    const index = state.assignedToStudentList.findIndex((item) => item.id === id)
    state.assignedToStudentList.splice(index, 1)
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
  async fetchStudentAssigned({ commit }) {
    const response = await this.$axios.$get("/edu-students-assigned")
    commit("SET_ASSIGNED", response.data)
  },
  async addStudentAsigned({ commit }, data) {
    const response = await this.$axios.$post("/edu-student-assigned/store", data)
    commit("ADD_ASSIGNED", data)
  },
  async updateStudentAsigned({ commit }, { id, payload }) {
    const response = await this.$axios.$put(`/edu-student-assigned/update/${id}`, payload)
    commit("UPDATE_ASSIGNED", response.data)
  },
  async deleteStudentAsigned({ commit }, id) {
    const response = await this.$axios.$delete(`/edu-student-assigned/delete/${id}`)
    commit("DELETE_ASSIGNED", id)
  }
}
