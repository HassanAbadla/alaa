// store/invProductTypes.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "inv-product-types",
    entityName: "productType",
    entityNamePlural: "productTypes",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
