// store/pmwebProjectCategories.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoints: {
    getAll: "ProjectCategories",
    getById: "",
    create: "",
    update: "",
    delete: ""
  },
  entityName: "projectCategory",
  entityNamePlural: "projectCategories",
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
    // You can define custom getters here if needed
    // For example, if you want to filter active categories or format them
    getProjectCategories: (state) => {
      return state.projectCategories.filter((category) => category.Inactive != 1)
    }
  }
}

export default createCrudStore(config)

// You can also export individual parts if needed
export const { state, mutations, actions, getters } = createCrudStore(config)
