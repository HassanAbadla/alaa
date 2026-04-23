// store/invManufacturers.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "inv-manufacturers",
    entityName: "manufacturer",
    entityNamePlural: "manufacturers",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
