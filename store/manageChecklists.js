import Vue from "vue"

export const state = () => ({
  stages: [],
  loadingStages: false
})

export const mutations = {
  setStages(state, data) {
    state.stages = data.map((item) => {
      return { ...item, CANSTitle: item.title }
    })
  },
  updateStage(state, updatedStage) {
    const index = state.stages.findIndex((stage) => stage.id === updatedStage.id)
    console.log({ updatedStage, index })
    if (index !== -1) {
      Vue.set(state.stages, index, { ...updatedStage })
    }
  },
  updateLoading(state, { name, value }) {
    state[name] = value
  },
  updateMessageCount(state, stageId) {
    const stage = state.stages.find((stage) => stage.id === stageId)
    if (stage) {
      stage.posts_count = stage.posts_count + 1
    }
  }
}

export const actions = {
  async fetchStages({ commit }, { project_id, contract_id }) {
    commit("updateLoading", { name: "loadingStages", value: true })
    try {
      const res = await this.$axios.get(`project-stages?project_id=${project_id}&contract_id=${contract_id}`)
      commit("setStages", res.data.data)
    } catch (error) {
      console.error(error)
    } finally {
      commit("updateLoading", { name: "loadingStages", value: false })
    }
  },
  async saveStage({ commit }, payload) {
    try {
      const response = await this.$axios.post("project-stages/update", payload)

      commit("updateStage", response.data.data)
      return response.data.data
    } catch (error) {
      console.error("Error saving stage:", error)
      throw error
    }
  },
  updateMessageCount({ commit }, stageId) {
    commit("updateMessageCount", stageId)
  }
}
