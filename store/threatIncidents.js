// store/threatIncidents.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "bcm-incidents",
  entityName: "incident",
  entityNamePlural: "incidents",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}

export default createCrudStore(config)
