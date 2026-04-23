// store/invProductCategories.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "inv-product-categories",
    entityName: "productCategory",
    entityNamePlural: "productCategories",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
