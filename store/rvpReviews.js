// store/rvpReviews.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "rvp-reviews",
  entityName: "review",
  entityNamePlural: "reviews",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
