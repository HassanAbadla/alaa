// store/invOperationalModes.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "inv-operational-modes",
    entityName: "operationalMode",
    entityNamePlural: "operationalModes",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
