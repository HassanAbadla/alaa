// store/tprmOutsourceContracts.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "tprm-outsourced-contracts",
  entityName: "outsourceContract",
  entityNamePlural: "outsourceContracts",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
