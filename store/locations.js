// store/locations.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "geo-locations",
  entityName: "location",
  entityNamePlural: "locations",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
