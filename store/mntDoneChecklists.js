// store/mntDoneChecklists.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "mnt-done-checklists",
    entityName: "doneChecklist",
    entityNamePlural: "doneChecklists",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
