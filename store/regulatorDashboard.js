export const state = () => ({
  dashboardData: null,
  regulatorsByCountry: [],
  frameworksByPackage: [],
  complianceItemsByActivePackages: [],
  frameworkTable: [],
  frameworkByRegulator: []
})

export const mutations = {
  SET_DASHBOARD_DATA(state, data) {
    state.dashboardData = data
  },
  SET_REGULATORS_BY_COUNTRY(state, data) {
    state.regulatorsByCountry = data
  },
  SET_FRAMEWORKS_BY_PACKAGE(state, data) {
    state.frameworksByPackage = data
  },
  SET_COMPLIANCE_ITEMS_BY_ACTIVE_PACKAGES(state, data) {
    state.complianceItemsByActivePackages = data
  },
  SET_FRAMEWORK_TABLE(state, data) {
    state.frameworkTable = data
  },
  SET_FRAMEWORK_BY_REGULATOR(state, data) {
    state.frameworkByRegulator = data
  }
}

export const actions = {
  async fetchRegulatorCharts({ commit }) {
    try {
      const response = await this.$axios.get("regulators-dashboard")
      const data = response.data.data || {}

      commit("SET_DASHBOARD_DATA", data)
      commit("SET_REGULATORS_BY_COUNTRY", data.regulators_by_country || [])
      commit("SET_FRAMEWORKS_BY_PACKAGE", data.frameworks_by_package || [])
      commit("SET_COMPLIANCE_ITEMS_BY_ACTIVE_PACKAGES", data.compliance_items_by_active_packages || [])
      commit("SET_FRAMEWORK_BY_REGULATOR", data.framework_by_regulator || [])
      commit("SET_FRAMEWORK_TABLE", data.framework_table || [])
    } catch (error) {
      console.error("Error in regulator charts:", error)
    }
  }
}
