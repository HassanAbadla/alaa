// store/strategy.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "bsc-perspectives",
  entityName: "perspective",
  entityNamePlural: "perspectives",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
