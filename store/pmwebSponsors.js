// pmwebSponsors.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "sponsors",
  entityName: "sponsor",
  entityNamePlural: "sponsors",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}
export default createCrudStore(config)
