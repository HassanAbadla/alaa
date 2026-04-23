export const state = () => ({
  chartData: null,
  assetChartData: null,
  categoryChartData: null,
  totalAssets: 0,
  riskTableData: [], // <-- هنا نحفظ بيانات الجدول
  capacityChartData: null,
  treatmentDeadline: [],
  risksByAssetType: [],
  top5Risks: [],
  topThreats: []
})

export const mutations = {
  SET_CHART_DATA(state, data) {
    state.chartData = data
  },
  SET_ASSET_CHART_DATA(state, data) {
    state.assetChartData = data
  },
  SET_TOTAL_ASSETS(state, total) {
    state.totalAssets = total
  },
  SET_CATEGORY_CHART_DATA(state, data) {
    state.categoryChartData = data
  },
  SET_RISK_TABLE_DATA(state, data) {
    state.riskTableData = data
  },
  SET_DATA(state, { key, data }) {
    state[key] = data
  },
  SET_CAPACITY_CHART_DATA(state, data) {
    state.capacityChartData = data
  },
  SET_TREATMENT_DEADLINE(state, data) {
    state.treatmentDeadline = data
  },
  SET_RISKS_BY_ASSET_TYPE(state, data) {
    state.risksByAssetType = data
  },
  SET_TOP_5_RISKS(state, data) {
    state.top5Risks = data
  },
  SET_TOP_THREATS(state, data) {
    state.topThreats = data
  }
}

export const actions = {
  async fetchChartData({ commit }) {
    try {
      const response = await this.$axios.get("/risk-dashboard/by-control-type")
      const apiData = response.data.data.control_types

      const labels = apiData.map((item) => item.name)
      const values = apiData.map((item) => item.count)

      const chartData = {
        labels,
        datasets: [
          {
            label: "Control Type",
            backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#EF5350"],
            data: values
          }
        ]
      }

      commit("SET_CHART_DATA", chartData)
    } catch (error) {
      console.error("Error fetching control type data:", error)
    }
  },

  async fetchAssetChartData({ commit }) {
    try {
      const response = await this.$axios.get("/risk-dashboard/by-asset-type")
      const apiData = response.data.data.asset_types

      const labels = apiData.map((item) => item.name)
      const values = apiData.map((item) => item.count)

      const chartData = {
        labels,
        datasets: [
          {
            label: "Asset Types",
            backgroundColor: ["#8E44AD", "#3498DB", "#E67E22", "#2ECC71"],
            data: values
          }
        ]
      }

      commit("SET_ASSET_CHART_DATA", chartData)
      commit("SET_TOTAL_ASSETS", response.data.data.total_risks || 0)
    } catch (error) {
      console.error("Error fetching asset type data:", error)
    }
  },

  async fetchCategoryChartData({ commit, dispatch, rootGetters }) {
    try {
      await dispatch("risk/fetchRisks", null, { root: true })
      const risks = rootGetters["risk/risks"] || []

      const grouped = risks.reduce((acc, risk) => {
        const key = risk.risk_category?.name || "Unknown"
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {})

      const labels = Object.keys(grouped)
      const values = Object.values(grouped)

      const chartData = {
        labels,
        datasets: [
          {
            label: "Risks by Categories",
            backgroundColor: ["#1abc9c", "#e74c3c", "#9b59b6", "#f1c40f", "#3498db"],
            data: values
          }
        ]
      }

      commit("SET_CATEGORY_CHART_DATA", chartData)
    } catch (error) {
      console.error("Error building category chart data:", error)
    }
  },

  //  جدول المخاطر: Risk ID, Budget, Treatment Duration

  async fetchRiskTableData({ commit }) {
    try {
      const response = await this.$axios.get("/risk-dashboard/dashboard")
      commit("SET_RISK_TABLE_DATA", response.data.data.top_treatments || [])
      commit("SET_TREATMENT_DEADLINE", response.data.data.treatement_deadline || [])
      commit("SET_RISKS_BY_ASSET_TYPE", response.data.data.risks_by_asset_type || [])
      commit("SET_TOP_5_RISKS", response.data.data.top_5_risks || [])
      commit("SET_TOP_THREATS", response.data.data.top_threats || [])
    } catch (error) {
      console.error("Error fetching treatment summary:", error)
    }
  },

  async fetchCapacityChartData({ dispatch, rootGetters, commit }) {
    try {
      await dispatch("risk/fetchRisks", null, { root: true })
      const risks = rootGetters["risk/risks"] || []

      const grouped = risks.reduce((acc, risk) => {
        const key = risk.risk_capacity?.name || "(Blank)"
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {})

      const labels = Object.keys(grouped)
      const values = Object.values(grouped)

      const chartData = {
        labels,
        datasets: [
          {
            label: "Risks by Capacities",
            backgroundColor: ["#2c3e50", "#2980b9", "#c0392b", "#27ae60", "#f39c12"],
            data: values
          }
        ]
      }

      commit("SET_CAPACITY_CHART_DATA", chartData)
    } catch (error) {
      console.error("Error generating capacity chart data:", error)
    }
  }
}

export const getters = {
  chartData: (state) => state.chartData,
  assetChartData: (state) => state.assetChartData,
  totalAssets: (state) => state.totalAssets,
  categoryChartData: (state) => state.categoryChartData,
  riskTableData: (state) => state.riskTableData,
  capacityChartData: (state) => state.capacityChartData
}
