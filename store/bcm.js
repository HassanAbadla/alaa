// store/bcm.js  –  Vuex module for BCM Dashboard
import axios from "axios"

export const state = () => ({
  dashboardStats: {
    total_threats: 0,
    average_rto_hours: 0,
    average_rpo_hours: 0,
    threats_during_peak_time: 0,
    distribution_times: [],
    impacts_by_category: [],
    impacts_by_severity: [],
    threats_by_category: [],
    threats_by_location: [],
    threats_by_recovery_code: [],
    threats_by_type: []
  }
})

export const mutations = {
  SET_DASHBOARD_STATS(state, payload) {
    state.dashboardStats = payload
  }
}

export const actions = {
  async fetchBCMDashboardStats({ commit }) {
    const { data } = await axios.get("/bcm-threats/dashboard")
    if (data.status === "success") {
      commit("SET_DASHBOARD_STATS", data.data)
    }
  }
}

export const getters = {
  getDashboardStats: (state) => state.dashboardStats
}
