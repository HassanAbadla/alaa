// store/srvContractRooms.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "srv-contract-rooms",
  entityName: "contractRoom",
  entityNamePlural: "contractRooms",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
