// store/districts.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "geo-districts",
  entityName: "district",
  entityNamePlural: "districts",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
