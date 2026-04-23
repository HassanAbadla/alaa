export const state = () => ({
  stages: []
})

export const getters = {
  projectStages: (state) => state.stages
}

export const mutations = {
  SET_PROJECT_STAGES(state, stages) {
    state.stages = stages
  },
  UPDATE_PROJECT_STAGE(state, updatedStage) {
    const index = state.stages.findIndex((stage) => stage.id === updatedStage.id)
    if (index !== -1) {
      state.stages[index] = {
        ...state.stages[index],
        ...updatedStage
      }
    }
  }
}

export const actions = {
  async fetchProjectStages({ commit }, { project_id, contract_id }) {
    try {
      const response = await this.$axios.get(`project-stages?project_id=${project_id}&contract_id=${contract_id}`)
      commit("SET_PROJECT_STAGES", response.data.data)
    } catch (error) {
      console.error("Error fetching project stages:", error)
      throw error
    }
  },
  async saveStage({ commit }, stage) {
    try {
      const response = await this.$axios.post("project-stages/update", stage)

      commit("UPDATE_PROJECT_STAGE", response.data.data)
      return response.data.data
    } catch (error) {
      console.error("Error saving stage:", error)
      throw error
    }
  }
}
