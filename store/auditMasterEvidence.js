export const state = () => ({
  evidences: [],
  currentEvidence: null,
  performances: []
})

export const mutations = {
  SET_EVIDENCES(state, evidences) {
    state.evidences = evidences
  },
  SET_CURRENT_EVIDENCE(state, evidence) {
    state.currentEvidence = evidence
  },
  ADD_EVIDENCE(state, evidence) {
    // state.evidences.push(evidence)
    if (Array.isArray(evidence)) {
      state.evidences.push(...evidence)
    } else {
      state.evidences.push(evidence)
    }
  },
  UPDATE_EVIDENCE(state, updatedEvidence) {
    const index = state.evidences.findIndex((e) => e.id === updatedEvidence.id)
    if (index !== -1) {
      state.evidences.splice(index, 1, updatedEvidence)
    }
  },

  REMOVE_EVIDENCE(state, evidenceId) {
    state.evidences = state.evidences.filter((e) => e.id !== evidenceId)
  },
  SET_PERFORMANCES(state, performances) {
    state.performances = performances
  },
  ADD_PERFORMANCE(state, performance) {
    state.performances.push(performance)
  },
  CLEAR_PERFORMANCES(state) {
    state.performances = []
  }
}

export const actions = {
  async fetchEvidences({ commit }, filters = {}) {
    try {
      const response = await this.$axios.get("/audit-evidence", { params: filters })
      commit("SET_EVIDENCES", response.data.data)
    } catch (error) {
      throw error
    }
  },
  // Fetch single evidence
  async fetchEvidence({ commit }, evidenceId) {
    try {
      const response = await this.$axios.get(`/audit-evidence/${evidenceId}`)
      commit("SET_CURRENT_EVIDENCE", response.data.data || response.data)
    } catch (error) {
      throw error
    }
  },

  // Create new evidence
  async createEvidence({ commit }, payload) {
    try {
      const response = await this.$axios.post("/audit-evidence", payload)
      const newEvidence = response.data.data

      commit("ADD_EVIDENCE", newEvidence)
    } catch (error) {
      throw error
    }
  },

  // Update evidence
  async updateEvidence({ commit }, { id, payload }) {
    try {
      const response = await this.$axios.post(`/audit-evidence/${id}`, payload)
      commit("UPDATE_EVIDENCE", response.data.data)
    } catch (error) {
      throw error
    }
  },

  // Delete evidence
  async deleteEvidence({ commit }, id) {
    try {
      await this.$axios.delete(`/audit-evidence/${id}`)
      commit("REMOVE_EVIDENCE", id)
    } catch (error) {
      throw error
    }
  },

  // Adit Items master evidences
  async fetchAuditItemsMasterEvidences({ commit }, auditItemId) {
    try {
      const response = await this.$axios.get("/audit-item-evidence")
      commit("SET_EVIDENCES", response.data.data)
    } catch (error) {
      throw error
    }
  },
  async addAuditItemEvidence({ commit }, payload) {
    try {
      const response = await this.$axios.post("/audit-item-evidence", payload)
      commit("ADD_EVIDENCE", response.data.data)
      return response.data.data
    } catch (error) {
      throw error
    }
  },
  async updateAuditItemEvidence({ commit }, { id, payload }) {
    try {
      const response = await this.$axios.post(`/audit-item-evidence/${id}`, payload)
      commit("UPDATE_EVIDENCE", response.data.data)
    } catch (error) {
      throw error
    }
  },
  async deleteAuditItemEvidence({ commit }, id) {
    try {
      await this.$axios.delete(`/audit-item-evidence/${id}`)
      commit("REMOVE_EVIDENCE", id)
    } catch (error) {
      throw error
    }
  },

  async mappingAuditItemEvidence({ commit }, item) {
    try {
      console.log("Mapping audit item - store:", item)

      const response = await this.$axios.post("/mapping-audit-item", item)
      // commit("ADD_EVIDENCE", response.data.data)
      commit("SET_EVIDENCES", response.data.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Check mapped Evidences
  async checkMappedEvidences({ commit }, { auditId, payload }) {
    try {
      const response = await this.$axios.post(`/mapped-evidences/${auditId}`, payload)
      // commit("SET_EVIDENCES", response.data.data)
      return response.data.data
    } catch (error) {
      throw error
    }
  },
  async getPerformance({ commit }) {
    try {
      const response = await this.$axios.get(`/compliance-percentage`)
      commit("CLEAR_PERFORMANCES")
      commit("SET_PERFORMANCES", response.data.data)
      return response.data.data
    } catch (error) {
      throw error
    }
  },
  async setPerformance({ commit }, payload) {
    try {
      const response = await this.$axios.post(`/compliance-percentage`, payload)
      commit("CLEAR_PERFORMANCES")
      commit("ADD_PERFORMANCE", response.data.data)
      return response.data.data
    } catch (error) {
      throw error
    }
  },
  async calculatePerformance({ commit }) {
    try {
      const response = await this.$axios.get(`/calculate-compliance-percentage`)
      // commit("ADD_PERFORMANCE", response.data.data)
      commit("CLEAR_PERFORMANCES")
      commit("SET_PERFORMANCES", response.data.data)
      return response.data.data
    } catch (error) {
      throw error
    }
  },
  async fetchMissingEvidences({ commit }, payload) {
    try {
      const response = await this.$axios.get(`/missing-evidences`, { params: payload })
      // commit("CLEAR_PERFORMANCES")
      // commit("SET_PERFORMANCES", response.data.data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }
}
