// store/tpsStatuses.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "tps-statuses",
  entityName: "status",
  entityNamePlural: "statuses",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
