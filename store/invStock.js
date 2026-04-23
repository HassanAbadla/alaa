// store/invStock.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "inv-stock",
    entityName: "stock",
    entityNamePlural: "stocks",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: ["inv_product_id", "inv_store_id", "qty"],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
