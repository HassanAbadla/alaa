// store/tprmIncidentTypes.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "tprm-incident-types",
  entityName: "incidentType",
  entityNamePlural: "incidentTypes",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
