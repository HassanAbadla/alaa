// store/audits.js
import Vue from "vue"
import {
  getAllAudits,
  addRound,
  closeRound,
  closeSubscription,
  updateSubscription,
  updateAuditItem,
  calculateAuditScore
} from "@/api/audit-api"

export const state = () => ({
  audits: [],
  loadingAudits: false,
  loadingStates: {},
  samaScore: null,
  loadingSamaScore: false
})

export const mutations = {
  SET_AUDITS(state, audits) {
    state.audits = Array.isArray(audits) ? audits : []
  },
  UPDATE_AUDIT_ITEM(state, { id, changes }) {
    const index = state.audits.findIndex((item) => item.id === id)
    if (index !== -1) {
      Vue.set(state.audits, index, { ...state.audits[index], ...changes })
    }
  },

  UPDATE_ROUND(state, { subscriptionId, auditContractId, roundId, changes }) {
    const subscription = state.audits.find((sub) => sub.id === subscriptionId)
    if (subscription) {
      const contract = subscription.audit_contracts.find((contract) => contract.id === auditContractId)
      if (contract) {
        const roundIndex = contract.children.findIndex((round) => round.id === roundId)
        if (roundIndex !== -1) {
          Vue.set(contract.children, roundIndex, { ...contract.children[roundIndex], ...changes })
        }
      }
    }
  },
  ADD_ROUND(state, { subscriptionId, packageId, round }) {
    const subscription = state.audits.find((sub) => sub.id === subscriptionId)
    if (subscription) {
      const contract = subscription.audit_contracts.find((contract) => contract.compliance_package.id === packageId)
      if (contract) {
        if (!Array.isArray(contract.children)) {
          Vue.set(contract, "children", [])
        }
        contract.children.push(round)
      }
    }
  },
  SET_LOADING_STATE(state, { key, value }) {
    Vue.set(state.loadingStates, key, value)
  },
  SET_SAMA_SCORE(state, data) {
    state.samaScore = data
  },
  SET_LOADING_SAMA_SCORE(state, value) {
    state.loadingSamaScore = value
  }
}

export const actions = {
  async fetchAudits({ commit }) {
    commit("SET_LOADING_STATE", { key: "loadingAudits", value: true })
    try {
      const res = await getAllAudits(this.$axios)
      commit("SET_AUDITS", res.data.subscriptions)
    } catch (error) {
      console.error("Error fetching audits:", error)
      commit("SET_AUDITS", [])
    } finally {
      commit("SET_LOADING_STATE", { key: "loadingAudits", value: false })
    }
  },
  async createRound({ commit }, { subscriptionId, packageId, dueDate }) {
    commit("SET_LOADING_STATE", { key: `create_${packageId}`, value: true })
    try {
      const res = await addRound(
        { subscription_id: subscriptionId, compliance_package_id: packageId, due_date: dueDate },
        this.$axios
      )
      commit("ADD_ROUND", { subscriptionId, packageId, round: res.data.data })
      return res.data
    } catch (error) {
      console.error("Error creating round:", error)
    } finally {
      commit("SET_LOADING_STATE", { key: `create_${packageId}`, value: false })
    }
  },
  async toggleItemStatus({ commit }, { type, item, closeMutation }) {
    if (item.closed || item.close) {
      return
    }
    const loadingKey = `toggle_${type === "subscription" ? "sub_" : ""}${item.id}`
    commit("SET_LOADING_STATE", { key: loadingKey, value: true })
    try {
      const closeFunction = type === "subscription" ? closeSubscription : closeRound
      const res = await closeFunction(item.id, this.$axios)
      if (res.data.status === "success") {
        if (type === "subscription") {
          commit("UPDATE_AUDIT_ITEM", { id: item.id, changes: { close: true } })
        } else {
          commit("UPDATE_ROUND", {
            subscriptionId: item.subscriptionId,
            auditContractId: item.auditContractId,
            roundId: item.id,
            changes: { closed: 1 }
          })
        }
      } else {
        console.error(`Failed to close ${type}:`, res.data.message)
      }
    } catch (error) {
      console.error(`Error toggling ${type} status:`, error)
    } finally {
      commit("SET_LOADING_STATE", { key: loadingKey, value: false })
    }
  },

  toggleSubscriptionStatus({ dispatch }, subscription) {
    return dispatch("toggleItemStatus", {
      type: "subscription",
      item: subscription,
      closeMutation: "UPDATE_AUDIT_ITEM"
    })
  },

  toggleRoundStatus({ dispatch }, round) {
    return dispatch("toggleItemStatus", {
      type: "round",
      item: round,
      closeMutation: "UPDATE_ROUND"
    })
  },
  async updateNote({ commit }, { type, id, note, updateMutation, subscriptionId, auditContractId, roundId }) {
    const loadingKey = `update_${type === "subscription" ? "" : "round_"}note_${id || subscriptionId}`
    commit("SET_LOADING_STATE", { key: loadingKey, value: true })
    try {
      const updateFunction = type === "subscription" ? updateSubscription : updateAuditItem
      const updateId = type === "subscription" ? subscriptionId : id
      const res = await updateFunction(updateId, { note }, this.$axios)
      if (res.data.status === "success") {
        if (type === "subscription") {
          commit(updateMutation, { id: subscriptionId, changes: { note } })
        } else {
          commit(updateMutation, { subscriptionId, auditContractId, roundId, changes: { note } })
        }
      } else {
        console.error(`Failed to update ${type} note:`, res.data.message)
      }
    } catch (error) {
      console.error(`Error updating ${type} note:`, error)
    } finally {
      commit("SET_LOADING_STATE", { key: loadingKey, value: false })
    }
  },

  updateSubscriptionNote({ dispatch }, payload) {
    return dispatch("updateNote", {
      ...payload,
      type: "subscription",
      updateMutation: "UPDATE_AUDIT_ITEM",
      id: payload.subscriptionId
    })
  },

  updateRoundNote({ dispatch }, payload) {
    return dispatch("updateNote", {
      ...payload,
      type: "round",
      updateMutation: "UPDATE_ROUND",
      id: payload.roundId
    })
  },

  async fetchSamaScore({ commit }, auditId) {
    commit("SET_LOADING_SAMA_SCORE", true)
    commit("SET_SAMA_SCORE", null)
    try {
      const res = await calculateAuditScore(auditId, this.$axios)
      commit("SET_SAMA_SCORE", res.data.data)
      return res.data
    } catch (error) {
      console.error("Error fetching SAMA score:", error)
      commit("SET_SAMA_SCORE", null)
    } finally {
      commit("SET_LOADING_SAMA_SCORE", false)
    }
  }
}

export const getters = {
  computedTreeItems: (state) => {
    return state.audits.map((subscription) => ({
      ...subscription,
      level: "subscription",
      children: subscription.audit_contracts.map((contract) => ({
        ...contract,
        level: "package",
        parentClosed: Boolean(subscription.close),
        children: contract.children.map((round, i) => ({
          ...round,
          index: i,
          level: "round",
          parentClosed: Boolean(subscription.close),
          parentName: contract.compliance_package.name,
          displayName: `${contract.compliance_package.name} - ${round.name}`,
          subscriptionId: subscription.id,
          auditContractId: contract.id
        }))
      }))
    }))
  },
  loadingStates: (state) => state.loadingStates,
  samaScore: (state) => state.samaScore,
  loadingSamaScore: (state) => state.loadingSamaScore
}
