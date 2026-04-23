// store/archBoxTypes.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "arch-box-types",
  entityName: "boxType",
  entityNamePlural: "boxTypes",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
