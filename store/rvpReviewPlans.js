// store/rvpReviewPlans.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "rvp-review-plans",
  entityName: "plan",
  entityNamePlural: "plans",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
