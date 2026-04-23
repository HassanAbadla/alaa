// store/srvRoomsBuildings.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "srv-room-buildings",
  entityName: "roomBuilding",
  entityNamePlural: "roomBuildings",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
