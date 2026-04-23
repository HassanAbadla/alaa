// store/logs.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "logs",
  entityName: "log",
  entityNamePlural: "logs",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data,

  customState: {
    itemLog: []
  },
  customMutations: {
    SET_ITEM_LOG(state, data) {
      state.itemLog = data
    }
  },
  customActions: {
    async fetchItemLog({ commit }, { id, logable_type }) {
      try {
        const response = await this.$axios.get(`/logs/${id}`, {
          params: { logable_type }
        })
        commit("SET_ITEM_LOG", response.data.data) // Changed from 'stats' to 'data'
      } catch (error) {
        throw error
      }
    }
  }
}
export default createCrudStore(config)
