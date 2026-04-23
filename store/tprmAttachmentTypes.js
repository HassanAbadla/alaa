// store/tprmAttachmentTypes.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "tprm-attachment-types",
  entityName: "attachmentType",
  entityNamePlural: "attachmentTypes",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
