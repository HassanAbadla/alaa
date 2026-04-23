// store/pmwebProjectStatuses.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "ProjectStatuses",
  entityName: "projectStatus",
  entityNamePlural: "projectStatuses",
  numericFields: [],

  // Custom transformations if needed
  transformRequest: (data) => {
    return data
  },
  transformResponse: (data) => {
    // Any response transformations
    return data
  },

  customGetters: {}
}

export default createCrudStore(config)

// You can also export individual parts if needed
export const { state, mutations, actions, getters } = createCrudStore(config)
