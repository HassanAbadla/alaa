// store/pmwebPBSs.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "pbs",
  entityName: "PBS",
  entityNamePlural: "PBSs",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
