// store/maintenanceRequests.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "maintenance-requests",
    entityName: "maintenanceRequest",
    entityNamePlural: "maintenanceRequests",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: [],
    transformRequest: (data) => data,
    transformResponse: (data) => data
}

export default createCrudStore(config)
