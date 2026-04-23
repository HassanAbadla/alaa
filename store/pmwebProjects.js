// store/pmwebProjects.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "Projects",

  entityName: "project",
  entityNamePlural: "projects",
  numericFields: ["TargetBudget", "TargetRevenue", "TargetDuration"],

  // Custom transformations if needed
  transformRequest: (data) => {
    // Handle ProjectDetail if it exists
    // if (data.ProjectDetail && Array.isArray(data.ProjectDetail)) {
    //   data.ProjectDetail = data.ProjectDetail.map((detail) => {
    //     return { ...detail }
    //   })
    // }
    return data
  },
  transformResponse: (data) => {
    // Any response transformations
    return data
  },
  // Custom getters specific to projects
  customGetters: {
    // Override the default getProjects getter to filter by IsActive
    getProjects: (state) =>
      state.projects
        .filter((project) => {
          return project.IsActive
        })
        .map((project) => {
          return { ...project, ProjectCodeWithName: `${project.ProjectNumber} - ${project.ProjectName}` }
        })
  }
}

export default createCrudStore(config)

// You can also export individual parts if needed
export const { state, mutations, actions, getters } = createCrudStore(config)
