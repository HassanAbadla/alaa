// store/invProductWarranties.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "inv-product-warranties",
    entityName: "productWarranty",
    entityNamePlural: "productWarranties",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
