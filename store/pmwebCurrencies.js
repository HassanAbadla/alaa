// store/pmwebCurrencies.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "Currencies",
  endpoints: {
    // getAll: "",
    // getById: "",
    // create: "",
    // update: "",
    // delete: ""
  },
  entityName: "currency",
  entityNamePlural: "currencies",
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
    getCurrencies: (state) => {
      return state.currencies.map((currency) => {
        return { ...currency, CurrencyCodeWithName: `${currency.Code} - ${currency.Name}` }
      })
    },
    getDefaultCurrency: (state) => {
      if (!state.currencies || state.currencies.length === 0) {
        return null
      }
      // find currency with SAR as the code
      let defaultCurrency = state.currencies.find((currency) => currency.IsDefault === "1")
      if (defaultCurrency) {
        defaultCurrency.CurrencyCodeWithName = `${defaultCurrency.Code} - ${defaultCurrency.Name}`
      }
      return defaultCurrency || null
    }
  }
}

export default createCrudStore(config)

// You can also export individual parts if needed
export const { state, mutations, actions, getters } = createCrudStore(config)
