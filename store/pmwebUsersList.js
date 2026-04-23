// store/pmwebUsersList.js
import { createCrudStore } from "~/utils/storeFactory"

// Simple configuration - using main endpoint for all operations
const config = {
  endpoint: "users-list", // Used for all CRUD operations
  endpoints: {
    // delete: "User-remove" // Only delete uses a different endpoint
    // getAll, getById, create, update will all use "User"
  },
  entityName: "user",
  entityNamePlural: "users",
  numericFields: [],
  // primaryKey: "Id",
  // apiPlugin: "$orsApi",
  transformRequest: (data) => {
    return data
  },
  transformResponse: (data) => data,
  customGetters: {
    fetchUsers: (state) => {
      return state.users.map((user) => {
        return { ...user, FullName: `${user.FirstName} ${user.LastName}` }
      })
    }
  }
}

export default createCrudStore(config)
