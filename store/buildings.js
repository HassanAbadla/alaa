// store/buildings.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "buildings",
  entityName: "building",
  entityNamePlural: "buildings",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
