// store/pmwebCountries.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoints: {
    getAll: "Countries",
    getById: "",
    create: "",
    update: "",
    delete: ""
  },
  entityName: "country",
  entityNamePlural: "countries",
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
    getCountries: (state) => state.countries.filter((country) => country.Inactive != 1)
  }
}

export default createCrudStore(config)

// You can also export individual parts if needed
export const { state, mutations, actions, getters } = createCrudStore(config)
