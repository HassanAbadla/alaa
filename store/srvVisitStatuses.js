// store/srvVisitStatuses.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "srv-visits-statuses",
  entityName: "visitStatus",
  entityNamePlural: "visitStatuses",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
