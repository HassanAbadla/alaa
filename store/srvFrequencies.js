// store/srvFrequencies.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "srv-frequencies",
  entityName: "frequency",
  entityNamePlural: "frequencies",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
