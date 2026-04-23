// store/invTransactionCategories.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "inv-transaction-categories",
    entityName: "transactionCategory",
    entityNamePlural: "transactionCategories",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: ["inv_transaction_type_id"],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
