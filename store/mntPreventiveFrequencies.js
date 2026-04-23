// store/mntPreventiveFrequencies.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "mnt-preventive-frequencies",
    entityName: "preventiveFrequency",
    entityNamePlural: "preventiveFrequencies",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
