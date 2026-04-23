export const state = () => ({
  assignedToClassList: [],
  classStories: []
  // crudLevelList: []
})

export const mutations = {
  SET_ASSIGNED(state, data) {
    state.assignedToClassList = data
  },
  ADD_ASSIGNED(state, data) {
    state.assignedToClassList.push(data)
  },
  UPDATE_ASSIGNED(state, data) {
    const index = state.assignedToClassList.findIndex((item) => item.id === data.id)
    state.assignedToClassList.splice(index, 1, data)
  },
  DELETE_ASSIGNED(state, id) {
    const index = state.assignedToClassList.findIndex((item) => item.id === id)
    state.assignedToClassList.splice(index, 1)
  },
  // SET_CRUD_GRADES(state, data) {
  //   state.crudLevelList = data
  // }
  SET_CLASS_STORIES(state, data) {
    state.classStories = data
  },
  CLEAR_CLASS_STORIES(state) {
    state.classStories = []
  }
}

export const actions = {
  // async getCrudLevelsList({ commit }) {
  //   const response = await this.$axios.$get("/edu-grades/crud-list")
  //   commit("SET_CRUD_GRADES", response.data)
  // },
  async fetchClassAssigned({ commit }) {
    const response = await this.$axios.$get("/edu-classes-assigned")
    commit("SET_ASSIGNED", response.data)
  },
  async addClassAsigned({ commit }, data) {
    const response = await this.$axios.$post("/edu-class-assigned/store", data)
    commit("ADD_ASSIGNED", data)
  },
  async updateClassAsigned({ commit }, { id, payload }) {
    const response = await this.$axios.$put(`/edu-class-assigned/update/${id}`, payload)
    commit("UPDATE_ASSIGNED", response.data)
  },
  async deleteClassAsigned({ commit }, id) {
    const response = await this.$axios.$delete(`/edu-class-assigned/delete/${id}`)
    commit("DELETE_ASSIGNED", id)
  },

  async getClassStories({ commit }) {
    commit("CLEAR_CLASS_STORIES")
    const response = await this.$axios.$get("/edu-class-stories")
    commit("SET_CLASS_STORIES", response.data)
  },
  async assignStoryToMe({ commit }, data) {
    const response = await this.$axios.$post("/edu-class-stories/assign-to-me", data)
    // commit("SET_CLASS_STORIES", response.data)
  }
}
