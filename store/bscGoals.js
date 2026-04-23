// store/bscGoals.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "bsc-goals",
  entityName: "goal",
  entityNamePlural: "goals",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data,

  // customGetters: {
  //   // Override the default getProjects getter to filter by IsActive
  //   getPerspectives: (state) =>
  //     state.perspectives.map((perspective) => {
  //       return { id: perspective.id, name: perspective.name }
  //     })
  // }
  customMutations: {
    ADD_GOAL: (state, data) => {
      console.log("adding user mutation:", data)

      if (data.bsc_goal_id) {
        console.log("Adding to parent", data.bsc_goal_id)

        const parent = state.goals.find((goal) => goal.id === data.bsc_goal_id)
        if (parent) {
          parent.sub_goals = parent.sub_goals || []
          parent.children = parent.children || []
          parent.sub_goals.push(data)
          parent.children.push(data)
        }
      }
    },
    UPDATE_GOAL: (state, data) => {
      if (data.bsc_goal_id) {
        const parent = state.goals.find((goal) => goal.id === data.bsc_goal_id)
        if (parent) {
          parent.sub_goals = parent.sub_goals || []
          parent.children = parent.children || []

          // Replace existing sub_goal/child with the same id, or add if not found
          const subGoalIdx = parent.sub_goals.findIndex((g) => g.id === data.id)
          if (subGoalIdx !== -1) {
            parent.sub_goals.splice(subGoalIdx, 1, data)
          } else {
            parent.sub_goals.push(data)
          }

          const childIdx = parent.children.findIndex((g) => g.id === data.id)
          if (childIdx !== -1) {
            parent.children.splice(childIdx, 1, data)
          } else {
            parent.children.push(data)
          }
        }
      }
    }
  }
}
export default createCrudStore(config)
