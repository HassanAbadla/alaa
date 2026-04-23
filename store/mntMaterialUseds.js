// store/mntMaterialUseds.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "mnt-material-useds",
    entityName: "materialUsed",
    entityNamePlural: "materialUseds",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
