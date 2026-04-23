// store/sensitiveAssets.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "asset-systems",
  entityName: "sensitiveAsset",
  entityNamePlural: "sensitiveAssets",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
