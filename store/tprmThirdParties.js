// store/tprmThirdParties.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "third-party",
  entityName: "thirdParty",
  entityNamePlural: "thirdParties",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data,
  customState: {
    dashboardData: []
  },

  customMutations: {
    // subract 1 from attachments_count on delete
    DELETE_TPRM_THIRD_PARTY: (state, id) => {
      const thirdParty = state.thirdParties.find((tp) => tp.id === id)
      if (thirdParty) {
        thirdParty.attachments_count = Math.max(0, (thirdParty.attachments_count || 1) - 1)
      }
    },
    // add 1 to attachments_count on add
    ADD_TPRM_ATTACHMENT: (state, id) => {
      console.log("ADD_TPRM_ATTACHMENT", id)
      const thirdParty = state.thirdParties.find((tp) => tp.id === id)
      console.log("Found thirdParty:", thirdParty)

      if (thirdParty) {
        thirdParty.attachments_count = (thirdParty.attachments_count || 0) + 1
      }
    },
    SET_DASHBOARD_DATA: (state, data) => {
      state.dashboardData = data
    }
  },
  customActions: {
    async fetchDashboardData({ commit, state }, params) {
      try {
        const response = await this.$axios.get("/tprm-dashboard")
        commit("SET_DASHBOARD_DATA", response.data)
        return response.data
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        throw error
      }
    }
  }
}
export default createCrudStore(config)
