// store/mntChecklists.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "mnt-checklists",
    entityName: "checklist",
    entityNamePlural: "checklists",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
