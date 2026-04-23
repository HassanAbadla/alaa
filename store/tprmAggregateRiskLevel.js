// store/tprmAggregateRiskLevel.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "tprm-aggregate-risk-levels",
  entityName: "aggregateRiskLevel",
  entityNamePlural: "aggregateRiskLevels",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
