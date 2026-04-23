// store/srvVisitPriorities.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "srv-visits-priorities",
  entityName: "visitPriority",
  entityNamePlural: "visitPriorities",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
