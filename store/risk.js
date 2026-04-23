import Vue from "vue"
import {
  getAllRisk,
  getRiskById,
  createRisk,
  bulkCreateRisks,
  updateRisk,
  deleteRisk,
  getRiskCategories,
  getRiskTypes,
  getRiskPriorities,
  getRiskStatuses,
  getRiskLikelihoods,
  getRiskImpacts,
  getAllRiskAttachments,
  createRiskAttachment,
  updateRiskAttachment,
  deleteRiskAttachment
} from "@/api/risk-api"
import { getUsers } from "../api/tenent-api"

export const state = () => ({
  risks: [],
  risk: null,
  stats: null,
  riskPriorities: [],
  riskTypes: [],
  riskCategories: [],
  riskStatuses: [],
  impacts: [],
  likelihoods: [],
  onsetSpeeds: [],
  riskAttachments: [],
  users: [],
  loading: {
    risks: false,
    users: false,
    riskPriorities: false,
    riskTypes: false,
    riskCategories: false,
    riskStatuses: false,
    impacts: false,
    likelihoods: false,
    onsetSpeeds: false,
    riskAttachments: false
  },
  errors: {
    risks: null,
    users: null,
    riskPriorities: null,
    riskTypes: null,
    riskCategories: null,
    riskStatuses: null,
    impacts: null,
    likelihoods: null,
    onsetSpeeds: null,
    riskAttachments: null
  }
})

export const mutations = {
  SET_DATA(state, { key, data }) {
    state[key] = data
  },
  SET_LOADING(state, { key, value }) {
    state.loading[key] = value
  },
  SET_ERROR(state, { key, error }) {
    state.errors[key] = error
  },
  ADD_RISK(state, risk) {
    state.risks.push(risk)
  },
  UPDATE_RISK(state, updatedRisk) {
    const index = state.risks.findIndex((risk) => risk.id === updatedRisk.id)
    if (index !== -1) {
      state.risks.splice(index, 1, updatedRisk)
    }
  },
  REMOVE_RISK(state, riskId) {
    state.risks = state.risks.filter((risk) => risk.id !== riskId)
  },
  SET_RISK_ATTACHMENTS(state, attachments) {
    state.riskAttachments = attachments.map((attachment) => ({
      ...attachment,
      isLoading: false
    }))
  },
  ADD_RISK_ATTACHMENT(state, { data, riskId }) {
    state.riskAttachments.push(data)

    const risk = state.risks.find((risk) => risk.id === riskId)
    if (risk) {
      risk.risk_attachments_count = (risk.risk_attachments_count || 0) + 1
    }
  },
  UPDATE_RISK_ATTACHMENT(state, { id, attachment }) {
    const index = state.riskAttachments.findIndex((att) => att.id === id)
    if (index !== -1) {
      Vue.set(state.riskAttachments, index, { ...attachment })
    }
  },
  REMOVE_RISK_ATTACHMENT(state, { attachmentId, parentId }) {
    state.riskAttachments = state.riskAttachments.filter((att) => att.id !== attachmentId)
    const risk = state.risks.find((risk) => risk.id === parentId)
    if (risk) {
      risk.risk_attachments_count = (risk.risk_attachments_count || 0) - 1
    }
  },
  SINGLE_ATTACHMENT_IS_LOADING(state, { id, value }) {
    const index = state.riskAttachments.findIndex((att) => att.id === id)
    if (index !== -1) {
      Vue.set(state.riskAttachments, index, { ...state.riskAttachments[index], isLoading: value })
    }
  },
  updateMessageCount(state, riskId) {
    const risk = state.risks.find((risk) => risk.id === riskId)
    if (risk) {
      risk.posts_count = risk.posts_count + 1
    }
  }
}

