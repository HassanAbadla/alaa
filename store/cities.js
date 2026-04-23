// store/cities.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "geo-cities",
  entityName: "city",
  entityNamePlural: "cities",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
