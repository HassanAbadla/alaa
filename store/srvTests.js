// store/srvTests.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "srv-tests",
  entityName: "test",
  entityNamePlural: "tests",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
