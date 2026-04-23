// store/assetStandards.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "asset-standards",
  entityName: "standard",
  entityNamePlural: "standards",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
