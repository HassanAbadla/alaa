// store/tenantContracts.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "tenant-contracts",
  entityName: "tenantContract",
  entityNamePlural: "tenantContracts",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
