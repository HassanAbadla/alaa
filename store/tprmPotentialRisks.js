// store/tprmPotentialRisks.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "tprm-potential-risks",
  entityName: "potentialRisk",
  entityNamePlural: "potentialRisks",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data,
  // customState: {
  //   potentialRisks: []
  // },
  // customMutations: {
  //   setPotentialRisks(state, risks) {
  //     state.potentialRisks = risks
  //   }
  // },

  customActions: {
    fetchPotentialRisksList({ commit }, payload) {
      return this.$axios
        .post("/tprm-potential-risks-list", payload)
        .then((response) => {
          commit("setPotentialRisks", response)
          return response
        })
        .catch((error) => {
          console.error("Error fetching potential risks:", error)
          throw error
        })
    }
  }
}
export default createCrudStore(config)
