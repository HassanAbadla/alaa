import {
  getAllRiskControls,
  getRiskControlById,
  createRiskControl,
  updateRiskControl,
  deleteRiskControl,
  getOperationalImpacts,
  getImpactReputations,
  getRiskControlTypes,
  getRiskControlEffectiveness
} from "@/api/risk-control-api"

export const state = () => ({
  riskControls: [],
  currentRisk: null,
  loading: false,
  error: null,
  operationalImpacts: [],
  impactReputations: [],
  riskControlTypes: [],
  riskControlEffectiveness: [],
  loadingLookups: {
    operationalImpacts: false,
    impactReputations: false,
    riskControlTypes: false,
    riskControlEffectiveness: false
  }
})

export const mutations = {
  SET_RISK_CONTROLS(state, controls) {
    state.riskControls = controls
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
  ADD_RISK_CONTROL(state, control) {
    state.riskControls.push(control)
  },
  UPDATE_RISK_CONTROL(state, updatedControl) {
    const index = state.riskControls.findIndex((control) => control.id === updatedControl.id)
    if (index !== -1) {
      state.riskControls.splice(index, 1, updatedControl)
    }
  },
  REMOVE_RISK_CONTROL(state, controlId) {
    state.riskControls = state.riskControls.filter((control) => control.id !== controlId)
  },
  SET_OPERATIONAL_IMPACTS(state, impacts) {
    state.operationalImpacts = impacts
  },
  SET_IMPACT_REPUTATIONS(state, reputations) {
    state.impactReputations = reputations
  },
  SET_RISK_CONTROL_TYPES(state, types) {
    state.riskControlTypes = types
  },
  SET_RISK_CONTROL_EFFECTIVENESS(state, effectiveness) {
    state.riskControlEffectiveness = effectiveness
  },
  SET_LOADING_LOOKUP(state, { key, value }) {
    state.loadingLookups[key] = value
  }
}

export const actions = {
  async fetchRiskControls({ commit }, { riskId, filters = {} }) {
    commit("SET_RISK_CONTROLS", [])
    commit("SET_LOADING", true)
    commit("SET_ERROR", null)

    try {
      const response = await getAllRiskControls(riskId, this.$axios, filters)
      commit("SET_RISK_CONTROLS", response.data.data)
      commit("SET_CURRENT_RISK", response.data.risk)
      return response.data
    } catch (error) {
      console.error("Error fetching risk controls:", error)
      commit("SET_ERROR", error.message)
      throw error
    } finally {
      commit("SET_LOADING", false)
    }
  },
  async createRiskControl({ commit }, payload) {
    try {
      const response = await createRiskControl(payload, this.$axios)
      commit("ADD_RISK_CONTROL", response.data.data)
      return response.data.data
    } catch (error) {
      console.error("Error creating risk control:", error)
      throw error
    }
  },
  async updateRiskControl({ commit }, { id, payload }) {
    try {
      const response = await updateRiskControl(payload, this.$axios, id)
      const updatedControl = response.data.data
      commit("UPDATE_RISK_CONTROL", updatedControl)
      return updatedControl
    } catch (error) {
      console.error("Error updating risk control:", error)
      throw error
    }
  },
  async deleteRiskControl({ commit }, id) {
    try {
      await deleteRiskControl(id, this.$axios)
      commit("REMOVE_RISK_CONTROL", id)
    } catch (error) {
      console.error("Error deleting risk control:", error)
      throw error
    }
  },
  async fetchOperationalImpacts({ commit }) {
    commit("SET_LOADING_LOOKUP", { key: "operationalImpacts", value: true })
    try {
      const response = await getOperationalImpacts(this.$axios)
      commit("SET_OPERATIONAL_IMPACTS", response.data.data)
    } catch (error) {
      console.error("Error fetching operational impacts:", error)
      throw error
    } finally {
      commit("SET_LOADING_LOOKUP", { key: "operationalImpacts", value: false })
    }
  },
  async fetchImpactReputations({ commit }) {
    commit("SET_LOADING_LOOKUP", { key: "impactReputations", value: true })
    try {
      const response = await getImpactReputations(this.$axios)
      commit("SET_IMPACT_REPUTATIONS", response.data.data)
    } catch (error) {
      console.error("Error fetching impact reputations:", error)
      throw error
    } finally {
      commit("SET_LOADING_LOOKUP", { key: "impactReputations", value: false })
    }
  },
  async fetchRiskControlTypes({ commit }) {
    commit("SET_LOADING_LOOKUP", { key: "riskControlTypes", value: true })
    try {
      const response = await getRiskControlTypes(this.$axios)
      commit("SET_RISK_CONTROL_TYPES", response.data.data)
    } catch (error) {
      console.error("Error fetching risk control types:", error)
      throw error
    } finally {
      commit("SET_LOADING_LOOKUP", { key: "riskControlTypes", value: false })
    }
  },
  async fetchRiskControlEffectiveness({ commit }) {
    commit("SET_LOADING_LOOKUP", { key: "riskControlEffectiveness", value: true })
    try {
      const response = await getRiskControlEffectiveness(this.$axios)
      commit("SET_RISK_CONTROL_EFFECTIVENESS", response.data.data)
    } catch (error) {
      console.error("Error fetching risk control effectiveness:", error)
      throw error
    } finally {
      commit("SET_LOADING_LOOKUP", { key: "riskControlEffectiveness", value: false })
    }
  }
}

export const getters = {
  getRiskControlById: (state) => (id) => {
    return state.riskControls.find((control) => control.id === id)
  }
}
