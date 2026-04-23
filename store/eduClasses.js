export const state = () => ({
  classesList: []
  // crudLevelList: []
})

export const mutations = {
  SET_EDU_CLASSES(state, data) {
    state.classesList = data
  },
  ADD_EDU_CLASS(state, data) {
    state.classesList.push(data)
  },
  UPDATE_EDU_CLASS(state, data) {
    const index = state.classesList.findIndex((item) => item.id === data.id)
    state.classesList.splice(index, 1, data)
  },
  DELETE_EDU_CLASS(state, id) {
    const index = state.classesList.findIndex((item) => item.id === id)
    state.classesList.splice(index, 1)
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
  async fetchEduClasses({ commit }) {
    const response = await this.$axios.$get("/edu-classes")
    console.log(response.data)

    commit("SET_EDU_CLASSES", response.data)
  },
  async addEduClass({ commit }, data) {
    const response = await this.$axios.$post("/edu-class/store", data)
    commit("ADD_EDU_CLASS", data)
  },
  async updateEduClass({ commit }, { id, payload }) {
    const response = await this.$axios.$put(`/edu-class/update/${id}`, payload)
    commit("UPDATE_EDU_CLASS", response.data)
  },
  async deleteEduClass({ commit }, id) {
    const response = await this.$axios.$delete(`/edu-class/delete/${id}`)
    commit("DELETE_EDU_CLASS", id)
  }
}
