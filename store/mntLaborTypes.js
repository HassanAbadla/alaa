// store/mntLaborTypes.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "mnt-labor-types",
    entityName: "laborType",
    entityNamePlural: "laborTypes",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
