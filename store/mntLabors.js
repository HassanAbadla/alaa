// store/mntLabors.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "mnt-labors",
    entityName: "labor",
    entityNamePlural: "labors",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
