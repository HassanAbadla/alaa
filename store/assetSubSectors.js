// store/assetSubSectors.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "asset-sub-sectors",
  entityName: "subSector",
  entityNamePlural: "subSectors",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
