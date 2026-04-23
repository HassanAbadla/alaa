// store/mntPreventiveCalanders.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "mnt-preventive-calanders",
    entityName: "preventiveCalander",
    entityNamePlural: "preventiveCalanders",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
