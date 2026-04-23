// store/threatAttachments.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "bcm-attachments",
  entityName: "attachment",
  entityNamePlural: "attachments",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],

  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
