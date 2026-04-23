// store/tpsTasks.js
import { createCrudStore } from "~/utils/storeFactory"
const config = {
  endpoint: "tps-tasks",
  entityName: "task",
  entityNamePlural: "tasks",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data,
  customState: {
    dashboardStats: {
      total_tasks: 0,
      open_tasks: 0,
      overdue_tasks: 0,
      completed_tasks: 0,
      tasks_by_status: [],
      tasks_by_domain: [],
      task_age_distribution: []
    }
  },
  customMutations: {
    // ADD_TASK: (state, data) => {
    //   console.log("adding user mutation:", data)
    //   if (data.tps_task_id) {
    //     const parent = state.tasks.find((task) => task.id === data.tps_task_id)
    //     if (parent) {
    //       parent.sub_tasks = parent.sub_tasks || []
    //       parent.children = parent.children || []
    //       parent.sub_tasks.push(data)
    //       parent.children.push(data)
    //     }
    //   }
    // },
    UPDATE_TASK: (state, data) => {
      console.log("custom update mutation:", data)
      if (data.parent_id !== null) {
        console.log("if check parent_id", data)
        const parent = state.tasks.find((task) => task.id === data.parent_id)
        if (parent) {
          parent.child_tasks = parent.child_tasks || []
          // parent.children = parent.children || []

          // Replace existing sub_task/child with the same id, or add if not found
          const subTaskIdx = parent.child_tasks.findIndex((t) => t.id === data.id)
          if (subTaskIdx !== -1) {
            parent.child_tasks.splice(subTaskIdx, 1, data)
          } else {
            parent.push(data)
          }

          const childIdx = parent.child_tasks.findIndex((t) => t.id === data.id)
          if (childIdx !== -1) {
            parent.child_tasks.splice(childIdx, 1, data)
          } else {
            parent.push(data)
          }
        }
      } else {
        console.log("else no parent_id", data)
        const idx = state.tasks.findIndex((t) => t.id === data.id)
        state.tasks.splice(idx, 1, data)
      }
    },
    SET_DASHBOARD_STATS: (state, data) => {
      state.dashboardStats = data
    },
    SET_TASKS_BY_STATUS: (state, data) => {
      state.dashboardStats.tasks_by_status = data
    },
    SET_TASKS_BY_DOMAIN: (state, data) => {
      state.dashboardStats.tasks_by_domain = data
    },
    SET_TASK_AGE_DISTRIBUTION: (state, data) => {
      state.dashboardStats.task_age_distribution = data
    }
  },
  customActions: {
    async fetchDashboardStats({ commit }, filters = {}) {
      try {
        const response = await this.$axios.get("/tps-dashboard", { params: filters })

        commit("SET_DASHBOARD_STATS", response.data.data)
        commit("SET_TASKS_BY_STATUS", response.data.data.tasks_by_status || [])
        commit("SET_TASKS_BY_DOMAIN", response.data.data.tasks_by_domain || [])
        commit("SET_TASK_AGE_DISTRIBUTION", response.data.data.task_age_distribution || [])

        return response.data.data
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        throw error
      }
    }
  }
}

export default createCrudStore(config)
