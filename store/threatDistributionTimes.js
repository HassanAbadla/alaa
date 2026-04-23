// store/threatDistributionTimes.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "bcm-distribution-times",
  entityName: "distributionTime",
  entityNamePlural: "distributionTimes",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
