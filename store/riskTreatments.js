import {
  getAllRiskTreatments,
  getRiskTreatmentById,
  createRiskTreatment,
  updateRiskTreatment,
  deleteRiskTreatment,
  getRiskTreatmentStatuses
} from "@/api/risk-treatment-api"

export const state = () => ({
  riskTreatments: [],
  currentRisk: null,
  loading: false,
  error: null,
  riskTreatmentStatuses: [],
  loadingLookups: {
    riskTreatmentStatuses: false
  }
})

export const mutations = {
  SET_RISK_TREATMENTS(state, treatments) {
    state.riskTreatments = treatments
  },
  SET_CURRENT_RISK(state, risk) {
    state.currentRisk = risk
  },
  SET_LOADING(state, value) {
    state.loading = value
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  ADD_RISK_TREATMENT(state, treatment) {
    state.riskTreatments.push(treatment)
  },
  UPDATE_RISK_TREATMENT(state, updatedTreatment) {
    const index = state.riskTreatments.findIndex((treatment) => treatment.id === updatedTreatment.id)
    if (index !== -1) {
      state.riskTreatments.splice(index, 1, updatedTreatment)
    }
  },
  REMOVE_RISK_TREATMENT(state, treatmentId) {
    state.riskTreatments = state.riskTreatments.filter((treatment) => treatment.id !== treatmentId)
  },
  SET_RISK_TREATMENT_STATUSES(state, statuses) {
    state.riskTreatmentStatuses = statuses
  },
  SET_LOADING_LOOKUP(state, { key, value }) {
    state.loadingLookups[key] = value
  }
}

export const actions = {
  async fetchRiskTreatments({ commit }, { riskId, filters = {} }) {
    commit("SET_LOADING", true)
    commit("SET_ERROR", null)
    commit("SET_RISK_TREATMENTS", [])
    console.log("fetchRiskTreatments", riskId, filters)
    try {
      const response = await getAllRiskTreatments(riskId, this.$axios, filters)
      commit("SET_RISK_TREATMENTS", response.data.data)
      commit("SET_CURRENT_RISK", response.data.risk)
      return response.data
    } catch (error) {
      console.error("Error fetching risk treatments:", error)
      commit("SET_ERROR", error.message)
      throw error
    } finally {
      commit("SET_LOADING", false)
    }
  },
  async createRiskTreatment({ commit }, payload) {
    try {
      const response = await createRiskTreatment(payload, this.$axios)
      commit("ADD_RISK_TREATMENT", response.data.data)
      return response.data.data
    } catch (error) {
      console.error("Error creating risk treatment:", error)
      throw error
    }
  },
  async updateRiskTreatment({ commit }, { id, payload }) {
    try {
      const response = await updateRiskTreatment(payload, this.$axios, id)
      const updatedTreatment = response.data.data
      commit("UPDATE_RISK_TREATMENT", updatedTreatment)
      return updatedTreatment
    } catch (error) {
      console.error("Error updating risk treatment:", error)
      throw error
    }
  },
  async deleteRiskTreatment({ commit }, id) {
    try {
      await deleteRiskTreatment(id, this.$axios)
      commit("REMOVE_RISK_TREATMENT", id)
    } catch (error) {
      console.error("Error deleting risk treatment:", error)
      throw error
    }
  },
  async fetchRiskTreatmentStatuses({ commit }) {
    commit("SET_LOADING_LOOKUP", { key: "riskTreatmentStatuses", value: true })
    try {
      const response = await getRiskTreatmentStatuses(this.$axios)
      commit("SET_RISK_TREATMENT_STATUSES", response.data.data)
    } catch (error) {
      console.error("Error fetching risk treatment statuses:", error)
      throw error
    } finally {
      commit("SET_LOADING_LOOKUP", { key: "riskTreatmentStatuses", value: false })
    }
  }
}

export const getters = {
  getRiskTreatmentById: (state) => (id) => {
    return state.riskTreatments.find((treatment) => treatment.id === id)
  }
}
