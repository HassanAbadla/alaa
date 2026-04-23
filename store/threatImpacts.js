// store/threatImpacts.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "bcm-threat-impact",
  entityName: "impact",
  entityNamePlural: "impacts",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
