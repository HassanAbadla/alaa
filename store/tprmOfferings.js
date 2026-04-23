// store/tprmOfferings.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "tprm-offerings",
  entityName: "offering",
  entityNamePlural: "offerings",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
