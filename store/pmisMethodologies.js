// store/pmisMethodologies.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "all-methodologies",
  entityName: "methodology",
  entityNamePlural: "methodologies",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data,
  customGetters: {
    defaultMethodology: (state) => {
      return state.methodologies ? state.methodologies[0] : null
    }
  }
}
export default createCrudStore(config)
