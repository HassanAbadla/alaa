// store/threatIncidentPlans.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "bcm-incident-plans",
  entityName: "incidentPlan",
  entityNamePlural: "incidentPlans",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}

export default createCrudStore(config)
