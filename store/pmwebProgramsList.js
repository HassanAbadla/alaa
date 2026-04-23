// store/pmwebPrograms.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "ListOfPrograms",
  endpoints: {},
  entityName: "program",
  entityNamePlural: "programs",
  numericFields: [],

  // Custom transformations if needed
  transformRequest: (data) => {
    return data
  },
  transformResponse: (data) => {
    // Any response transformations
    return data
  },
  // Custom getters specific to programs
  customGetters: {
    // Override the default getPrograms getter to filter by IsActive
  }
}

export default createCrudStore(config)

// You can also export individual parts if needed
export const { state, mutations, actions, getters } = createCrudStore(config)
