// store/srvResultStatuses.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "srv-results-statuses",
  entityName: "resultStatus",
  entityNamePlural: "resultStatuses",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
