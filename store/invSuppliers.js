// store/invSuppliers.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "inv-suppliers",
    entityName: "supplier",
    entityNamePlural: "suppliers",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
