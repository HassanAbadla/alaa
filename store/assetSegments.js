// store/assetSegments.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "asset-system-segments",
  entityName: "segment",
  entityNamePlural: "segments",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
