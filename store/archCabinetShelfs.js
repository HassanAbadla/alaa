// store/archCabinetShelfs.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "arch-cabinet-shelfs",
  entityName: "cabinetShelf",
  entityNamePlural: "cabinetShelfs",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
