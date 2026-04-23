// store/archBoxes.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "arch-boxes",
  entityName: "box",
  entityNamePlural: "boxes",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
