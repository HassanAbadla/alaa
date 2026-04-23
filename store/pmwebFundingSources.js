// pmwebFundingSources.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "funding-source",
  entityName: "fundingSource",
  entityNamePlural: "fundingSources",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
