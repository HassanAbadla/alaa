// store/archRoomStorages.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "arch-room-storages",
  entityName: "roomStorage",
  entityNamePlural: "roomStorages",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
