// store/mntScheduleStatuses.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "mnt-schedule-statuses",
    entityName: "scheduleStatus",
    entityNamePlural: "scheduleStatuses",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
