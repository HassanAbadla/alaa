// pmwebProjectManagers.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "project-managers",
  entityName: "projectManager",
  entityNamePlural: "projectManagers",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => {
    return data.map((manager) => {
      return {
        ...manager,
        dropdownDisplay: `${manager.CompanyName} - ${manager.FirstName} ${manager.LastName}`
      }
    })
  }
}

export default createCrudStore(config)
