// store/pmwebInitiativeRatings.js
import { createCrudStore } from "~/utils/storeFactory"

// Simple configuration - using main endpoint for all operations
const config = {
  endpoint: "InitiativeRatings", // Used for all CRUD operations
  endpoints: {
    // delete: "InitiativeRating-remove" // Only delete uses a different endpoint
    // getAll, getById, create, update will all use "InitiativeRating"
  },
  entityName: "initiativeRating",
  entityNamePlural: "initiativeRatings",
  numericFields: [],
  // primaryKey: "Id",
  // apiPlugin: "$orsApi",
  transformRequest: (data) => {
    return data
  },
  transformResponse: (data) => data,
  customGetters: {
    getInitiativeRatings: (state) => {
      return state.initiativeRatings.map((rating) => {
        if (rating?.user) {
          const fullName = `${rating.user.FirstName} ${rating.user.LastName}`
          rating.user.FullName = fullName
        }
        return rating
      })
    },
    getCurrentInitiativeRating: (state) => {
      const rating = state.currentInitiativeRating?.Rating
      let processedRating = rating

      if (rating != null) {
        const numericRating = parseFloat(rating)
        if (!isNaN(numericRating)) {
          processedRating = parseFloat(numericRating.toFixed(1))
        }
      }

      return {
        ...state.currentInitiativeRating,
        Rating: processedRating
      }
    }
  }
}

export default createCrudStore(config)
