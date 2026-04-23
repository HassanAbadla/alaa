// store/pmwebPrograms.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "programs",
  endpoints: {
    // getAll: "portfolio/Programs.svc/GetPrograms",
    // getById: "portfolio/Programs.svc/GetProgramById",
    // create: "portfolio/Programs.svc/AddPrograms",
    // update: "portfolio/Programs.svc/UpdatePrograms",
    // delete: "portfolio/Programs.svc/DeletePrograms"
  },
  entityName: "program",
  entityNamePlural: "programs",
  numericFields: ["ProgramEstimatedCost", "ProjectTargetBudget", "ProjectTargetRevenue"],

  // Custom transformations if needed
  transformRequest: (data) => {
    // Handle ProgramDetail if it exists
    // if (data.ProgramDetail && Array.isArray(data.ProgramDetail)) {
    //   data.ProgramDetail = data.ProgramDetail.map((detail) => {
    //     return { ...detail }
    //   })
    // }
    return data
  },
  transformResponse: (data) => {
    // Any response transformations
    return data
  },
  // Custom getters specific to programs
  customGetters: {
    // Override the default getPrograms getter to filter by IsActive
  }
}

export default createCrudStore(config)

// You can also export individual parts if needed
export const { state, mutations, actions, getters } = createCrudStore(config)
