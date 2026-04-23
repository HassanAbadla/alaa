// store/bscTeams.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "bsc-teams",
  entityName: "team",
  entityNamePlural: "teams",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
