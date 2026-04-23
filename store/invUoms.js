// store/invUoms.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "inv-uoms",
    entityName: "uom",
    entityNamePlural: "uoms",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
