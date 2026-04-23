// store/threats.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "bcm-threats",
  entityName: "threat",
  entityNamePlural: "threats",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}

export default createCrudStore(config)
