// store/srvTeamUsers.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "srv-team-users",
  entityName: "teamUser",
  entityNamePlural: "teamUsers",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
