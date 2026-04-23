// store/srvContractStatuses.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "srv-contract-statuses",
  entityName: "status",
  entityNamePlural: "statuses",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
