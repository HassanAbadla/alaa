export const state = () => ({
  evidences: [],
  currentEvidence: null
})

export const mutations = {
  SET_EVIDENCES(state, evidences) {
    state.evidences = evidences
  },
  SET_CURRENT_EVIDENCE(state, evidence) {
    state.currentEvidence = evidence
  },
  ADD_EVIDENCE(state, evidence) {
    state.evidences.push(evidence)
  },
  UPDATE_EVIDENCE(state, updatedEvidence) {
    const index = state.evidences.findIndex((e) => e.id === updatedEvidence.id)
    if (index !== -1) {
      state.evidences.splice(index, 1, updatedEvidence)
    }
  },

  REMOVE_EVIDENCE(state, evidenceId) {
    state.evidences = state.evidences.filter((e) => e.id !== evidenceId)
  }
}

export const actions = {
  async fetchEvidences({ commit }) {
    try {
      const response = await this.$axios.get("/compliance-evidence")
      commit("SET_EVIDENCES", response.data.data)
    } catch (error) {
      throw error
    }
  },
  // Fetch single evidence
  async fetchEvidence({ commit }, evidenceId) {
    try {
      const response = await this.$axios.get(`/compliance-evidence/${evidenceId}`)
      commit("SET_CURRENT_EVIDENCE", response.data.data || response.data)
    } catch (error) {
      throw error
    }
  },

  // Create new evidence
  async createEvidence({ commit, dispatch }, payload) {
    try {
      const response = await this.$axios.post("/compliance-evidence", payload)
      const newEvidence = response.data.data

      // commit("ADD_EVIDENCE", newEvidence)
      dispatch("fetchEvidences")
    } catch (error) {
      throw error
    }
  },

  // Update evidence
  async updateEvidence({ commit, dispatch }, { id, payload }) {
    try {
      const response = await this.$axios.put(`/compliance-evidence/${id}`, payload)
      // commit("UPDATE_EVIDENCE", response.data.data)
      dispatch("fetchEvidences")
    } catch (error) {
      throw error
    }
  },

  // Delete evidence
  async deleteEvidence({ commit }, id) {
    try {
      await this.$axios.delete(`/compliance-evidence/${id}`)
      commit("REMOVE_EVIDENCE", id)
    } catch (error) {
      throw error
    }
  },

  async complianceEvidenceTable({ commit }) {
    try {
      const response = await this.$axios.get("/compliance-evidence-table")
      // commit("SET_EVIDENCES", response.data.data)
      return response
    } catch (error) {
      throw error
    }
  }
}
