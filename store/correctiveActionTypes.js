// correctiveActionTypes.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "corrective-action-types",
  entityName: "type",
  entityNamePlural: "types",
  numericFields: [],
  apiPlugin: "$axios",
  primaryKey: "id", // Add this
  transformRequest: (data) => data,
  transformResponse: (data) => data // FIX: was missing return statement
}

export default createCrudStore(config)
