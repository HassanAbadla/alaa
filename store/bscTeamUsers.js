// store/bscTeamUsers.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "bsc-team-users",
  entityName: "user",
  entityNamePlural: "users",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
