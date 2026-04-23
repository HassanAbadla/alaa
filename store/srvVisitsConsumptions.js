// store/srvVisitsConsumptions.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "srv-visits-consumptions",
  entityName: "visitsConsumption",
  entityNamePlural: "visitsConsumptions",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
