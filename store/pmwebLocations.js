// pmwebLocations.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "locations",
  entityName: "location",
  entityNamePlural: "locations",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => {
    return data.map((location) => {
      return { ...location, CodeName: `${location.Code} - ${location.Name}` }
    })
  }
}
export default createCrudStore(config)
