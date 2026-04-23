export const state = () => ({
  complianceEvidences: []
})

export const mutations = {
  SET_COMPLIANCE_EVIDENCES(state, complianceEvidences) {
    state.complianceEvidences = complianceEvidences
  },
  ADD_COMPLIANCE_EVIDENCE(state, complianceEvidence) {
    state.complianceEvidences.push(complianceEvidence)
  },
  UPDATE_COMPLIANCE_EVIDENCE(state, complianceEvidence) {
    const index = state.complianceEvidences.findIndex((evidence) => evidence.id === complianceEvidence.id)
    if (index !== -1) {
      state.complianceEvidences.splice(index, 1, complianceEvidence)
    }
  },
  REMOVE_COMPLIANCE_EVIDENCE(state, id) {
    state.complianceEvidences = state.complianceEvidences.filter((evidence) => evidence.id !== id)
  }
}

export const actions = {
  getComplianceEvidences({ commit }, filters = {}) {
    return this.$axios
      .get("compliance-evidences", { params: filters })
      .then((response) => {
        commit("SET_COMPLIANCE_EVIDENCES", response.data.data)
      })
      .catch((error) => {
        console.error("Error fetching compliance evidences:", error)
        throw error
      })
  },
  addComplianceEvidence({ commit }, payload) {
    return this.$axios
      .post("compliance-evidences", payload)
      .then((response) => {
        commit("ADD_COMPLIANCE_EVIDENCE", response.data.data)
      })
      .catch((error) => {
        console.error("Error adding compliance evidence:", error)
        throw error
      })
  },
  updateComplianceEvidence({ commit }, { id, data }) {
    return this.$axios
      .put(`compliance-evidences/${id}`, data)
      .then((response) => {
        commit("UPDATE_COMPLIANCE_EVIDENCE", response.data.data)
      })
      .catch((error) => {
        console.error("Error updating compliance evidence:", error)
        throw error
      })
  },
  deleteComplianceEvidence({ commit }, id) {
    return this.$axios
      .delete(`compliance-evidences/${id}`)
      .then(() => {
        commit("REMOVE_COMPLIANCE_EVIDENCE", id)
      })
      .catch((error) => {
        console.error("Error deleting compliance evidence:", error)
        throw error
      })
  },

  async importData({ commit }, formData) {
    try {
      const response = await this.$axios.post("compliance-evidences-import", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      return response.data
    } catch (error) {
      throw error
    }
  },

  async downloadTemplate({ commit }) {
    try {
      const response = await this.$axios.get("compliance-evidences-template", {
        responseType: "blob"
      })

      return response.data
    } catch (error) {
      throw error
    }
  }
}
