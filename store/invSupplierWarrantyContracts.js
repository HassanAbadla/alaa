// store/invSupplierWarrantyContracts.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "inv-supplier-warranty-contracts",
    entityName: "supplierWarrantyContract",
    entityNamePlural: "supplierWarrantyContracts",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
