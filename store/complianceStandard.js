export const state = () => ({
  complianceStandardList: []
})

export const mutations = {
  SET_STANDARD(state, item) {
    state.complianceStandardList = item
  },
  NEW_MANUFACTURER(state, item) {
    state.complianceStandardList.push(item)
  }
}

export const actions = {
  async createComplianceStandard({ commit }, payload) {
    try {
      const response = await this.$axios.post("add-compliance-standards", payload)
      // commit("NEW_MANUFACTURER", response.data.data)
      commit("SET_STANDARD", response.data.data)
    } catch (error) {
      console.error("Error creating Compliance Standard:", error)
      throw error
    }
  },
  async fetchComplianceStandards({ commit }) {
    try {
      const response = await this.$axios.get("compliance-standards")
      commit("SET_STANDARD", response.data.data)
    } catch (e) {
      console.error("Error fetching Compliance Standards:", error)
    }
  }
}
