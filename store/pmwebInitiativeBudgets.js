// store/pmwebInitiativeBudgets.js
import { createCrudStore } from "~/utils/storeFactory"

// Simple configuration - using main endpoint for all operations
const config = {
  endpoint: "InitiativeBudget", // Used for all CRUD operations
  endpoints: {
    // delete: "InitiativeBudget-remove" // Only delete uses a different endpoint
    // getAll, getById, create, update will all use "InitiativeBudget"
  },
  entityName: "initiativeBudget",
  entityNamePlural: "initiativeBudgets",
  numericFields: ["BudgetYear", "RevisionNumber"],
  // primaryKey: "Id",
  // apiPlugin: "$orsApi",
  transformRequest: (data) => {
    return data
  },
  transformResponse: (data) => data,
  customGetters: {}
}

export default createCrudStore(config)
