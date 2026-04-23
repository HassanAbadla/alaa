// store/tprmIndustries.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "tprm-industries",
  entityName: "industry",
  entityNamePlural: "industries",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
