// store/tprmOutsourceTypes.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "tprm-outsource-types",
  entityName: "outsourceType",
  entityNamePlural: "outsourceTypes",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
