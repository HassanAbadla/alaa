// store/invProductModels.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "inv-product-models",
    entityName: "productModel",
    entityNamePlural: "productModels",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: ["inv_model_power_consumption", "design_capacity", "power"],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
