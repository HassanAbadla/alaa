// store/mntSchedules.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "mnt-schedules",
    entityName: "schedule",
    entityNamePlural: "schedules",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
