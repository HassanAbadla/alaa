// store/bscStrategicObjectives.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "bsc-strategic-objectives",
  entityName: "objective",
  entityNamePlural: "objectives",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
