// store/peakTimes.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "peak-times",
  entityName: "peakTime",
  entityNamePlural: "peakTimes",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
