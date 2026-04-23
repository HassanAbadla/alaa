// store/pmwebDocStatues.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoints: {
    getAll: "DocStatus",
    getById: "",
    create: "",
    update: "",
    delete: ""
  },
  entityName: "docStatus",
  entityNamePlural: "docStatuses",
  numericFields: [],
  primaryKey: "Id",
  apiPlugin: "$orsApi",
  // Custom transformations if needed
  transformRequest: (data) => {
    return data
  },
  transformResponse: (data) => {
    // Any response transformations
    return data
  },

  customGetters: {
    getDefaultDocStatus: (state) => {
      if (!state.docStatuses || state.docStatuses.length === 0) {
        return null
      }
      return state.docStatuses[0] // Return the first docStatus
    }
  }
}

export default createCrudStore(config)

// You can also export individual parts if needed
export const { state, mutations, actions, getters } = createCrudStore(config)
