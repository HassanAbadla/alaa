// store/invTransactions.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "inv-transactions",
    entityName: "transaction",
    entityNamePlural: "transactions",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: ["inv_plusminus", "quantity", "inv_transaction_type_id", "inv_transaction_category_id", "inv_product_id", "inv_store_id"],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
