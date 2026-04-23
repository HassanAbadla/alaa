// store/stepStatuses.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "node-statuses",
  entityName: "stepStatus",
  entityNamePlural: "stepStatuses",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data,

  // custom state
  // customState: {
  //   userTypes: []
  // },

  // // Custom mutations
  customMutations: {
    SET_NODE_STATUSES(state, statuses) {
      state.stepStatuses = statuses
    }
    //   SET_CURRENT_STEP(state, step) {
    //     state.currentStep = step
    //   },
    //   addStep(state, step) {
    //     state.steps.push(step)
    //   },
    //   SET_USER_TYPES(state, userTypes) {
    //     state.userTypes = userTypes
    //   }
  },

  // // override fetchWorkflows actions
  customActions: {
    async fetchStepStatuses({ commit }, id) {
      const steps = await this.$axios.$get(`/node-statuses/${id}`)
      commit("SET_NODE_STATUSES", steps.data)
    }
    //   // async fetchStepById({ commit }, id) {
    //   //   const response = await this.$axios.$get(`/flow_nodes/${id}`)
    //   //   commit("SET_CURRENT_STEP", response)
    //   // },
    //   async addStep({ commit }, step) {
    //     const response = await this.$axios.$post("/flow_nodes", step)
    //     commit("addStep", response)
    //   },
    //   async fetchUserTypes({ commit }) {
    //     const response = await this.$axios.$get("/user-types")
    //     commit("SET_USER_TYPES", response.data)
    //   }
  }

  // // custom getters
  // customGetters: {
  //   getUserTypes(state) {
  //     return state.userTypes
  //   }
  // }
}
export default createCrudStore(config)
