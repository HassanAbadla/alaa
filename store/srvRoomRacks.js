// store/srvRoomRacks.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "srv-room-racks",
  entityName: "roomRack",
  entityNamePlural: "roomRacks",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
