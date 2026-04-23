// store/srvIsoClasses.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "srv-iso-classes",
  entityName: "class",
  entityNamePlural: "classes",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
