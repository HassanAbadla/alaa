// store/invTransactionTypes.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "inv-transaction-types",
    entityName: "transactionType",
    entityNamePlural: "transactionTypes",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
