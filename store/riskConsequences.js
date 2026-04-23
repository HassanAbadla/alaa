import {
  getAllRiskConsequences,
  getRiskConsequenceById,
  createRiskConsequence,
  updateRiskConsequence,
  deleteRiskConsequence
} from "@/api/risk-consequence-api"

export const state = () => ({
  riskConsequences: [],
  risk: null,
  loading: false,
  error: null
})

export const mutations = {
  SET_RISK_CONSEQUENCES(state, data) {
    console.log("DATA", data)
    state.riskConsequences = data.data
    state.risk = data.risk
  },
  SET_LOADING(state, value) {
    state.loading = value
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  ADD_RISK_CONSEQUENCE(state, consequence) {
    state.riskConsequences.push(consequence)
  },
  UPDATE_RISK_CONSEQUENCE(state, updatedConsequence) {
    const index = state.riskConsequences.findIndex((consequence) => consequence.id === updatedConsequence.id)
    if (index !== -1) {
      state.riskConsequences.splice(index, 1, updatedConsequence)
    }
  },
  REMOVE_RISK_CONSEQUENCE(state, consequenceId) {
    state.riskConsequences = state.riskConsequences.filter((consequence) => consequence.id !== consequenceId)
  }
}

export const actions = {
  async fetchRiskConsequences({ commit }, riskId) {
    commit("SET_LOADING", true)
    commit("SET_ERROR", null)
    commit("SET_RISK_CONSEQUENCES", [])
    try {
      const response = await getAllRiskConsequences(riskId, this.$axios)
      commit("SET_RISK_CONSEQUENCES", response.data)
      return response.data
    } catch (error) {
      console.error("Error fetching risk consequences:", error)
      commit("SET_ERROR", error.message)
      throw error
    } finally {
      commit("SET_LOADING", false)
    }
  },
  async createRiskConsequence({ commit }, payload) {
    try {
      const response = await createRiskConsequence(payload, this.$axios)
      commit("ADD_RISK_CONSEQUENCE", response.data.data)
      return response.data.data
    } catch (error) {
      console.error("Error creating risk consequence:", error)
      throw error
    }
  },
  async updateRiskConsequence({ commit }, { id, payload }) {
    try {
      const response = await updateRiskConsequence(payload, this.$axios, id)
      const updatedConsequence = response.data.data
      commit("UPDATE_RISK_CONSEQUENCE", updatedConsequence)
      return updatedConsequence
    } catch (error) {
      console.error("Error updating risk consequence:", error)
      throw error
    }
  },
  async deleteRiskConsequence({ commit }, id) {
    try {
      await deleteRiskConsequence(id, this.$axios)
      commit("REMOVE_RISK_CONSEQUENCE", id)
    } catch (error) {
      console.error("Error deleting risk consequence:", error)
      throw error
    }
  }
}

export const getters = {
  getRiskConsequenceById: (state) => (id) => {
    return state.riskConsequences.find((consequence) => consequence.id === id)
  }
}
