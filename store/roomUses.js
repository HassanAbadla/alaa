// store/roomUses.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "room-uses",
  entityName: "roomUse",
  entityNamePlural: "roomUses",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
