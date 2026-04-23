// store/pmwebProjectTypes.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoints: {
    getAll: "ProjectTypes",
    getById: "",
    create: "",
    update: "",
    delete: ""
  },
  entityName: "projectType",
  entityNamePlural: "projectTypes",
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

  customGetters: {}
}

export default createCrudStore(config)

// You can also export individual parts if needed
export const { state, mutations, actions, getters } = createCrudStore(config)
