// store/invStoreTypes.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "inv-store-types",
    entityName: "storeType",
    entityNamePlural: "storeTypes",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
