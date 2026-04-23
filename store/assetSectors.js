// store/assetSectors.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "asset-sectors",
  entityName: "sector",
  entityNamePlural: "sectors",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
