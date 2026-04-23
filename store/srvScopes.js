// store/srvScopes.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "srv-scopes",
  entityName: "scope",
  entityNamePlural: "scopes",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