export const actions = {
  async fetchData({ commit }, { key, endpoint, params = {} }) {
    commit("SET_DATA", { key, data: [] })
    commit("SET_LOADING", { key, value: true })
    commit("SET_ERROR", { key, error: null })
    if (key === "risks") {
      // commit("SET_DATA", { key: "stats", data: null })
    }
    try {
      const response = await this.$axios.get(endpoint, { params })
      commit("SET_DATA", { key, data: response.data.data })
      // need to access stats
      if (response.data?.stats) {
        commit("SET_DATA", { key: "stats", data: response.data.stats })
      }
    } catch (error) {
      console.error(`Error fetching ${key}:`, error)
      commit("SET_ERROR", { key, error: error.message })
    } finally {
      commit("SET_LOADING", { key, value: false })
    }
  },
  fetchRisks({ dispatch }, filters = {}) {
    return dispatch("fetchData", { key: "risks", endpoint: "risk", params: filters })
  },
  fetchRisk({ dispatch }, id) {
    return dispatch("fetchData", { key: "risk", endpoint: `risk/${id}` })
  },
  fetchUsers({ dispatch }, filters = {}) {
    return dispatch("fetchData", { key: "users", endpoint: "tenant/users" })
  },
  fetchRiskPriorities({ dispatch }) {
    return dispatch("fetchData", { key: "riskPriorities", endpoint: "risk-priorities" })
  },

  fetchRiskTypes({ dispatch }) {
    return dispatch("fetchData", { key: "riskTypes", endpoint: "risk-types" })
  },
  fetchRiskCategories({ dispatch }) {
    return dispatch("fetchData", { key: "riskCategories", endpoint: "risk-categories" })
  },
  fetchRiskStatuses({ dispatch }) {
    return dispatch("fetchData", { key: "riskStatuses", endpoint: "risk-statuses" })
  },

  fetchImpacts({ dispatch }) {
    return dispatch("fetchData", { key: "impacts", endpoint: "impacts" })
  },
  fetchLikelihoods({ dispatch }) {
    return dispatch("fetchData", { key: "likelihoods", endpoint: "likelihoods" })
  },
  fetchOnsetSpeeds({ dispatch }) {
    return dispatch("fetchData", { key: "onsetSpeeds", endpoint: "risk-onset-speed" })
  },
  async createRisk({ commit }, payload) {
    commit("SET_LOADING", { key: "riskAttachments", value: true })
    try {
      const response = await createRisk(payload, this.$axios)
      commit("ADD_RISK", response.data.data)
      if (response.data?.stats) {
        commit("SET_DATA", { key: "stats", data: response.data.stats })
      }
      return response.data.data
    } catch (error) {
      console.error("Error creating risk:", error)
      throw error
    } finally {
      commit("SET_LOADING", { key: "riskAttachments", value: false })
    }
  },
  async bulkCreateRisks({ dispatch }, risks) {
    try {
      const response = await bulkCreateRisks(risks, this.$axios)
      return { success: true, count: response.data.count, errors: response.data.errors || {} }
    } catch (error) {
      const errors = error.response?.data?.errors || {}
      return { success: false, count: 0, errors }
    }
  },
  async updateRisk({ commit }, { id, payload }) {
    try {
      const response = await updateRisk(payload, this.$axios, id)
      const updatedRisk = response.data.data
      commit("UPDATE_RISK", updatedRisk)
      if (response.data?.stats) {
        commit("SET_DATA", { key: "stats", data: response.data.stats })
      }
      return updatedRisk
    } catch (error) {
      console.error("Error updating risk:", error)
      throw error
    }
  },
  async deleteRisk({ commit }, id) {
    try {
      const response = await deleteRisk(id, this.$axios)
      commit("REMOVE_RISK", id)
      if (response.data?.stats) {
        commit("SET_DATA", { key: "stats", data: response.data.stats })
      }
    } catch (error) {
      console.error("Error deleting risk:", error)
      throw error
    }
  },
  async fetchRiskAttachments({ commit }, riskId) {
    commit("SET_LOADING", { key: "riskAttachments", value: true })
    commit("SET_ERROR", { key: "riskAttachments", error: null })
    commit("SET_RISK_ATTACHMENTS", [])
    try {
      const response = await getAllRiskAttachments(riskId, this.$axios)
      commit("SET_RISK_ATTACHMENTS", response.data.data)
    } catch (error) {
      console.error("Error fetching risk attachments:", error)
      commit("SET_ERROR", { key: "riskAttachments", error: error.message })
    } finally {
      commit("SET_LOADING", { key: "riskAttachments", value: false })
    }
  },
  async createRiskAttachment({ commit }, { formData, riskId }) {
    try {
      const response = await createRiskAttachment(formData, this.$axios)
      commit("ADD_RISK_ATTACHMENT", { data: response.data.data, riskId })
      return response.data.data
    } catch (error) {
      console.error("Error creating risk attachment:", error)
      throw error
    }
  },
  async updateRiskAttachment({ commit }, { id, payload }) {
    commit("SINGLE_ATTACHMENT_IS_LOADING", { id, value: true })
    try {
      const response = await updateRiskAttachment(id, payload, this.$axios)
      commit("UPDATE_RISK_ATTACHMENT", { id, attachment: response.data.data })
      return response.data.data
    } catch (error) {
      console.error("Error updating risk attachment:", error)
      throw error
    } finally {
      commit("SINGLE_ATTACHMENT_IS_LOADING", { id: attachmentId, value: false })
    }
  },
  async deleteRiskAttachment({ commit }, { attachmentId, parentId }) {
    try {
      await deleteRiskAttachment(attachmentId, this.$axios)

      commit("REMOVE_RISK_ATTACHMENT", { attachmentId, parentId })
    } catch (error) {
      console.error("Error deleting risk attachment:", error)
      throw error
    }
  },
  updateMessageCount({ commit }, riskId) {
    commit("updateMessageCount", riskId)
  }
}

export const getters = {
  getRiskById: (state) => (id) => {
    return state.risks.find((risk) => risk.id === id)
  },
  users: (state) => {
    return state.users.map((user) => ({ ...user, name: user?.full_name }))
  },
  risks: (state) => state.risks,
  isLoadingRisks: (state) => state.loading.risks,
  riskCategories: (state) => state.riskCategories,
  riskTypes: (state) => state.riskTypes,
  riskPriorities: (state) => state.riskPriorities,
  riskStatuses: (state) => state.riskStatuses,
  impacts: (state) => state.impacts,
  likelihoods: (state) => state.likelihoods
}
