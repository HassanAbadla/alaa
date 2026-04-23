// store/srvRoomResults.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "srv-room-results",
  entityName: "roomResult",
  entityNamePlural: "roomResults",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data,

  customState: {
    stats: []
  },
  customMutations: {
    SET_ROOM_RESULT(state, data) {
      state.roomResults = data
    },
    setStats(state, data) {
      state.stats = data
    }
  },
  customActions: {
    async fetchRoomResults({ commit }, filters = {}) {
      try {
        const response = await this.$axios.get("/srv-room-results", { params: filters })
        commit("SET_ROOM_RESULT", response.data.data)
        commit("setStats", response.data.stats)
      } catch (error) {
        throw error
      }
    }
  }
}
export default createCrudStore(config)
