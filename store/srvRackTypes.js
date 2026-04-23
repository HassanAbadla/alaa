// store/srvRackTypes.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "srv-rack-types",
  entityName: "rackType",
  entityNamePlural: "rackTypes",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
