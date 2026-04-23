import Vue from "vue"

export const state = () => ({
  attachments: [],
  loading: false,
  controlReviewTypes: [],
  loadingControlReviewTypes: false,
  controlReviewPurposes: [],
  loadingControlReviewPurposes: false
})

export const mutations = {
  SET_STATE(state, { name, value }) {
    state[name] = value
  },
  REMOVE_FROM_LIST(state, itemId) {
    state.attachments = state.attachments.filter((att) => att.id !== itemId)
  },
  UPDATE_ATTACHMENT(state, updatedAttachment) {
    const index = state.attachments.findIndex((att) => att.id === updatedAttachment.id)
    if (index !== -1) {
      Vue.set(state.attachments, index, { ...updatedAttachment })
    }
  }
}

export const actions = {
  async fetchAttachments({ commit }, payload) {
    commit("SET_STATE", { name: "loading", value: true })
    commit("SET_STATE", { name: "attachments", value: [] })
    try {
      const res = await this.$axios.get("documents", { params: payload })
      commit("SET_STATE", { name: "attachments", value: res.data.data })
    } catch (error) {
      console.error("Error fetching attachments", error)
    } finally {
      commit("SET_STATE", { name: "loading", value: false })
    }
  },
  async fetchControlReviewTypes({ commit }) {
    commit("SET_STATE", { name: "loadingControlReviewTypes", value: true })
    commit("SET_STATE", { name: "controlReviewTypes", value: [] })
    try {
      const res = await this.$axios.get("attachment-types")
      commit("SET_STATE", { name: "controlReviewTypes", value: res.data.data })
    } catch (error) {
      console.error("Error fetching controlReviewTypes", error)
    } finally {
      commit("SET_STATE", { name: "loadingControlReviewTypes", value: false })
    }
  },
  async fetchControlReviewPurposes({ commit }) {
    commit("SET_STATE", { name: "loadingControlReviewPurposes", value: true })
    commit("SET_STATE", { name: "controlReviewPurposes", value: [] })
    try {
      const res = await this.$axios.get("attachment-purposes")
      commit("SET_STATE", { name: "controlReviewPurposes", value: res.data.data })
    } catch (error) {
      console.error("Error fetching controlReviewPurposes", error)
    } finally {
      commit("SET_STATE", { name: "loadingControlReviewPurposes", value: false })
    }
  },
  removeAttachmentFromList({ commit }, itemId) {
    commit("REMOVE_FROM_LIST", itemId)
  }
}
