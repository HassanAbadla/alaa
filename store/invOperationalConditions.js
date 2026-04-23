// store/invOperationalConditions.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "inv-operational-conditions",
    entityName: "operationalCondition",
    entityNamePlural: "operationalConditions",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
