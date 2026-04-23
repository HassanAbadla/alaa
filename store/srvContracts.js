// store/srvContracts.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "srv-contracts",
  entityName: "contract",
  entityNamePlural: "contracts",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data,

  customState: {
    stats: []
  },
  customMutations: {
    SET_CONTRACTS(state, data) {
      state.contracts = data
    },
    setStats(state, data) {
      state.stats = data
    }
  },
  customActions: {
    async fetchContracts({ commit }, filters = {}) {
      try {
        const response = await this.$axios.get("/srv-contracts", { params: filters })
        commit("SET_CONTRACTS", response.data.data)
        commit("setStats", response.data.stats)
      } catch (error) {
        throw error
      }
    }
  }
}
export default createCrudStore(config)
