// store/workflows.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "workflow",
  entityName: "workflow",
  entityNamePlural: "workflows",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data,
  // Custom mutations
  customMutations: {
    SET_WORKFLOWS(state, workflows) {
      state.workflows = workflows
    },
    SET_CURRENT_WORKFLOWS(state, workflow) {
      state.currentWorkflow = workflow
    },
    ADD_WORKFLOW(state, workflow) {
      state.workflows.push(workflow)
    }
  },

  // override fetchWorkflows actions
  customActions: {
    async fetchWorkflows({ commit }) {
      const workflows = await this.$axios.$get("/workflow")
      commit("SET_WORKFLOWS", workflows)
    },
    async fetchWorkflowById({ commit }, id) {
      const response = await this.$axios.$get(`/workflow/${id}`)
      commit("SET_CURRENT_WORKFLOWS", response)
    },
    async addWorkflow({ commit }, workflow) {
      const response = await this.$axios.$post("/workflow", workflow)
      commit("ADD_WORKFLOW", response)
    }
  }
}
export default createCrudStore(config)
