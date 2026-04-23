// projectsList.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "projects-list",
  entityName: "project",
  entityNamePlural: "projects",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data,

  customGetters: {}
}

export default createCrudStore(config)
