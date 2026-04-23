// store/archCabinetTypes.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "arch-cabinet-types",
  entityName: "cabinetType",
  entityNamePlural: "cabinetTypes",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
