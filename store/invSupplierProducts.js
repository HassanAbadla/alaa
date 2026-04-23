// store/invSupplierProducts.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "inv-supplier-products",
    entityName: "supplierProduct",
    entityNamePlural: "supplierProducts",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: ["inv_product_id"],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
