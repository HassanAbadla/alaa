// store/tprmRatings.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "tprm-ratings",
  entityName: "rating",
  entityNamePlural: "ratings",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
