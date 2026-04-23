// store/tprmInventories.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "tprm-inventories",
  entityName: "inventory",
  entityNamePlural: "inventories",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
