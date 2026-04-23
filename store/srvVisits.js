// store/srvVisits.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "srv-visits",
  entityName: "visit",
  entityNamePlural: "visits",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data,

  customState: {
    stats: []
  },
  customMutations: {
    SET_VISITS(state, data) {
      state.visits = data
    },
    setStats(state, data) {
      state.stats = data
    }
  },
  customActions: {
    async fetchVisits({ commit }, filters = {}) {
      try {
        const response = await this.$axios.get("/srv-visits", { params: filters })
        commit("SET_VISITS", response.data.data)
        commit("setStats", response.data.stats)
      } catch (error) {
        throw error
      }
    }
  }
}
export default createCrudStore(config)
