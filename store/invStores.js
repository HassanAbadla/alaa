// store/invStores.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "inv-stores",
    entityName: "store",
    entityNamePlural: "stores",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: ["location_id", "inv_store_type_id"],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
