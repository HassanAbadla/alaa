import {
  getAllRiskCauses,
  getRiskCauseById,
  createRiskCause,
  updateRiskCause,
  deleteRiskCause
} from "@/api/risk-cause-api"

export const state = () => ({
  riskCauses: [],

  loading: false,
  error: null,
  currentRisk: null
})

export const mutations = {
  SET_RISK_CAUSES(state, causes) {
    state.riskCauses = causes
  },
  SET_LOADING(state, value) {
    state.loading = value
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_CURRENT_RISK(state, risk) {
    state.currentRisk = risk
  },
  ADD_RISK_CAUSE(state, cause) {
    state.riskCauses.push(cause)
  },
  UPDATE_RISK_CAUSE(state, updatedCause) {
    const index = state.riskCauses.findIndex((cause) => cause.id === updatedCause.id)
    if (index !== -1) {
      state.riskCauses.splice(index, 1, updatedCause)
    }
  },
  REMOVE_RISK_CAUSE(state, causeId) {
    state.riskCauses = state.riskCauses.filter((cause) => cause.id !== causeId)
  }
}

export const actions = {
  async fetchRiskCauses({ commit }, riskId) {
    commit("SET_LOADING", true)
    commit("SET_ERROR", null)
    commit("SET_RISK_CAUSES", [])
    try {
      const response = await getAllRiskCauses(riskId, this.$axios)
      commit("SET_RISK_CAUSES", response.data.data)
      commit("SET_CURRENT_RISK", response.data.risk)
      return response.data
    } catch (error) {
      console.error("Error fetching risk causes:", error)
      commit("SET_ERROR", error.message)
      throw error
    } finally {
      commit("SET_LOADING", false)
    }
  },
  async createRiskCause({ commit }, payload) {
    try {
      const response = await createRiskCause(payload, this.$axios)
      commit("ADD_RISK_CAUSE", response.data.data)
      return response.data.data
    } catch (error) {
      console.error("Error creating risk cause:", error)
      throw error
    }
  },
  async updateRiskCause({ commit }, { id, payload }) {
    try {
      const response = await updateRiskCause(payload, this.$axios, id)
      const updatedCause = response.data.data
      commit("UPDATE_RISK_CAUSE", updatedCause)
      return updatedCause
    } catch (error) {
      console.error("Error updating risk cause:", error)
      throw error
    }
  },
  async deleteRiskCause({ commit }, id) {
    try {
      await deleteRiskCause(id, this.$axios)
      commit("REMOVE_RISK_CAUSE", id)
    } catch (error) {
      console.error("Error deleting risk cause:", error)
      throw error
    }
  }
}

export const getters = {
  getRiskCauseById: (state) => (id) => {
    return state.riskCauses.find((cause) => cause.id === id)
  }
}
