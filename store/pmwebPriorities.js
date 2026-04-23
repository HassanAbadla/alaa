// store/pmwebPrioritiess.js
import { createCrudStore } from "~/utils/storeFactory"

// Simple configuration - using main endpoint for all operations
const config = {
  endpoint: "Priorities", // Used for all CRUD operations
  endpoints: {
    // delete: "Priorities-remove" // Only delete uses a different endpoint
    // getAll, getById, create, update will all use "Priorities"
  },
  entityName: "priorities",
  entityNamePlural: "priorities",
  numericFields: [],
  // primaryKey: "Id",
  // apiPlugin: "$orsApi",
  transformRequest: (data) => data,
  transformResponse: (data) => data,
  customGetters: {
    getDefaultPriority: (state) => {
      if (!state.priorities || state.priorities.length === 0) {
        return null
      }
      // based on how PMWeb handles priorities, we can assume that the default priority is the one with Id 4 (Emergency)
      const defaultPriority = state.priorities.find((priority) => priority.Id === "4")
      console.log("Default Priority:", defaultPriority)
      return defaultPriority ? defaultPriority : state.priorities[0]
    }
  }
}

export default createCrudStore(config)
