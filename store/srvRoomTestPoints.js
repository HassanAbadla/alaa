// store/srvRoomTestPoints.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "srv-room-test-points",
  entityName: "point",
  entityNamePlural: "points",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
