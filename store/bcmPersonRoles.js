// store/bcmPersonRoles.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "bcm-person-roles",
  entityName: "role",
  entityNamePlural: "roles",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}

export default createCrudStore(config)
