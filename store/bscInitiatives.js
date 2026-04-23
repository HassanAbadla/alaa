// store/bscInitiatives.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "bsc-initiatives",
  entityName: "initiative",
  entityNamePlural: "initiatives",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
