// store/tprmInventoryTypes.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "tprm-inventory-types",
  entityName: "inventoryType",
  entityNamePlural: "inventoryTypes",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
