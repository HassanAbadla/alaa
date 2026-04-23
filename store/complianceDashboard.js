// store/complianceDashboard.js

export const state = () => ({
  frameworkAuditItems: [],
  complianceStatuses: [],
  controlsByFramework: [],
  avgAuditScore: 0,
  avgAuditProgress: 0
})

export const mutations = {
  SET_FRAMEWORK_AUDIT_ITEMS(state, items) {
    state.frameworkAuditItems = items
  },
  SET_COMPLIANCE_STATUSES(state, statuses) {
    state.complianceStatuses = statuses
  },
  SET_CONTROLS_BY_FRAMEWORK(state, controls) {
    state.controlsByFramework = controls
  },
  SET_AVG_AUDIT_SCORE(state, score) {
    state.avgAuditScore = score
  },
  SET_AVG_AUDIT_PROGRESS(state, progress) {
    state.avgAuditProgress = progress
  }
}
export const actions = {
  async fetchComplianceCharts({ commit }) {
    try {
      const response = await this.$axios.get("compliance-charts")
      console.log("Compliance API raw response:", response)
      return response

      if (!response || !response.data) {
        console.warn(" No data returned from compliance-charts API")
        return
      }

      const { frameworkAuditItems, complianceStatuses, controlsByFramework } = response.data.data

      commit("SET_FRAMEWORK_AUDIT_ITEMS", frameworkAuditItems || [])
      commit("SET_COMPLIANCE_STATUSES", complianceStatuses || [])
      commit("SET_CONTROLS_BY_FRAMEWORK", controlsByFramework || [])
      commit("SET_AVG_AUDIT_SCORE", data.avg_audit_score || 0)
      commit("SET_AVG_AUDIT_PROGRESS", data.avg_audit_progress || 0)
    } catch (error) {
      console.error("Error in compliance charts:", error)
    }
  }
}
