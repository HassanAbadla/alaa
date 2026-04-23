// pmwebWorkflowCalenders.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "workflow-calender",
  entityName: "workflowCalender",
  entityNamePlural: "workflowCalenders",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data
}

export default createCrudStore(config)
